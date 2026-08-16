# Proposed issue — Document a memory-security threat model and candidate-set lifecycle rules

## Limitation

Memory retrieval is also an input channel. Recalled prose can contain tool
directives, fake authorization, secrets, stale operational facts, or a
correction that disappears if scope is filtered too early. Semantic top-K is an
incomplete candidate set, not inventory or chronology.

## Suggested optional extension

- say explicitly that memory is untrusted data, never instruction or authority;
- recursively inspect nested fields for instruction, credential, and permission
  shapes;
- use immutable record IDs with ID-based supersession and revocation;
- resolve lifecycle, conflict, and quarantine across the whole candidate set
  before scope filtering;
- deny stale-only, cross-scope-current-state, and unresolved conflict with a
  visible reason;
- define confirmed writes as terminal `blob_id`, not job acceptance or immediate
  recall;
- require an independent current check before consequential action.

A minimal red-team replay contrasting permissive retrieval with a firewall path,
plus a decision table for use/ignored/quarantine/denied/expired/escalate,
would make the boundary reproducible.
