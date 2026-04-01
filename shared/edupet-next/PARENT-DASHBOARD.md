# Parent Dashboard

The parent dashboard lives at `demo/parent-dashboard.html`.

## Features
- Current pet state snapshot (mood, stage, key stats, last event/message)
- Recent event history table
- Per-app totals table (sessions/tasks/retries/focus + top event counts)
- Manual event entry
- Export / import / reset controls

## Usage

1. Open `demo/parent-dashboard.html` in browser or GitHub Pages.
2. Use the manual event controls to simulate behavior from specific apps.
3. Use export/import to archive or move local state.
4. Use reset to clear state for testing.

## Notes for integrators

- Dashboard uses only public `window.EduPet` APIs.
- No backend, no cloud sync, no dependencies.
- You can copy this page into host apps and only adjust styling/text.
