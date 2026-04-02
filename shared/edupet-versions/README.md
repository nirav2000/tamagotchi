# EduPet versions

This folder separates the main EduPet variants into versioned paths so different branches and experiments can be preserved without overwriting each other.

## Structure

- `01-main-stable/` — snapshot target for the current `main` branch EduPet
- `02-ui-pass/` — snapshot target for the `assistant-ui-pass` variant
- `03-lifecycle-pass/` — snapshot target for the `assistant-lifecycle` variant

## Why this exists

The repository currently has multiple branches with different EduPet ideas:

- the current main EduPet implementation
- a richer UI pass under `shared/edupet-next/`
- a lifecycle extension branch for `shared/edupet/`

Keeping them as separate version folders makes it easier to:

- compare variants side by side
- preserve experiments
- test demos independently
- decide later which version becomes the official active path

## Recommended rule

Only one version should be treated as the official active integration target at a time.
The others should be treated as snapshots or experiments until they are merged properly.
