#!/usr/bin/env python3
"""HOTFIX — remove self-referential custom properties introduced by Convergence
Pass 2 (e.g. `--color-bg: var(--color-bg)`). These are circular -> resolve to empty,
collapsing the navy background + primary text on 6 tool/reference pages.
Fix: delete the self-ref declaration lines so the values flow from tokens.css
(which is linked and applies — verified live). Per-file asserts; braces preserved."""
import re, pathlib, sys
root = pathlib.Path(sys.argv[1]); OUT = root/"hotfix-selfref"; OUT.mkdir(parents=True, exist_ok=True)

# (source path, output filename) — the LIVE version of each affected page
FILES = [
    ("phase2-convergence/dora.html", "dora.html"),
    ("phase2-convergence/nis2.html", "nis2.html"),
    ("phase2-convergence/eu-ai-act-tiers.html", "eu-ai-act-tiers.html"),
    ("phase2-convergence/eu-ai-act-enforcement.html", "eu-ai-act-enforcement.html"),
    ("phase2-convergence/eu-ai-act-enforcement-risk.html", "eu-ai-act-enforcement-risk.html"),
    ("phase4-deploy/radar.html", "radar.html"),   # live radar (has the Phase 4 canvas fix)
]
# remove a whole declaration line that is self-referential: --X: var(--X);
selfref = re.compile(r'\n[ \t]*--([a-z0-9-]+)\s*:\s*var\(\s*--\1\s*\)\s*;?[ \t]*(?=\n)')

for src, name in FILES:
    p = root/src; t = p.read_text(); ob=(t.count('{'),t.count('}'))
    assert "styles/tokens.css" in t, f"{name}: tokens.css NOT linked — removal unsafe!"
    t2, n = selfref.subn('', t)
    assert n >= 1, f"{name}: expected >=1 self-ref, found {n}"
    assert not selfref.search(t2), f"{name}: self-ref remains"
    assert (t2.count('{'),t2.count('}'))==ob, f"{name}: brace count changed"
    (OUT/name).write_text(t2)
    print(f"{name:34} removed {n} self-ref line(s) · braces {ob[0]}/{ob[1]} preserved · tokens linked ✓")
print("\nFixed files ->", OUT)
