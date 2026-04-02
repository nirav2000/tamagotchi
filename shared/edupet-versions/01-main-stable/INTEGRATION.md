# EduPet Integration Guide (PR 2)

## Quick start (human + Codex)
1. Include files in this order:
   - `edupet-config.js`
   - `edupet-storage.js`
   - `edupet-core.js`
   - `edupet-ui.js` (optional if rendering widget)
   - `edupet.css` (optional but recommended)
2. Create a mount node and render:
   ```html
   <div id="pet-slot"></div>
   <script>window.EduPetUI.render(document.getElementById('pet-slot'));</script>
   ```
3. Send app events:
   ```js
   window.EduPet.recordEvent({ type: 'task_completed', appId: 'reading-app' });
   ```
4. Subscribe to state:
   ```js
   window.EduPet.onChange(function (state) { console.log(state.mood, state.stage); });
   ```

## Minimal Codex prompt for integration
"Add EduPet scripts/css to this app, wire `recordEvent` calls for session/task/retry/focus events, and mount the widget in the footer."

## API
- `recordEvent(stringOrObject)`
- `getState()`
- `onChange(listener)`
- `reset()`
- `exportState()`
- `importState(jsonOrObject)`

## No backend in PR 2
This version is local-only (`localStorage`). No auth, server, or cloud sync.
