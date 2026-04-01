# EduPet Event Model (PR 2)

## Positive events
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

## Negative / behavior events
- `idle_timeout`
- `task_abandoned`
- `focus_lost`
- `rapid_switch`
- `guessing_pattern`
- `session_quit_early`

## Recovery / persistence events
- `persisted_after_mistakes`
- `completed_after_retry`
- `returned_after_break`

## Balancing principle
- Ordinary mistakes are not heavily punished (`retry_attempt` is positive).
- Disengagement events apply stronger penalties than struggle events.
- Recovery events restore confidence and growth quickly.
