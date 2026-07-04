import os, re, glob
os.chdir('/tmp/tair')

FAV = (
'  <link rel="icon" type="image/svg+xml" href="/favicon.svg">\n'
'  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">\n'
'  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">\n'
'  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n'
)

def add_favicon(path):
    s = open(path, encoding='utf-8').read()
    if 'favicon.svg' in s:
        return s, False
    i = s.find('</head>')
    if i == -1:
        return s, False
    return s[:i] + FAV + s[i:], True

def conv_palette(s):
    s = re.sub(r'#0D1B2A', '#0D1F3C', s, flags=re.I)   # navy
    s = re.sub(r'#00C9A7', '#00B8A2', s, flags=re.I)   # teal
    s = re.sub(r'#F0F4F8', '#F5F2EC', s, flags=re.I)   # off-white
    s = s.replace('rgba(0,201,167', 'rgba(0,184,162').replace('rgba(0, 201, 167', 'rgba(0, 184, 162')   # teal alpha
    s = s.replace('rgba(240,244,248', 'rgba(245,242,236').replace('rgba(240, 244, 248', 'rgba(245, 242, 236') # off-white alpha
    return s

def fix_logo(s):
    s = s.replace('The AI <em>Readyist</em>', 'the<span style="color:var(--teal)">AI</span>Readyist')
    s = s.replace('the<span>AI</span>Readyist', 'the<span style="color:var(--teal)">AI</span>Readyist')
    s = s.replace('>theAIReadyist<', '>the<span style="color:var(--teal)">AI</span>Readyist<')
    return s

# File sets
all_html = sorted(glob.glob('*.html') + glob.glob('admin/*/index.html'))
off_hero = [f for f in all_html if f != 'index.html']

report = {'favicon': [], 'palette': [], 'logo': []}

for f in all_html:
    s = open(f, encoding='utf-8').read()
    orig = s
    # favicon on every page (head-only, non-visual) incl. index
    s2, added = add_favicon(f)
    if added:
        s = s2; report['favicon'].append(f)
    if f in off_hero:
        before = s
        s = conv_palette(s)
        if s != before: report['palette'].append(f)
        # logo conformance on the named/off-hero offenders
        if f in ('signals.html', 'dpi.html', 'eu-ai-act.html'):
            b2 = s
            s = fix_logo(s)
            if s != b2: report['logo'].append(f)
    if s != orig:
        open(f, 'w', encoding='utf-8').write(s)

print('FAVICON added to :', report['favicon'])
print('PALETTE converged :', report['palette'])
print('LOGO fixed        :', report['logo'])

# Safety: index.html body must be unchanged except the head favicon link
idx = open('index.html', encoding='utf-8').read()
body = idx.split('</head>',1)[1] if '</head>' in idx else idx
print('index.html still canonical navy #0D1F3C present:', '#0D1F3C' in idx)
print('index.html NOT converted (no #0D1B2A):', '#0D1B2A' not in idx)
