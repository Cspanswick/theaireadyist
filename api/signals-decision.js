/**
 * POST /api/signals-decision — approve / reject / publish / edit an executive signal.
 * Guarded by x-admin-key header. Requires env:
 *   ADMIN_API_KEY       — shared admin passphrase
 *   SUPABASE_SECRET_KEY — Supabase secret key (bypasses RLS)
 *
 * Body:
 *   {
 *     id: "SIG-...",                 // required
 *     action: "approve"|"reject"|"publish"|"save",  // required
 *     edits: {                       // optional, applied before the action
 *       signal_title, why_it_matters, decision_question, suggested_tags (array),
 *       primary_pillar, secondary_pillar, executive_relevance_score
 *     },
 *     rejected_reason: "..."         // optional, used with action=reject
 *   }
 *
 * Human approval is mandatory. 'publish' is a manual, explicit action — nothing
 * is ever auto-published.
 */
const SB_URL = 'https://mydxofjvpuurwwaohqys.supabase.co';
const SB_TABLE = 'executive_signals';

const PILLARS = [
  'Executive Operating Models', 'Decision Intelligence', 'Agentic Governance',
  'AI Economics', 'Human Agency', 'Sovereign AI'
];

function slugify(s) {
  return (s || 'signal').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }
  if (!process.env.ADMIN_API_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ error: 'SUPABASE_SECRET_KEY not configured' });
  }

  const { id, action, edits, rejected_reason } = req.body || {};
  if (!id || !/^SIG-[\w.-]+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid or missing id' });
  }
  if (!['approve', 'reject', 'publish', 'save'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  // Build the patch from optional edits (whitelist of editable fields)
  const patch = {};
  if (edits && typeof edits === 'object') {
    if (typeof edits.signal_title === 'string') patch.signal_title = edits.signal_title.slice(0, 300);
    if (typeof edits.why_it_matters === 'string') patch.why_it_matters = edits.why_it_matters.slice(0, 2000);
    if (typeof edits.decision_question === 'string') patch.decision_question = edits.decision_question.slice(0, 600);
    if (Array.isArray(edits.suggested_tags)) patch.suggested_tags = edits.suggested_tags.slice(0, 10).map(t => String(t).slice(0, 40));
    if (PILLARS.includes(edits.primary_pillar)) patch.primary_pillar = edits.primary_pillar;
    if (edits.secondary_pillar === null || PILLARS.includes(edits.secondary_pillar)) patch.secondary_pillar = edits.secondary_pillar;
    const sc = Number(edits.executive_relevance_score);
    if (sc >= 1 && sc <= 5) patch.executive_relevance_score = sc;
  }

  // Apply the action
  if (action === 'approve') {
    patch.approval_status = 'approved';
    patch.rejected_reason = null;
  } else if (action === 'reject') {
    patch.approval_status = 'rejected';
    patch.rejected_reason = (rejected_reason && String(rejected_reason).slice(0, 200)) || 'admin_rejected';
  } else if (action === 'publish') {
    patch.approval_status = 'published';
    patch.rejected_reason = null;
    if (!patch.published_slug) patch.published_slug = slugify(patch.signal_title || '');
  }
  // action === 'save' applies edits only, no status change.

  if (action === 'save' && Object.keys(patch).length === 0) {
    return res.status(400).json({ error: 'No edits provided' });
  }

  const url = `${SB_URL}/rest/v1/${SB_TABLE}?id=eq.${encodeURIComponent(id)}`;
  try {
    const sb = await fetch(url, {
      method: 'PATCH',
      headers: {
        apikey: secret, Authorization: 'Bearer ' + secret,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(patch)
    });
    if (!sb.ok) {
      const detail = await sb.text();
      return res.status(502).json({ error: 'Update failed', status: sb.status, detail });
    }
    const rows = await sb.json();
    if (!rows.length) return res.status(404).json({ error: 'Signal not found' });
    return res.status(200).json({ ok: true, action, signal: rows[0] });
  } catch (e) {
    return res.status(502).json({ error: 'Could not reach Supabase', detail: e.message });
  }
};
