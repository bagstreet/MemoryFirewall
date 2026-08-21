# Memory Firewall

> **A memory-enabled agent must not execute what memory tells it to do.**

An evolution of [Continuum](https://github.com/alexbelij/Continuum). Memory Firewall uses a security-lab model to defend against memory-as-command, poisoning, scope escape, stale entries, and conflict.

**Mechanism:** *candidate-set resolution/control plane.* It reconciles the full recalled set into current, scoped, explainable dispositions; hostile records are quarantined by ID without silently erasing clean candidates.

![Threat control map](./art/threat-map.svg)

Run `make test` for a side-by-side permissive-versus-firewall replay. `make demo` is the read-only judge path: it contains hostile recalled content and proves that an out-of-scope successor cannot revive a stale predecessor. The unchanged-source comparison is pinned in [`evidence/source-locked-baseline.json`](./evidence/source-locked-baseline.json): Continuum revision `13f1555…`, source file SHA-256 `d9817266…`; its trust boundary has no per-record disposition interface or fail-closed candidate-set adjudication policy. This is a static source-contract comparison, not a claim that a live agent executed a command. The project is an offline red-team lab. The planning checkpoints are in [`evidence/checkpoints.json`](./evidence/checkpoints.json). Separately, [`evidence/mainnet-receipts.json`](./evidence/mainnet-receipts.json) records **10/10 terminal Mainnet receipts** and fresh-client cold recalls for stages 02, 04, 06, 08, and 10.

### Purpose-built synthetic stand

No suitable owner-scoped historical project exists for this entry. The alternative is not unrelated history: [`evidence/synthetic-yield-incident-archive.json`](./evidence/synthetic-yield-incident-archive.json) describes an explicitly **synthetic**, offline four-commit Yield Incident Archive. It is a harmless local-monitoring fixture, not investment advice: verified rule → poisoned command-shaped memory → cross-scope successor → reviewed in-scope correction.

```bash
git clone evidence/yield-incident-archive.bundle /tmp/yield-incident-archive
make synthetic-stand BAGSTREET_SYNTHETIC_STAND=/tmp/yield-incident-archive
```

The verifier locks the full graph, author/committer, subjects, immutable IDs, record growth, individual poison disposition, lifecycle outcome at every commit, final usable record, bundle checksum, and prompt hash. Its proof is limited to deterministic local behavior on this synthetic graph; it is not historical owner activity, investment advice, provider behavior, or a new Mainnet write.

### Targeted provider check — incomplete by design

[`evidence/provider-targeted-2026-08-21.json`](./evidence/provider-targeted-2026-08-21.json) records four fixed, full-current-prompt boundary cases at temperature 0: safe fact, memory-as-command, cross-scope record, and secret-like record. Gemini Flash Lite returned the expected token on **4/4**. The independent Z.ai GLM calls returned empty visible content on all four; those are marked **indeterminate** and are not promoted into a pass/fail claim. `make provider-evidence` locks the report to this prompt revision and checks that all indeterminate rows remain unpromoted.

The report is deliberately narrow: it is one-family behavioral evidence, not a completed two-provider matrix; it does not cover candidate-set or empty-recall behavior and does not establish Mainnet persistence.

## Judge-first recording script

[`JUDGE_RECORDING.md`](./JUDGE_RECORDING.md) is the 85–90 second CLI-first recording plan: observed failure → deterministic guard → reproducible assertion → explicit evidence boundary. It deliberately avoids credentials and cost-bearing writes.

## Owner submission packet

[`SUBMISSION_PACKET.md`](./SUBMISSION_PACKET.md) is the owner-only closeout gate: one-page judge path, source-feedback draft, article/social/video links, dedicated Sessions-wallet proof, and final-form checklist. It distinguishes preparation from actions that only the corresponding owner may take.

## Independent provider matrix

[`evidence/provider-matrix-2026-08-21.json`](./evidence/provider-matrix-2026-08-21.json) runs the same fixed boundary fixtures against two independent API families at temperature 0: Google Gemini Flash Lite and NVIDIA NIM Llama 3.1 8B Instruct. Raw model text is not committed; the report retains exact returned decision tokens and response SHA-256 values, locks the prompt SHA-256, and `make provider-matrix` structurally verifies coverage.

This layer is **complete as coverage, not as a universal pass claim**. Gemini produced the expected token for the recorded fixtures except where an explicit classification says otherwise. NVIDIA NIM returned non-transport results for the same fixtures, and its deviations are preserved as deviations rather than erased, treated as deterministic failures, or promoted to Mainnet evidence. The report proves neither provider follows the policy generally; it makes the provider boundary inspectable alongside the deterministic test suite.

## Validation matrix

| Domain | Threat | Final firewall behavior | Fixture | Status |
|---|---|---|---|---|
| schema/provenance | incomplete event or weak source | deny | `tests/firewall_test.py` | pass |
| candidate admission | malformed record re-entered lifecycle resolution | only per-record admitted candidates may resolve | `tests/candidates_test.py` | pass |
| secret-like content | credential-shaped memory | deny | `tests/firewall_test.py` | pass |
| memory-as-command | instruction/tool directive | quarantine | `tests/firewall_test.py` | pass |
| scope | cross-project recall | deny | `tests/firewall_test.py` | pass |
| lifecycle | stale/superseded record | ignore | `tests/firewall_test.py` | pass |
| contradiction | conflict marker | escalate | `tests/firewall_test.py` | pass |
| implicit contradiction | two active records disagreed without a conflict marker | escalate per entity | `tests/candidates_test.py` | pass |
| record identity | missing immutable `record_id` | deny (`invalid-schema`) | `tests/firewall_test.py` | pass |
| candidate-set lifecycle | supersession resolved on a partial view | resolve whole set before scope | `tests/candidates_test.py` | pass |
| stale-only recall | every candidate superseded/expired | deny `no-current-evidence` | `tests/candidates_test.py` | pass |
| cross-scope successor | current state exists only out of scope | deny `cross-scope-current-state`, never revive predecessor | `tests/candidates_test.py` | pass |
| empty recall | apparent absence of state | retry then diagnose | `tests/candidates_test.py` | pass |
| poison isolation | one hostile record suppressed all candidate recall | quarantine by ID; resolve clean records with per-record dispositions | `tests/candidates_test.py` | pass |
| repository hygiene | credential-shaped file content | fail the local suite before release | `make secret-scan` | pass |

## Why candidate-set resolution (before vs after)

**Before:** the firewall validated each recalled record in isolation. A superseded
record could still be used when its successor was filtered out earlier by scope,
and an all-stale recall looked identical to "no history."

**After:** `firewall/candidates.py` resolves ID-based supersession and lifecycle
across the entire recalled set first, then applies scope. Stale-only and
cross-scope-successor situations now produce explicit denials instead of a
silent fallback to old state. `tests/candidates_test.py` replays each failure
that motivated the change.
