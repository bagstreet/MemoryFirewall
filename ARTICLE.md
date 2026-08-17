# Memory Firewall: A Safer Recall Path for Tool-Using Agents

I evolved Continuum because I wanted memory to improve an agent’s work without
giving recalled prose the power to direct it. A memory system is useful when it
preserves durable context across sessions, but it becomes dangerous when an
agent interprets a retrieved note as a command. An old note can be expired, a
semantically similar result can belong to another scope, and hostile text can
be stored beside perfectly legitimate project knowledge.

Memory Firewall treats every retrieved candidate as untrusted data first. It
checks the record shape, provenance, lifecycle, scope, and content before a
candidate can affect a response. Instruction-shaped text is quarantined.
Secret-like values are denied rather than stored or repeated. Expired,
revoked, and superseded records cannot be used. If compatible candidates make
incompatible claims, the result is an escalation, not a confident synthesis.
When recall is unexpectedly empty, the agent retries once and then returns
`denied — recall integrity unknown` instead of guessing.

The before/after difference is practical. A permissive retrieval route can
take the top semantic match, preserve a stale decision, and expose the agent
to a command embedded in its own memory. The firewall route does not equate
similarity with authority. A top-K retrieval is only a candidate set, not a
complete inventory or a chronology; explicit IDs and supersession edges decide
whether a record remains eligible.

I implemented the policy as a small Python security lab with a candidate
classifier and resolver. The regression suite includes normal scoped use,
stale and superseded records, conflicts, nested injection patterns,
secret-like content, cross-scope successors, malformed records, and failed
recall. It also verifies ordering: injection is detected before use, lifecycle
is resolved before scope filtering, and an out-of-scope successor cannot
reactivate an older local predecessor.

The repository includes the prompt, red-team fixtures, Python tests, a
before/after validation matrix, and a rendered threat map. The local lab
proves repeatable policy behavior, not completed live storage. Any Mainnet
claim will be added only with terminal `blob_id` receipts and independent cold
recall for the relevant stages; accepted jobs, timeouts, and local hashes are
not treated as storage proof.
