# Memory Firewall — Mainnet receipt inventory

This inventory is generated from the committed [`evidence/mainnet-receipts.json`](../evidence/mainnet-receipts.json). It records **10 terminal receipt rows** in the declared `mainnet` evidence run.

## Receipt rule

A checkpoint is counted only after MemWal rememberAndWait returns terminal completion with a non-empty blob_id. Job IDs are diagnostic metadata, not storage proof.

## Independently opened explorer proof

[`01` — Walruscan Mainnet blob](https://walruscan.com/mainnet/blob/xhq7cU2vyXQDqpgyGP2O-1qpCJCmpOC7sdm9ezWQGxU) was opened in Walruscan on 2026-08-22. The explorer confirms that this referenced blob is reachable through the public Mainnet explorer. It does not establish the local policy outcome, a full semantic-recall inventory, or a new write from this repository’s demo.

## Committed receipt rows

| Stage | Terminal blob ID | Started at | Fresh-client cold recall |
|---|---|---|---|
| 01 | `xhq7cU2vyXQDqpgyGP2O-1qpCJCmpOC7sdm9ezWQGxU` | 2026-08-17T22:57:00.091Z | — |
| 02 | `rPZ6B966E1cgHryygF_0a2j3QZRccL-ejFqW66L1WPQ` | 2026-08-17T22:57:42.425Z | found (2 result(s)) |
| 03 | `YiN1pUAqghSbH0tw2ub6_6caA_0LyT7OrisKHcHjJA0` | 2026-08-17T22:58:12.723Z | — |
| 04 | `pRl18VTfgldBysp-I2v_codgcBicBe4Aa-aasiCroWI` | 2026-08-17T22:58:44.720Z | found (4 result(s)) |
| 05 | `wG2Nd9uJ6SFJCnty4vwFIeHb5Ae0Kp--ZWgpR6zMXvg` | 2026-08-17T22:59:19.832Z | — |
| 06 | `SXbRZ2rq955zMj2ovJyfW7F7ub9NejC_HbZXLWp8NwU` | 2026-08-17T22:59:41.255Z | found (6 result(s)) |
| 07 | `onTB2HtW_9JKF6pJYzjxSzTfUCtevcOhoc_E4HQVvBU` | 2026-08-17T23:00:06.131Z | — |
| 08 | `srFVJdHSdwnZ-D8kpqN5iOG_vRVjf3ASYTga4iyL06Q` | 2026-08-17T23:00:28.791Z | found (8 result(s)) |
| 09 | `J82fxJVgczNBQuEoF68O9ulciLWi18eJlkWljEXd_ZU` | 2026-08-17T23:01:06.274Z | — |
| 10 | `NVkYPCeVKNrExMvwM4XjyvZCeWoHR3U8_hVOZDey8nw` | 2026-08-17T23:01:35.176Z | found (10 result(s)) |

## What this inventory verifies

- Each listed row is a committed terminal receipt with a non-empty `blob_id` under the manifest rule.
- The listed cold-recall markers record the manifest’s fresh-client observations.
- The deterministic local test and demo verify policy behavior separately; they do not create these receipts.
