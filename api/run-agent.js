/**
 * POST /api/run-agent — trigger the Research News Agent workflow on GitHub.
 * Guarded by x-admin-key header. Requires env vars:
 *   ADMIN_API_KEY  — shared admin passphrase
 *   GITHUB_TOKEN   — fine-grained PAT with Actions read/write on Cspanswick/theaireadyist
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }
  if (!process.env.ADMIN_API_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  if (!process.env.GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN not configured' });
  }

  const config = (req.body && req.body.config) || 'default.json';
  if (!/^[\w.-]+\.json$/.test(config)) {
    return res.status(400).json({ error: 'Invalid config filename' });
  }

  const ghRes = await fetch(
    'https://api.github.com/repos/Cspanswick/theaireadyist/actions/workflows/research-agent.yml/dispatches',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'theaireadyist-admin'
      },
      body: JSON.stringify({ ref: 'main', inputs: { config } })
    }
  );

  if (ghRes.status === 204) {
    return res.status(200).json({ ok: true, message: 'Agent run started', config });
  }
  const detail = await ghRes.text();
  return res.status(502).json({ error: 'GitHub dispatch failed', status: ghRes.status, detail });
};
