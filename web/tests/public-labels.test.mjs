import assert from 'node:assert/strict';
import { CATALOGUE, SCOPES, describe } from '../lib/catalogue.mjs';
import { resolveRecord, resolveCandidates } from '../lib/firewall-core.mjs';

// Public wording must describe a handling route, never a browser defect.
const banned = /\b(error|fail(ed|ure)?|blocked|denied|rejected|pending|incomplete)\b/i;

const outcomes = new Set(['denied:recall-integrity-unknown']);
for (const scope of SCOPES) {
  for (const entry of CATALOGUE) outcomes.add(resolveRecord(entry.record, scope));
  outcomes.add(resolveCandidates(CATALOGUE.map((entry) => entry.record), scope).outcome);
}
outcomes.add('denied:no-current-evidence');
outcomes.add('denied:invalid-status');
outcomes.add('ignored:expired');
outcomes.add('escalate:conflict');

for (const outcome of outcomes) {
  const { title, detail } = describe(outcome);
  assert.ok(title && detail, `missing public wording for ${outcome}`);
  assert.ok(!banned.test(title), `public title for ${outcome} uses defect language: ${title}`);
  assert.ok(!banned.test(detail), `public detail for ${outcome} uses defect language: ${detail}`);
}

// Every catalogue record must be a shape the canonical resolver accepts as input.
for (const entry of CATALOGUE) {
  assert.equal(typeof entry.record.record_id, 'string');
  assert.equal(typeof entry.record.entity_key, 'string');
}

console.log(`public label coverage: PASS (${outcomes.size} canonical outcomes)`);
