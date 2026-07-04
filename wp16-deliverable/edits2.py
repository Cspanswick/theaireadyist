import os
os.chdir('/tmp/tair')
f = 'index.html'
s = open(f, encoding='utf-8').read()
orig = s

# 1) Tab bar: CFO/CHRO/CIO/CTO/Board  ->  CEO/CFO/COO/Tech Executive/CHRO/Board
old_tabs = (
"      <button class=\"lenses-tab active\" onclick=\"setLens('cfo')\" role=\"tab\" aria-selected=\"true\">CFO</button>\n"
"      <button class=\"lenses-tab\" onclick=\"setLens('chro')\" role=\"tab\" aria-selected=\"false\">CHRO</button>\n"
"      <button class=\"lenses-tab\" onclick=\"setLens('cio')\" role=\"tab\" aria-selected=\"false\">CIO</button>\n"
"      <button class=\"lenses-tab\" onclick=\"setLens('cto')\" role=\"tab\" aria-selected=\"false\">CTO</button>\n"
"      <button class=\"lenses-tab\" onclick=\"setLens('board')\" role=\"tab\" aria-selected=\"false\">Board</button>\n"
)
new_tabs = (
"      <button class=\"lenses-tab active\" onclick=\"setLens('ceo')\" role=\"tab\" aria-selected=\"true\">CEO</button>\n"
"      <button class=\"lenses-tab\" onclick=\"setLens('cfo')\" role=\"tab\" aria-selected=\"false\">CFO</button>\n"
"      <button class=\"lenses-tab\" onclick=\"setLens('coo')\" role=\"tab\" aria-selected=\"false\">COO</button>\n"
"      <button class=\"lenses-tab\" onclick=\"setLens('tech')\" role=\"tab\" aria-selected=\"false\">Tech Executive</button>\n"
"      <button class=\"lenses-tab\" onclick=\"setLens('chro')\" role=\"tab\" aria-selected=\"false\">CHRO</button>\n"
"      <button class=\"lenses-tab\" onclick=\"setLens('board')\" role=\"tab\" aria-selected=\"false\">Board</button>\n"
)
assert s.count(old_tabs) == 1, "tabs block not found"
s = s.replace(old_tabs, new_tabs, 1)

