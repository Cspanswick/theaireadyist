/**
 * run-signal-agent.js — Executive Signal Agent v1
 * theAIReadyist
 *
 * Pillar-based executive signal engine. NOT a generic AI news scraper.
 *
 * Pipeline:
 *   1. Load source config (agent/configs/signal-sources.json)
 *   2. Fetch + parse public RSS/Atom feeds for enabled sources
 *   3. Deduplicate by URL (within run + against rows already in Supabase)
 *   4. Two-tier classification:
 *        Tier 1 (Haiku)  — triage every item: pillar, confidence, reason,
 *                          executive relevance score (1–5), keep/reject
 *        Tier 2 (Sonnet) — only for items scoring 4–5: write the full signal
 *                          (signal_title, why_it_matters, decision_question, tags)
 *   5. Store every evaluated item in Supabase `executive_signals`
 *        - score 4–5 & relevant  → approval_status = 'pending'  (enters approval queue)
 *        - everything else        → approval_status = 'rejected' (audit + dedup memory)
 *   6. Log a run summary
 *
 * NOTHING IS PUBLISHED. Pending signals require human approval via /admin/signals.
 *
 * Ingestion rules (hard):
 *   - RSS/Atom headline metadata only (title, url, source, date, excerpt)
 *   - Never fetch paywalled article bodies; never bypass access controls
 *   - No browser automation; no personal data collected
 *
 * Environment:
 *   ANTHROPIC_API_KEY    — required unless MOCK_CLASSIFY=1
 *   SUPABASE_SECRET_KEY  — required to store signals (skips storage if absent)
 *   CONFIG_FILE          — optional, defaults to signal-sources.json
 *   MOCK_CLASSIFY=1      — offline deterministic classifier (testing only)
 *   FEED_FIXTURES=<path> — read items from a local JSON fixture instead of fetching (testing only)
 *   MAX_ITEMS=<n>        — global cap on items evaluated per run (cost control)
 *   DRY_RUN=1            — run the full pipeline but do not write to Supabase
 */

const fs = require('fs');
const path = require('path');

// ── Models ─────────────────────────────────────────────
// Verified current production model strings (June 2026).
const TRIAGE_MODEL = 'claude-haiku-4-5-20251001'; // Tier 1 — cheap triage of every item
const SIGNAL_MODEL = 'claude-sonnet-4-6';         // Tier 2 — full signal for queued items only

// ── Supabase ───────────────────────────────────────────
const SB_URL = 'https://mydxofjvpuurwwaohqys.supabase.co';
const SB_TABLE = 'executive_signals';

// ── Canonical six pillars (must not be renamed) ────────
const PILLARS = [
  'Executive Operating Models',
  'Decision Intelligence',
  'Agentic Governance',
  'AI Economics',
  'Human Agency',
  'Sovereign AI'
];

// ── Tunables ───────────────────────────────────────────
const QUEUE_THRESHOLD = 4;        // only scores >= this enter the approval queue
const TRIAGE_BATCH = 12;          // items per Haiku triage call
const SIGNAL_BATCH = 6;           // items per Sonnet signal call

// ════════════════════════════════════════════════════════
// Config loading
// ════════════════════════════════════════════════════════
function loadConfig() {
  const configFile = process.env.CONFIG_FILE || 'signal-sources.json';
  const configPath = path.join(__dirname, 'configs', configFile);
  if (!fs.existsSync(configPath)) {
    console.error(`Source config not found: ${configPath}`);
    process.exit(1);
  }
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  console.log(`Loaded source config: ${configFile} (v${cfg.version})`);
  return cfg;
}

// ════════════════════════════════════════════════════════
// Feed fetching + parsing (dependency-free, tolerant)
// ════════════════════════════════════════════════════════
function decodeEntities(s) {
  if (!s) return '';
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')              // strip any embedded HTML tags
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#x2019;/gi, '’').replace(/&#8217;/g, '’')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function pick(block, tags) {
  for (const tag of tags) {
    // <tag ...>value</tag>
    const m = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i'));
    if (m && m[1] && m[1].trim()) return m[1];
  }
  return '';
}

