# Memory Firewall — replay receipt

## What is replayed

Fixed incident replay graph: a clean candidate and poisoned content are resolved independently through containment and lifecycle rules.

## Reproduce

1. Run `make test`.
2. Run `make synthetic-stand`.
3. Inspect [`evidence/synthetic-incident-archive.json`](../evidence/synthetic-incident-archive.json) for the pinned provenance and outcome fields.

## Ground truth and policy result

`make synthetic-stand` clones the committed graph in isolation and validates the declared containment result.

## Boundary

This is a purpose-built fixed replay graph; it is not presented as owner-history or a provider run.
