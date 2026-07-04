#!/usr/bin/env python3
"""Phase 2 per-page convergence — dpi.html (Assessment template, §8.3).
Conservative type-role adoption on the CONTENT HIERARCHY only: exact-value rules
become token aliases (zero visual change); off-scale label sizes snap to nearest
role; lead gets the reading measure; page declared tmpl-assessment. Likert/progress/
nav UI micro-type left for a later pass (logged DD-13 UI). Per-rule count asserts."""
import sys, pathlib
src = pathlib.Path(sys.argv[1]) / "phase1-deploy" / "dpi.html"
out = pathlib.Path(sys.argv[1]) / "phase2-convergence" / "dpi.html"
out.parent.mkdir(parents=True, exist_ok=True)
t = src.read_text()
def rep(old, new, label):
    global t
    assert t.count(old) == 1, f"{label}: expected 1, found {t.count(old)}"
    t = t.replace(old, new, 1); print(f"  {label}")

# link Phase 2 stylesheets (after tokens.css)
rep('<link rel="stylesheet" href="/styles/tokens.css">',
    '<link rel="stylesheet" href="/styles/tokens.css">\n<link rel="stylesheet" href="/styles/typography.css">\n<link rel="stylesheet" href="/styles/layout.css">',
    "link typography.css + layout.css")

# type roles — exact-value aliases (zero change) + clean snaps
rep(".hero-kicker {\n    font-family: 'DM Mono', monospace;\n    font-size: 9px;",
    ".hero-kicker {\n    font-family: 'DM Mono', monospace;\n    font-size: var(--type-label);", "hero-kicker 9px -> --type-label")
rep(".hero-title {\n    font-family: 'Playfair Display', serif;\n    font-size: clamp(34px, 4.4vw, 50px);",
    ".hero-title {\n    font-family: 'Playfair Display', serif;\n    font-size: var(--type-hero);", "hero-title clamp -> --type-hero")
rep(".hero-desc {\n    font-family: 'DM Sans', sans-serif;\n    font-size: 16px;",
    ".hero-desc {\n    font-family: 'DM Sans', sans-serif;\n    font-size: var(--type-body);", "hero-desc 16px -> --type-body (exact)")
rep("color: var(--slate-70);\n    max-width: 660px;\n    line-height: 1.7;",
    "color: var(--slate-70);\n    max-width: var(--layout-reading);\n    line-height: 1.7;", "hero-desc max-width 660 -> --layout-reading")
rep("gap: 20px;\n    font-family: 'DM Mono', monospace;\n    font-size: 9px;",
    "gap: 20px;\n    font-family: 'DM Mono', monospace;\n    font-size: var(--type-meta);", "hero-meta 9px -> --type-meta")
rep(".dim-title {\n    font-family: 'Playfair Display', serif;\n    font-size: 22px;",
    ".dim-title {\n    font-family: 'Playfair Display', serif;\n    font-size: var(--type-h2);", "dim-title 22px -> --type-h2 (exact)")
rep(".dim-purpose {\n    font-family: 'DM Sans', sans-serif;\n    font-size: 13.5px;",
    ".dim-purpose {\n    font-family: 'DM Sans', sans-serif;\n    font-size: var(--type-body-sm);", "dim-purpose 13.5px -> --type-body-sm")
rep(".dim-pillar {\n    font-family: 'DM Mono', monospace;\n    font-size: 8.5px;",
    ".dim-pillar {\n    font-family: 'DM Mono', monospace;\n    font-size: var(--type-meta);", "dim-pillar 8.5px -> --type-meta")
rep(".stmt-text {\n    font-family: 'DM Sans', sans-serif;\n    font-size: 15px;",
    ".stmt-text {\n    font-family: 'DM Sans', sans-serif;\n    font-size: var(--type-body-sm);", "stmt-text 15px -> --type-body-sm (exact)")

# declare template (harmless: tmpl-assessment sub-classes aren't used here; intent marker)
rep("<body>", '<body class="tmpl tmpl-assessment">', "declare tmpl-assessment")

out.write_text(t)
print(f"\ndpi.html converged -> {out}")
