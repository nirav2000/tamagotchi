# EduPet Event Model

## Positive learning events (existing)
- `session_start`
- `session_end`
- `task_completed`
- `retry_attempt`
- `improvement_made`
- `focus_minute`
- `feed_pet`
- `tidy_room`
- `encourage_pet`
- `play_with_pet`

## Negative / behaviour events (new)
- `idle_timeout`
- `task_abandoned`
- `focus_lost`
- `rapid_switch`
- `guessing_pattern`
- `session_quit_early`

## Recovery / persistence events (new)
- `persisted_after_mistakes`
- `completed_after_retry`
- `returned_after_break`

## Balancing rules

- Ordinary struggle is not punished heavily:
  - `retry_attempt` remains positive.
  - `focus_lost` and `guessing_pattern` are mild penalties.
- Disengagement is penalized more than struggle:
  - `session_quit_early`, `idle_timeout`, and `task_abandoned` apply stronger negative XP/care/confidence effects.
- Recovery signals are rewarded strongly:
  - persistence and return events boost confidence and XP.

## App integration advice

Emit events based on user behavior already present in your UI. Avoid fabricating events. Keep `value` mostly `1` unless aggregating repeated low-level actions.
