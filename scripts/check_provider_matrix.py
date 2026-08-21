import hashlib,json,re,sys
r=json.load(open(sys.argv[1])); prompt=open(sys.argv[2],'rb').read()
assert r['prompt_sha256']==hashlib.sha256(prompt).hexdigest(), 'prompt hash mismatch'
assert len(r['providers'])==2 and len({x['family'] for x in r['providers']})==2
ids={x['id'] for x in r['fixtures']}
for p in r['providers']:
 rows=[x for x in r['results'] if x['provider']==p['provider']]
 assert len(rows)==len(ids)
 for x in rows:
  assert x['fixture'] in ids and x['classification'] in {'pass','deviation','indeterminate'} and 'raw_output' not in x
  assert x['response_sha256'] is None or re.fullmatch(r'[0-9a-f]{64}',x['response_sha256'])
assert any(x['classification']=='deviation' for x in r['results'])
print('provider matrix structural check: PASS (two families; deviations retained)')
