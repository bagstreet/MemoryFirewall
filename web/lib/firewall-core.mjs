const strings = (value) => typeof value === 'string'
  ? [value]
  : Array.isArray(value)
    ? value.flatMap(strings)
    : value && typeof value === 'object'
      ? Object.values(value).flatMap(strings)
      : [];

export function resolveRecord(record, scope) {
  const required = ['record_id', 'text', 'scope', 'entity_key', 'status', 'effective_at', 'source', 'confidence'];
  if (!record || !required.every((key) => record[key])) return 'denied:invalid-schema';
  if (Number.isNaN(Date.parse(record.effective_at))) return 'denied:invalid-schema';
  const text = strings(record).join(' ').toLowerCase();
  if (['api_key', 'private key', 'password', 'seed phrase', 'ghp_', 'sk-'].some((item) => text.includes(item))) return 'denied:secret-like';
  if (['ignore policy', 'ignore previous', 'run command', 'curl ', 'override instruction'].some((item) => text.includes(item))) return 'quarantine:memory-as-command';
  if (record.expired) return 'ignored:expired';
  if (['superseded', 'revoked', 'quarantined', 'expired'].includes(record.status)) return 'ignored:lifecycle';
  if (!['active', 'conflict'].includes(record.status)) return 'denied:invalid-status';
  if (record.scope !== scope) return 'denied:scope';
  if (record.conflict || record.status === 'conflict') return 'escalate:conflict';
  if (record.confidence !== 'high') return 'denied:ungrounded';
  return 'used:safe';
}

export function resolveCandidates(records, scope) {
  if (!Array.isArray(records) || records.length === 0) return { outcome: 'denied:recall-integrity-unknown', usable: [], dispositions: [] };
  const classified = records.map((record) => ({ record, outcome: resolveRecord(record, scope) }));
  const dispositions = classified.map(({ record, outcome }) => ({ record_id: record?.record_id ?? null, outcome }));
  const admitted = classified
    .filter(({ outcome }) => outcome === 'used:safe' || outcome.startsWith('ignored:') || outcome === 'denied:scope' || outcome === 'escalate:conflict')
    .map(({ record }) => record);
  if (admitted.length === 0) return { outcome: classified[0].outcome, usable: [], dispositions };
  const superseded = new Set(admitted.map((record) => record.supersedes).filter(Boolean));
  const current = admitted.filter((record) => !superseded.has(record.record_id) && !['superseded', 'revoked', 'quarantined', 'expired'].includes(record.status) && !record.expired);
  if (current.length === 0) return { outcome: 'denied:no-current-evidence', usable: [], dispositions };
  const scoped = current.filter((record) => record.scope === scope);
  if (scoped.length === 0) return { outcome: 'denied:cross-scope-current-state', usable: [], dispositions };
  if (scoped.some((record) => record.conflict || record.status === 'conflict')) return { outcome: 'escalate:conflict', usable: [], dispositions };
  const values = new Map();
  for (const record of scoped) values.set(record.entity_key, (values.get(record.entity_key) ?? new Set()).add(record.text));
  if ([...values.values()].some((set) => set.size > 1)) return { outcome: 'escalate:conflict', usable: [], dispositions };
  if (scoped.some((record) => record.confidence !== 'high')) return { outcome: 'denied:ungrounded', usable: [], dispositions };
  return { outcome: 'used:safe', usable: scoped, dispositions };
}
