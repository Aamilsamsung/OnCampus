"""PES-only discovery: this does NOT automatically publish or submit events."""
import os, json, sys
from urllib.parse import urlparse, urljoin
import httpx
from bs4 import BeautifulSoup
def approved(url):
    p=urlparse(url)
    return p.scheme=='https' and (p.hostname=='pes.edu' or (p.hostname or '').endswith('.pes.edu'))
def collect():
    urls=[u.strip() for u in os.getenv('PES_SOURCE_URLS','').split(',') if u.strip()]
    if not urls: raise RuntimeError('Set PES_SOURCE_URLS to approved PES pages')
    out=[]
    with httpx.Client(timeout=15,follow_redirects=False,headers={'User-Agent':'OnCampus student event discovery'}) as client:
        for url in urls:
            if not approved(url): raise ValueError('Official PES HTTPS domains only')
            try:
                r=client.get(url);r.raise_for_status()
                soup=BeautifulSoup(r.text,'html.parser')
                for a in soup.select('a[href]'):
                    link=urljoin(url,a['href']);title=a.get_text(' ',strip=True)
                    if approved(link) and any(w in (title+' '+link).lower() for w in ['event','hackathon','workshop','competition','seminar']):
                        out.append({'title':title[:200],'url':link,'source_page':url,'status':'needs_verification'})
            except httpx.HTTPError as e: print(str(e),file=sys.stderr)
    return list({item['url']:item for item in out}.values())
if __name__=='__main__': print(json.dumps(collect(),indent=2))
