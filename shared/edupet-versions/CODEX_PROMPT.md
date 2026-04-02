# Codex prompt for full consolidation

Use this prompt in Codex from branch `consolidate-all-branches`.

```text
Work on branch: consolidate-all-branches

Goal:
Physically gather the EduPet work into the version folders already created under `/shared/edupet-versions/`.

Populate these folders:
- `/shared/edupet-versions/01-main-stable/`
- `/shared/edupet-versions/02-ui-pass/`
- `/shared/edupet-versions/03-lifecycle-pass/`

Requirements:

1. 01-main-stable
Copy the current main EduPet implementation from `/shared/edupet/` into this folder, including:
- edupet-config.js
- edupet-storage.js
- edupet-core.js
- edupet-ui.js
- edupet.css
- demo/index.html
- dashboard/index.html
- any relevant docs already in `/shared/edupet/`

2. 02-ui-pass
Copy the richer UI-focused variant from `/shared/edupet-next/` into this folder, including:
- README.md
- INTEGRATION.md
- EVENTS.md
- PARENT-DASHBOARD.md
- edupet-config.js
- edupet-storage.js
- edupet-core.js
- edupet-ui.js
- edupet.css
- demo/index.html
- demo/parent-dashboard.html

3. 03-lifecycle-pass
Create a lifecycle-focused snapshot.
Prefer making this self-contained.
Include:
- LIFECYCLE.md
- edupet-lifecycle.js
- demo/lifecycle.html
- and copy any required base EduPet files if needed so this version can stand on its own

4. Keep current active paths untouched
Do not delete or rewrite:
- `/shared/edupet/`
- `/shared/edupet-next/`

5. Documentation
Update `/shared/edupet-versions/README.md` if needed so it clearly explains:
- what each version is
- which branch/work it came from
- whether it is stable, variant, or extension
- which demo file to open

6. Keep this a preservation/consolidation exercise
Do not refactor heavily.
Do not choose a winner yet.
Just consolidate cleanly.

When done:
- summarize exactly what was copied into each version folder
- flag any duplication
- note any files that still depend on original paths
```
