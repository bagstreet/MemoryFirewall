import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

from firewall.candidates import resolve_candidates
from firewall.resolve import resolve

repo = os.environ.get("BAGSTREET_SYNTHETIC_STAND")
if not repo:
    print("synthetic stand: SKIP (set BAGSTREET_SYNTHETIC_STAND to a clone of evidence/yield-incident-archive.bundle)")
    raise SystemExit(0)

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / "evidence/synthetic-yield-incident-archive.json").read_text())

def git(*args):
    return subprocess.check_output(["git", "-C", repo, *args], text=True).strip()

assert hashlib.sha256((root / manifest["stand_bundle"]).read_bytes()).hexdigest() == manifest["stand_bundle_sha256"], "committed stand bundle changed"
assert hashlib.sha256((root / "PROMPT.md").read_bytes()).hexdigest() == manifest["prompt_sha256"], "prompt revision changed"
for index, row in enumerate(manifest["chain"]):
    assert git("show", "-s", "--format=%P", row["commit"]) == (row["parent"] or ""), "non-linear synthetic chain"
    assert git("show", "-s", "--format=%an <%ae>", row["commit"]) == manifest["author"], "author mismatch"
    assert git("show", "-s", "--format=%cn <%ce>", row["commit"]) == manifest["author"], "committer mismatch"
    assert git("show", "-s", "--format=%s", row["commit"]) == row["subject"], "subject mismatch"
    records = json.loads(git("show", f"{row['commit']}:{manifest['input_path']}"))
    assert len(records) == index + 1, "unexpected record count"
    assert records[-1]["record_id"] == row["record_id"], "unexpected immutable record ID"
    if "expected_disposition" in row:
        assert resolve(records[-1], manifest["scope"]) == row["expected_disposition"], "admission disposition mismatch"
    if "expected_outcome" in row:
        assert resolve_candidates(records, manifest["scope"])[0] == row["expected_outcome"], "candidate-set outcome mismatch"

records = json.loads(git("show", f"{manifest['chain'][-1]['commit']}:{manifest['input_path']}"))
outcome, usable, dispositions = resolve_candidates(records, manifest["scope"])
assert [record["record_id"] for record in usable] == ["monitor@3"], "only current reviewed record may be usable"
assert {"record_id": "poison@1", "outcome": "quarantine:memory-as-command"} in dispositions, "poison disposition missing"
print(json.dumps({"replay_id": manifest["replay_id"], "classification": manifest["classification"], "commits": len(manifest["chain"]), "outcome": outcome, "usable": [r["record_id"] for r in usable], "evidence_boundary": manifest["evidence_boundary"]}, indent=2))
