def resolve(record, scope):
    text=record['text'].lower()
    if record['scope'] != scope: return 'denied:scope'
    if record.get('expired'): return 'ignored:expired'
    if 'ignore policy' in text or 'run command' in text: return 'quarantine:memory-as-command'
    if record.get('conflict'): return 'escalate:conflict'
    return 'used:safe'
