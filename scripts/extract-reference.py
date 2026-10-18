"""Reproducible HTML -> JSX/data/CSS. Target HTML is parsed, never executed.
Requires beautifulsoup4. Preserve source whitespace, SVG paths and CSS cascade.
"""
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Comment
import json, re, hashlib

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'reference'
OUT = ROOT / 'src/generated'
OUT.mkdir(parents=True, exist_ok=True)
source = (REF / 'server.html').read_text(encoding='utf-8')
raw_soup = BeautifulSoup(source, 'html.parser')
css = '\n'.join(s.get_text() for s in raw_soup.find_all('style'))
# The browser DOM is authoritative. In particular the server closes an h3
# with </h2>; html.parser nests the following CTA, but Chromium does not.
live = (REF/'index.html').read_text(encoding='utf-8')
soup = BeautifulSoup(live, 'html.parser')
for card in soup.select('.comp-card, .for-you-card'):
    # Remove capture-time observer state, then reconstruct it in ScrollReveals.
    card.attrs.pop('style', None)
(REF / 'original.css').write_text(css, encoding='utf-8')
# Keep original pixels/rem: the source has no Webflow fluid-font model.
css = re.sub(r"url\(['\"]?([^)'\"]+)['\"]?\)", lambda m: 'url("/source-assets/' + m[1].strip() + '")' if not m[1].startswith(('http', 'data:')) else m[0], css)
app = ROOT / 'src/app'
app.mkdir(parents=True, exist_ok=True)
(app/'globals.css').write_text('/* Generated from reference/server.html: preserve cascade order. */\n' + css + '\n@tailwind utilities;\n', encoding='utf-8')
tokens = dict(re.findall(r'(--[\w-]+)\s*:\s*([^;]+);', css.split(':root {',1)[1].split('}',1)[0]))
(OUT/'tokens.json').write_text(json.dumps(tokens, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
faq = [{'question': q.select_one('button').get_text(' ', strip=True), 'answer': q.select_one('.faq-item__a p').get_text(' ', strip=True)} for q in soup.select('.faq-item')]
videos = [dict(id=v['data-id'], ratio=v['data-ratio'], color=v['data-skin-color']) for v in soup.select('.voomly-embed')]
(OUT/'content.ts').write_text('// Generated from reference/index.html (live DOM); do not retype content.\nexport const faqItems = '+json.dumps(faq, ensure_ascii=False, indent=2)+' as const;\nexport const videos = '+json.dumps(videos, ensure_ascii=False, indent=2)+' as const;\n', encoding='utf-8')
attrs = {'class':'className','for':'htmlFor','viewbox':'viewBox','stroke-width':'strokeWidth','stroke-linecap':'strokeLinecap','stroke-linejoin':'strokeLinejoin','fill-rule':'fillRule','clip-rule':'clipRule','tabindex':'tabIndex','allowfullscreen':'allowFullScreen','frameborder':'frameBorder','referrerpolicy':'referrerPolicy'}
voids = {'img','br','hr','input','source','meta','link','wbr','area','embed','col','param','track'}
imports = set()
def camel(s): return re.sub(r'-([a-z])', lambda m: m[1].upper(), s)
def jsx(node):
    if isinstance(node, Comment): return ''
    if isinstance(node, NavigableString): return '{'+json.dumps(str(node), ensure_ascii=False)+'}'
    if node.name in ('script', 'noscript', 'style'): return ''
    cl = node.get('class', [])
    if 'checkout-embed-wrap' in cl:
        imports.add('CheckoutEmbed'); return '<CheckoutEmbed />'
    if 'video-carousel-outer' in cl:
        imports.add('VideoCarousel'); return '<VideoCarousel />'
    if 'video-carousel-dots' in cl: return ''
    if 'faq-list' in cl:
        imports.add('FaqAccordion'); return '<FaqAccordion />'
    tag = {'textpath':'textPath'}.get(node.name, node.name)
    cta = node.has_attr('data-checkout') or (tag == 'button' and 'btn' in cl)
    if cta: tag = 'CheckoutLink'; imports.add(tag)
    attributes = []
    if cta and node.name == 'button': attributes.append('as="button"')
    for k,v in node.attrs.items():
        if k.startswith('on') or (cta and k in ('href','data-checkout')): continue
        k = attrs.get(k, {'startoffset':'startOffset','font-family':'fontFamily','font-size':'fontSize','font-weight':'fontWeight','letter-spacing':'letterSpacing','text-anchor':'textAnchor'}.get(k,k))
        if isinstance(v,list): v=' '.join(v)
        if k == 'style':
            pairs = [p.split(':',1) for p in v.split(';') if ':' in p]
            st = {camel(a.strip()):b.strip() for a,b in pairs}
            attributes.append('style={'+json.dumps(st,ensure_ascii=False)+'}'); continue
        if k == 'src' and not v.startswith(('http','data:')): v='/source-assets/'+v
        attributes.append(k+'='+json.dumps(v,ensure_ascii=False))
    opening='<'+tag+(' '+' '.join(attributes) if attributes else '')
    if node.name in voids: return opening+' />'
    return opening+'>'+''.join(jsx(n) for n in node.children)+'</'+tag+'>'

sections = [('Hero','.nossa-hero'),('Comparison','.comparison-section'),('AlertBanner','.cta-banner-wrap'),('Testimonials','.video-section'),('Audience','.for-you-section'),('Offer','.offer-section'),('Guarantee','.guarantee-section'),('Mentor','.mentor-section'),('Faq','.faq-section'),('FinalParallax','.final-parallax'),('Footer','.footer')]
for name, selector in sections:
    imports.clear()
    body = jsx(soup.select_one(selector))
    header = '// Generated from '+selector+' in reference/index.html (live DOM).\n'
    for symbol in sorted(imports): header += f'import {{ {symbol} }} from "@/components/{symbol}";\n'
    (OUT/(name+'.tsx')).write_text(header+f'export function {name}() {{ return ({body}); }}\n',encoding='utf-8')
# Inventory is evidence only. No tracking libraries are copied into the app.
capture = json.loads((REF/'capture-original.json').read_text('utf-8'))
urls = sorted({e['url']['url'] for e in capture['normalized_result']['events']['items'] if isinstance(e.get('url'),dict)})
(REF/'network-urls.json').write_text(json.dumps(urls,ensure_ascii=False,indent=2),encoding='utf-8')
manifest = {'source':'https://holdingtotal.com.br/imersao/','html_sha256':hashlib.sha256(source.encode()).hexdigest(),'live_dom_sha256':hashlib.sha256(live.encode()).hexdigest(),'css_sha256':hashlib.sha256((REF/'original.css').read_bytes()).hexdigest(),'sections':[s[0] for s in sections],'tokens':len(tokens),'faq':len(faq),'videos':len(videos)}
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(manifest,ensure_ascii=True))
