#!/usr/bin/env python3
"""Phase 2 convergence — EU AI Act reference pages (-> Editorial) + signals.html.
Lightweight formalisation (same approach as the tool batch): link Phase 2 layer,
declare template, tokenise exact-value content sizes (zero visual change).
signals.html is a filterable CARD INDEX that maps to none of the four templates
(template-coverage gap, ties to DD-12) -> links + size tokens only, NO template
class, gap logged for Clive's six-vs-five decision."""
import re, sys, pathlib
root = pathlib.Path(sys.argv[1]); OUT = root/"phase2-convergence"; OUT.mkdir(parents=True, exist_ok=True)

PAGES = {
    "eu-ai-act-tiers.html":            "tmpl-editorial",
    "eu-ai-act-reference.html":        "tmpl-editorial",
    "eu-ai-act-enforcement.html":      "tmpl-editorial",
    "eu-ai-act-enforcement-risk.html": "tmpl-editorial",
    "signals.html":                    None,   # card index — template gap, no class
}
SIZE = {"16px":"--type-body","15px":"--type-body-sm","22px":"--type-h2","18px":"--type-h3","19px":"--type-body-lg"}

for page, tmpl in PAGES.items():
    src = root/"phase1-deploy"/page; t = src.read_text(); n=0
    if "styles/typography.css" not in t:
        t = t.replace('<link rel="stylesheet" href="/styles/tokens.css">',
                      '<link rel="stylesheet" href="/styles/tokens.css">\n<link rel="stylesheet" href="/styles/typography.css">\n<link rel="stylesheet" href="/styles/layout.css">', 1)
    for px, tok in SIZE.items():
        t, c = re.subn(r"font-size:(\s*)"+re.escape(px)+r"(?![0-9])", rf"font-size:\1var({tok})", t); n += c
    if tmpl:
        assert t.count("<body>") == 1, f"{page}: <body> not unique"
        t = t.replace("<body>", f'<body class="tmpl {tmpl}">', 1)
    (OUT/page).write_text(t)
    o=src.read_text(); ob=(o.count('{'),o.count('}')); nb=(t.count('{'),t.count('}'))
    print(f"{page:32} tmpl={str(tmpl):14} sizes={n:2} braces {nb[0]}/{nb[1]} {'PRESERVED' if ob==nb else 'CHANGED!'}{'  [no class: template gap]' if not tmpl else ''}")
print("\nStaged ->", OUT)
