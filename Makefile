.PHONY: evidence-check demo test
test: evidence-check
	PYTHONPATH=. python3 tests/firewall_test.py
	PYTHONPATH=. python3 tests/candidates_test.py

demo:
	PYTHONPATH=. python3 firewall/demo.py

evidence-check:
	python3 scripts/check_evidence.py
