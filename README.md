# Memory Firewall

> **A memory-enabled agent must not execute what memory tells it to do.**

An evolution of [Continuum](https://github.com/alexbelij/Continuum). Memory Firewall uses a security-lab model to defend against memory-as-command, poisoning, scope escape, stale entries, and conflict.

![Threat control map](./art/threat-map.svg)

Run `make test` for a side-by-side permissive-versus-firewall replay. The project is an offline red-team lab. Ten planned Mainnet checkpoints are in [`evidence/checkpoints.json`](./evidence/checkpoints.json); receipts remain pending until live confirmation.
