/**
 * POST /api/dpi-submit — store an anonymous Decision Performance Index result.
 *
 * The DPI assessment (dpi.html) computes the score entirely client-side and
 * works with or without this endpoint. On submission it POSTs an anonymous,
 * benchmark-ready result here. The page ignores any failure, so the assessment
 * always completes for the user even if storage is not yet configured.
 *
 * Privacy: this endpoint stores NO personal data. It accepts only the scores,
 * the identified constraints, and optional coarse benchmark dimensions
 * (industry / org size / geography). Any unexpected fields are dropped.
 *
 * Body (application/json):
 *   {
 *     "assessment_id": "DPI-2026-06-22T...",
 *     "timestamp": "2026-06-22T...Z",
 *     "version": "1.0",
 *     "overall_score": 64.0,
 *     "band": "Performing",
 *     "primary_constraint": "Decision Accountability",
 *     "secondary_constraint": "Decision Velocity",
 *     "dimension_scores": { "quality": 75, "velocity": 50, ... },
 *     "industry": null, "org_size": null, "geography": null
 *   }
 *
 * Requires env var (server-side only, bypasses RLS):
 *   SUPABASE_SECRET_KEY  — Supabase secret key
 *
 * Storage is best-effort. If SUPABASE_SECRET_KEY is absent the endpoint returns
 * 200 with { ok: true, stored: false } so the client never sees an error.
 */
const SUPABASE_URL = 'https://mydxofjvpuurwwaohqys.supabase.co';

const DIMENSION_IDS = ['quality', 'velocity', 'accountability', 'capability', 'value', 'resilience'];
const BANDS = ['Reactive', 'Developing', 'Performing', 'Adaptive'];
const CONSTRAINTS = [
  'Decision Quality', 'Decision Velocity', 'Decision Accountability',
  'Decision Capability', 'Decision Value', 'Decision Resilience'
];

function clampScore(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return null;
  return Math.max(0, Math.min(100, Math.round(x * 10) / 10));
}

function cleanText(s, max) {
  if (typeof s !== 'string') return null;
  const t = s.trim().slice(0, max || 80);
  return t.length ? t : null;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const b = req.body || {};

  // ── Validate / sanitise (drop anything unexpected) ──────────────
  const overall = clampScore(b.overall_score);
  if (overall === null) {
    return res.status(400).json({ error: 'overall_score (0–100) is required' });
  }
  if (!BANDS.includes(b.band)) {
    return res.status(400).json({ error: 'band must be one of ' + BANDS.join(', ') });
  }
  if (!CONSTRAINTS.includes(b.primary_constraint) || !CONSTRAINTS.includes(b.secondary_constraint)) {
    return res.status(400).json({ error: 'primary/secondary_constraint must be a valid dimension name' });
  }

  const dimScores = {};
  const src = b.dimension_scores || {};
  DIMENSION_IDS.forEach(id => { dimScores[id] = clampScore(src[id]); });

  const row = {
    id: cleanText(b.assessment_id, 64) || ('DPI-' + new Date().toISOString().replace(/[:.]/g, '-')),
    created_at: new Date().toISOString(),
    version: cleanText(b.version, 16) || '1.0',
    overall_score: overall,
    band: b.band,
    primary_constraint: b.primary_constraint,
    secondary_constraint: b.secondary_constraint,
    dimension_scores: dimScores,        // jsonb
    industry: cleanText(b.industry, 64),
    org_size: cleanText(b.org_size, 32),
    geography: cleanText(b.geography, 64)
  };

  // ── Best-effort storage ─────────────────────────────────────────
  if (!process.env.SUPABASE_SECRET_KEY) {
    // Not configured yet — accept and acknowledge without persisting.
    return res.status(200).json({ ok: true, stored: false, reason: 'storage not configured' });
  }

  try {
    const sbRes = await fetch(SUPABASE_URL + '/rest/v1/dpi_results', {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_SECRET_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SECRET_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(row)
    });

    if (!sbRes.ok) {
      const detail = await sbRes.text().catch(() => '');
      return res.status(502).json({ ok: false, stored: false, status: sbRes.status, detail: detail.slice(0, 200) });
    }
    return res.status(200).json({ ok: true, stored: true, id: row.id });
  } catch (e) {
    return res.status(502).json({ ok: false, stored: false, error: 'storage request failed' });
  }
};
