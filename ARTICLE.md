# Memory Firewall: A Safer Recall Path for Tool-Using Agents

> **Publication status: owner-review draft.** First-person voice and factual
> claims require adoption and approval by bagstreet before publication.

I evolved the D&D Campaign Vault prompt because a campaign memory can preserve useful lore without giving recalled prose the power to direct an agent. A memory store can contain good project knowledge beside stale decisions, text copied from untrusted sources, cross-project notes, and instruction-shaped content. A system that retrieves the highest-scoring passage and treats it as authority has quietly made its memory route an attack route.

**Memory Firewall** treats every recalled candidate as untrusted data first. It validates record shape and provenance, scans nested values for instructions and secret-like material, resolves lifecycle and supersession, then evaluates scope. Only an eligible candidate may inform a response. Tool calls, permissions, credentials, and authorization are never derived from recalled prose. If candidates conflict, the resolver escalates rather than blending them into a confident answer.

The policy also rejects a common but dangerous assumption: semantic top-K recall is not an inventory, chronology, permission system, or proof of absence. A missing result can be a retrieval limitation; an old result can rank above its successor. The firewall retries suspicious empty recall once, then returns `denied — recall integrity unknown` rather than guessing that no relevant history exists.

I implemented the evolution as a small Python security lab. The tests cover normal scoped use, invalid schema, weak provenance, secret-like content, nested injection patterns, stale and superseded records, conflicts, empty recall, and cross-scope successors. The ordering is tested directly: lifecycle is resolved across the candidate set before scope filtering, so a current out-of-scope successor cannot make an older local predecessor look current again. This is where a permissive “validate one retrieved record” approach breaks down.

The before/after change is practical. Before, an agent could select a plausible remembered note and accidentally preserve a revoked decision or interpret a recalled directive as a new command. After, the agent can explain the boundary: candidate accepted, denied, quarantined, ignored, or escalated—and the reason is part of the result. That makes the policy reviewable and gives an operator a reason to investigate instead of an invented summary.

The repository includes the evolved prompt, red-team lab, executable regression tests, threat map, before/after matrix, ten-stage evidence plan, and a video runbook. The local test suite proves repeatable policy behavior; it does not claim completed live storage or provider execution.

Live Walrus evidence will be added only when each meaningful stage has a terminal `blob_id`, retains the real fixture or commit revision, and is confirmed by a fresh-session recall. An accepted job, a timeout, or a local digest is not storage proof. The outcome is a memory-enabled agent that can use context deliberately without allowing memory itself to become an unreviewed command channel.