function pickLink(block) {
  // RSS: <link>url</link>  |  Atom: <link href="url" .../>
  const rss = block.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/i);
  if (rss && rss[1] && rss[1].trim().startsWith('http')) return rss[1].trim();
  const atomAlt = block.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i);
  if (atomAlt) return atomAlt[1];
  const atom = block.match(/<link[^>]*href=["']([^"']+)["']/i);
  if (atom) return atom[1];
  const guid = block.match(/<guid(?:\s[^>]*)?>([\s\S]*?)<\/guid>/i);
  if (guid && guid[1] && guid[1].trim().startsWith('http')) return guid[1].trim();
  return '';
}

function parseFeed(xml, sourceName) {
  const items = [];
  // Support both RSS <item> and Atom <entry>
  const blocks = xml.match(/<(item|entry)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi) || [];
  for (const block of blocks) {
    const title = decodeEntities(pick(block, ['title']));
    const url = (pickLink(block) || '').trim();
    const dateRaw = pick(block, ['pubDate', 'published', 'updated', 'dc:date']).trim();
    const excerpt = decodeEntities(pick(block, ['description', 'summary', 'content:encoded', 'content']))
      .slice(0, 400);
    if (!title || !url) continue;
    let published = null;
    if (dateRaw) {
      const d = new Date(dateRaw);
      if (!isNaN(d.getTime())) published = d.toISOString();
    }
    items.push({ source: sourceName, title, url, published, excerpt });
  }
  return items;
}

