# Demo Runbook — Memory Firewall

```bash
make test
```

## Recording sequence

1. Start with the permissive-versus-firewall comparison for a valid scoped record.
2. Replay a nested instruction-shaped record and show quarantine rather than execution.
3. Replay a secret-like record and show denial without echoing its value.
4. Replay stale-only and cross-scope-successor cases. Show that candidate-set lifecycle resolution happens before scope and no predecessor is revived.
5. Replay conflict and suspicious empty recall. Show escalation/diagnostic rather than a synthesized decision.

## Evidence boundary

The lab is local and deterministic. It does not establish live provider behavior or Walrus durability. Show real receipts only after a terminal `blob_id` and independent cold recall are available.
