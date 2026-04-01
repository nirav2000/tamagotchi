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
    if (nextState.energy <= 25) {
      return 'sleepy';
    }
    if (nextState.care <= 25) {
      return 'worried';
    }
    if (nextState.lastEvent === 'improvement_made') {
      return 'proud';
    }
    if (nextState.curiosity >= 65) {
      return 'curious';
    }
    return 'happy';
  }

  function getStage(nextState) {
    var stages = config.stages;
    var result = stages[0].id;
    var i;

    for (i = 0; i < stages.length; i += 1) {
      if (nextState.xp >= stages[i].minXp) {
        result = stages[i].id;
      }
    }

    return result;
  }

  function applyEffects(eventType) {
    var delta = config.events[eventType];
    var key;

    if (!delta) {
      return false;
    }

    for (key in delta) {
      if (Object.prototype.hasOwnProperty.call(delta, key)) {
        state[key] = clampStat(key, (state[key] || 0) + delta[key]);
      }
    }

    state.lastEvent = eventType;
    state.lastEventAt = new Date().toISOString();
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
    recordEvent: applyEffects,
    getState: getState,
    onChange: onChange,
    reset: reset
  };
})();
