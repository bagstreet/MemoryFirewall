from .resolve import resolve


def resolve_candidates(records, scope):
    """Fail-closed resolver for a semantic recall candidate set.

    A top-K recall is neither a complete inventory nor a state log. This
    function only decides whether the presented set contains a current,
    in-scope, independently usable record; it never converts absence into
    permission or proof that history does not exist.
    """
    if not isinstance(records, list) or not records:
        return 'denied:recall-integrity-unknown', []

    classified = [(record, resolve(record, scope)) for record in records]
    hostile = next((outcome for _, outcome in classified
                    if outcome.startswith('quarantine:') or outcome == 'denied:secret-like'), None)
    if hostile:
        return hostile, []

    superseded = {
        record.get('supersedes') for record in records
        if isinstance(record, dict) and record.get('supersedes')
    }
    current = [
        record for record in records
        if isinstance(record, dict)
        and record.get('record_id') not in superseded
        and record.get('status') not in ('superseded', 'revoked', 'quarantined', 'expired')
        and not record.get('expired')
    ]
    if not current:
        return 'denied:no-current-evidence', []

    scoped = [record for record in current if record.get('scope') == scope]
    if not scoped:
        return 'denied:cross-scope-current-state', []
    if any(record.get('conflict') or record.get('status') == 'conflict' for record in scoped):
        return 'escalate:conflict', []
    if any(record.get('confidence') != 'high' for record in scoped):
        return 'denied:ungrounded', []
    return 'used:safe', scoped
