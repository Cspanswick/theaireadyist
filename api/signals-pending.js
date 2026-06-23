/**
 * GET /api/signals-pending — return executive signals for admin review.
 * Guarded by x-admin-key header. Requires env:
 *   ADMIN_API_KEY       — shared admin passphrase
 *   SUPABASE_SECRET_KEY — Supabase secret key (bypasses RLS)
 *
 * Optional query filters:
 *   status  — pending (default) | approved | rejected | published | all
 *   pillar  — exact pillar name
 *   source  — exact source_name
 *   minScore — minimum executive_relevance_score (1..5)
 */
const SB_URL = 'https://mydxofjvpuurwwaohqys.supabase.co';
const SB_TABLE = 'executive_signals';

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GET only' });
  }
  if (!process.env.ADMIN_API_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ error: 'SUPABASE_SECRET_KEY not configured' });
  }

  const q = req.query || {};
  const status = (q.status || 'pending').toString();
  const params = ['select=*', 'order=executive_relevance_score.desc,created_at.desc', 'limit=300'];

  if (status !== 'all') params.push('approval_status=eq.' + encodeURIComponent(status));
  if (q.pillar) params.push('primary_pillar=eq.' + encodeURIComponent(q.pillar.toString()));
  if (q.source) params.push('source_name=eq.' + encodeURIComponent(q.source.toString()));
  if (q.minScore) params.push('executive_relevance_score=gte.' + encodeURIComponent(q.minScore.toString()));

  const url = `${SB_URL}/rest/v1/${SB_TABLE}?${params.join('&')}`;
  try {
    const sb = await fetch(url, { headers: { apikey: secret, Authorization: 'Bearer ' + secret } });
    if (!sb.ok) {
      return res.status(502).json({ error: 'Supabase read failed', status: sb.status });
    }
    const signals = await sb.json();
    return res.status(200).json({ signals });
  } catch (e) {
    return res.status(502).json({ error: 'Could not reach Supabase', detail: e.message });
  }
};
