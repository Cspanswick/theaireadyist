/**
 * POST /api/insights-decision — approve or reject a draft insight.
 * Body: { "id": "INS-...", "action": "approve" | "reject" }
 *
 * approve → UPSERT-style publish:
 *   1. Canonicalise the draft's slug (strip the agent's -YYYY-MM-DD suffix)
 *      so every version of a topic publishes to ONE stable URL.
 *   2. Mark any currently-published row with that slug as 'superseded'
 *      (kept for audit, removed from the public ticker/list/detail).
 *   3. Publish the draft with the canonical slug + fresh published_at.
 *   4. Prune: keep only MAX_PUBLISHED most-recently-published rows;
 *      older ones become 'superseded' so the ticker stays fresh.
 *   Result: re-approving a topic REFRESHES the live insight instead of
 *   stacking duplicates in the Live Insights ticker.
 *
 * reject → status 'rejected' (kept for audit, never public)
 *
 * Works with the partial unique index (see supabase-migration.sql):
 *   CREATE UNIQUE INDEX insights_one_published_per_slug
 *     ON insights (slug) WHERE status = 'published';
 * If a concurrent approval wins the race, the 409 from Supabase triggers
 * one supersede-and-retry before failing.
 *
 * Guarded by x-admin-key header. Requires env vars:
 *   ADMIN_API_KEY        — shared admin passphrase
 *   SUPABASE_SECRET_KEY  — Supabase secret key (server-side only)
 */
const SUPABASE_URL = 'https://mydxofjvpuurwwaohqys.supabase.co';

/** Maximum number of published insights to keep live at any one time. */
const MAX_PUBLISHED = 10;

function sbHeaders(extra) {
  return Object.assign({
    'apikey': process.env.SUPABASE_SECRET_KEY,
    'Authorization': 'Bearer ' + process.env.SUPABASE_SECRET_KEY,
    'Content-Type': 'application/json'
  }, extra || {});
}

/** Strip the agent's date suffix; fall back to a slugified title. */
function canonicalSlug(slug, title) {
  const base = String(slug || '').replace(/-\d{4}-\d{2}-\d{2}$/, '').trim();
  if (base) return base;
  return String(title || 'untitled-insight')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'untitled-insight';
}

/** Mark any published row carrying this slug as superseded. */
async function supersedePublished(slug) {
  return fetch(
    SUPABASE_URL + '/rest/v1/insights'
      + '?slug=eq.' + encodeURIComponent(slug)
      + '&status=eq.published',
    {
      method: 'PATCH',
      headers: sbHeaders({ 'Prefer': 'return=minimal' }),
      body: JSON.stringify({ status: 'superseded' })
    }
  );
}

/** Publish the draft under the canonical slug. */
async function publishDraft(id, slug) {
  return fetch(
    SUPABASE_URL + '/rest/v1/insights'
      + '?id=eq.' + encodeURIComponent(id)
      + '&status=eq.draft',
    {
      method: 'PATCH',
      headers: sbHeaders({ 'Prefer': 'return=representation' }),
      body: JSON.stringify({
        status: 'published',
        slug: slug,
        published_at: new Date().toISOString()
      })
    }
  );
}

/**
 * Keep only the MAX_PUBLISHED most-recently-published rows live.
 * Anything older gets marked 'superseded'. Non-fatal: errors are
 * swallowed so a prune failure never blocks a successful approve.
 */
async function pruneOldPublished(maxKeep) {
  try {
    const listRes = await fetch(
      SUPABASE_URL + '/rest/v1/insights'
        + '?status=eq.published'
        + '&select=id'
        + '&order=published_at.desc',
      { headers: sbHeaders() }
    );
    if (!listRes.ok) return;
    const all = await listRes.json();
    if (all.length <= maxKeep) return;
    const toSupersede = all.slice(maxKeep).map(r => r.id);
    await fetch(
      SUPABASE_URL + '/rest/v1/insights'
        + '?id=in.(' + toSupersede.map(encodeURIComponent).join(',') + ')',
      {
        method: 'PATCH',
        headers: sbHeaders({ 'Prefer': 'return=minimal' }),
        body: JSON.stringify({ status: 'superseded' })
      }
    );
  } catch (_) {
    // non-fatal — prune best-effort only
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }
  if (!process.env.ADMIN_API_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  if (!process.env.SUPABASE_SECRET_KEY) {
    return res.status(500).json({ error: 'SUPABASE_SECRET_KEY not configured' });
  }

  const { id, action } = req.body || {};
  if (!id || !['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Body must be { id, action: approve|reject }' });
  }

  // ── Reject: unchanged behaviour ─────────────────────────────────
  if (action === 'reject') {
    const sbRes = await fetch(
      SUPABASE_URL + '/rest/v1/insights?id=eq.' + encodeURIComponent(id) + '&status=eq.draft',
      {
        method: 'PATCH',
        headers: sbHeaders({ 'Prefer': 'return=representation' }),
        body: JSON.stringify({ status: 'rejected' })
      }
    );
    if (!sbRes.ok) {
      return res.status(502).json({ error: 'Supabase update failed', status: sbRes.status });
    }
    const rows = await sbRes.json();
    if (!rows.length) {
      return res.status(404).json({ error: 'No draft found with that id (already decided?)' });
    }
    return res.status(200).json({ ok: true, id, action, insight: rows[0] });
  }

  // ── Approve: supersede-then-publish ─────────────────────────────
  // 1. Read the draft to derive its canonical slug
  const getRes = await fetch(
    SUPABASE_URL + '/rest/v1/insights'
      + '?id=eq.' + encodeURIComponent(id)
      + '&status=eq.draft'
      + '&select=id,slug,title&limit=1',
    { headers: sbHeaders() }
  );
  if (!getRes.ok) {
    return res.status(502).json({ error: 'Supabase read failed', status: getRes.status });
  }
  const drafts = await getRes.json();
  if (!drafts.length) {
    return res.status(404).json({ error: 'No draft found with that id (already decided?)' });
  }
  const slug = canonicalSlug(drafts[0].slug, drafts[0].title);

  // 2. Retire the currently-published version of this topic, if any
  const supRes = await supersedePublished(slug);
  if (!supRes.ok) {
    return res.status(502).json({ error: 'Supabase supersede failed', status: supRes.status });
  }

  // 3. Publish the draft under the canonical slug
  let pubRes = await publishDraft(id, slug);

  // Race lost (another approval published this slug between steps 2 and 3):
  // supersede once more and retry.
  if (pubRes.status === 409) {
    const retrySup = await supersedePublished(slug);
    if (retrySup.ok) pubRes = await publishDraft(id, slug);
  }

  if (!pubRes.ok) {
    return res.status(502).json({ error: 'Supabase publish failed', status: pubRes.status });
  }
  const rows = await pubRes.json();
  if (!rows.length) {
    return res.status(404).json({ error: 'No draft found with that id (already decided?)' });
  }

  // 4. Prune oldest published rows beyond MAX_PUBLISHED (best-effort)
  await pruneOldPublished(MAX_PUBLISHED);

  return res.status(200).json({ ok: true, id, action, slug, insight: rows[0] });
};
