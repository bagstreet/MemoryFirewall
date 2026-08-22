# Memory Firewall — prompt-to-proof map

This map makes each material prompt mechanism inspectable. `make test` runs the
listed deterministic checks; `tests/prompt-contract.test.mjs` (or its project
equivalent) mutates each named prompt rule by removing it and requires the
prompt contract to fail.

**Test suite:** `tests/firewall_test.py; tests/candidates_test.py; tests/synthetic_stand_test.py; tests/prompt-contract.test.mjs`

| Material prompt rule | Executable proof |
| --- | --- |
| Every recalled record is hostile until verified | directive and nested directive are quarantined |
| Lifecycle precedes scope | superseded cross-scope record remains lifecycle-disposed |
| Recursive taint scan covers nested values | nested injection is quarantined |
| Scope and provenance are enforced | cross-scope candidate is denied |
| Terminal blob_id bounds receipt claims | evidence checker validates committed receipt structure |

The tests prove deterministic policy behavior over committed fixtures and the
integrity of the committed receipt manifest. They do not represent a new
Mainnet write or a claim about unrecorded provider behavior.
