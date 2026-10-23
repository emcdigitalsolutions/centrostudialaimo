# Sostituisce le descrizioni dei corsi con i testi originali scritti per il Centro Studi Alaimo (tools/testi/*.json).
# Dei testi di partenza restano solo i dati oggettivi: requisiti di ammissione e punteggi.
import json, glob, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, '..', 'site', 'src', 'data')


def load(kind):
    out = {}
    for f in glob.glob(os.path.join(ROOT, 'testi', f'{kind}*.json')):
        out.update(json.load(open(f, encoding='utf-8')))
    return out


def p(x):
    return {'t': 'p', 'x': x}


def ul(items):
    return {'t': 'ul', 'items': items}


FACT = re.compile(r'^(requisiti|titoli (di )?ammissione|punteggi?o?|valutazione)', re.I)
BAD = re.compile(r'orizzonte|academy|ecampus|columbus|link campus|british|sinped|centro sportivo educativo|@', re.I)


def facts(body):
    keep = []
    for s in body:
        if not FACT.match(s['h']):
            continue
        h = 'Punteggio' if re.match(r'^(punteggi|valutazione)', s['h'], re.I) else 'Requisiti di ammissione'
        c = []
        for b in s['c']:
            if b['t'] == 'p' and len(b['x']) < 320 and not BAD.search(b['x']):
                c.append(b)
            elif b['t'] == 'ul':
                items = [i for i in b['items'] if len(i) < 320 and not BAD.search(i)]
                if items:
                    c.append(ul(items))
        if c:
            keep.append({'h': h, 'c': c})
    return keep


def save(name, D):
    json.dump(D, open(os.path.join(DATA, name + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


missing = []

T = load('lauree')
D = json.load(open(os.path.join(DATA, 'lauree.json'), encoding='utf-8'))
for l in D:
    t = T.get(l['slug'])
    if not t:
        missing.append(('lauree', l['slug'])); l['body'] = []; continue
    l['body'] = [{'h': 'Il corso', 'c': [p(x) for x in t['i']]},
                 {'h': 'Cosa imparerai', 'c': [ul(t['o'])]},
                 {'h': 'Sbocchi professionali', 'c': [ul(t['s'])]}]
save('lauree', D)

for kind, label in [('master', 'Il master'), ('perfezionamento', 'Il corso')]:
    T = load(kind)
    D = json.load(open(os.path.join(DATA, kind + '.json'), encoding='utf-8'))
    for m in D:
        t = T.get(m['slug'])
        old = m['body']
        if not t:
            missing.append((kind, m['slug'])); m['body'] = facts(old); continue
        m['body'] = [{'h': label, 'c': [p(x) for x in t['i']]},
                     {'h': 'Obiettivi', 'c': [ul(t['o'])]},
                     {'h': 'A chi si rivolge', 'c': [p(t['d'])]}] + facts(old)
    save(kind, D)

for kind in ['certificazioni', 'regionali', 'abilitanti']:
    T = json.load(open(os.path.join(ROOT, 'testi', kind + '.json'), encoding='utf-8'))
    D = json.load(open(os.path.join(DATA, kind + '.json'), encoding='utf-8'))
    for c in D:
        t = T.get(c['slug'])
        if not t:
            missing.append((kind, c['slug'])); c['body'] = []; continue
        c['body'] = t['b']
    save(kind, D)

D = json.load(open(os.path.join(DATA, 'pacchetti.json'), encoding='utf-8'))
for c in D:
    c['body'] = []
save('pacchetti', D)

print('mancanti:', missing or 'nessuno')
