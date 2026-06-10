/**
 * GET /api/insights-pending — list draft insights awaiting approval.
 * Guarded by x-admin-key header. Requires env vars:
 *   ADMIN_API_KEY        — shared admin passphrase
 *   SUPABASE_SECRET_KEY  — Supabase secret key (server-side only, bypasses RLS)
 */
const SUPABASE_URL = 'https://mydxofjvpuurwwaohqys.supabase.co';

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GET only' });
  }
  if (!process.env.ADMIN_API_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  if (!process.env.SUPABASE_SECRET_KEY) {
    return res.status(500).json({ error: 'SUPABASE_SECRET_KEY not configured' });
  }

  const sbRes = await fetch(
    SUPABASE_URL + '/rest/v1/insights?status=eq.draft&select=*&order=created_at.desc',
    {
      headers: {
        'apikey': process.env.SUPABASE_SECRET_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SECRET_KEY
      }
    }
  );

  if (!sbRes.ok) {
    return res.status(502).json({ error: 'Supabase read failed', status: sbRes.status });
  }
  const rows = await sbRes.json();
  return res.status(200).json({ ok: true, count: rows.length, drafts: rows });
};
