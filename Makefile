.PHONY: evidence-check demo test synthetic-stand
test: evidence-check secret-scan
	PYTHONPATH=. python3 tests/firewall_test.py
	PYTHONPATH=. python3 tests/candidates_test.py
	PYTHONPATH=. python3 tests/synthetic_stand_test.py

demo:
	PYTHONPATH=. python3 firewall/demo.py

evidence-check:
	python3 scripts/check_evidence.py
secret-scan:
	python3 scripts/secret_scan.py

synthetic-stand:
	PYTHONPATH=. python3 scripts/check_synthetic_stand.py
