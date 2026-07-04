#!/usr/bin/env python3
"""Phase 2 — map signals.html to the new Index template + converge the 6 admin pages.
signals already has Phase 2 links + size tokens (from the refs batch) -> just add the
tmpl-index body class now that the sixth template exists. Admin pages: lightweight
formalisation (links + exact-value size tokens + best-fit template class)."""
import re, sys, pathlib
root = pathlib.Path(sys.argv[1]); CONV = root/"phase2-convergence"
SIZE = {"16px":"--type-body","15px":"--type-body-sm","22px":"--type-h2","18px":"--type-h3","19px":"--type-body-lg"}

# 1) signals.html — add the tmpl-index class (file already converged in the refs batch)
s = (CONV/"signals.html").read_text()
assert s.count("<body>") == 1 and 'tmpl-index' not in s, "signals body state unexpected"
(CONV/"signals.html").write_text(s.replace("<body>", '<body class="tmpl tmpl-index">', 1))
print("signals.html -> tmpl-index class added")

# 2) admin pages
ADMIN = {
    "admin/signals/index.html":            "tmpl-index",      # review queue
    "admin/research-candidates/index.html":"tmpl-index",      # review queue
    "admin/approvals/index.html":          "tmpl-index",      # review queue
    "admin/observation/index.html":        "tmpl-dashboard",  # monitoring
    "admin/research-agent/index.html":     "tmpl-product",    # tool
    "admin/blog-research/index.html":      "tmpl-product",    # tool
}
for page, tmpl in ADMIN.items():
    src = root/"phase1-deploy"/page; t = src.read_text(); n=0
    if "styles/typography.css" not in t:
        t = t.replace('<link rel="stylesheet" href="/styles/tokens.css">',
                      '<link rel="stylesheet" href="/styles/tokens.css">\n<link rel="stylesheet" href="/styles/typography.css">\n<link rel="stylesheet" href="/styles/layout.css">', 1)
    for px, tok in SIZE.items():
        t, c = re.subn(r"font-size:(\s*)"+re.escape(px)+r"(?![0-9])", rf"font-size:\1var({tok})", t); n+=c
    assert t.count("<body>") == 1, f"{page}: <body> not unique"
    t = t.replace("<body>", f'<body class="tmpl {tmpl}">', 1)
    outp = CONV/page; outp.parent.mkdir(parents=True, exist_ok=True); outp.write_text(t)
    o=src.read_text(); ob=(o.count('{'),o.count('}')); nb=(t.count('{'),t.count('}'))
    print(f"{page:38} {tmpl:14} sizes={n:2} braces {nb[0]}/{nb[1]} {'PRESERVED' if ob==nb else 'CHANGED!'}")
print("\nStaged ->", CONV)
