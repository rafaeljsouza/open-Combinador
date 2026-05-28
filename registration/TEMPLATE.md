# Registration Package Template

Create a new folder: `registration/<version-tag>/`

Required files:

1. `manifest.md`
2. `hashes.sha256`
3. `artifact-list.txt`
4. `build-info.txt`

Minimum `build-info.txt` fields:

- `timestamp_utc=`
- `node_version=`
- `npm_version=`
- `git_commit=`
- `working_tree_entries=`

Recommended verification command:

```bash
sha256sum -c registration/<version-tag>/hashes.sha256
```
