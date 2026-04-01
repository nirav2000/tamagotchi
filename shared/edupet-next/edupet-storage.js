(function () {
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function getDayKey(dateInput) {
    var date = dateInput ? new Date(dateInput) : new Date();
    return date.toISOString().slice(0, 10);
  }

  function buildStarterState(config) {
    var state = clone(config.initialState);
    var ts = nowISO();
    state.createdAt = ts;
    state.updatedAt = ts;
    state.lastDecayAt = ts;
    state.daily.dayKey = getDayKey(ts);
    state.daily.counts = {};
    return state;
  }

  function safeParse(raw) {
    try {
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function mergeDeep(target, source) {
    var key;
    for (key in source) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
          target[key] = {};
        }
        mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  function normalize(state, config) {
    var merged = clone(config.initialState);
    var safeState = state && typeof state === 'object' ? state : {};
    var bounds = config.statBounds;
    var key;
    mergeDeep(merged, safeState);

    if (!Array.isArray(merged.history)) {
      merged.history = [];
    }
    if (!merged.perApp || typeof merged.perApp !== 'object' || Array.isArray(merged.perApp)) {
      merged.perApp = {};
    }
    if (!merged.totals || typeof merged.totals !== 'object' || Array.isArray(merged.totals)) {
      merged.totals = clone(config.initialState.totals);
    }
    if (!merged.daily || typeof merged.daily !== 'object' || Array.isArray(merged.daily)) {
      merged.daily = clone(config.initialState.daily);
    }
    if (!merged.daily.counts || typeof merged.daily.counts !== 'object' || Array.isArray(merged.daily.counts)) {
      merged.daily.counts = {};
    }

    if (!merged.createdAt) merged.createdAt = nowISO();
    if (!merged.updatedAt) merged.updatedAt = nowISO();
    if (!merged.lastDecayAt) merged.lastDecayAt = merged.updatedAt;
    if (!merged.daily.dayKey) merged.daily.dayKey = getDayKey(merged.updatedAt);

    for (key in bounds) {
      if (!Object.prototype.hasOwnProperty.call(bounds, key)) continue;
      if (typeof merged[key] !== 'number' || isNaN(merged[key])) {
        merged[key] = config.initialState[key] || 0;
      }
      merged[key] = Math.max(bounds[key].min, Math.min(bounds[key].max, merged[key]));
    }

    merged.history = merged.history.slice(-60);
    return merged;
  }

  function load(config) {
    var raw = localStorage.getItem(config.storageKey);
    if (!raw) {
      return buildStarterState(config);
    }
    var parsed = safeParse(raw);
    if (!parsed) {
      return buildStarterState(config);
    }
    return normalize(parsed, config);
  }

  function save(state, config) {
    state.updatedAt = nowISO();
    localStorage.setItem(config.storageKey, JSON.stringify(normalize(state, config)));
    return state;
  }

  function reset(config) {
    var starter = buildStarterState(config);
    save(starter, config);
    return starter;
  }

  function exportState(state, config) {
    return JSON.stringify(normalize(state, config), null, 2);
  }

  function importState(input, config) {
    var parsed = typeof input === 'string' ? safeParse(input) : input;
    if (!parsed) {
      return null;
    }
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
    importState: importState,
    buildStarterState: buildStarterState,
    getDayKey: getDayKey
  };
})();