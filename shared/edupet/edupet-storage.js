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
    if (!raw) return buildStarterState(config);

    try {
      return normalize(JSON.parse(raw), config);
    } catch (err) {
      return buildStarterState(config);
    }
  }

  function normalize(state, config) {
    var merged = clone(config.initialState);
    var key;

    if (!state || typeof state !== 'object') return buildStarterState(config);

    for (key in merged) {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        merged[key] = state[key];
      }
    }

    if (!merged.createdAt) merged.createdAt = nowISO();
    if (!merged.updatedAt) merged.updatedAt = nowISO();
    if (!Array.isArray(merged.history)) merged.history = [];
    if (!merged.perApp || typeof merged.perApp !== 'object') merged.perApp = {};

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

  function exportState(config) {
    var state = load(config);
    return JSON.stringify(state, null, 2);
  }

  function importState(raw, config) {
    var parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    var normalized = normalize(parsed, config);
    save(normalized, config);
    return normalized;
  }

  window.EduPetStorage = {
    load: load,
    save: save,
    reset: reset,
    normalize: normalize,
    exportState: exportState,
    importState: importState
  };
})();
