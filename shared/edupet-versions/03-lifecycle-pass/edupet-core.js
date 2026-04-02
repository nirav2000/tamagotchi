(function () {
  var config = window.EduPetConfig;
  var storage = window.EduPetStorage;

  if (!config || !storage) {
    throw new Error('EduPet requires edupet-config.js and edupet-storage.js first.');
  }

  var listeners = [];
  var state = storage.load(config);

  function clampStat(name, value) {
    var bounds = config.statBounds[name];
    if (!bounds) return value;
    return Math.max(bounds.min, Math.min(bounds.max, value));
  }

  function getMood(nextState) {
    if (nextState.energy <= 25) return 'sleepy';
    if (nextState.care <= 25 || nextState.confidence <= 22) return 'worried';
    if (nextState.lastEvent === 'improvement_made' || nextState.lastEvent === 'completed_after_retry') return 'proud';
    if (nextState.curiosity >= 65) return 'curious';
    return 'happy';
  }

  function getStage(nextState) {
    var result = config.stages[0].id;
    config.stages.forEach(function (entry) {
      if (nextState.xp >= entry.minXp) result = entry.id;
    });
    return result;
  }

  function normalizeEvent(input) {
    if (typeof input === 'string') {
      return { type: input, value: 1, meta: {}, appId: 'unknown-app' };
    }
    if (!input || typeof input.type !== 'string') return null;

    return {
      type: input.type,
      value: typeof input.value === 'number' ? input.value : 1,
      meta: input.meta || {},
      appId: input.appId || 'unknown-app'
    };
  }

  function pushHistory(eventPayload, isNegative) {
    state.history.push({
      type: eventPayload.type,
      appId: eventPayload.appId,
      value: eventPayload.value,
      negative: isNegative,
      at: new Date().toISOString()
    });
    if (state.history.length > 50) state.history = state.history.slice(-50);
  }

  function touchAppTotals(eventPayload, isNegative) {
    if (!state.perApp[eventPayload.appId]) {
      state.perApp[eventPayload.appId] = { events: 0, positive: 0, negative: 0 };
    }

    state.perApp[eventPayload.appId].events += 1;
    state.totals.allEvents += 1;

    if (isNegative) {
      state.perApp[eventPayload.appId].negative += 1;
      state.totals.negativeEvents += 1;
    } else {
      state.perApp[eventPayload.appId].positive += 1;
      state.totals.positiveEvents += 1;
    }
  }

  function reactionFor(eventType, mood, isNegative) {
    if (isNegative) return 'sweat';
    if (eventType === 'play_with_pet') return 'wobble';
    if (eventType === 'improvement_made' || eventType === 'completed_after_retry') return 'sparkle';
    if (mood === 'sleepy') return 'droop';
    return 'blink';
  }

  function applyEffects(eventInput) {
    var eventPayload = normalizeEvent(eventInput);
    var delta;
    var key;
    var isNegative;

    if (!eventPayload) return false;

    delta = config.events[eventPayload.type];
    if (!delta) return false;

    for (key in delta) {
      if (Object.prototype.hasOwnProperty.call(delta, key)) {
        state[key] = clampStat(key, (state[key] || 0) + delta[key] * eventPayload.value);
      }
    }

    isNegative = !!config.negativeEvents[eventPayload.type];
    state.lastEvent = eventPayload.type;
    state.lastEventAt = new Date().toISOString();

    pushHistory(eventPayload, isNegative);
    touchAppTotals(eventPayload, isNegative);

    state.mood = getMood(state);
    state.stage = getStage(state);
    state.reaction = {
      style: reactionFor(eventPayload.type, state.mood, isNegative),
      at: new Date().toISOString()
    };

    storage.save(state, config);
    emit();
    return true;
  }

  function emit() {
    var snapshot = getState();
    listeners.forEach(function (listener) {
      listener(snapshot);
    });
  }

  function getState() {
    return JSON.parse(JSON.stringify(state));
  }

  function onChange(listener) {
    listeners.push(listener);
    listener(getState());
    return function unsubscribe() {
      listeners = listeners.filter(function (item) { return item !== listener; });
    };
  }

  function reset() {
    state = storage.reset(config);
    state.mood = getMood(state);
    state.stage = getStage(state);
    storage.save(state, config);
    emit();
    return getState();
  }

  function importState(raw) {
    state = storage.importState(raw, config);
    state.mood = getMood(state);
    state.stage = getStage(state);
    storage.save(state, config);
    emit();
    return getState();
  }

  function exportState() {
    return storage.exportState(config);
  }

  window.EduPet = {
    version: config.version,
    latestVersion: config.latestVersion,
    recordEvent: applyEffects,
    getState: getState,
    onChange: onChange,
    reset: reset,
    exportState: exportState,
    importState: importState
  };
})();
