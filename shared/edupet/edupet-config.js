(function () {
  var CURRENT_VERSION = '0.1.0';

  window.EduPetConfig = {
    version: CURRENT_VERSION,
    storageKey: 'edupet.v1.state',
    statBounds: {
      energy: { min: 0, max: 100 },
      confidence: { min: 0, max: 100 },
      curiosity: { min: 0, max: 100 },
      care: { min: 0, max: 100 },
      knowledge: { min: 0, max: 100 },
      xp: { min: 0, max: 10000 }
    },
    stages: [
      { id: 'egg', minXp: 0 },
      { id: 'baby', minXp: 40 },
      { id: 'child', minXp: 120 },
      { id: 'explorer', minXp: 260 },
      { id: 'scholar', minXp: 450 }
    ],
    events: {
      session_start: { energy: -2, curiosity: 2, xp: 2 },
      session_end: { confidence: 2, care: 1, xp: 3 },
      task_completed: { confidence: 4, knowledge: 3, xp: 8 },
      retry_attempt: { confidence: 1, curiosity: 1, energy: -1, xp: 2 },
      improvement_made: { confidence: 5, knowledge: 2, xp: 10 },
      focus_minute: { knowledge: 1, energy: -1, xp: 1 },
      feed_pet: { energy: 10, care: 2, xp: 1 },
      tidy_room: { care: 6, confidence: 1, xp: 2 },
      encourage_pet: { confidence: 4, care: 3, xp: 2 },
      play_with_pet: { energy: 3, curiosity: 3, confidence: 1, xp: 3 }
    },
    initialState: {
      stage: 'egg',
      mood: 'curious',
      energy: 55,
      confidence: 40,
      curiosity: 55,
      care: 45,
      knowledge: 20,
      xp: 0,
      createdAt: null,
      updatedAt: null,
      lastEvent: null,
      lastEventAt: null
    },
    moods: ['happy', 'sleepy', 'curious', 'proud', 'worried'],
    moodMessages: {
      happy: 'I feel great and ready to learn!',
      sleepy: 'A short break or snack would help.',
      curious: 'Tell me something new today!',
      proud: 'We made progress. Nice work!',
      worried: 'Can we do a little check-in together?'
    }
  };
})();
