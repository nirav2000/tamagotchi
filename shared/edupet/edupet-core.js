(function () {
  var config = window.EduPetConfig;
  var storage = window.EduPetStorage;

  if (!config || !storage) {
    throw new Error('EduPet requires config and storage first.');
  }

  var listeners = [];
  var uiBridge = null;
  var state = storage.load(config);

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function clampStat(name, value) {
    var bounds = config.statBounds[name];
    if (!bounds) return value;
    return Math.max(bounds.min, Math.min(bounds.max, value));
  }

  function currentDayKey() {
    return storage.getDayKey();
  }

  function refreshDailyBucket() {
    var today = currentDayKey();
    if (state.daily.dayKey !== today) {
      state.daily.dayKey = today;
      state.daily.counts = {};
    }
  }

  function applyDailyDecay() {
    var last = state.lastDecayAt ? new Date(state.lastDecayAt) : new Date();
    var now = new Date();
    var msPerDay = 24 * 60 * 60 * 1000;
    var days = Math.floor((new Date(now.toISOString().slice(0, 10)).getTime() - new Date(last.toISOString().slice(0, 10)).getTime()) / msPerDay);
    var key;

    if (days <= 0) {
      refreshDailyBucket();
      return;
    }

    for (key in config.dailyDecay) {
      if (!Object.prototype.hasOwnProperty.call(config.dailyDecay, key)) continue;
      state[key] = clampStat(key, (state[key] || 0) + (config.dailyDecay[key] * days));
    }

    state.lastDecayAt = now.toISOString();
    refreshDailyBucket();
  }

  function getStage(nextState) {
    var result = config.stages[0].id;
    config.stages.forEach(function (entry) {
      if (nextState.xp >= entry.minXp) {
        result = entry.id;
      }
    });
    return result;
  }

  function getMood(nextState) {
    if (nextState.energy <= 24) return 'sleepy';
    if (nextState.care <= 24 || nextState.cleanliness <= 24) return 'worried';
    if (nextState.lastEvent === 'improvement_made') return 'proud';
    if (nextState.curiosity >= 66) return 'curious';
    return 'happy';
  }

  function getExpression(nextState) {
    var mood = getMood(nextState);
    if (mood === 'sleepy') return 'sleepy';
    if (mood === 'worried') return 'worried';
    if (mood === 'proud') return 'proud';
    if (mood === 'curious') return 'curious';
    return 'happy';
  }

  function getMultiplier(eventPayload) {
    var dampeners = config.antiGrind.eventDampeners || {};
    var cap = dampeners[eventPayload.type];
    var count;

    refreshDailyBucket();
    count = state.daily.counts[eventPayload.type] || 0;

    if (!cap) return 1;
    if (count >= cap) return 0;
    if (count >= Math.max(1, cap - 2)) return 0.35;
    return 1;
  }

  function incrementDailyCount(type) {
    refreshDailyBucket();
    state.daily.counts[type] = (state.daily.counts[type] || 0) + 1;
  }

  function ensurePerApp(appId) {
    if (!state.perApp[appId]) {
      state.perApp[appId] = {
        sessions: 0,
        taskCompleted: 0,
        retries: 0,
        improvements: 0,
        focusMinutes: 0
      };
    }
    return state.perApp[appId];
  }

  function pushHistory(entry) {
    if (!Array.isArray(state.history)) {
      state.history = [];
    }
    state.history.push(entry);
    if (state.history.length > 60) {
      state.history = state.history.slice(-60);
    }
  }

  function updateTotals(eventPayload) {
    var app = ensurePerApp(eventPayload.appId);
    if (eventPayload.type === 'session_start') {
      state.totals.sessions += 1;
      app.sessions += 1;
    } else if (eventPayload.type === 'task_completed') {
      state.totals.taskCompleted += eventPayload.value;
      app.taskCompleted += eventPayload.value;
    } else if (eventPayload.type === 'retry_attempt') {
      state.totals.retries += eventPayload.value;
      app.retries += eventPayload.value;
    } else if (eventPayload.type === 'improvement_made') {
      state.totals.improvements += eventPayload.value;
      app.improvements += eventPayload.value;
    } else if (eventPayload.type === 'focus_minute') {
      state.totals.focusMinutes += eventPayload.value;
      app.focusMinutes += eventPayload.value;
    }
  }

  function emit() {
    var snapshot = getState();
    listeners.forEach(function (listener) {
      listener(snapshot);
    });
    if (uiBridge && typeof uiBridge.refresh === 'function') {
      uiBridge.refresh(snapshot);
    }
  }

  function getState() {
    applyDailyDecay();
    state.stage = getStage(state);
    state.mood = getMood(state);
    state.expression = getExpression(state);
    return clone(state);
  }

  function recordEvent(input) {
    var eventPayload = typeof input === 'string'
      ? { type: input, value: 1, appId: 'unknown-app', meta: {} }
      : input;

    var delta;
    var multiplier;
    var key;
    var note;

    if (!eventPayload || typeof eventPayload.type !== 'string') return false;

    eventPayload = {
      type: eventPayload.type,
      value: typeof eventPayload.value === 'number' && eventPayload.value > 0 ? eventPayload.value : 1,
      appId: eventPayload.appId || 'unknown-app',
      meta: eventPayload.meta || {}
    };

    applyDailyDecay();
    delta = config.events[eventPayload.type];
    if (!delta) return false;

    multiplier = getMultiplier(eventPayload);

    for (key in delta) {
      if (!Object.prototype.hasOwnProperty.call(delta, key)) continue;
      state[key] = clampStat(key, (state[key] || 0) + (delta[key] * eventPayload.value * multiplier));
      if (key === 'xp' || key === 'coins') {
        state[key] = Math.round(state[key]);
      }
    }

    incrementDailyCount(eventPayload.type);
    state.lastEvent = eventPayload.type;
    state.lastEventAt = new Date().toISOString();
    state.stage = getStage(state);
    state.mood = getMood(state);
    state.expression = getExpression(state);

    note = config.eventMessages[eventPayload.type] || config.moodMessages[state.mood];
    if (multiplier === 0) {
      note = 'That still counts a little, but let us mix things up.';
    } else if (multiplier < 1) {
      note = 'Nice. Variety will help me grow even more.';
    }

    state.lastMessage = note;
    updateTotals(eventPayload);
    pushHistory({
      type: eventPayload.type,
      appId: eventPayload.appId,
      value: eventPayload.value,
      multiplier: multiplier,
      at: new Date().toISOString()
    });

    storage.save(state, config);
    emit();
    return true;
  }

  function onChange(listener) {
    listeners.push(listener);
    listener(getState());
    return function unsubscribe() {
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  function reset() {
    state = storage.reset(config);
    emit();
    return getState();
  }

  function exportState() {
    return storage.exportState(state, config);
  }

  function importState(input) {
    var imported = storage.importState(input, config);
    if (!imported) return false;
    state = imported;
    emit();
    return true;
  }

  function attachUI(bridge) {
    uiBridge = bridge;
  }

  function mount(target) {
    if (uiBridge && typeof uiBridge.mount === 'function') {
      return uiBridge.mount(target, getState());
    }
    return null;
  }

  function openPanel() {
    if (uiBridge && typeof uiBridge.open === 'function') {
      uiBridge.open();
    }
  }

  function closePanel() {
    if (uiBridge && typeof uiBridge.close === 'function') {
      uiBridge.close();
    }
  }

  function refreshUI() {
    if (uiBridge && typeof uiBridge.refresh === 'function') {
      uiBridge.refresh(getState());
    }
  }

  window.EduPet = {
    version: config.version,
    latestVersion: config.latestVersion,
    recordEvent: recordEvent,
    getState: getState,
    onChange: onChange,
    reset: reset,
    exportState: exportState,
    importState: importState,
    attachUI: attachUI,
    mount: mount,
    openPanel: openPanel,
    closePanel: closePanel,
    refreshUI: refreshUI,
    feed: function () { return recordEvent({ type: 'feed_pet', appId: 'pet-actions' }); },
    tidy: function () { return recordEvent({ type: 'tidy_room', appId: 'pet-actions' }); },
    encourage: function () { return recordEvent({ type: 'encourage_pet', appId: 'pet-actions' }); },
    play: function () { return recordEvent({ type: 'play_with_pet', appId: 'pet-actions' }); }
  };

  applyDailyDecay();
})();