(function () {
  var config = window.EduPetConfig;
  if (!config) {
    throw new Error('EduPet lifecycle requires edupet-config.js first.');
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function dayKey(dateInput) {
    var date = dateInput ? new Date(dateInput) : new Date();
    return date.toISOString().slice(0, 10);
  }

  var spec = {
    stages: [
      { id: 'egg', forms: ['sunegg'] },
      { id: 'hatchling', forms: ['pip'] },
      { id: 'nestling', forms: ['snuglet', 'fizzlet', 'drooplet'] },
      { id: 'child', forms: ['brightlet', 'scoutlet', 'softlet', 'scrufflet', 'fraylet'] },
      { id: 'teen', forms: ['bluewing', 'questwing', 'bookwing', 'heartwing', 'driftwing', 'grumblewing'] },
      { id: 'adult', forms: ['scholarwing', 'guidewing', 'sparkwing', 'kindwing', 'patchwing', 'wiltwing'] },
      { id: 'elder', forms: ['wisewing', 'gentlewing', 'tiredwing'] },
      { id: 'fading', forms: ['fading_wisewing', 'fading_gentlewing', 'fading_tiredwing'] },
      { id: 'ghost', forms: ['ghost_feather', 'star_spirit'] }
    ],
    healthStates: ['stable', 'neglected', 'critical', 'fading', 'dead']
  };

  config.lifecycleSpec = spec;
  config.stages = [
    { id: 'egg', minXp: 0 },
    { id: 'hatchling', minXp: 20 },
    { id: 'nestling', minXp: 70 },
    { id: 'child', minXp: 150 },
    { id: 'teen', minXp: 300 },
    { id: 'adult', minXp: 500 },
    { id: 'elder', minXp: 800 }
  ];

  config.initialState.lifecycle = {
    alive: true,
    majorStage: 'egg',
    form: 'sunegg',
    healthState: 'stable',
    ageDays: 0,
    daysCritical: 0,
    lineage: 0,
    scores: {
      lifeCareScore: 50,
      lifeFocusScore: 50,
      lifePersistenceScore: 50,
      lifeCuriosityScore: 50,
      lifeNeglectScore: 0
    },
    memorial: null,
    lastLifecycleReviewDay: null
  };

  function scoreFromHistory(state) {
    var history = Array.isArray(state.history) ? state.history : [];
    var metrics = {
      care: 0,
      focus: 0,
      persistence: 0,
      curiosity: 0,
      neglect: 0,
      negative: 0
    };

    history.forEach(function (entry) {
      var type = entry.type;
      if (type === 'feed_pet' || type === 'tidy_room' || type === 'encourage_pet') {
        metrics.care += 4;
      }
      if (type === 'focus_minute' || type === 'task_completed') {
        metrics.focus += 3;
      }
      if (type === 'retry_attempt' || type === 'persisted_after_mistakes' || type === 'completed_after_retry') {
        metrics.persistence += 4;
      }
      if (type === 'session_start' || type === 'play_with_pet' || type === 'improvement_made') {
        metrics.curiosity += 2;
      }
      if (type === 'idle_timeout' || type === 'task_abandoned' || type === 'focus_lost' || type === 'rapid_switch' || type === 'guessing_pattern' || type === 'session_quit_early') {
        metrics.neglect += 8;
        metrics.negative += 1;
      }
    });

    return {
      lifeCareScore: clamp(Math.round((metrics.care / 3) + state.care), 0, 100),
      lifeFocusScore: clamp(Math.round((metrics.focus / 3) + state.knowledge), 0, 100),
      lifePersistenceScore: clamp(Math.round((metrics.persistence / 3) + state.confidence), 0, 100),
      lifeCuriosityScore: clamp(Math.round((metrics.curiosity / 3) + state.curiosity), 0, 100),
      lifeNeglectScore: clamp(Math.round(metrics.neglect + (100 - state.care) * 0.25 + (100 - state.energy) * 0.2), 0, 100),
      negativeEvents: metrics.negative
    };
  }

  function majorStageFromState(state, scores) {
    if (!state.lifecycle.alive) return 'ghost';
    if (state.lifecycle.healthState === 'fading') return 'fading';
    if (state.xp < 20) return 'egg';
    if (state.xp < 70) return 'hatchling';
    if (state.xp < 150) return 'nestling';
    if (state.xp < 300) return 'child';
    if (state.xp < 500) return 'teen';
    if (state.xp < 800) return 'adult';
    if (scores.lifeNeglectScore > 82 && state.lifecycle.daysCritical >= 2) return 'fading';
    return 'elder';
  }

  function healthStateFromState(state, scores) {
    if (!state.lifecycle.alive) return 'dead';
    if (scores.lifeNeglectScore >= 88 || (state.energy <= 10 && state.care <= 10)) return 'critical';
    if (scores.lifeNeglectScore >= 60 || state.energy <= 22 || state.care <= 22) return 'neglected';
    return 'stable';
  }

  function formForStage(majorStage, scores, state) {
    if (majorStage === 'egg') return 'sunegg';
    if (majorStage === 'hatchling') return 'pip';
    if (majorStage === 'ghost') {
      return scores.lifeCuriosityScore >= scores.lifeNeglectScore ? 'star_spirit' : 'ghost_feather';
    }
    if (majorStage === 'nestling') {
      if (scores.lifeNeglectScore >= 55) return 'drooplet';
      if (scores.lifeCuriosityScore > scores.lifeCareScore + 4) return 'fizzlet';
      return 'snuglet';
    }
    if (majorStage === 'child') {
      if (scores.lifeNeglectScore >= 75) return 'fraylet';
      if (scores.lifeNeglectScore >= 55) return 'scrufflet';
      if (scores.lifeCareScore >= 70) return 'softlet';
      if (scores.lifeCuriosityScore >= 70) return 'scoutlet';
      return 'brightlet';
    }
    if (majorStage === 'teen') {
      if (scores.lifeNeglectScore >= 78) return 'grumblewing';
      if (scores.lifeNeglectScore >= 58) return 'driftwing';
      if (scores.lifeFocusScore >= 76) return 'bookwing';
      if (scores.lifeCareScore >= 76) return 'heartwing';
      if (scores.lifeCuriosityScore >= 76) return 'questwing';
      return 'bluewing';
    }
    if (majorStage === 'adult') {
      if (scores.lifeNeglectScore >= 80) return 'wiltwing';
      if (scores.lifeFocusScore >= 82 && scores.lifePersistenceScore >= 78) return 'scholarwing';
      if (scores.lifeCareScore >= 80) return 'kindwing';
      if (scores.lifeCuriosityScore >= 80) return 'sparkwing';
      if (scores.lifeCareScore >= 65 && scores.lifeFocusScore >= 65 && scores.lifePersistenceScore >= 65) return 'guidewing';
      return 'patchwing';
    }
    if (majorStage === 'elder') {
      if (scores.lifeNeglectScore >= 65) return 'tiredwing';
      if (scores.lifeCareScore >= 75) return 'gentlewing';
      return 'wisewing';
    }
    if (majorStage === 'fading') {
      if ((state.lifecycle.form || '').indexOf('gentle') !== -1 || scores.lifeCareScore >= 75) return 'fading_gentlewing';
      if ((state.lifecycle.form || '').indexOf('wise') !== -1 || scores.lifeFocusScore >= 70) return 'fading_wisewing';
      return 'fading_tiredwing';
    }
    return 'sunegg';
  }

  function summaryForMemorial(form, scores) {
    if (scores.lifeFocusScore >= scores.lifeCareScore && scores.lifeFocusScore >= scores.lifeCuriosityScore) {
      return 'Lived a bright and determined life.';
    }
    if (scores.lifeCareScore >= scores.lifeCuriosityScore) {
      return 'Lived a gentle life and needed steady care.';
    }
    if (scores.lifeNeglectScore >= 70) {
      return 'Needed more regular care and check-ins.';
    }
    return 'Loved learning and kept trying.';
  }

  function applyLifecycle(state) {
    var now = new Date();
    var lifecycle = state.lifecycle || clone(config.initialState.lifecycle);
    var createdAt = state.createdAt ? new Date(state.createdAt) : now;
    var scores;
    var today;
    var majorStage;
    var healthState;

    lifecycle.ageDays = Math.max(0, Math.floor((now.getTime() - createdAt.getTime()) / 86400000));
    scores = scoreFromHistory(state);
    today = dayKey(now);

    healthState = healthStateFromState({ lifecycle: lifecycle, energy: state.energy, care: state.care }, scores);

    if (lifecycle.lastLifecycleReviewDay !== today) {
      if (healthState === 'critical') {
        lifecycle.daysCritical = (lifecycle.daysCritical || 0) + 1;
      } else {
        lifecycle.daysCritical = 0;
      }
      lifecycle.lastLifecycleReviewDay = today;
    }

    if (healthState === 'critical' && lifecycle.daysCritical >= 3 && lifecycle.ageDays >= 3) {
      lifecycle.alive = false;
      lifecycle.healthState = 'dead';
      lifecycle.majorStage = 'ghost';
      lifecycle.form = scores.lifeCuriosityScore >= scores.lifeNeglectScore ? 'star_spirit' : 'ghost_feather';
      lifecycle.scores = {
        lifeCareScore: scores.lifeCareScore,
        lifeFocusScore: scores.lifeFocusScore,
        lifePersistenceScore: scores.lifePersistenceScore,
        lifeCuriosityScore: scores.lifeCuriosityScore,
        lifeNeglectScore: scores.lifeNeglectScore
      };
      lifecycle.memorial = lifecycle.memorial || {
        finalForm: state.stage || lifecycle.form,
        ageDays: lifecycle.ageDays,
        strongestTrait: scores.lifeFocusScore >= scores.lifeCareScore && scores.lifeFocusScore >= scores.lifeCuriosityScore ? 'focus' : (scores.lifeCareScore >= scores.lifeCuriosityScore ? 'care' : 'curiosity'),
        summary: summaryForMemorial(lifecycle.form, scores)
      };
      state.stage = lifecycle.form;
      state.lifecycle = lifecycle;
      return state;
    }

    lifecycle.alive = true;
    if (healthState === 'critical' && lifecycle.ageDays >= 10) {
      lifecycle.healthState = 'fading';
    } else {
      lifecycle.healthState = healthState;
    }

    majorStage = majorStageFromState({ xp: state.xp, lifecycle: lifecycle }, scores);
    lifecycle.majorStage = majorStage;
    lifecycle.form = formForStage(majorStage, scores, { lifecycle: lifecycle });
    lifecycle.scores = {
      lifeCareScore: scores.lifeCareScore,
      lifeFocusScore: scores.lifeFocusScore,
      lifePersistenceScore: scores.lifePersistenceScore,
      lifeCuriosityScore: scores.lifeCuriosityScore,
      lifeNeglectScore: scores.lifeNeglectScore
    };

    state.stage = lifecycle.form;
    state.lifecycle = lifecycle;
    return state;
  }

  function install() {
    var app = window.EduPet;
    var installedFlag = window.__EDUPET_LIFECYCLE_INSTALLED__;
    var originalRecordEvent;
    var originalGetState;
    var originalReset;
    var originalImportState;

    if (!app || installedFlag) return false;
    window.__EDUPET_LIFECYCLE_INSTALLED__ = true;

    originalRecordEvent = app.recordEvent;
    originalGetState = app.getState;
    originalReset = app.reset;
    originalImportState = app.importState;

    function syncLifecycleState(rawState) {
      var nextState = applyLifecycle(clone(rawState || originalGetState()));
      originalImportState(nextState);
      return originalGetState();
    }

    app.recordEvent = function (input) {
      var result = originalRecordEvent(input);
      if (!result) return result;
      syncLifecycleState(originalGetState());
      return result;
    };

    app.getState = function () {
      return applyLifecycle(originalGetState());
    };

    app.reset = function () {
      var state = originalReset();
      return syncLifecycleState(state);
    };

    app.importState = function (raw) {
      var state = originalImportState(raw);
      return syncLifecycleState(state);
    };

    app.getLifecycleSpec = function () {
      return clone(spec);
    };

    app.getLifecycleSummary = function () {
      var state = app.getState();
      return clone(state.lifecycle || {});
    };

    app.rebirth = function () {
      var current = app.getState();
      var lineage = current.lifecycle && typeof current.lifecycle.lineage === 'number' ? current.lifecycle.lineage : 0;
      var fresh = originalReset();
      fresh.lifecycle = clone(config.initialState.lifecycle);
      fresh.lifecycle.lineage = lineage + 1;
      return syncLifecycleState(fresh);
    };

    syncLifecycleState(originalGetState());
    return true;
  }

  function tryInstallLoop() {
    var attempts = 0;
    var timer = setInterval(function () {
      attempts += 1;
      if (install() || attempts > 50) {
        clearInterval(timer);
      }
    }, 100);
  }

  window.EduPetLifecycle = {
    install: install,
    spec: clone(spec),
    applyLifecycle: applyLifecycle
  };

  if (!install()) {
    tryInstallLoop();
  }
})();