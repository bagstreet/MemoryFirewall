import json
from pathlib import Path
m=json.loads(Path('evidence/mainnet-receipts.json').read_text());rows=m.get('receipts',m);cold=[r for r in rows if (r.get('cold_recall') or {}).get('status')=='found' or r.get('cold_recall_result')=='found']
if len(rows)!=10 or any(not r.get('blob_id') for r in rows) or len(cold)!=5: raise SystemExit('receipt manifest invariant failed')
c=json.loads(Path('evidence/checkpoints.json').read_text())
if c.get('evidence_status')!='mainnet_confirmed_10_of_10' or any(r.get('historical_outcome')!='no_separate_historical_receipt' or r.get('current_evidence')!='confirmed_mainnet_receipt' for r in c['checkpoints']): raise SystemExit('checkpoint metadata invariant failed')
for name in ['README.md','ARTICLE.md','DEMO.md']:
 p=Path(name)
 if p.exists() and 'pending Mainnet' in p.read_text(): raise SystemExit(f'stale Mainnet claim in {name}')
print(f'evidence consistency: PASS ({len(rows)} receipts; {len(cold)} cold recalls)')
