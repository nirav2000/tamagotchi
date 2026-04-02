# EduPet lifecycle pass

Source branch/workstream: `assistant-lifecycle` (consolidated snapshot)

This folder preserves a lifecycle-focused extension layer for EduPet. It is intended as an **extension** on top of the baseline behavior, packaged here with base files so it can run independently.

## What this adds

- Lifecycle phase tracking (`egg`, `baby`, `child`, `teen`, `adult`)
- Stage progression helper methods
- Lifecycle-aware event tagging for integrations

## How to run

1. Open `demo/lifecycle.html` in a browser.
2. Trigger lifecycle controls and inspect the emitted lifecycle state.

## Notes

- This is a preservation snapshot; no heavy refactor has been applied.
- Base EduPet files are copied in so this folder is self-contained.
