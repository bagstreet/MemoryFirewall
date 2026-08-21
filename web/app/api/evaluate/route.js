import { NextResponse } from 'next/server';
import { resolveCandidates, resolveRecord } from '../../../lib/firewall-core.mjs';
import { CATALOGUE, SCOPES, describe } from '../../../lib/catalogue.mjs';

export const dynamic = 'force-dynamic';

function noteRecord(note, scope) {
  return {
    record_id: 'operator-note@live', entity_key: 'operator_note', scope,
    text: note, status: 'active', effective_at: '2026-08-21T00:00:00Z',
    source: 'user-statement', confidence: 'high',
  };
}

function evaluate({ selected, scope, note }) {
  const chosen = CATALOGUE.filter((entry) => selected.includes(entry.id));
  const records = chosen.map((entry) => entry.record);
  const trimmed = typeof note === 'string' ? note.trim() : '';
  if (trimmed) records.push(noteRecord(trimmed.slice(0, 400), scope));

  const result = resolveCandidates(records, scope);
  const byId = new Map(result.dispositions.map((item) => [item.record_id, item.outcome]));

  const cards = chosen.map((entry) => ({
    id: entry.id,
    label: entry.label,
    record_id: entry.record.record_id,
    outcome: byId.get(entry.record.record_id) ?? resolveRecord(entry.record, scope),
    ...describe(byId.get(entry.record.record_id) ?? resolveRecord(entry.record, scope)),
  }));

  const noteOutcome = trimmed ? (byId.get('operator-note@live') ?? resolveRecord(noteRecord(trimmed, scope), scope)) : null;

  return {
    scope,
    note_used: Boolean(trimmed),
    note_outcome: noteOutcome,
    note_public: noteOutcome ? describe(noteOutcome) : null,
    canonical_outcome: result.outcome,
    public: describe(result.outcome),
    usable_ids: result.usable.map((record) => record.record_id),
    dispositions: result.dispositions,
    cards,
    candidate_count: records.length,
    cli: `PYTHONPATH=. python3 -c "from firewall.candidates import resolve_candidates; print(resolve_candidates(${JSON.stringify(records)}, ${JSON.stringify(scope)})[0])"`,
    source: 'web/lib/firewall-core.mjs — parity-tested against firewall/resolve.py + firewall/candidates.py',
  };
}

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const selected = Array.isArray(body.selected) ? body.selected.filter((id) => CATALOGUE.some((entry) => entry.id === id)) : [];
  const scope = SCOPES.includes(body.scope) ? body.scope : SCOPES[0];
  return NextResponse.json(evaluate({ selected, scope, note: body.note }));
}

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const selected = (params.get('selected') || 'deploy-current').split(',').filter(Boolean);
  const scope = SCOPES.includes(params.get('scope')) ? params.get('scope') : SCOPES[0];
  return NextResponse.json(evaluate({
    selected: selected.filter((id) => CATALOGUE.some((entry) => entry.id === id)),
    scope,
    note: params.get('note') || '',
  }));
}
