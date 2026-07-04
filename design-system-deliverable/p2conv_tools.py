#!/usr/bin/env python3
"""Phase 2 convergence — tool pages (eu-ai-act, dora, nis2 -> Assessment; radar -> Dashboard).
These already meet the experiential bar after Phase 1 (verified live: teal accent, faces,
border-only cards). So this is LIGHTWEIGHT FORMALISATION, not a restyle:
  (1) link typography.css + layout.css
  (2) declare the template class on <body> (DD-16)
  (3) tokenise EXACT-VALUE content font-sizes -> role tokens (zero visual change, DD-13 SSOT)
Off-scale label/score/nav sizes and reading-measure polish are deferred (logged) — the pages
already read as one institution, so no risky scale changes."""
import re, sys, pathlib
root = pathlib.Path(sys.argv[1])
OUT = root / "phase2-convergence"; OUT.mkdir(parents=True, exist_ok=True)

PAGES = {
    "eu-ai-act.html": "tmpl-assessment",
    "dora.html":      "tmpl-assessment",
    "nis2.html":      "tmpl-assessment",
    "radar.html":     "tmpl-dashboard",
}
# exact px -> token (value-identical at 16px root): body/heading sizes only
SIZE = {"16px":"--type-body","15px":"--type-body-sm","22px":"--type-h2","18px":"--type-h3","19px":"--type-body-lg"}

for page, tmpl in PAGES.items():
    t = (root/"phase1-deploy"/page).read_text(); n_links=n_size=0
    # (1) stylesheets
    if "styles/typography.css" not in t:
        t = t.replace('<link rel="stylesheet" href="/styles/tokens.css">',
                      '<link rel="stylesheet" href="/styles/tokens.css">\n<link rel="stylesheet" href="/styles/typography.css">\n<link rel="stylesheet" href="/styles/layout.css">', 1)
        n_links = 1
    # (3) tokenise exact-value font-sizes (anchored to font-size:)
    for px, tok in SIZE.items():
        t, c = re.subn(r"font-size:(\s*)"+re.escape(px)+r"(?![0-9])", rf"font-size:\1var({tok})", t)
        n_size += c
    # (2) template class
    assert t.count("<body>") == 1, f"{page}: <body> not unique"
    t = t.replace("<body>", f'<body class="tmpl {tmpl}">', 1)
    (OUT/page).write_text(t)
    # integrity
    ob, cb = t.count("{"), t.count("}")
    print(f"{page:18} tmpl={tmpl:15} links+{n_links} sizes-tokenised={n_size:2}  braces {ob}/{cb} {'OK' if ob==cb else 'MISMATCH'}")
print("\nStaged ->", OUT)