# 2) Replace the whole LENSES object (slice between marker and renderLens)
new_lenses = '''const LENSES = {
  ceo: {
    label: "CEO Lens",
    thesis: "Are we becoming an AI-ready enterprise?",
    sub: "Competitive advantage, growth and transformation now turn on AI readiness. The CEO owns whether the organisation is positioning to lead the category or follow it.",
    pillars: [
      { num: "02", name: "Decision Intelligence", priority: "high" },
      { num: "01", name: "Executive Operating Models", priority: "high" },
      { num: "04", name: "AI Economics", priority: "watch" },
      { num: "05", name: "Human Agency", priority: "watch" },
    ],
    articles: [
      { tag: "Executive Operating Models", title: "The Operating Model Is the Strategy", href: "https://cspanswick.substack.com" },
      { tag: "Executive Operating Models", title: "What AI-Native Actually Looks Like at Scale", href: "https://cspanswick.substack.com" },
      { tag: "AI Economics", title: "The AI Bill Shock Nobody Is Budgeting For", href: "https://cspanswick.substack.com/p/the-ai-bill-shock-nobody-is-budgeting" },
    ]
  },
  cfo: {
    label: "CFO Lens",
    thesis: "Are we investing wisely and creating measurable value?",
    sub: "AI is a capital-allocation decision before it is a technology one. The CFO owns investment discipline, ROI and value realisation across the AI portfolio.",
    pillars: [
      { num: "04", name: "AI Economics", priority: "high" },
      { num: "01", name: "Executive Operating Models", priority: "watch" },
      { num: "03", name: "Agentic Governance", priority: "watch" },
      { num: "02", name: "Decision Intelligence", priority: "watch" },
    ],
    articles: [
      { tag: "AI Economics", title: "The AI Bill Shock Nobody Is Budgeting For", href: "https://cspanswick.substack.com/p/the-ai-bill-shock-nobody-is-budgeting" },
      { tag: "AI Economics", title: "When Agents Talk to Agents, Who Pays?", href: "https://cspanswick.substack.com" },
      { tag: "Agentic Governance", title: "Who Owns the Model When It Gets It Wrong?", href: "https://cspanswick.substack.com" },
    ]
  },
  coo: {
    label: "COO Lens",
    thesis: "Can the organisation operationalise AI safely and repeatably?",
    sub: "Operating model, execution and decision velocity. The COO owns the gap between an AI that demos and an AI that runs the business every day.",
    pillars: [
      { num: "01", name: "Executive Operating Models", priority: "high" },
      { num: "02", name: "Decision Intelligence", priority: "high" },
      { num: "05", name: "Human Agency", priority: "watch" },
      { num: "03", name: "Agentic Governance", priority: "watch" },
    ],
    articles: [
      { tag: "Executive Operating Models", title: "The Operating Model Is the Strategy", href: "https://cspanswick.substack.com" },
      { tag: "Executive Operating Models", title: "Production Readiness Is Not a Technical Problem", href: "https://cspanswick.substack.com" },
      { tag: "Decision Intelligence", title: "What AI-Native Actually Looks Like at Scale", href: "https://cspanswick.substack.com" },
    ]
  },
  tech: {
    label: "Tech Executive Lens",
    serving: "CIO \\u2022 CTO \\u2022 CAIO \\u2022 CDAO \\u2022 CISO",
    thesis: "Can we build, govern and operate AI at enterprise scale?",
    sub: "Enterprise architecture, data and production readiness, AI platforms and operations, governance implementation, cyber resilience and trust \\u2014 the collective technology leadership accountable for making AI real.",
    pillars: [
      { num: "03", name: "Agentic Governance", priority: "high" },
      { num: "06", name: "Sovereign AI", priority: "high" },
      { num: "02", name: "Decision Intelligence", priority: "watch" },
      { num: "01", name: "Executive Operating Models", priority: "watch" },
    ],
    articles: [
      { tag: "Agentic Governance", title: "Vibe Coding Has a Stop Sign", href: "https://cspanswick.substack.com/p/vibe-coding-has-a-stop-sign" },
      { tag: "Sovereign AI", title: "The EU AI Act Is Not an IT Problem", href: "https://cspanswick.substack.com" },
      { tag: "Executive Operating Models", title: "Production Readiness Is Not a Technical Problem", href: "https://cspanswick.substack.com" },
    ]
  },
  chro: {
    label: "CHRO Lens",
    thesis: "Can our people adapt successfully?",
    sub: "Workforce transformation, skills, leadership and human agency. The CHRO owns whether the organisation's people thrive alongside AI rather than merely survive it.",
    pillars: [
      { num: "05", name: "Human Agency", priority: "high" },
      { num: "01", name: "Executive Operating Models", priority: "watch" },
      { num: "02", name: "Decision Intelligence", priority: "watch" },
      { num: "03", name: "Agentic Governance", priority: "watch" },
    ],
    articles: [
      { tag: "Human Agency", title: "Can You Prove This Role Can't Be Done by AI?", href: "https://cspanswick.substack.com/p/can-you-prove-this-role-cant-be-done" },
      { tag: "Human Agency", title: "Why AI Champions Burn Out", href: "https://cspanswick.substack.com" },
      { tag: "Executive Operating Models", title: "What AI-Native Actually Looks Like at Scale", href: "https://cspanswick.substack.com" },
    ]
  },
  board: {
    label: "Board Lens",
    thesis: "Are we governing AI responsibly?",
    sub: "Governance, oversight, fiduciary responsibility, strategic risk and resilience. The board owns whether AI is being adopted with appropriate accountability.",
    pillars: [
      { num: "03", name: "Agentic Governance", priority: "high" },
      { num: "06", name: "Sovereign AI", priority: "high" },
      { num: "04", name: "AI Economics", priority: "watch" },
      { num: "05", name: "Human Agency", priority: "watch" },
    ],
    articles: [
      { tag: "Agentic Governance", title: "Governance Without Theatre", href: "https://cspanswick.substack.com" },
      { tag: "Agentic Governance", title: "Who Owns the Model When It Gets It Wrong?", href: "https://cspanswick.substack.com" },
      { tag: "Sovereign AI", title: "The EU AI Act Is Not an IT Problem", href: "https://cspanswick.substack.com" },
    ]
  }
};
'''
start = s.index('const LENSES = {')
end = s.index('function renderLens')
s = s[:start] + new_lenses + '\n' + s[end:]

# 3) renderLens: render the optional "Serving:" line under the lens label
old_label = '<div class="lenses-function-label">${d.label}</div>'
new_label = ('<div class="lenses-function-label">${d.label}</div>'
             '${d.serving ? `<div class="lenses-serving" style="font-family:\'DM Mono\',monospace;font-size:12px;letter-spacing:.08em;color:rgba(240,244,248,.5);margin-top:6px;">Serving: ${d.serving}</div>` : ""}')
assert s.count(old_label) == 1, "function-label not found"
s = s.replace(old_label, new_label, 1)

# 4) Initialise on CEO
s = s.replace("// Initialise on CFO\nrenderLens('cfo');", "// Initialise on CEO\nrenderLens('ceo');", 1)

assert s != orig
open(f, 'w', encoding='utf-8').write(s)
print("index.html executive lens refresh applied")
