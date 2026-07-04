import os
os.chdir('/tmp/tair')

# ============ admin/signals/index.html ============
f = 'admin/signals/index.html'
s = open(f, encoding='utf-8').read()
orig = s

# A. New button after the Publish button
pub = "      +     '<button type=\"button\" class=\"btn btn-publish\" onclick=\"window._act(this,\\'publish\\')\">▲ Publish</button>'\n"
cand = "      +     '<button type=\"button\" class=\"btn btn-candidate\" onclick=\"window._act(this,\\'publish_candidate\\')\">▲+ Publish + Research Candidate</button>'\n"
assert s.count(pub) == 1, "A: publish button line not found uniquely"
s = s.replace(pub, pub + cand, 1)

# B. CSS for the new button
oldcss = "    .btn-publish:hover { filter: brightness(1.1); }\n"
newcss = oldcss + "    .btn-candidate { color: var(--amber); border-color: var(--border-warn); }\n    .btn-candidate:hover { background: rgba(232,168,56,0.12); }\n"
assert s.count(oldcss) == 1, "B: btn-publish hover css not found"
s = s.replace(oldcss, newcss, 1)

# C. makeCandidate flag + payload capture
oldC = "    var card = btn.closest('.sig-card');\n    var id = card.getAttribute('data-id');\n"
addC = ("    var makeCandidate = (action === 'publish_candidate');\n"
        "    if (makeCandidate) action = 'publish';\n"
        "    var candPayload = null;\n"
        "    if (makeCandidate) {\n"
        "      var e0 = collectEdits(card);\n"
        "      var srcA = card.querySelector('.sig-orig a');\n"
        "      candPayload = { signal_id: id, signal_url: srcA ? srcA.href : '', signal_title: e0.signal_title || '', pillar: e0.primary_pillar || null, candidate_topic: e0.signal_title || 'Untitled signal' };\n"
        "    }\n")
assert s.count(oldC) == 1, "C: _act header not found"
s = s.replace(oldC, oldC + addC, 1)

# D. confirm message
oldD = "    if (action === 'publish' && !confirm('Publish this signal to the public site (/signals.html)?')) return;\n"
newD = "    if (action === 'publish' && !confirm(makeCandidate ? 'Publish this signal AND add it to the research backlog?' : 'Publish this signal to the public site (/signals.html)?')) return;\n"
assert s.count(oldD) == 1, "D: publish confirm not found"
s = s.replace(oldD, newD, 1)

# E. create candidate after publish success
oldE = "          setStatus(id + ' → ' + newStatus + '.', 'success');\n        }\n"
addE = ("          setStatus(id + ' → ' + newStatus + '.', 'success');\n"
        "          if (makeCandidate && candPayload) {\n"
        "            try {\n"
        "              var cr = await fetch('/api/research-candidates', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': key }, body: JSON.stringify(candPayload) });\n"
        "              var cd = await cr.json().catch(function(){ return {}; });\n"
        "              setStatus(cr.ok ? (id + ' published + added as ' + ((cd.candidate && cd.candidate.id) || 'candidate') + '.') : (id + ' published, but candidate add failed.'), cr.ok ? 'success' : 'error');\n"
        "            } catch (e) { setStatus(id + ' published; candidate add errored.', 'error'); }\n"
        "          }\n"
        "        }\n")
assert s.count(oldE) == 1, "E: publish success setStatus not found"
s = s.replace(oldE, addE, 1)

assert s != orig
open(f, 'w', encoding='utf-8').write(s)
print("signals/index.html edited OK")

# ============ admin/research-agent/index.html (D4 prefill) ============
g = 'admin/research-agent/index.html'
t = open(g, encoding='utf-8').read()
inj = """
<script>
/* WP15: pre-fill from a Research Candidate when arriving via /admin/research-candidates */
(function(){
  try{
    var p = new URLSearchParams(location.search);
    var topic = p.get('topic'); if(!topic) return;
    function apply(){
      var el = document.getElementById('topic');
      if(el){ el.value = topic; }
      var cand = (p.get('candidate')||'').replace(/[<>]/g,'');
      var sig  = (p.get('signal')||'').replace(/[<>]/g,'');
      var rat  = (p.get('rationale')||'').replace(/[<>]/g,'');
      var note = document.createElement('div');
      note.style.cssText = 'margin:12px 0;padding:10px 14px;border:1px solid rgba(0,201,167,.4);background:rgba(0,201,167,.08);color:#F0F4F8;font:13px/1.5 -apple-system,sans-serif;';
      note.innerHTML = 'Pre-filled from research candidate <b>'+cand+'</b>. You still launch manually.'+(sig?'<br>Source signal: “'+sig+'”':'')+(rat?'<br>Rationale: '+rat:'');
      if(el && el.parentNode){ el.parentNode.insertBefore(note, el); }
    }
    if(document.readyState!=='loading'){ setTimeout(apply,400); } else { window.addEventListener('load', function(){ setTimeout(apply,400); }); }
  }catch(e){}
})();
</script>
"""
idx = t.rfind('</body>')
assert idx != -1, "research-agent: no </body>"
t = t[:idx] + inj + t[idx:]
open(g, 'w', encoding='utf-8').write(t)
print("research-agent/index.html prefill injected OK")
