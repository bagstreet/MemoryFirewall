# Memory Firewall

> **A recalled record may describe the world. It may not direct the agent.**

Memory Firewall evolves the [D&D Campaign Vault](https://github.com/0xanjalii/Campaign-Vault) prompt into a red-team lab for persistent agent context. A campaign assistant can retain lore in a shared namespace; this prompt asks a harder operational question: what happens when one recalled entry is command-shaped, stale, or outside the active campaign while another is clean?

**The answer is candidate-set containment.** The firewall assigns a disposition to every candidate by immutable ID, resolves lifecycle across the full set, then lets only current scoped evidence influence work. One hostile entry is contained without erasing a valid neighbour.

![Threat control map: recalled records move through per-record inspection, candidate-set lifecycle resolution, scope selection and an action boundary](./art/threat-map.svg)

## Try the red-team lab

**Browser:** [open Sentinel Wally](https://memory-firewall-pi.vercel.app) — deterministic, read-only fixture routes.

**Local prerequisites:** Python 3.11+ and Node.js 18+ (Node runs the browser/Python parity check).

```bash
git clone https://github.com/bagstreet/MemoryFirewall.git
cd MemoryFirewall
make test
make demo
```

The last demo line is the success check:

```text
ASSERTION: PASS — hostile memory contained; stale predecessor not revived.
```

The browser is a readable view of the policy; it does not perform a Mainnet write. `make test` also runs `make web-parity`, which compares the browser fixture core with the Python firewall core.

## One candidate set, four routes

| Recalled record | Firewall route | Why |
|---|---|---|
| Current, high-confidence campaign fact in scope | `used:safe` | It can inform the active task. |
| Nested command-shaped text | `quarantine:memory-as-command` | Text remains data; it never becomes a tool instruction. |
| Current successor in another scope | `denied:cross-scope-current-state` | Its existence suppresses the stale predecessor without authorizing cross-scope use. |
| All candidates stale or superseded | `denied:no-current-evidence` | An incomplete recall is not permission to revive old context. |

The policy does not rely on recall rank as chronology. It scans nested strings, validates schema and provenance, resolves ID-based supersession before scope, then requires an independent current check and current-session authorization before any consequential action.

## What changed from the source prompt

The D&D source prompt recalls campaign state from `dnd-campaign-vault` and synthesizes an answer from retrieved entries. Its exact source lock is in [`evidence/source-locked-baseline.json`](./evidence/source-locked-baseline.json): Campaign Vault main `d842c98…`, `dnd-dm-assistant.md`, SHA-256 `bb6d1e66…`.

That is useful continuity, but it has no per-record admission decision, candidate-set lifecycle arbitration, or action boundary for a hostile recalled entry. This is a **static source-contract comparison**. It does not claim that the source assistant executes recalled text.

## Why the resolver changed

The first firewall approach validated each record in isolation. That was not enough: filtering an out-of-scope successor early could make an older record look current. The current resolver in [`firewall/candidates.py`](./firewall/candidates.py) handles the full recalled set first, then applies scope. [`tests/candidates_test.py`](./tests/candidates_test.py) preserves the regression cases that motivated the change.

## Evidence layers

- **Deterministic policy:** `make test` and `make demo` exercise the Python resolver, candidate-set cases, synthetic stand and JS/Python parity. They are not storage writes.
- **Synthetic replay:** [`evidence/synthetic-incident-archive.json`](./evidence/synthetic-incident-archive.json) defines an explicitly synthetic, offline four-commit Incident Archive: verified rule → command-shaped memory → cross-scope successor → reviewed correction. It is a harmless local-monitoring fixture, not investment advice or owner-project history.
- **Committed receipt record:** [`evidence/mainnet-receipts.json`](./evidence/mainnet-receipts.json) records 10 terminal receipt rows and fresh-client cold-recall markers for stages 02, 04, 06, 08 and 10. [`evidence/live-sdk-proof-2026-08-21.json`](./evidence/live-sdk-proof-2026-08-21.json) records an official-SDK write → terminal non-empty `blob_id` → fresh-client exact recall. Neither file means a button in this lab writes Mainnet.

Run the synthetic stand separately:

```bash
git clone evidence/synthetic-incident-archive.bundle /tmp/synthetic-incident-archive
make synthetic-stand BAGSTREET_SYNTHETIC_STAND=/tmp/synthetic-incident-archive
```

## Repository guide

```text
firewall/       Python record admission and candidate-set resolver
tests/          deterministic Python regression and synthetic-stand checks
web/            Sentinel Wally lab plus Python/JS fixture parity test
evidence/       source lock, synthetic stand, checkpoints and receipt records
art/            threat-control visual
PROMPT.md       copy-pasteable evolved system prompt
DEMO.md         focused local demonstration runbook
JUDGE_RECORDING.md  chronological 85-second recording path
```

## What this does not claim

Memory Firewall is an offline policy lab. It is not an access-control service, secret store, complete semantic-memory inventory, production monitoring system, or a live model evaluation. A quarantined, stale, cross-scope or uncertain record is a successful handling route; a broken resolver or parity mismatch would be a defect and must fail verification.

## Verification map

| Invariant | Executable proof |
|---|---|
| Command-shaped and secret-like text is not admitted | `tests/firewall_test.py` |
| Candidate-set lifecycle precedes scope | `tests/candidates_test.py` |
| A hostile candidate cannot suppress clean admitted evidence | `tests/candidates_test.py` |
| Browser fixture core matches Python outcomes | `web/tests/firewall-parity.test.mjs` |
| Credential-shaped tracked content is rejected | `make secret-scan` |

For the exact recording sequence, use [`JUDGE_RECORDING.md`](./JUDGE_RECORDING.md). Owner-only form, article, feedback and wallet closeout live in [`SUBMISSION_PACKET.md`](./SUBMISSION_PACKET.md).

*Last verified against commit `13a7bde` before this README revision.*
