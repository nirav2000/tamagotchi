(function (global) {
  'use strict';

  if (!global.EduPet) {
    throw new Error('EduPet core must be loaded before edupet-lifecycle.js');
  }

  var STAGES = ['egg', 'baby', 'child', 'teen', 'adult'];
  var KEY = '__edupetLifecycle';

  function getCurrent() {
    try {
      var raw = global.localStorage.getItem(KEY);
      if (!raw) return { stage: 'egg', updatedAt: new Date().toISOString() };
      var parsed = JSON.parse(raw);
      return {
        stage: STAGES.indexOf(parsed.stage) >= 0 ? parsed.stage : 'egg',
        updatedAt: parsed.updatedAt || new Date().toISOString()
      };
    } catch (_) {
      return { stage: 'egg', updatedAt: new Date().toISOString() };
    }
  }

  function setCurrent(stage) {
    if (STAGES.indexOf(stage) < 0) return false;
    var state = { stage: stage, updatedAt: new Date().toISOString() };
    global.localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  }

  function advance() {
    var current = getCurrent();
    var idx = STAGES.indexOf(current.stage);
    if (idx < STAGES.length - 1) {
      setCurrent(STAGES[idx + 1]);
    }
    return getCurrent();
  }

  function regress() {
    var current = getCurrent();
    var idx = STAGES.indexOf(current.stage);
    if (idx > 0) {
      setCurrent(STAGES[idx - 1]);
    }
    return getCurrent();
  }

  function resetLifecycle() {
    setCurrent('egg');
    return getCurrent();
  }

  var api = {
    stages: STAGES.slice(),
    getState: getCurrent,
    setStage: function (stage) {
      if (!setCurrent(stage)) return getCurrent();
      return getCurrent();
    },
    advance: advance,
    regress: regress,
    reset: resetLifecycle,
    annotateEvent: function (event) {
      var lifecycle = getCurrent();
      var payload = event || {};
      payload.lifecycleStage = lifecycle.stage;
      return payload;
    }
  };

  global.EduPetLifecycle = api;
})(window);
