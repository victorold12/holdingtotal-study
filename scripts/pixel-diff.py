"""Exact RGB diff per captured region. No tolerance or hidden exclusion mask."""
from PIL import Image, ImageChops
from pathlib import Path
import json
p = Path(__file__).resolve().parents[1]/'reference/verification'
names=['hero','comparison','testimonials-header','audience','offer-benefits','guarantee','mentor','faq','final','footer']
results=[]
for w in [1440,768,390]:
 for i,name in enumerate(names):
  a=Image.open(p/f'original-{w}-region-{i}.png').convert('RGB')
  b=Image.open(p/f'local-{w}-region-{i}.png').convert('RGB')
  if a.size!=b.size:
   results.append(dict(width=w,region=name,reference_size=a.size,local_size=b.size,status='SIZE_MISMATCH'));continue
  delta=ImageChops.difference(a,b)
  n=sum(1 for pixel in delta.get_flattened_data() if pixel!=(0,0,0))
  results.append(dict(width=w,region=name,pixels=a.width*a.height,changed=n,percent=round(n/(a.width*a.height)*100,6),status='EXACT' if n==0 else 'DIFFERENT'))
  diff_path=p/f'diff-{w}-{name}.png'
  if n: delta.save(diff_path)
  elif diff_path.exists(): diff_path.unlink()
(p/'pixel-diff.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'exact':sum(r['status']=='EXACT' for r in results),'regions':len(results),'differences':[r for r in results if r['status']!='EXACT']},indent=2))
