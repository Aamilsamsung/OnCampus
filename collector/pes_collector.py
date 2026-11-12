"""Official PES event candidate collector. Review required; no fabricated data."""
import os,sys,json,re,hashlib
from urllib.parse import urljoin,urlparse
from datetime import datetime,timezone
import httpx
from bs4 import BeautifulSoup

DEFAULT_URLS=[
 'https://events.pes.edu/browse/?campus=pesu-rr-campus',
 'https://events.pes.edu/browse/?campus=pesu-ec-campus',
 'https://events.pes.edu/browse/?campus=pesu-hn-campus'
]
def official(url):
 p=urlparse(url)
 return p.scheme=='https' and p.hostname in ('events.pes.edu','clubs.pes.edu','support.pes.edu','news.pes.edu')
def fetch(client,url):
 if not official(url): raise ValueError('Only approved official PES domains')
 r=client.get(url,follow_redirects=False)
 r.raise_for_status()
 if r.status_code in (301,302,307,308): raise ValueError('Redirects are not followed')
 if 'text/html' not in r.headers.get('content-type',''): raise ValueError('HTML expected')
 return BeautifulSoup(r.text[:2_000_000],'html.parser')
def collect():
 urls=[u.strip() for u in os.getenv('PES_SOURCE_URLS',','.join(DEFAULT_URLS)).split(',') if u.strip()]
 if any(not official(u) for u in urls): raise ValueError('Non-official source rejected')
 output={}
 with httpx.Client(timeout=20,headers={'User-Agent':'OnCampus/0.2 student event candidate collector (manual review)'}) as client:
  for page in urls:
   try:
    soup=fetch(client,page)
    campus=('Electronic City' if 'pesu-ec' in page else 'Ring Road' if 'pesu-rr' in page else 'Hanumanth Nagar' if 'pesu-hn' in page else None)
    for a in soup.select('a[href]'):
     link=urljoin(page,a.get('href',''))
     if not official(link): continue
     if urlparse(link).hostname!='events.pes.edu':continue
     if not re.search(r'/events?/|/event-detail/|/event/',urlparse(link).path,re.I):continue
     parent=a.find_parent(['article','li']) or a.parent
     title=(a.get_text(' ',strip=True) or (parent.get_text(' ',strip=True) if parent else ''))[:200].strip()
     if len(title)<8:continue
     output[link]={'title_candidate':title,'url':link,'campus_hint':campus,'source_page':page,'status':'pending_manual_verification'}
   except (httpx.HTTPError,ValueError) as e:print(f'Could not collect {page}: {e}',file=sys.stderr)
 return list(output.values())
if __name__=='__main__':
 items=collect()
 print(json.dumps({'checked_at':datetime.now(timezone.utc).isoformat(),'candidates':items,'count':len(items)},indent=2))
