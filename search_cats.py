import urllib.request
import json
import urllib.parse
import sys

sys.stdout.reconfigure(encoding='utf-8')

categories = [
    'Category:Solar parks in Germany',
    'Category:Photovoltaic power stations in Spain',
    'Category:Solar farms in the United States',
    'Category:Rooftop photovoltaic systems',
    'Category:Photovoltaic systems'
]

results = []
for cat in categories:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle={urllib.parse.quote(cat)}&gcmtype=file&gcmlimit=25&prop=imageinfo&iiprop=url|size|mime&format=json"
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
                if ('image/jpeg' in mime or 'image/png' in mime) and w >= 2500 and w > h:
                    results.append((title, ii.get('url'), w, h))
    except Exception as e:
        print(f"Error {cat}: {e}")

print(f"Total matching landscape images: {len(results)}")
for r in results[:20]:
    print(r[0], f"({r[2]}x{r[3]}) ->", r[1])
