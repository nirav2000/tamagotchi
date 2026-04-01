# EduPet Integration Guide

This EduPet build is plain HTML/CSS/JS and GitHub Pages compatible.

## Minimal integration steps

1. Copy these files into your app:
   - `edupet-config.js`
   - `edupet-storage.js`
   - `edupet-core.js`
   - `edupet-ui.js`
   - `edupet.css`
2. Include them in this order:

```html
<link rel="stylesheet" href="/path/to/edupet.css" />
<script src="/path/to/edupet-config.js"></script>
<script src="/path/to/edupet-storage.js"></script>
<script src="/path/to/edupet-core.js"></script>
<script src="/path/to/edupet-ui.js"></script>
```

3. Add a mount container and mount once:

```html
<div id="petMount"></div>
<script>
  window.EduPet.mount(document.getElementById('petMount'));
</script>
```

## Recording events from your app

```js
window.EduPet.recordEvent({
  type: 'task_completed',
  appId: 'reading-app',
  value: 1,
  meta: { taskId: 'story-4' }
});
```

Use `appId` consistently per app so per-app totals stay meaningful.

## Integrating with Codex tasks

When Codex modifies another app to use EduPet, it should:
- keep script order intact,
- avoid framework-specific wrappers unless required,
- add `recordEvent` calls at existing points (session start/end, task lifecycle, focus timers),
- preserve GitHub Pages compatibility (no backend assumptions).

## State management tools

- `window.EduPet.exportState()` → JSON string
- `window.EduPet.importState(json)` → boolean
- `window.EduPet.reset()` → reset local state

Use export/import to move demo data between environments.
