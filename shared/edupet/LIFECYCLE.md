# EduPet lifecycle

This file is for both humans and developers.

It explains the full Tamagotchi-style lifecycle and the lifecycle extension that can be loaded on top of the base EduPet library.

## What this adds

The base EduPet library already tracks mood, progress, reactions and events.

The lifecycle extension adds:

- an egg-to-death lifecycle
- branching character forms
- hidden life scores
- health states
- death and memorial behaviour
- rebirth to a new egg

## Script order

Load the lifecycle file after `edupet-config.js` and before `edupet-storage.js` and `edupet-core.js`.

```html
<script src="edupet-config.js"></script>
<script src="edupet-lifecycle.js"></script>
<script src="edupet-storage.js"></script>
<script src="edupet-core.js"></script>
<script src="edupet-ui.js"></script>
```

This allows the lifecycle state to become part of the saved EduPet profile.

## Lifecycle ladder

| Major stage | Typical forms | What it means |
|---|---|---|
| Egg | `sunegg` | Starting state |
| Hatchling | `pip` | First living form |
| Nestling | `snuglet`, `fizzlet`, `drooplet` | Care and curiosity start to matter |
| Child | `brightlet`, `scoutlet`, `softlet`, `scrufflet`, `fraylet` | The pet starts reflecting habits |
| Teen | `bluewing`, `questwing`, `bookwing`, `heartwing`, `driftwing`, `grumblewing` | User patterns are now clear |
| Adult | `scholarwing`, `guidewing`, `sparkwing`, `kindwing`, `patchwing`, `wiltwing` | Main mature form |
| Elder | `wisewing`, `gentlewing`, `tiredwing` | End-of-life mature stage |
| Fading | `fading_wisewing`, `fading_gentlewing`, `fading_tiredwing` | Critical late-life decline |
| Ghost | `ghost_feather`, `star_spirit` | Post-death memorial form |

## Branching logic

The lifecycle does not branch from XP alone.

It also uses hidden life scores built from the event history.

### Hidden scores

- `lifeCareScore`
- `lifeFocusScore`
- `lifePersistenceScore`
- `lifeCuriosityScore`
- `lifeNeglectScore`

These are derived from the EduPet event history and current state.

### High-level branching rules

- strong care creates calmer and kinder forms
- strong curiosity creates exploratory forms
- strong persistence creates more resilient forms
- strong focus and knowledge creates study-oriented forms
- repeated neglect, quitting, or disengagement creates weaker forms

## Health states

The lifecycle adds a health state separate from mood.

Possible values:

- `stable`
- `neglected`
- `critical`
- `fading`
- `dead`

### Important rule

The system should not punish ordinary mistakes heavily.

It should react more strongly to:

- neglect
- disengagement
- repeated quitting
- long-term low care
- long periods in a critical state

## Death model

Death is gentle and stylised.

The pet does not just disappear.

Instead it moves through:

1. stable or neglected life
2. critical state
3. fading state
4. ghost or spirit form
5. memorial record

## Memorial model

When a pet dies, the lifecycle stores a memorial summary such as:

- final form
- age in days
- strongest trait
- summary text

Example summaries:

- `Lived a bright and determined life.`
- `Needed more steady care and check-ins.`
- `Loved learning and kept trying.`

## Rebirth

The lifecycle adds `EduPet.rebirth()`.

This resets the pet to a new egg while carrying forward a lineage count.

## Developer spec

### Lifecycle state shape

The lifecycle extension stores data under `state.lifecycle`.

Typical structure:

```json
{
  "alive": true,
  "majorStage": "child",
  "form": "brightlet",
  "healthState": "stable",
  "ageDays": 6,
  "daysCritical": 0,
  "lineage": 0,
  "scores": {
    "lifeCareScore": 62,
    "lifeFocusScore": 48,
    "lifePersistenceScore": 58,
    "lifeCuriosityScore": 64,
    "lifeNeglectScore": 14
  },
  "memorial": null,
  "lastLifecycleReviewDay": "2026-04-01"
}
```

### Added public API

When the lifecycle extension is loaded it adds these methods to `window.EduPet`:

- `EduPet.getLifecycleSpec()`
- `EduPet.getLifecycleSummary()`
- `EduPet.rebirth()`

## Event philosophy

Mistakes are not the main route to decline.

Ordinary struggling is acceptable.

The lifecycle reacts more strongly to behaviour such as:

- abandoning tasks
- idle timeout
- quitting early
- repeated switching
- no care over time

And it rewards:

- returning after a break
- persistence after mistakes
- consistent care
- meaningful effort over time

## Demo

Open `demo/lifecycle.html` to see the lifecycle-enabled version.
