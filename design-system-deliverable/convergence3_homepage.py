#!/usr/bin/env python3
"""Convergence Pass 3 — HOMEPAGE ONLY (index.html). Hero-Protection-critical.
Targets DD-03 (nav logo teal), DD-04 (Live Insights feed cards -> border-only),
DD-08 (Live Insights --li- band palette -> hero). NO global swaps; every edit is a
specific string so the hero block (.hero*) is provably untouched. DD-05 NOT applied
(awaiting sign-off)."""
import re, sys, pathlib
p = pathlib.Path(sys.argv[1]) / "index.html"
t = p.read_text(); orig = t
edits = []
def rep(old, new, label, n=1):
    global t
    c = t.count(old)
    assert c == n, f"{label}: expected {n} match(es), found {c}"
    t = t.replace(old, new, n); edits.append((label, n))

# --- tokens.css link in <head> (needed so var(--color-*) resolves in the band) ---
if "styles/tokens.css" not in t:
    t = re.sub(r"(\n([ \t]*)<style)", r'\n\2<link rel="stylesheet" href="/styles/tokens.css">\1', t, count=1)
    edits.append(("tokens link", 1))

# --- DD-03 nav logo teal split (markup + css) ---
rep('">theAIReadyist</a>', '">the<span class="nav-ai">AI</span>Readyist</a>', "DD-03 nav markup")
t2, n = re.subn(r'(\.nav-logo\s*\{[^}]*\})', r'\1\n  .nav-logo .nav-ai { color: var(--teal); }', t, count=1)
assert n == 1, "DD-03 nav css rule not inserted"; t = t2; edits.append(("DD-03 nav css", 1))

# --- DD-04 feed cards -> border-only (transparent rest state; subtle teal hover) ---
rep('.feed-lead {\n    background: var(--bg2);', '.feed-lead {\n    background: transparent;', "DD-04 feed-lead bg")
rep('.feed-lead:hover { background: #192d4e; }', '.feed-lead:hover { background: rgba(0,184,162,0.05); }', "DD-04 feed-lead hover")
rep('.feed-item {\n    background: var(--bg2);', '.feed-item {\n    background: transparent;', "DD-04 feed-item bg")
rep('.feed-item:hover { background: #192d4e; }', '.feed-item:hover { background: rgba(0,184,162,0.05); }', "DD-04 feed-item hover")

# DD-04 (cont.) border-only cards need a subtle border to carry separation structurally
rep('    border-right: 1px solid var(--rule);\n    transition: background 0.15s;\n    min-height: 280px;',
    '    border: 1px solid var(--li-border-sub);\n    transition: background 0.15s;\n    min-height: 280px;',
    "DD-04 feed-lead border")
rep('    flex: 1;\n    transition: background 0.15s;\n  }',
    '    flex: 1;\n    border: 1px solid var(--li-border-sub);\n    transition: background 0.15s;\n  }',
    "DD-04 feed-item border")

# --- DD-08 Live Insights band palette -> hero (line-specific) ---
rep('--li-navy:      #0D1B2A;', '--li-navy:      var(--color-bg);',            "DD-08 li-navy")
rep('--li-teal:      #00C9A7;', '--li-teal:      var(--color-accent);',        "DD-08 li-teal")
rep('--li-text:      #F0F4F8;', '--li-text:      var(--color-text-primary);',  "DD-08 li-text")
rep('--li-amber:     #E8A838;', '--li-amber:     var(--color-warning);',       "DD-08 li-amber")
rep('--li-text-sec:  rgba(240,244,248,0.65);', '--li-text-sec:  rgba(245,242,236,0.65);', "DD-08 li-text-sec")
rep('--li-text-mut:  rgba(240,244,248,0.40);', '--li-text-mut:  rgba(245,242,236,0.40);', "DD-08 li-text-mut")
rep('--li-border:    rgba(0,201,167,0.20);', '--li-border:    rgba(0,184,162,0.20);', "DD-08 li-border")
rep('--li-border-hi: rgba(0,201,167,0.55);', '--li-border-hi: rgba(0,184,162,0.55);', "DD-08 li-border-hi")
rep('box-shadow: 0 0 0 0 rgba(0,201,167,0.45); }', 'box-shadow: 0 0 0 0 rgba(0,184,162,0.45); }', "DD-08 pulse kf1")
rep('box-shadow: 0 0 0 6px rgba(0,201,167,0); }', 'box-shadow: 0 0 0 6px rgba(0,184,162,0); }', "DD-08 pulse kf2")

p.write_text(t)
print("Applied edits:")
for lbl, n in edits: print(f"  {lbl}")
print(f"\nTotal edits: {len(edits)} | bytes {len(orig)} -> {len(t)}")
