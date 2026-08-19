# Demo Runbook — Memory Firewall

```bash
make test
make demo
```

## Recording sequence

1. Start with the permissive-versus-firewall comparison for a valid scoped record.
2. Replay a nested instruction-shaped record and show quarantine rather than execution.
3. Replay a secret-like record and show denial without echoing its value.
4. Replay stale-only and cross-scope-successor cases. Show that candidate-set lifecycle resolution happens before scope and no predecessor is revived.
5. Replay conflict and suspicious empty recall. Show escalation/diagnostic rather than a synthesized decision.

## Evidence boundary

The lab is local and deterministic. `make demo` prints a separate committed-manifest summary; it does not make a live write. It does not establish live provider behavior or Walrus durability by itself. The receipt-board segment may show the committed terminal `blob_id` records and independent cold recalls.
