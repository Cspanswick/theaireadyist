/**
 * /api/research-candidates — Research Candidate backlog (WP15).
 * Guarded by x-admin-key. Requires env:
 *   ADMIN_API_KEY       — shared admin passphrase
 *   SUPABASE_SECRET_KEY — Supabase secret key (bypasses RLS)
 *
 * GET    ?status=&pillar=        list candidates (newest first)
 * POST   { signal_id, signal_url, signal_title, pillar, candidate_topic, editorial_notes }
 *                                create a candidate (assigns RQ-NNN)
 * PATCH  { id, status?, editorial_notes?, candidate_topic?, research_brief_id? }
 *                                update a candidate
 *
 * Human action only — nothing here triggers research.
 */
const SB_URL = 'https://mydxofjvpuurwwaohqys.supabase.co';
const SB_TABLE = 'research_candidates';

const PILLARS = [
  'Executive Operating Models', 'Decision Intelligence', 'Agentic Governance',
  'AI Economics', 'Human Agency', 'Sovereign AI'
];
const STATUSES = ['new', 'reviewing', 'research_started', 'completed', 'archived'];

function sbHeaders(secret, extra) {
  return Object.assign({ apikey: secret, Authorization: 'Bearer ' + secret }, extra || {});
}

async function nextId(secret) {
  // Read the highest existing RQ-NNN and increment.
  const url = `${SB_URL}/rest/v1/${SB_TABLE}?select=id&order=id.desc&limit=1`;
  const res = await fetch(url, { headers: sbHeaders(secret) });
  let max = 0;
  if (res.ok) {
    const rows = await res.json();
    if (rows.length) {
      const m = String(rows[0].id || '').match(/RQ-(\d+)/);
      if (m) max = parseInt(m[1], 10);
    }
  }
  return 'RQ-' + String(max + 1).padStart(3, '0');
}

module.exports = async (req, res) => {
  if (!process.env.ADMIN_API_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: 'SUPABASE_SECRET_KEY not configured' });

  // ── GET: list ──
  if (req.method === 'GET') {
    const q = req.query || {};
    const params = ['select=*', 'order=created_at.desc', 'limit=300'];
    if (q.status && STATUSES.includes(q.status)) params.push('status=eq.' + encodeURIComponent(q.status));
    if (q.pillar) params.push('pillar=eq.' + encodeURIComponent(q.pillar));
    try {
      const sb = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}?${params.join('&')}`, { headers: sbHeaders(secret) });
      if (!sb.ok) return res.status(502).json({ error: 'Read failed', status: sb.status });
      return res.status(200).json({ candidates: await sb.json() });
    } catch (e) { return res.status(502).json({ error: 'Could not reach Supabase', detail: e.message }); }
  }

  // ── POST: create ──
  if (req.method === 'POST') {
    const b = req.body || {};
    if (!b.candidate_topic || !String(b.candidate_topic).trim()) {
      return res.status(400).json({ error: 'candidate_topic required' });
    }
    const row = {
      id: await nextId(secret),
      signal_id: b.signal_id ? String(b.signal_id).slice(0, 120) : null,
      signal_url: b.signal_url ? String(b.signal_url).slice(0, 1000) : null,
      signal_title: b.signal_title ? String(b.signal_title).slice(0, 500) : null,
      pillar: PILLARS.includes(b.pillar) ? b.pillar : null,
      candidate_topic: String(b.candidate_topic).slice(0, 300),
      editorial_notes: b.editorial_notes ? String(b.editorial_notes).slice(0, 2000) : null,
      status: 'new'
    };
    try {
      const sb = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}`, {
        method: 'POST',
        headers: sbHeaders(secret, { 'Content-Type': 'application/json', Prefer: 'return=representation' }),
        body: JSON.stringify(row)
      });
      if (!sb.ok) return res.status(502).json({ error: 'Create failed', status: sb.status, detail: await sb.text() });
      const rows = await sb.json();
      return res.status(200).json({ ok: true, candidate: rows[0] });
    } catch (e) { return res.status(502).json({ error: 'Could not reach Supabase', detail: e.message }); }
  }

  // ── PATCH: update ──
  if (req.method === 'PATCH') {
    const b = req.body || {};
    if (!b.id || !/^RQ-[\w.-]+$/.test(b.id)) return res.status(400).json({ error: 'Invalid or missing id' });
    const patch = {};
    if (b.status && STATUSES.includes(b.status)) patch.status = b.status;
    if (typeof b.editorial_notes === 'string') patch.editorial_notes = b.editorial_notes.slice(0, 2000);
    if (typeof b.candidate_topic === 'string' && b.candidate_topic.trim()) patch.candidate_topic = b.candidate_topic.slice(0, 300);
    if (typeof b.research_brief_id === 'string') patch.research_brief_id = b.research_brief_id.slice(0, 120);
    if (!Object.keys(patch).length) return res.status(400).json({ error: 'No valid fields to update' });
    try {
      const sb = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}?id=eq.${encodeURIComponent(b.id)}`, {
        method: 'PATCH',
        headers: sbHeaders(secret, { 'Content-Type': 'application/json', Prefer: 'return=representation' }),
        body: JSON.stringify(patch)
      });
      if (!sb.ok) return res.status(502).json({ error: 'Update failed', status: sb.status, detail: await sb.text() });
      const rows = await sb.json();
      if (!rows.length) return res.status(404).json({ error: 'Candidate not found' });
      return res.status(200).json({ ok: true, candidate: rows[0] });
    } catch (e) { return res.status(502).json({ error: 'Could not reach Supabase', detail: e.message }); }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
