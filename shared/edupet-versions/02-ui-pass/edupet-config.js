(function () {
  var VERSION = '0.2.0-alpha';
  var SELECTED_VERSION = window.EDUPET_SELECTED_VERSION || VERSION;

  window.EduPetConfig = {
    version: SELECTED_VERSION,
    latestVersion: VERSION,
    storageKey: 'edupet.next.state.' + SELECTED_VERSION,
    statBounds: {
      energy: { min: 0, max: 100 },
      confidence: { min: 0, max: 100 },
      curiosity: { min: 0, max: 100 },
      care: { min: 0, max: 100 },
      knowledge: { min: 0, max: 100 },
      cleanliness: { min: 0, max: 100 },
      xp: { min: 0, max: 99999 },
      coins: { min: 0, max: 99999 }
    },
    stages: [
      { id: 'egg', minXp: 0 },
      { id: 'baby', minXp: 40 },
      { id: 'child', minXp: 120 },
      { id: 'explorer', minXp: 260 },
      { id: 'scholar', minXp: 450 }
    ],
    events: {
      session_start:     { energy: -1, curiosity: 2, xp: 2 },
      session_end:       { confidence: 2, care: 1, xp: 3 },
      task_completed:    { confidence: 4, knowledge: 3, xp: 8, coins: 1 },
      retry_attempt:     { confidence: 2, curiosity: 1, energy: -1, xp: 3 },
      improvement_made:  { confidence: 6, knowledge: 2, xp: 10, coins: 2 },
      focus_minute:      { knowledge: 1, xp: 1, energy: -1 },
      feed_pet:          { energy: 10, care: 2, xp: 1 },
      tidy_room:         { cleanliness: 12, care: 3, xp: 1 },
      encourage_pet:     { confidence: 2, care: 3, xp: 1 },
      play_with_pet:     { energy: 3, curiosity: 3, care: 1, xp: 2 }
    },
    dailyDecay: {
      energy: -5,
      care: -3,
      cleanliness: -4
    },
    antiGrind: {
      focusMinuteDailyCap: 20,
      eventDampeners: {
        correct_answer: 12,
        focus_minute: 20,
        feed_pet: 2,
        tidy_room: 2,
        encourage_pet: 3,
        play_with_pet: 3
      }
    },
    initialState: {
      stage: 'egg',
      mood: 'curious',
      expression: 'curious',
      energy: 58,
      confidence: 42,
      curiosity: 60,
      care: 48,
      knowledge: 22,
      cleanliness: 68,
      xp: 0,
      coins: 0,
      createdAt: null,
      updatedAt: null,
      lastEvent: null,
      lastEventAt: null,
      lastDecayAt: null,
      lastMessage: 'Tell me something new today!',
      history: [],
      perApp: {},
      totals: {
        sessions: 0,
        taskCompleted: 0,
        retries: 0,
        improvements: 0,
        focusMinutes: 0
      },
      daily: {
        dayKey: null,
        counts: {}
      }
    },
    moodMessages: {
      happy: 'That felt good. Let us keep going.',
      sleepy: 'I am getting sleepy. A small boost would help.',
      curious: 'Tell me something new today!',
      proud: 'We made progress. Nice work.',
      worried: 'Can we do a little check-in together?'
    },
    eventMessages: {
      session_start: 'Ready when you are.',
      session_end: 'Nice session. I liked that.',
      task_completed: 'That helped me grow.',
      retry_attempt: 'Trying again is brave.',
      improvement_made: 'That was better than before!',
      focus_minute: 'One focused minute counts.',
      feed_pet: 'Yum. I feel brighter already.',
      tidy_room: 'Much better. This feels cosy.',
      encourage_pet: 'Thanks. I needed that.',
      play_with_pet: 'That was fun.'
    },
    careLabels: {
      feed_pet: 'Feed',
      tidy_room: 'Tidy',
      encourage_pet: 'Encourage',
      play_with_pet: 'Play'
    }
  };
})();