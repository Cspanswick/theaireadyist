/**
 * run-agent.js — Scheduled Research News Agent runner
 * theAIReadyist
 *
 * Reads a config JSON (produced by the control centre), calls the Claude API
 * with web search enabled, applies the agent instructions and guardrails,
 * and writes a markdown brief to agent/output/.
 *
 * Nothing is published. The output is a draft for human review.
 */

const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// ── Model ──────────────────────────────────────────────
// Verified current production model string (June 2026).
// Sonnet 4.6 balances quality and cost for scheduled runs.
const MODEL = 'claude-sonnet-4-6';

// ── Load config ────────────────────────────────────────
const configFile = process.env.CONFIG_FILE || 'default.json';
const configPath = path.join(__dirname, 'configs', configFile);

if (!fs.existsSync(configPath)) {
  console.error(`Config not found: ${configPath}`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
console.log(`Loaded config: ${configFile}`);
console.log(`Topic: ${config.topic}`);

// ── Build the agent system prompt ──────────────────────
// This encodes the agent-instructions.md rules: source hierarchy,
// confidence levels, fact/opinion/vendor separation, and the
// mandatory human-approval notice.
const systemPrompt = `You are a Scheduled Market News Research Agent for theAIReadyist.

Your job: research recent, credible sources on the configured topic and produce a structured, cited, evidence-led brief.

SOURCE QUALITY HIERARCHY (prioritise in this order):
1. Primary sources — official announcements, regulators, standards bodies, company statements
2. Recognised analyst firms, research organisations, consultancies
3. Credible trade press and specialist publications
4. Vendor blogs and marketing — clearly labelled as vendor perspective
5. Social/informal commentary — only if useful, marked low confidence

CONFIDENCE LEVELS:
- High: primary sources, official documents, or multiple credible sources
- Medium: credible secondary sources, no primary confirmation
- Low: opinion, vendor material, limited or unverified evidence

MANDATORY RULES:
- Cite every factual claim with source name and date
- Separate facts, opinions and vendor claims explicitly
- Flag weak or conflicting evidence
- Never invent sources or fabricate statistics
- Never present vendor claims as neutral evidence
- Show confidence level for each major finding
- End with a human-approval notice — you must NOT publish, email, post or distribute

GUARDRAILS ACTIVE THIS RUN:
${(config.guardrails || []).map(g => `- ${g}`).join('\n')}

OUTPUT FORMAT: ${config.output?.outputFormat || 'executive-brief'}
TARGET LENGTH: ~${config.output?.documentLengthWords || 1000} words
TONE: ${config.output?.tone || 'Executive'}

Produce the brief in clean markdown with these sections:
1. Configuration summary
2. Executive summary
3. Latest developments (headline, summary, source, date, evidence type, confidence)
4. Key themes
5. Market implications
6. Source register (markdown table)
7. Contradictions or evidence gaps
8. Recommended follow-up
9. Human approval notice`;

// ── Build the user message ─────────────────────────────
const sectors = Array.isArray(config.marketFocus) ? config.marketFocus.join(', ') : config.marketFocus;
const regions = Array.isArray(config.region) ? config.region.join(', ') : config.region;
const sourceTypes = config.sourcePreferences?.preferredSourceTypes?.join(', ') || 'any credible source';
const excluded = config.sourcePreferences?.excludedSources || 'none';

const userMessage = `Research this topic and produce the brief:

TOPIC: ${config.topic}
SECTOR(S): ${sectors || 'not specified'}
REGION(S): ${regions || 'not specified'}
PREFERRED SOURCES: ${sourceTypes}
EXCLUDED SOURCES: ${excluded}

Focus on developments from the last 3 months. Use web search to find current, credible sources. Today's date is ${new Date().toISOString().split('T')[0]}.`;

// ── Call the Claude API ────────────────────────────────
async function run() {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

  console.log('Calling Claude API with web search...');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search'
      }
    ]
  });

  // Assemble the text output from all text blocks
  const brief = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');

  if (!brief.trim()) {
    console.error('No text returned from the API.');
    process.exit(1);
  }

  // ── Write the output ─────────────────────────────────
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
  const safeTopic = (config.topic || 'brief')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 50);
  const outName = `${timestamp}_${safeTopic}.md`;
  const outDir = path.join(__dirname, 'output');
  const outPath = path.join(outDir, outName);

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const header = `---
generated: ${new Date().toISOString()}
topic: ${config.topic}
sectors: ${sectors}
regions: ${regions}
model: ${MODEL}
status: DRAFT — awaiting human approval
---

`;

  fs.writeFileSync(outPath, header + brief, 'utf-8');
  console.log(`Brief written: agent/output/${outName}`);
}

run().catch(err => {
  console.error('Agent run failed:', err.message);
  process.exit(1);
});
