from .resolve import resolve


def resolve_candidates(records, scope):
    """Fail-closed resolver for a semantic recall candidate set.

    A top-K recall is neither a complete inventory nor a state log. This
    function only decides whether the presented set contains a current,
    in-scope, independently usable record; it never converts absence into
    permission or proof that history does not exist.
    """
    if not isinstance(records, list) or not records:
        return 'denied:recall-integrity-unknown', [], []

    classified = [(record, resolve(record, scope)) for record in records]
    dispositions = [
        {'record_id': record.get('record_id') if isinstance(record, dict) else None, 'outcome': outcome}
        for record, outcome in classified
    ]
    # Do not re-admit raw records after the per-record gate has denied their
    # schema or status. Candidate resolution is downstream of admission.
    admitted = [
        record for record, outcome in classified
        if outcome == 'used:safe'
        or outcome.startswith('ignored:')
        or outcome == 'denied:scope'
        or outcome == 'escalate:conflict'
    ]
    if not admitted:
        return classified[0][1], [], dispositions

    superseded = {
        record.get('supersedes') for record in admitted
        if isinstance(record, dict) and record.get('supersedes')
    }
    current = [
        record for record in admitted
        if isinstance(record, dict)
        and record.get('record_id') not in superseded
        and record.get('status') not in ('superseded', 'revoked', 'quarantined', 'expired')
        and not record.get('expired')
    ]
    if not current:
        return 'denied:no-current-evidence', [], dispositions

    scoped = [record for record in current if record.get('scope') == scope]
    if not scoped:
        return 'denied:cross-scope-current-state', [], dispositions
    if any(record.get('conflict') or record.get('status') == 'conflict' for record in scoped):
        return 'escalate:conflict', [], dispositions
    values_by_entity = {}
    for record in scoped:
        values_by_entity.setdefault(record['entity_key'], set()).add(record['text'])
    if any(len(values) > 1 for values in values_by_entity.values()):
        return 'escalate:conflict', [], dispositions
    if any(record.get('confidence') != 'high' for record in scoped):
        return 'denied:ungrounded', [], dispositions
    # A poisoned candidate is quarantined by ID, but cannot suppress unrelated
    # valid memory. Callers receive a complete per-record disposition list.
    return 'used:safe', scoped, dispositions
