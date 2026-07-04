#!/usr/bin/env python3
"""Convergence Pass 2 (Phase 1) — DD-02 (single source of truth), DD-07 (hardcoded
hex), residual DD-01 (missed old-palette rgba), DD-04 (border-only primary cards).
Operates on phase1-deploy/. EXCLUDES index.html (homepage gets its own reviewed pass).
All hex->token swaps are VALUE-IDENTICAL (zero visual change). DD-04 is the only
intended visual change and is applied only to confirmed primary-content cards."""
import re, sys, pathlib

ROOT = pathlib.Path(sys.argv[1])

PAGES = [
    "signals.html","dpi.html","dora.html","nis2.html","radar.html","eu-ai-act.html",
    "eu-ai-act-enforcement.html","eu-ai-act-enforcement-risk.html","eu-ai-act-reference.html",
    "eu-ai-act-tiers.html","admin/signals/index.html","admin/observation/index.html",
    "admin/research-candidates/index.html","admin/approvals/index.html",
    "admin/research-agent/index.html","admin/blog-research/index.html",
]  # index.html deliberately excluded

# value-identical hex -> token map (exact tokens.css values)
HEX = {
    "0D1F3C":"--color-bg","0C1118":"--color-bg-deep","162440":"--color-bg-raised",
    "00B8A2":"--color-accent","0E8576":"--color-accent-dim","F5F2EC":"--color-text-primary",
    "A0AEBB":"--color-text-secondary","6B7A8D":"--color-text-muted","4CAF8E":"--color-success",
    "E8A838":"--color-warning","D96A5B":"--color-risk",
}
# DD-04 targets: (file, selector) -> primary content cards only
DD04 = {
    "signals.html":[r"\.card"],
    "admin/signals/index.html":[r"\.sig-card"],
    "admin/research-candidates/index.html":[r"\.rc"],
    "admin/approvals/index.html":[r"\.draft-card"],
}

def alias_hex(style:str)->tuple[str,int]:
    n=0
    for hexv,tok in HEX.items():
        # match #RRGGBB not followed by another hex digit; case-insensitive
        pat=re.compile(r"#"+hexv+r"(?![0-9A-Fa-f])", re.IGNORECASE)
        style,c=pat.subn(f"var({tok})", style); n+=c
    return style,n

def fix_residual(style:str)->tuple[str,int]:
    # old navy #0D1B2A in rgb form -> hero navy 13,31,60
    style,c=re.subn(r"rgba\(\s*13\s*,\s*27\s*,\s*42", "rgba(13, 31, 60", style)
    return style,c

def dd04(style:str, selectors)->tuple[str,int]:
    n=0
    for sel in selectors:
        pat=re.compile(r"("+sel+r"\s*\{[^}]*?background:\s*)var\(--(?:surface|bg2|raised)\)")
        style,c=pat.subn(r"\1transparent", style); n+=c
    return style,n

summary=[]
for rel in PAGES:
    p=ROOT/rel
    if not p.exists(): summary.append((rel,"MISSING",0,0,0,0)); continue
    t=p.read_text()
    # 1) insert tokens.css link before first <style if absent
    link_added=0
    if "styles/tokens.css" not in t:
        t=re.sub(r"(\n([ \t]*)<style)", r'\n\2<link rel="stylesheet" href="/styles/tokens.css">\1', t, count=1)
        link_added=1
    # operate inside <style>...</style> blocks only
    blocks=list(re.finditer(r"<style[^>]*>.*?</style>", t, re.DOTALL))
    hexn=resn=cardn=0
    for m in reversed(blocks):  # reverse so indices stay valid
        s=m.group(0)
        s,a=alias_hex(s); hexn+=a
        s,r=fix_residual(s); resn+=r
        if rel in DD04:
            s,c=dd04(s, DD04[rel]); cardn+=c
        t=t[:m.start()]+s+t[m.end():]
    p.write_text(t)
    summary.append((rel,"ok",link_added,hexn,resn,cardn))

print(f"{'page':40} link hex resid card")
for rel,st,lk,hx,rs,cd in summary:
    print(f"{rel:40} {lk:>4} {hx:>3} {rs:>5} {cd:>4}  {st}")
print("\nTotals: hex->token", sum(s[3] for s in summary),
      "| residual-navy", sum(s[4] for s in summary),
      "| cards->transparent", sum(s[5] for s in summary))
