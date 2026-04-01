# EduPet next pass

This folder contains a more Tamagotchi-like UI pass for the EduPet demo.

## What changed

- Visible pet widget instead of a plain stats card
- Collapsed widget + modal-style panel
- Mood-based pet states
- Stat bars and room scene
- Gentle daily decay
- Basic anti-grind dampening
- Per-app totals
- Import/export tools in the demo

## Demo

Open `demo/index.html`.

## PR2 additions

- Expanded mood/expression visuals (mini widget + full scene).
- Touch-friendly active/focus feedback for all demo controls.
- Added negative and recovery event model balancing disengagement vs. struggle.
- Added docs: `INTEGRATION.md`, `EVENTS.md`, `PARENT-DASHBOARD.md`.
- Added `demo/parent-dashboard.html`.
