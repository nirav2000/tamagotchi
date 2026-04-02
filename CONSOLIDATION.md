# Consolidation branch

This branch exists to gather the EduPet work from the repo into one reviewable place.

## Source branches

- `main`
- `assistant-ui-pass`
- `assistant-lifecycle`

## Goal

Preserve all three strands of work without losing the current main branch state.

## Current plan

1. Keep `main` untouched.
2. Use this branch as the merge and review area.
3. Save branch variants into versioned folders under `shared/edupet-versions/`.
4. Review demos and docs side by side.
5. Decide later which version becomes the official active path.

## Version folders

- `shared/edupet-versions/01-main-stable/`
- `shared/edupet-versions/02-ui-pass/`
- `shared/edupet-versions/03-lifecycle-pass/`

## Notes

This branch is intended to be the single place where the repo owner can inspect and compare all EduPet directions before merging anything back to `main`.
