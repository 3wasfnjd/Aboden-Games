"""Check rendered pages, local links, accessibility landmarks and immutable policy bytes."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib,json
root=Path('dist');errors=[]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set();self.h1=0;self.mains=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.add(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='main':self.mains+=1
  if tag=='img' and 'alt' not in a:errors.append('Missing image alt')
  if tag in ('a','link','img','script','use'):
   href=a.get('href') or a.get('src')
   if href:self.links.append(href)
  if a.get('target')=='_blank' and 'noopener' not in a.get('rel',''):errors.append('Unsafe external target')
parsed={}
for p in root.rglob('*.html'):
 parser=Page();parser.feed(p.read_text());parsed[p]=parser
 if 'privacy' not in str(p):
  if parser.h1!=1:errors.append(f'{p}: expected one h1, got {parser.h1}')
  if parser.mains!=1:errors.append(f'{p}: expected main landmark')
  if 'github.com/' in p.read_text():errors.append(f'{p}: public repository link')
for p,parser in parsed.items():
 for href in parser.links:
  u=urlsplit(href)
  if u.scheme or u.netloc:continue
  if not u.path:target=p
  else:
   target=root/unquote(u.path.lstrip('/')) if u.path.startswith('/') else p.parent/unquote(u.path)
   if target.is_dir():target=target/'index.html'
  if not target.is_file():errors.append(f'{p}: missing {href}');continue
  if u.fragment and target in parsed and unquote(u.fragment) not in parsed[target].ids:errors.append(f'{p}: missing anchor {href}')
original=json.loads(Path('migration/destination-original-sha256.json').read_text())
for filename in ['dahrooj-privacy.html','privacy-policies/dahrooj-meta-quest.html']:
 assert hashlib.sha256((root/filename).read_bytes()).hexdigest()==original['dahrooj-privacy.html']
assert not (root/'privacy-drafts').exists()
if errors:raise SystemExit('\n'.join(errors))
print(f'PASS: {len(parsed)} HTML pages; internal links, anchors, landmarks, image alt, external link safety and exact privacy bytes.')
