import os
import subprocess
import sys

result = subprocess.run([sys.executable, "scripts/check_synthetic_stand.py"], capture_output=True, text=True)
assert result.returncode == 0, result.stderr
assert "synthetic stand: SKIP" in result.stdout or "MF-SYN-INCIDENT-01" in result.stdout
print("synthetic stand test: PASS")
