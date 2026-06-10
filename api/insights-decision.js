/**
 * POST /api/insights-decision — approve or reject a draft insight.
 * Body: { "id": "INS-...", "action": "approve" | "reject" }
 * approve → status 'published' + published_at now (appears in the public ticker)
 * reject  → status 'rejected' (kept for audit, never public)
 * Guarded by x-admin-key header. Requires env vars:
 *   ADMIN_API_KEY        — shared admin passphrase
 *   SUPABASE_SECRET_KEY  — Supabase secret key (server-side only)
 */
const SUPABASE_URL = 'https://mydxofjvpuurwwaohqys.supabase.co';

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

  const patch = action === 'approve'
    ? { status: 'published', published_at: new Date().toISOString() }
    : { status: 'rejected' };

  const sbRes = await fetch(
    SUPABASE_URL + '/rest/v1/insights?id=eq.' + encodeURIComponent(id) + '&status=eq.draft',
    {
      method: 'PATCH',
      headers: {
        'apikey': process.env.SUPABASE_SECRET_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SECRET_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(patch)
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
};
