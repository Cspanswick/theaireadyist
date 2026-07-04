#!/usr/bin/env python3
"""Convergence Pass 4 — DD-05 homepage readiness labels -> six canonical pillars.
LABEL TEXT ONLY: 6 hero score-dim names + 6 matching DIMENSION_SCORES keys (kept in
sync) + 2 stray feed tags. NO scores/colours/widths/structure/CSS change. Full-context
replacements with count asserts so 'Operating Model' can't corrupt 'Executive Operating
Models' elsewhere. Hero structure stays intact (only inner text nodes change)."""
import sys, pathlib
p = pathlib.Path(sys.argv[1]) / "index.html"
t = p.read_text()
def rep(old, new, label):
    global t
    assert t.count(old) == 1, f"{label}: expected 1 match, found {t.count(old)}"
    t = t.replace(old, new, 1); print(f"  {label}")

print("HTML score-dim names:")
rep('<span class="score-dim-name">AI Cost Governance</span>',          '<span class="score-dim-name">AI Economics</span>', "AI Cost Governance -> AI Economics")
rep('<span class="score-dim-name">Governance &amp; Trust</span>',      '<span class="score-dim-name">Agentic Governance</span>', "Governance & Trust -> Agentic Governance")
rep('<span class="score-dim-name">Human &amp; Culture Readiness</span>','<span class="score-dim-name">Human Agency</span>', "Human & Culture Readiness -> Human Agency")
rep('<span class="score-dim-name">Operating Model</span>',             '<span class="score-dim-name">Executive Operating Models</span>', "Operating Model -> Executive Operating Models")
rep('<span class="score-dim-name">Production Readiness</span>',        '<span class="score-dim-name">Decision Intelligence</span>', "Production Readiness -> Decision Intelligence")
rep('<span class="score-dim-name">Regulatory Compliance</span>',       '<span class="score-dim-name">Sovereign AI</span>', "Regulatory Compliance -> Sovereign AI")

print("DIMENSION_SCORES keys (kept in sync):")
rep("'AI Cost Governance':",    "'AI Economics':",               "key: AI Economics")
rep("'Governance & Trust':",    "'Agentic Governance':",         "key: Agentic Governance")
rep("'Human & Culture':",       "'Human Agency':",               "key: Human Agency")
rep("'Operating Model':",       "'Executive Operating Models':", "key: Executive Operating Models")
rep("'Production Readiness':",  "'Decision Intelligence':",      "key: Decision Intelligence")
rep("'Regulatory Compliance':", "'Sovereign AI':",               "key: Sovereign AI")

print("Stray feed tags:")
rep('<span class="feed-tag">PoC Purgatory</span>',        '<span class="feed-tag">Executive Operating Models</span>', "PoC Purgatory -> Executive Operating Models")
rep('<span class="feed-tag">AI Cost Intelligence</span>', '<span class="feed-tag">AI Economics</span>', "AI Cost Intelligence -> AI Economics")

p.write_text(t)
print("\nDD-05 applied: 14 label-only edits.")