async function fetchFeed(source, defaults) {
  const ua = (defaults && defaults.user_agent) || 'AIReadyistSignalBot/1.0';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(source.feed_url, {
      headers: { 'User-Agent': ua, 'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.warn(`  ! ${source.name}: HTTP ${res.status} — skipped`);
      return [];
    }
    const xml = await res.text();
    const items = parseFeed(xml, source.name);
    console.log(`  · ${source.name}: ${items.length} items`);
    return items;
  } catch (e) {
    clearTimeout(timeout);
    console.warn(`  ! ${source.name}: fetch failed (${e.message}) — skipped`);
    return [];
  }
}

// ════════════════════════════════════════════════════════
// Gather candidate items (fetch or fixtures), filter, dedupe within run
// ════════════════════════════════════════════════════════
async function gatherItems(cfg) {
  const defaults = cfg.defaults || {};
  const lookbackMs = (defaults.lookback_hours || 30) * 3600 * 1000;
  const maxPer = defaults.max_items_per_source || 25;
  const cutoff = Date.now() - lookbackMs;

  let raw = [];

  if (process.env.FEED_FIXTURES) {
    const fx = JSON.parse(fs.readFileSync(process.env.FEED_FIXTURES, 'utf-8'));
    raw = Array.isArray(fx) ? fx : (fx.items || []);
    console.log(`Loaded ${raw.length} items from fixtures: ${process.env.FEED_FIXTURES}`);
  } else {
    const enabled = (cfg.sources || []).filter(s => s.enabled && s.feed_url);
    console.log(`Fetching ${enabled.length} enabled source(s)...`);
    for (const source of enabled) {
      let items = await fetchFeed(source, defaults);
      // group + region tagging from source config
      items = items.map(it => ({ ...it, source_group: source.group, region: source.default_region || null }));
      // per-source recency filter (keep items with no date — many feeds omit it)
      items = items.filter(it => !it.published || new Date(it.published).getTime() >= cutoff);
      items = items.slice(0, maxPer);
      raw.push(...items);
    }
  }

  // Dedupe within the run by normalised URL
  const seen = new Set();
  const deduped = [];
  let dupWithinRun = 0;
  for (const it of raw) {
    const key = normUrl(it.url);
    if (!key) continue;
    if (seen.has(key)) { dupWithinRun++; continue; }
    seen.add(key);
    deduped.push(it);
  }

  return { items: deduped, fetched: raw.length, dupWithinRun };
}

function normUrl(u) {
  if (!u) return '';
  try {
    const url = new URL(u.trim());
    url.hash = '';
    // strip common tracking params
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid']
      .forEach(p => url.searchParams.delete(p));
    let s = url.toString();
    return s.replace(/\/$/, '').toLowerCase();
  } catch {
    return u.trim().replace(/\/$/, '').toLowerCase();
  }
}

// ════════════════════════════════════════════════════════
// Dedupe against rows already stored in Supabase
// ════════════════════════════════════════════════════════
async function filterAlreadyStored(items, secret) {
  if (!secret || !items.length) return { fresh: items, dupStored: 0 };
  const known = new Set();
  // Pull recent source_urls (cap to a reasonable window)
  const url = `${SB_URL}/rest/v1/${SB_TABLE}?select=source_url&order=created_at.desc&limit=4000`;
  try {
    const res = await fetch(url, { headers: { apikey: secret, Authorization: 'Bearer ' + secret } });
    if (res.ok) {
      const rows = await res.json();
      rows.forEach(r => known.add(normUrl(r.source_url)));
    }
  } catch (e) {
    console.warn(`  ! Could not load existing URLs for dedup (${e.message}) — proceeding without store-dedup.`);
  }
  let dupStored = 0;
  const fresh = items.filter(it => {
    if (known.has(normUrl(it.url))) { dupStored++; return false; }
    return true;
  });
  return { fresh, dupStored };
}

// ════════════════════════════════════════════════════════
// Tier 1 — Haiku triage
// ════════════════════════════════════════════════════════
const TRIAGE_SYSTEM = `You are the triage stage of TheAIReadyist Executive Signal Agent. This is a pillar-based executive signal engine, NOT a generic AI news classifier.

Classify each item against EXACTLY ONE primary pillar (optionally one secondary pillar) from the six canonical pillars, score its executive relevance 1–5, and decide whether to keep or reject it.

THE SIX PILLARS:
1. Executive Operating Models — how organisations redesign themselves to operate in an AI-native world (operating models, org design, transformation, workflow/process redesign, decision velocity, AI-enabled enterprises).
2. Decision Intelligence — improving the quality of decisions (decision science, knowledge systems, enterprise search, data strategy, RAG, context engineering, information architecture, decision support, analytics for decisions).
3. Agentic Governance — governing AI authority and accountability (agentic AI, AI governance/regulation, risk, auditability, human oversight, decision rights, autonomous agents, responsible AI controls, compliance for AI decisions).
4. AI Economics — creating and measuring value from AI (AI ROI, cost management, productivity, value realisation, investment decisions, business cases, FinOps for AI, inference costs, vendor pricing, cost of scale).
5. Human Agency — humans remaining effective decision-makers (leadership, trust, judgement, behaviour, culture, human accountability, AI literacy, organisational psychology, role identity, leadership mindset).
6. Sovereign AI — trusted, resilient AI capability (sovereignty, data residency, DORA, NIS2, EU AI Act sovereignty, geopolitics, infrastructure independence, national AI strategies, resilience, critical infrastructure, cloud dependency, regulatory divergence by geography).

Do NOT classify by "Decision Performance" dimensions — those are the underlying outcome model, not the editorial taxonomy.

EXECUTIVE RELEVANCE SCORE:
5 — Board-level signal: significant implication for AI strategy, governance, economics, operating model, sovereignty or human leadership.
4 — Strategic: material implication for CIO/COO/CFO/CEO/board, MSP or telco leadership.
3 — Important: useful for monitoring, not yet board-level.
2 — Relevant: connected to a pillar but low urgency/impact.
1 — Interesting: relevant but not strategically important.

REJECT (set classification_status:"reject") when the item is:
- a vendor press release / product launch with no executive implication
- low-quality SEO content, social posts, rumours
- not relevant to any pillar (reason: "not_relevant_to_pillars")
Do NOT force weak items into the taxonomy. If unsure of the pillar, set classification_confidence:"low".

OUTPUT: Respond with ONLY a JSON array, one object per input item, in the same order:
[{"i":0,"primary_pillar":"<one of the six exact names>","secondary_pillar":"<exact name or null>","classification_confidence":"high|medium|low","classification_reason":"<short>","executive_relevance_score":1-5,"classification_status":"keep|reject","rejected_reason":"<short or null>"}]
No prose, no markdown fences.`;

async function triageBatch(client, batch) {
  const payload = batch.map((it, idx) => ({
    i: idx,
    title: it.title,
    source: it.source,
    group: it.source_group || '',
    excerpt: (it.excerpt || '').slice(0, 300)
  }));
  const res = await client.messages.create({
    model: TRIAGE_MODEL,
    max_tokens: 2048,
    system: TRIAGE_SYSTEM,
    messages: [{ role: 'user', content: 'Classify and score these items:\n' + JSON.stringify(payload) }]
  });
  return parseJsonArray(res, batch.length);
}

// ════════════════════════════════════════════════════════
// Tier 2 — Sonnet full signal generation (queued items only)
// ════════════════════════════════════════════════════════
const SIGNAL_SYSTEM = `You write executive signals for TheAIReadyist. Each input item has already been classified to a pillar and scored 4 or 5 (queue-worthy). For each item produce the publishable signal fields.

Rules:
- Signal Title: a short executive headline (not the raw article title; sharpen it).
- Why It Matters: 2–4 sentences focused on the EXECUTIVE IMPLICATION, not an article summary.
- Decision Question: ONE question an executive should ask (e.g. "What decision rights need to change before this capability is deployed?").
- Suggested Tags: 3–6 concise tags.
Do not invent facts beyond the title/excerpt. If the excerpt is thin, keep claims cautious.

OUTPUT: ONLY a JSON array, one object per input item, same order:
[{"i":0,"signal_title":"...","why_it_matters":"...","decision_question":"...","suggested_tags":["...","..."]}]
No prose, no markdown fences.`;

async function signalBatch(client, batch) {
  const payload = batch.map((it, idx) => ({
    i: idx,
    original_title: it.title,
    source: it.source,
    excerpt: (it.excerpt || '').slice(0, 350),
    primary_pillar: it.primary_pillar,
    secondary_pillar: it.secondary_pillar,
    executive_relevance_score: it.executive_relevance_score
  }));
  const res = await client.messages.create({
    model: SIGNAL_MODEL,
    max_tokens: 3072,
    system: SIGNAL_SYSTEM,
    messages: [{ role: 'user', content: 'Write signals for these items:\n' + JSON.stringify(payload) }]
  });
  return parseJsonArray(res, batch.length);
}

function parseJsonArray(res, expectedLen) {
  const text = (res.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  let json = text.trim();
  // strip code fences if the model added them
  json = json.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  const start = json.indexOf('[');
  const end = json.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('No JSON array in model response');
  return JSON.parse(json.slice(start, end + 1));
}

// ════════════════════════════════════════════════════════
// MOCK classifier (offline testing only)
// ════════════════════════════════════════════════════════
const MOCK_RULES = [
  { pillar: 'AI Economics', kw: ['roi', 'cost', 'spend', 'price', 'pricing', 'investment', 'budget', 'value', 'productivity', 'finops'] },
  { pillar: 'Agentic Governance', kw: ['governance', 'regulat', 'agent', 'autonom', 'risk', 'audit', 'compliance', 'oversight', 'accountab'] },
  { pillar: 'Sovereign AI', kw: ['sovereign', 'data residency', 'dora', 'nis2', 'eu ai act', 'geopolit', 'infrastructure', 'national', 'resilien', 'cloud depend'] },
  { pillar: 'Decision Intelligence', kw: ['decision', 'knowledge', 'rag', 'context engineering', 'data strategy', 'analytics', 'enterprise search', 'information architecture'] },
  { pillar: 'Human Agency', kw: ['leadership', 'culture', 'trust', 'literacy', 'workforce', 'skill', 'judgement', 'human', 'talent'] },
  { pillar: 'Executive Operating Models', kw: ['operating model', 'transformation', 'restructur', 'workflow', 'org design', 'reorganis', 'process', 'platform model', 'ai-native'] }
];
function mockTriage(batch) {
  return batch.map((it, i) => {
    const hay = (it.title + ' ' + (it.excerpt || '')).toLowerCase();
    let primary = null, secondary = null;
    for (const r of MOCK_RULES) {
      if (r.kw.some(k => hay.includes(k))) {
        if (!primary) primary = r.pillar;
        else if (!secondary && r.pillar !== primary) secondary = r.pillar;
      }
    }
    const reject = /press release|launches?|now available|webinar|sponsored|giveaway/.test(hay) && !/governance|roi|cost|sovereign/.test(hay);
    if (!primary && !reject) primary = 'Executive Operating Models';
    // deterministic pseudo-score
    let score = 1 + ((it.title.length + (it.excerpt || '').length) % 5);
    if (/board|cio|cfo|ceo|chief|enterprise|strategy/.test(hay)) score = Math.min(5, score + 1);
    return {
      i,
      primary_pillar: reject ? null : primary,
      secondary_pillar: secondary,
      classification_confidence: primary ? 'medium' : 'low',
      classification_reason: reject ? 'matched reject heuristic' : `keyword match → ${primary}`,
      executive_relevance_score: reject ? 1 : score,
      classification_status: reject ? 'reject' : 'keep',
      rejected_reason: reject ? 'vendor_or_low_quality' : null
    };
  });
}
function mockSignal(batch) {
  return batch.map((it, i) => ({
    i,
    signal_title: it.title.length > 70 ? it.title.slice(0, 67) + '…' : it.title,
    why_it_matters: `[MOCK] Executive implication for ${it.primary_pillar}: leaders should weigh how this affects their AI posture. Generated offline for pipeline testing.`,
    decision_question: 'What decision should leadership revisit in light of this signal?',
    suggested_tags: [it.primary_pillar, it.source, 'AI'].filter(Boolean)
  }));
}

// ════════════════════════════════════════════════════════
// Storage
// ════════════════════════════════════════════════════════
function slugify(s) {
  return (s || 'signal').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

function buildRow(it, nowIso) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const rand = Math.random().toString(36).slice(2, 7);
  const queued = it.classification_status === 'keep'
    && PILLARS.includes(it.primary_pillar)
    && Number(it.executive_relevance_score) >= QUEUE_THRESHOLD;
  return {
    id: 'SIG-' + ts + '-' + rand,
    retrieved_at: nowIso,
    published_at: it.published || null,
    source_name: it.source,
    source_url: it.url,
    source_group: it.source_group || null,
    source_published_at: it.published || null,
    original_title: it.title,
    signal_title: it.signal_title || it.title,
    excerpt: it.excerpt || null,
    primary_pillar: PILLARS.includes(it.primary_pillar) ? it.primary_pillar : null,
    secondary_pillar: PILLARS.includes(it.secondary_pillar) ? it.secondary_pillar : null,
    classification_confidence: it.classification_confidence || 'low',
    classification_reason: it.classification_reason || null,
    executive_relevance_score: Number(it.executive_relevance_score) || null,
    why_it_matters: it.why_it_matters || null,
    decision_question: it.decision_question || null,
    suggested_tags: Array.isArray(it.suggested_tags) ? it.suggested_tags : [],
    approval_status: queued ? 'pending' : 'rejected',
    rejected_reason: queued ? null : (it.rejected_reason || (it.classification_status === 'reject' ? 'filtered' : 'below_relevance_threshold')),
    published_slug: queued ? slugify(it.signal_title || it.title) : null,
    raw_metadata: { region: it.region || null, triage_score: it.executive_relevance_score }
  };
}

async function storeRows(rows, secret) {
  if (process.env.DEBUG_ROWS === '1') {
    const sample = rows.filter(r => r.approval_status === 'pending').slice(0, 2);
    console.log('\n[DEBUG_ROWS] sample pending rows:\n' + JSON.stringify(sample, null, 2));
  }
  if (!secret) { console.log('SUPABASE_SECRET_KEY not set — skipping storage (dry).'); return { stored: 0 }; }
  if (process.env.DRY_RUN === '1') { console.log('DRY_RUN=1 — not writing to Supabase.'); return { stored: 0 }; }
  let stored = 0;
  // insert in chunks
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    const res = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}`, {
      method: 'POST',
      headers: {
        apikey: secret, Authorization: 'Bearer ' + secret,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal,resolution=ignore-duplicates'
      },
      body: JSON.stringify(chunk)
    });
    if (res.ok) stored += chunk.length;
    else console.error(`  ! Insert chunk failed: HTTP ${res.status} ${await res.text()}`);
  }
  return { stored };
}

// ════════════════════════════════════════════════════════
// Main
// ════════════════════════════════════════════════════════
async function run() {
  const nowIso = new Date().toISOString();
  const mock = process.env.MOCK_CLASSIFY === '1';
  const secret = process.env.SUPABASE_SECRET_KEY;
  const maxItems = parseInt(process.env.MAX_ITEMS || '0', 10);

  const cfg = loadConfig();
  const enabledCount = (cfg.sources || []).filter(s => s.enabled && s.feed_url).length;
  const groupsTested = new Set((cfg.sources || []).filter(s => s.enabled && s.feed_url).map(s => s.group));

  // 1–3. Gather + dedupe
  let { items, fetched, dupWithinRun } = await gatherItems(cfg);
  const { fresh, dupStored } = await filterAlreadyStored(items, secret);
  items = fresh;
  if (maxItems > 0 && items.length > maxItems) {
    console.log(`Capping ${items.length} candidate items to MAX_ITEMS=${maxItems}.`);
    items = items.slice(0, maxItems);
  }
  console.log(`Candidates after dedupe: ${items.length} (fetched ${fetched}, ${dupWithinRun} dup-in-run, ${dupStored} already stored)`);

  if (!items.length) {
    console.log('No new items to classify. Done.');
    return summary({ enabledCount, groupsTested, fetched, classified: 0, queued: 0, rejected: 0, dupWithinRun, dupStored, stored: 0 });
  }

  // 4a. Tier-1 triage
  let client = null;
  if (!mock) {
    const Anthropic = require('@anthropic-ai/sdk');
    client = new Anthropic(); // reads ANTHROPIC_API_KEY
  }
  console.log(`Tier 1 triage (${mock ? 'MOCK' : TRIAGE_MODEL}) over ${items.length} items...`);
  for (let i = 0; i < items.length; i += TRIAGE_BATCH) {
    const batch = items.slice(i, i + TRIAGE_BATCH);
    let verdicts;
    try {
      verdicts = mock ? mockTriage(batch) : await triageBatch(client, batch);
    } catch (e) {
      console.warn(`  ! Triage batch failed (${e.message}) — marking batch low-confidence reject.`);
      verdicts = batch.map((_, idx) => ({ i: idx, primary_pillar: null, classification_status: 'reject', classification_confidence: 'low', executive_relevance_score: 1, rejected_reason: 'triage_error' }));
    }
    verdicts.forEach(v => {
      const it = batch[v.i];
      if (!it) return;
      Object.assign(it, {
        primary_pillar: v.primary_pillar || null,
        secondary_pillar: v.secondary_pillar || null,
        classification_confidence: v.classification_confidence || 'low',
        classification_reason: v.classification_reason || null,
        executive_relevance_score: v.executive_relevance_score || 1,
        classification_status: v.classification_status || 'keep',
        rejected_reason: v.rejected_reason || null
      });
    });
  }

  // 4b. Tier-2 signal generation for queue-worthy items only
  const queueItems = items.filter(it =>
    it.classification_status === 'keep'
    && PILLARS.includes(it.primary_pillar)
    && Number(it.executive_relevance_score) >= QUEUE_THRESHOLD);
  console.log(`Tier 2 signal generation (${mock ? 'MOCK' : SIGNAL_MODEL}) over ${queueItems.length} queued items...`);
  for (let i = 0; i < queueItems.length; i += SIGNAL_BATCH) {
    const batch = queueItems.slice(i, i + SIGNAL_BATCH);
    let signals;
    try {
      signals = mock ? mockSignal(batch) : await signalBatch(client, batch);
    } catch (e) {
      console.warn(`  ! Signal batch failed (${e.message}) — using original titles as fallback.`);
      signals = batch.map((it, idx) => ({ i: idx, signal_title: it.title, why_it_matters: null, decision_question: null, suggested_tags: [] }));
    }
    signals.forEach(s => {
      const it = batch[s.i];
      if (!it) return;
      Object.assign(it, {
        signal_title: s.signal_title || it.title,
        why_it_matters: s.why_it_matters || null,
        decision_question: s.decision_question || null,
        suggested_tags: Array.isArray(s.suggested_tags) ? s.suggested_tags : []
      });
    });
  }

  // 5. Build + store rows
  const rows = items.map(it => buildRow(it, nowIso));
  const queued = rows.filter(r => r.approval_status === 'pending').length;
  const rejected = rows.length - queued;
  const { stored } = await storeRows(rows, secret);

  return summary({
    enabledCount, groupsTested, fetched,
    classified: items.length, queued, rejected,
    dupWithinRun, dupStored, stored,
    rows
  });
}

function summary(s) {
  const groups = [...(s.groupsTested || [])];
  console.log('\n──────── RUN SUMMARY ────────');
  console.log(`Enabled sources:     ${s.enabledCount} across ${groups.length} group(s): ${groups.join(', ')}`);
  console.log(`Items fetched:       ${s.fetched}`);
  console.log(`Duplicates skipped:  ${s.dupWithinRun} (within run) + ${s.dupStored} (already stored)`);
  console.log(`Items classified:    ${s.classified}`);
  console.log(`Queued (pending):    ${s.queued}`);
  console.log(`Rejected:            ${s.rejected}`);
  console.log(`Stored to Supabase:  ${s.stored}`);
  console.log('All queued signals require human approval at /admin/signals — nothing is published.');
  console.log('─────────────────────────────');
  return s;
}

run().catch(err => {
  console.error('Signal agent run failed:', err.stack || err.message);
  process.exit(1);
});
