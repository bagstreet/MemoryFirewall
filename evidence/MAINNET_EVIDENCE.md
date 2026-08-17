# Mainnet evidence

The local demo is credential-free. The live evidence harness uses environment-only credentials, an isolated namespace per run, a deterministic idempotency key per write, and MemWal `rememberAndWait`.

A checkpoint is counted only after terminal completion with a non-empty `blob_id`; accepted jobs, timeouts, local hashes, or a bare recall do not count. The receipt manifest contains no credentials or raw request data.

## Confirmed sequence

As of 2026-08-18, all **10/10** planned stages for **Memory Firewall** have terminal Mainnet blob receipts. Required cold-hand-off stages were recalled through fresh MemWal clients: 02, 04, 06, 08, 10. Some stages were completed across separate isolated reruns after transient relayer/sidecar failures; only the final terminal receipts are included.

See [`mainnet-receipts.json`](mainnet-receipts.json) for stage receipt metadata and run namespaces.
