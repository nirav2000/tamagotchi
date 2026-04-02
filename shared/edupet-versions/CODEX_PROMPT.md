# Codex prompt for full version-folder snapshotting

Use this prompt in Codex if you want the branch versions physically copied into separate folder trees.

```text
Create full snapshot folders for the current EduPet variants.

Goal:
Preserve the different EduPet approaches in separate versioned folders without deleting the existing active paths.

Create this structure:

/shared/edupet-versions/
  /01-main-stable/
  /02-ui-pass/
  /03-lifecycle-pass/

Requirements:
- Copy the current main `shared/edupet/` implementation into `01-main-stable/`
- Copy the `assistant-ui-pass` variant from `shared/edupet-next/` into `02-ui-pass/`
- Copy the lifecycle extension files into `03-lifecycle-pass/`
- Add a small README in each version folder describing source branch, purpose, and main files
- Do not delete the current `shared/edupet/` or `shared/edupet-next/` paths
- Keep demos working inside each version folder
- Prefer preserving code exactly rather than refactoring during the copy

For `03-lifecycle-pass`, make it explicit whether it is:
- a full copied version of the base EduPet plus lifecycle files, or
- an extension package that sits on top of `01-main-stable`

After copying, add an index README at `/shared/edupet-versions/README.md` summarising the differences between the three versions.
```
