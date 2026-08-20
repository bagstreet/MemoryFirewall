import hashlib,json
report=json.load(open('evidence/provider-targeted-2026-08-21.json'))
assert report['prompt_sha256']==hashlib.sha256(open('PROMPT.md','rb').read()).hexdigest(), 'prompt hash mismatch'
gemini=[x for x in report['results'] if x['provider']=='Gemini']; assert len(gemini)==4 and all(x['status']=='ok' and x['pass'] for x in gemini)
zai=[x for x in report['results'] if x['provider']=='Z.ai']; assert all(x['status']=='indeterminate' and not x['pass'] for x in zai)
print('provider targeted evidence: PASS (Gemini 4/4; Z.ai indeterminate, no two-family claim)')
