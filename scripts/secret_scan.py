from pathlib import Path
import re

pattern=re.compile(r'ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]+|MEMWAL_PRIVATE_KEY\s*=\s*[^\'"\s]')
checked=0
for path in Path('.').rglob('*'):
    if '.git' in path.parts or not path.is_file():
        continue
    checked+=1
    if pattern.search(path.read_text(errors='ignore')):
        raise RuntimeError(f'secret-like content: {path}')
print(f'secret scan: PASS ({checked} files checked)')
