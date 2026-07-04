#!/usr/bin/env python3
"""Phase 4 — fix radar.html canvas to use resolved data-viz tokens.
Canvas can't read CSS var() (those calls silently failed): introduce a global VIZ
token bridge (getComputedStyle, resolved once) and replace every broken var() ctx
call + ad-hoc series hex with tokens. Links dataviz.css too. Per-edit count asserts."""
import sys, pathlib
root = pathlib.Path(sys.argv[1]); OUT = root/"phase4-deploy"; OUT.mkdir(parents=True, exist_ok=True)
src = root/"phase2-convergence"/"radar.html"   # latest deployed version
t = src.read_text()
def rep(old, new, label):
    global t
    assert t.count(old) == 1, f"{label}: expected 1, found {t.count(old)}"
    t = t.replace(old, new, 1); print(f"  {label}")

# link dataviz.css (after components.css if linked, else after tokens.css)
if "styles/dataviz.css" not in t:
    anchor = '<link rel="stylesheet" href="/styles/layout.css">'
    rep(anchor, anchor + '\n<link rel="stylesheet" href="/styles/dataviz.css">', "link dataviz.css")

# global VIZ token bridge, defined before getColor
rep("function getColor(v) {",
    "const VIZ = (() => { const c = getComputedStyle(document.documentElement); const g = k => c.getPropertyValue(k).trim();\n"
    "  return { grid: g('--color-data-grid')||'rgba(245,242,236,0.10)', gridHi:'rgba(0,184,162,0.25)',\n"
    "    accent: g('--color-accent')||'#00B8A2', warning: g('--color-warning')||'#E8A838',\n"
    "    risk: g('--color-risk')||'#D96A5B', success: g('--color-success')||'#4CAF8E',\n"
    "    data3: g('--color-data-3')||'#6FA8DC', bg: g('--color-bg')||'#0D1F3C' }; })();\n\n"
    "function getColor(v) {", "insert global VIZ bridge")

# getColor -> tokens
rep("  if (v < 30) return '#e05c5c';\n  if (v < 55) return '#d4845a';\n  if (v < 75) return 'var(--teal)';\n  if (v < 90) return '#9acd9a';\n  return '#7aaa8a';",
    "  if (v < 30) return VIZ.risk;\n  if (v < 55) return VIZ.warning;\n  if (v < 75) return VIZ.accent;\n  if (v < 90) return VIZ.success;\n  return VIZ.success;",
    "getColor -> tokens")

# slider track gradient (CSS context — var() valid here)
rep("const colorMap = { euai:'#6a9fc0', dora:'#d4845a', nis2:'#7aaa8a' };",
    "const colorMap = { euai:'var(--color-data-3)', dora:'var(--color-warning)', nis2:'var(--color-success)' };",
    "slider colorMap -> tokens")

# framework dot colours
rep("const dotColors = isControl ? null : ['#6a9fc0', '#d4845a', '#7aaa8a'];",
    "const dotColors = isControl ? null : [VIZ.data3, VIZ.warning, VIZ.success];",
    "dotColors -> tokens")

# rings + spokes (BROKEN var() in canvas -> resolved grid tokens)
rep("ctx.strokeStyle = ring === 100 ? 'var(--teal-dim)' : 'var(--rule)';",
    "ctx.strokeStyle = ring === 100 ? VIZ.gridHi : VIZ.grid;", "ring grid -> tokens")
rep("    ctx.strokeStyle = 'var(--rule)';\n    ctx.lineWidth = 0.5;",
    "    ctx.strokeStyle = VIZ.grid;\n    ctx.lineWidth = 0.5;", "spoke grid -> token")

# data polygon fill/stroke -> semantic tokens (fixes var(--teal-dim) fill branch)
rep("  const fillC = avg < 0.30 ? 'rgba(224,92,92,0.12)' : avg < 0.55 ? 'rgba(212,132,90,0.12)' : avg < 0.75 ? 'var(--teal-dim)' : 'rgba(122,170,138,0.12)';",
    "  const fillC = avg < 0.30 ? VIZ.risk+'1f' : avg < 0.55 ? VIZ.warning+'1f' : avg < 0.75 ? VIZ.accent+'1f' : VIZ.success+'1f';",
    "fillC -> tokens")
rep("  const strokeC = avg < 0.30 ? 'rgba(224,92,92,0.7)' : avg < 0.55 ? 'rgba(212,132,90,0.7)' : avg < 0.75 ? 'rgba(0,184,162,0.7)' : 'rgba(122,170,138,0.7)';",
    "  const strokeC = avg < 0.30 ? VIZ.risk+'b3' : avg < 0.55 ? VIZ.warning+'b3' : avg < 0.75 ? VIZ.accent+'b3' : VIZ.success+'b3';",
    "strokeC -> tokens")

# data-point dot border (BROKEN var(--navy))
rep("ctx.strokeStyle = 'var(--navy)'; ctx.lineWidth = 1.5; ctx.stroke();",
    "ctx.strokeStyle = VIZ.bg; ctx.lineWidth = 1.5; ctx.stroke();", "dot border -> token")

(OUT/"radar.html").write_text(t)
o = src.read_text()
print(f"\nbraces {t.count('{')}/{t.count('}')} ({'preserved' if (o.count('{'),o.count('}'))==(t.count('{'),t.count('}')) else 'CHANGED'})")
# confirm no broken var() remains in canvas ctx assignments
import re
bad = [l.strip() for l in t.splitlines() if 'ctx.' in l and 'var(--' in l]
print("remaining broken ctx var():", bad if bad else "none ✓")
