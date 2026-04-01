(function () {
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function buildStarterState(config) {
    var state = clone(config.initialState);
    var ts = nowISO();
    state.createdAt = ts;
    state.updatedAt = ts;
    return state;
  }

  function load(config) {
    var raw = localStorage.getItem(config.storageKey);
    if (!raw) {
      return buildStarterState(config);
    }

    try {
      var parsed = JSON.parse(raw);
      return normalize(parsed, config);
    } catch (err) {
      return buildStarterState(config);
    }
  }

  function normalize(state, config) {
    var merged = clone(config.initialState);
    var key;

    for (key in merged) {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        merged[key] = state[key];
      }
    }

    if (!merged.createdAt) {
      merged.createdAt = nowISO();
    }
    if (!merged.updatedAt) {
      merged.updatedAt = nowISO();
    }

    return merged;
  }

  function save(state, config) {
    state.updatedAt = nowISO();
    localStorage.setItem(config.storageKey, JSON.stringify(state));
    return state;
  }

  function reset(config) {
    var starter = buildStarterState(config);
    save(starter, config);
    return starter;
  }

  window.EduPetStorage = {
    load: load,
    save: save,
    reset: reset,
    normalize: normalize
  };
})();
