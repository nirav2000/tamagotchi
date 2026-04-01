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
    if (!bounds) {
      return value;
    }
    return Math.max(bounds.min, Math.min(bounds.max, value));
  }

  function getMood(nextState) {
    if (nextState.energy <= 25) return 'sleepy';
    if (nextState.care <= 25) return 'worried';
    if (nextState.lastEvent === 'improvement_made') return 'proud';
    if (nextState.curiosity >= 65) return 'curious';
    return 'happy';
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

  function normalizeEvent(input) {
    if (typeof input === 'string') {
      return { type: input, value: 1, meta: {}, appId: 'unknown-app' };
    }

    if (!input || typeof input.type !== 'string') {
      return null;
    }

    return {
      type: input.type,
      value: typeof input.value === 'number' ? input.value : 1,
      meta: input.meta || {},
      appId: input.appId || 'unknown-app'
    };
  }

  function pushHistory(eventPayload) {
    if (!Array.isArray(state.history)) {
      state.history = [];
    }

    state.history.push({
      type: eventPayload.type,
      appId: eventPayload.appId,
      value: eventPayload.value,
      at: new Date().toISOString()
    });

    if (state.history.length > 30) {
      state.history = state.history.slice(-30);
    }
  }

  function applyEffects(eventInput) {
    var eventPayload = normalizeEvent(eventInput);
    var key;
    var delta;

    if (!eventPayload) {
      return false;
    }

    delta = config.events[eventPayload.type];
    if (!delta) {
      return false;
    }

    for (key in delta) {
      if (Object.prototype.hasOwnProperty.call(delta, key)) {
        state[key] = clampStat(key, (state[key] || 0) + delta[key] * eventPayload.value);
      }
    }

    state.lastEvent = eventPayload.type;
    state.lastEventAt = new Date().toISOString();
    pushHistory(eventPayload);
    state.mood = getMood(state);
    state.stage = getStage(state);
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
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
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

  window.EduPet = {
    version: config.version,
    latestVersion: config.latestVersion,
    recordEvent: applyEffects,
    getState: getState,
    onChange: onChange,
    reset: reset
  };
})();
