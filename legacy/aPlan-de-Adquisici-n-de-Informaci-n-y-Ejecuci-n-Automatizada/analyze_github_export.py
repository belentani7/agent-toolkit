import json
from collections import Counter
from pathlib import Path

path = Path('/home/ubuntu/work_ecosistema/root/GITHUB-BELENTANI7-COMPLETE.json')
data = json.loads(path.read_text(encoding='utf-8-sig'))
repo_container = data.get('repositories', {})
repos = repo_container.get('value', []) if isinstance(repo_container, dict) else repo_container
print('top_type:', type(data).__name__)
print('top_keys:', list(data)[:20])
print('repository_count:', len(repos))
print('declared_count:', repo_container.get('Count') if isinstance(repo_container, dict) else None)
for key in ('language', 'primary_language', 'visibility', 'fork'):
    values = [r.get(key) for r in repos if isinstance(r, dict) and r.get(key) is not None]
    print(f'{key}:', Counter(values).most_common(20))
for key in ('name', 'full_name', 'size', 'stargazers_count', 'open_issues_count', 'updated_at'):
    values = [r.get(key) for r in repos if isinstance(r, dict) and r.get(key) is not None]
    print(f'{key}_count:', len(values), 'sample:', values[:3])
print('private_repos_count:', data.get('privateReposCount'))
print('organizations_count:', len(data.get('organizations', []) or []))
print('gists_count:', len(data.get('gists', []) or []))
