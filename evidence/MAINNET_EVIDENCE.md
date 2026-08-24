# Mainnet evidence

The local demo is credential-free. The live evidence harness uses environment-only credentials, an isolated namespace per run, a deterministic idempotency key per write, and MemWal `rememberAndWait`.

A checkpoint is counted only after terminal completion with a non-empty `blob_id`; accepted jobs, timeouts, local hashes, or a bare recall do not count. The receipt manifest contains no credentials or raw request data.

## Confirmed sequence

As of 2026-08-18, all **10/10** planned stages for **Memory Firewall** have terminal Mainnet blob receipts. Required cold-hand-off stages were recalled through fresh MemWal clients: 02, 04, 06, 08, 10. Some stages were completed across separate isolated reruns after transient relayer/sidecar failures; only the final terminal receipts are included.

See [`mainnet-receipts.json`](mainnet-receipts.json) for stage receipt metadata and run namespaces.

## Checkpoint provenance

Each row in `evidence/checkpoints.json` records `prompt_version`: the SHA-256 of `PROMPT.md` as it stood in
commit `7d77544`, the commit that introduced this receipt manifest. That is the prompt text
in force when the receipts were captured, which is not necessarily the prompt at HEAD.

Reproduce it:

```
git show 7d77544:PROMPT.md | sha256sum
```

No row records a runtime version. The capture scripts never recorded one, so it cannot
be recovered from history, and the field was removed rather than filled with a guess.
`historical_outcome` states that a row has no separate historical receipt of its own;
the Mainnet evidence for every row is the receipt named in `current_evidence`.

