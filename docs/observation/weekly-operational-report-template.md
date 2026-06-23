# Executive Signals — Weekly Operational Report

**Aligns to:** DR-001 · Priority 2 (Operational Baseline)
**Cadence:** weekly during the observation period (30–60 days from go-live)
**Sources:** `executive_signals` (SQL — see `observation-plan.md`); GitHub Actions logs; Anthropic usage.
**Authoritative numbers come from SQL here; the observation dashboard is the quick visual pulse.**

> Copy this block each week into `weekly-operational-reports.md` (or one file per week). Fields marked _[ ]_ are filled from the queries/log references noted.

---

## Week of YYYY-MM-DD  (Week N of observation)

### 1. Signal Volume
| Metric | This week | Prev week | Cumulative |
|---|---|---|---|
| Total ingested (stored) | _[ ]_ | _[ ]_ | _[ ]_ |
| Accepted (approved + published) | _[ ]_ | _[ ]_ | _[ ]_ |
| Rejected — agent (auto) | _[ ]_ | _[ ]_ | _[ ]_ |
| Rejected — admin | _[ ]_ | _[ ]_ | _[ ]_ |
| Published | _[ ]_ | _[ ]_ | _[ ]_ |

*Source:* observation-plan §1 + §2 SQL.

### 2. Source Quality
- **Highest-performing sources** (most accepted/published): _[ ]_
- **Lowest-performing sources** (high volume, low acceptance — candidates to reweight): _[ ]_
- **Source contribution** (share of ingested by source): _[ ]_
- Feeds returning 0 / errors this week: _[ ]_

*Source:* observation-plan §1 (source contribution) + a join of source × approval_status.

```sql
-- Source quality: ingested vs accepted by source (this week)
SELECT source_name,
       count(*) AS ingested,
       count(*) FILTER (WHERE approval_status IN ('approved','published')) AS accepted,
       count(*) FILTER (WHERE approval_status = 'published') AS published
FROM executive_signals
WHERE created_at >= date_trunc('week', now())
GROUP BY 1 ORDER BY ingested DESC;
```

### 3. Pillar Distribution
| Pillar | Count | % |
|---|---|---|
| Executive Operating Models | _[ ]_ | _[ ]_ |
| Decision Intelligence | _[ ]_ | _[ ]_ |
| Agentic Governance | _[ ]_ | _[ ]_ |
| AI Economics | _[ ]_ | _[ ]_ |
| Human Agency | _[ ]_ | _[ ]_ |
| Sovereign AI | _[ ]_ | _[ ]_ |

*Source:* observation-plan §3.

### 4. Editorial Performance
| Metric | Value |
|---|---|
| Approval rate (accepted / human-decided) | _[ ]_ % |
| Publication rate (published / accepted) | _[ ]_ % |
| Average executive relevance score | _[ ]_ |

*Source:* observation-plan §2 + `AVG(executive_relevance_score)`.

### 5. Platform Health
| Metric | Value | Notes |
|---|---|---|
| Daily runs succeeded | _[ ]_ / 7 | GitHub Actions → "Executive Signal Agent" |
| Failed / skipped runs | _[ ]_ | Time-guard skips are expected, not failures |
| Feed failures (sources erroring) | _[ ]_ | From run logs |
| API cost (week / cumulative) | _[ ]_ | Anthropic usage; target ~$3–5/mo |

### 6. Notes & actions
- Anomalies: _[ ]_
- Feed config changes made: _[ ]_
- Patterns logged to Emerging Pattern Register this week: _[count + IDs]_

---

*End of week N. Roll the highlights into the Constraint Intelligence Readiness Report at period close.*
