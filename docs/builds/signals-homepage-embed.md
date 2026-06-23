# Surfacing published signals on the homepage / pillar pages

The public homepage (`index.html`), insights page and pillar pages are not part of this
workspace — they live in the deployed repo and are edited via unified diffs (see
`dpi-mvp-deliverables/index.html.dpi-featured.diff`). To avoid blind edits, this file
provides a **drop-in module** you can paste into any of those pages. It:

- reads only `approval_status = 'published'` rows (anon key + RLS — identical to `/signals.html`);
- shows the top published signals by relevance score;
- uses the site's existing CSS variables (`--teal`, `--amber`, `--off-white`, etc.) with
  fallbacks, so it inherits the current design system — **no new visual system introduced**;
- uses `tair-sig-` prefixed classes to avoid clashing with existing styles;
- degrades silently (renders nothing) when there are no published signals.

Nothing here publishes anything — it only displays already-approved-and-published signals.

---

## A. Homepage strip — "Latest Executive Signals"

Paste this where you want the strip to appear (e.g. after the Readiness Instruments
section). Adjust `LIMIT` if you want more/fewer cards.

```html
<!-- Latest Executive Signals (reads published signals only) -->
<section class="tair-sig" aria-label="Latest executive signals">
  <div class="tair-sig-head">
    <div class="tair-sig-label">Executive Signals</div>
    <a class="tair-sig-all" href="/signals.html">View all &rarr;</a>
  </div>
  <div class="tair-sig-grid" id="tairSigGrid"></div>
</section>

<style>
  .tair-sig { max-width: 1080px; margin: 0 auto; padding: 40px 48px; }
  .tair-sig-head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:20px; }
  .tair-sig-label { font-family:'DM Mono',monospace; font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--teal,#00C9A7); }
  .tair-sig-all { font-family:'DM Mono',monospace; font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--slate-70,rgba(240,244,248,.65)); text-decoration:none; }
  .tair-sig-all:hover { color:var(--teal,#00C9A7); }
  .tair-sig-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:18px; }
  .tair-sig-card { background:var(--surface,#0F2233); border:1px solid var(--teal-border,rgba(0,201,167,.2)); border-top:2px solid var(--teal,#00C9A7); padding:22px; display:flex; flex-direction:column; }
  .tair-sig-pillar { font-family:'DM Mono',monospace; font-size:10.5px; letter-spacing:.08em; text-transform:uppercase; color:var(--teal,#00C9A7); margin-bottom:10px; }
  .tair-sig-title { font-family:'Playfair Display',serif; font-size:19px; font-weight:700; line-height:1.25; color:var(--off-white,#F0F4F8); margin-bottom:10px; }
  .tair-sig-why { font-size:13.5px; color:var(--slate-70,rgba(240,244,248,.65)); margin-bottom:14px; }
  .tair-sig-foot { margin-top:auto; font-family:'DM Mono',monospace; font-size:10.5px; color:var(--slate,rgba(240,244,248,.4)); display:flex; justify-content:space-between; }
  .tair-sig-foot a { color:var(--slate-70,rgba(240,244,248,.65)); text-decoration:none; }
  .tair-sig-foot a:hover { color:var(--teal,#00C9A7); }
</style>

<script>
(function () {
  var LIMIT = 3;          // homepage cards to show
  var PILLAR = '';        // '' = all pillars; set to a pillar name on a pillar page (see B)
  var SB = 'https://mydxofjvpuurwwaohqys.supabase.co';
  var KEY = 'sb_publishable_gAIR6BSI1ZwMNSzafJCAdQ_hAb6jtAR';
  var url = SB + '/rest/v1/executive_signals'
    + '?select=signal_title,why_it_matters,primary_pillar,source_name,source_url,published_at,executive_relevance_score'
    + '&approval_status=eq.published'
    + (PILLAR ? '&primary_pillar=eq.' + encodeURIComponent(PILLAR) : '')
    + '&order=executive_relevance_score.desc,published_at.desc&limit=' + LIMIT;
  var grid = document.getElementById('tairSigGrid');
  if (!grid) return;
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  fetch(url, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } })
    .then(function(r){ return r.ok ? r.json() : []; })
    .then(function(rows){
      if (!rows || !rows.length) { var s = grid.closest('.tair-sig'); if (s) s.style.display='none'; return; }
      grid.innerHTML = rows.map(function(d){
        var pub = d.published_at ? new Date(d.published_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : '';
        return '<article class="tair-sig-card">'
          + '<div class="tair-sig-pillar">' + esc(d.primary_pillar||'') + '</div>'
          + '<h3 class="tair-sig-title">' + esc(d.signal_title||'') + '</h3>'
          + (d.why_it_matters ? '<p class="tair-sig-why">' + esc(d.why_it_matters) + '</p>' : '')
          + '<div class="tair-sig-foot"><span>' + esc(d.source_name||'') + (pub?' · '+esc(pub):'') + '</span>'
          + (d.source_url ? '<a href="'+esc(d.source_url)+'" target="_blank" rel="noopener noreferrer">source ↗</a>' : '')
          + '</div></article>';
      }).join('');
    })
    .catch(function(){ var s = grid.closest('.tair-sig'); if (s) s.style.display='none'; });
})();
</script>
```

---

## B. Pillar-page variant

On a pillar page, show only that pillar's signals by setting `PILLAR` in the script above
to the exact pillar name, e.g.:

```js
var PILLAR = 'Agentic Governance';   // one of the six canonical names
```

Everything else is identical. The strip hides itself if that pillar has no published signals
yet.

---

## C. Applying it the way you applied the DPI

If you prefer the diff workflow used for the DPI feature:

1. Open the real `index.html` in the deployed repo.
2. Decide placement (the DPI diff inserted after `<div class="section-label">Readiness Instruments</div>` — an editorial "Signals" strip likely sits better near the insights/featured-content area).
3. Paste block **A** there, commit, and deploy as usual.

Because the module is self-contained (markup + scoped styles + fetch), there are no other
files to touch and no build step.

---

## Notes

- The strip reads the **same** published rows as `/signals.html`; until you approve & publish
  signals in `/admin/signals`, it renders nothing (and hides its own section).
- If you later move the anon key or Supabase URL, update them here and in `signals.html`.
- This is intentionally lightweight; if you want a richer homepage feature (e.g. a rotating
  hero signal or a per-pillar count badge), that can be built once the homepage source is in
  this workspace.
```
