# EduPet versions

This directory is a preservation/consolidation area that snapshots multiple EduPet lines of work without changing active source directories.

## Version map

### 01-main-stable

- **Path:** `01-main-stable/`
- **Source work:** copied from `shared/edupet/` (main stable implementation)
- **Type:** **stable baseline**
- **Open demo:** `01-main-stable/demo/index.html`
- **Extra demo:** `01-main-stable/dashboard/index.html`

### 02-ui-pass

- **Path:** `02-ui-pass/`
- **Source work:** copied primarily from `shared/edupet-next/` (UI-focused variant), with integration/event/dashboard docs preserved alongside it
- **Type:** **variant** (richer UI-focused pass)
- **Open demo:** `02-ui-pass/demo/index.html`
- **Extra demo:** `02-ui-pass/demo/parent-dashboard.html`

### 03-lifecycle-pass

- **Path:** `03-lifecycle-pass/`
- **Source work:** lifecycle-focused snapshot based on lifecycle branch/workstream notes, packaged with copied base EduPet runtime files for standalone use
- **Type:** **extension snapshot**
- **Open demo:** `03-lifecycle-pass/demo/lifecycle.html`

## Notes

- Active paths are intentionally untouched:
  - `shared/edupet/`
  - `shared/edupet-next/`
- This folder is for side-by-side comparison and preservation only.
