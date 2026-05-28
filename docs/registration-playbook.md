# Software Registration Playbook (Brazil)

This project can be open-source and still be formally registered as software authorship.
This playbook defines a repeatable package for version evidence and integrity checks.

## Goal

Create a versioned evidence package containing:

- Build artifacts
- Source snapshot references
- Hash manifest (SHA-256)
- Build environment and commands
- Legal metadata (authorship, license, timestamp)

## Suggested Folder Convention

Use one folder per registered checkpoint:

- `registration/<version-tag>/`

Example:

- `registration/baseline-v0.9/`

## Minimum Contents per Checkpoint

1. `manifest.md`
2. `hashes.sha256`
3. `build-info.txt`
4. `artifact-list.txt`

Optional:

- `git-commit.txt`
- `legal-notes.txt`

## Reproducible Build Procedure

Run from repository root:

```bash
npm ci
npm run build
```

Then collect metadata:

```bash
node -v
npm -v
git rev-parse HEAD
git status --short
```

## Hashing Procedure

Hash all files included in the registration package and selected source/build artifacts.

Suggested command (Linux):

```bash
sha256sum \
  package.json package-lock.json vite.config.js \
  README.md LICENSE \
  supabase/schema.sql supabase/mock_seed.sql \
  dist/index.html \
  dist/assets/* \
  src/lib/backend/*.js \
  src/pages/*.jsx \
  src/components/*.jsx \
  > registration/<version-tag>/hashes.sha256
```

## What to Register

- Version tag/name (for example: `baseline-v0.9`)
- Main commit hash used for the release package
- Hash manifest file
- Open-source license in force for that version (MIT in this repository)

## Important Notes

- Keep package content immutable after hashing.
- If anything changes, create a new version folder and regenerate all hashes.
- Include UTC timestamps whenever possible.
