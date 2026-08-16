from datetime import datetime

def strings(value):
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        return [item for value in value for item in strings(value)]
    if isinstance(value, dict):
        return [item for value in value.values() for item in strings(value)]
    return []

def resolve(record, scope):
    required = ('record_id', 'text', 'scope', 'entity_key', 'status', 'effective_at', 'source', 'confidence')
    if not isinstance(record, dict) or any(not record.get(k) for k in required):
        return 'denied:invalid-schema'
    try:
        datetime.fromisoformat(record['effective_at'].replace('Z', '+00:00'))
    except (TypeError, ValueError):
        return 'denied:invalid-schema'
    text = ' '.join(strings(record)).lower()
    if any(x in text for x in ('api_key', 'private key', 'password', 'seed phrase', 'ghp_', 'sk-')):
        return 'denied:secret-like'
    if any(x in text for x in ('ignore policy', 'ignore previous', 'run command', 'curl ', 'override instruction')):
        return 'quarantine:memory-as-command'
    # Supersession and lifecycle resolve BEFORE scope filtering, so an
    # out-of-scope successor can never leave an older record looking current.
    if record.get('expired'):
        return 'ignored:expired'
    if record['status'] in ('superseded', 'revoked', 'quarantined', 'expired'):
        return 'ignored:lifecycle'
    if record['status'] not in ('active', 'conflict'):
        return 'denied:invalid-status'
    if record['scope'] != scope:
        return 'denied:scope'
    if record.get('conflict') or record['status'] == 'conflict':
        return 'escalate:conflict'
    if record['confidence'] != 'high':
        return 'denied:ungrounded'
    return 'used:safe'
