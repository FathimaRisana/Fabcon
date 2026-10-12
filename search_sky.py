import urllib.request
import json
import urllib.parse
import sys

sys.stdout.reconfigure(encoding='utf-8')

queries = [
    'photovoltaic panels sky sun',
    'solar panels reflection modern',
    'solar photovoltaic farm sunset OR sunrise',
    'photovoltaic power station rows sky'
]

results = []
for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'FabconSearch/1.0 (info@fabcon.com)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                title = p.get('title', '')
                ii = p.get('imageinfo', [{}])[0]
                mime = ii.get('mime', '')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if ('image/jpeg' in mime or 'image/png' in mime) and w > h and w >= 2500:
                    results.append((title, ii.get('url'), w, h))
    except Exception as e:
        print(f"Error {q}: {e}")

seen = set()
for r in results:
    if r[1] not in seen:
        seen.add(r[1])
        print(f"{r[0]} ({r[2]}x{r[3]}) -> {r[1]}")
