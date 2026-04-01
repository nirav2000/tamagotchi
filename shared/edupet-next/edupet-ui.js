(function () {
  var rootElements = null;
  var lastReactionAt = null;

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === 'string') el.textContent = text;
    return el;
  }

  function percentage(value) {
    return Math.max(0, Math.min(100, value || 0));
  }

  function buildStatRow(label, value) {
    var row = createEl('div', 'edupet-stat');
    var top = createEl('div', 'edupet-stat-top');
    var bar = createEl('div', 'edupet-stat-bar');
    var fill = createEl('div', 'edupet-stat-fill');

    top.innerHTML = '<span>' + label + '</span><strong>' + Math.round(value) + '</strong>';
    fill.style.width = percentage(value) + '%';
    bar.appendChild(fill);
    row.appendChild(top);
    row.appendChild(bar);
    return row;
  }

  function refresh(state) {
    if (!rootElements) return;

    var pet = rootElements.pet;
    var bubble = rootElements.bubble;
    var mood = rootElements.mood;
    var stage = rootElements.stage;
    var roomNote = rootElements.roomNote;
    var stats = rootElements.stats;
    var miniStage = rootElements.miniStage;
    var miniMood = rootElements.miniMood;

    pet.className = 'edupet-pet mood-' + state.expression + ' stage-' + state.stage;
    rootElements.miniPet.className = 'edupet-mini-pet mood-' + state.expression + ' stage-' + state.stage;
    bubble.textContent = state.lastMessage || 'Hello.';
    mood.textContent = 'Mood: ' + state.mood;
    stage.textContent = 'Stage: ' + state.stage;
    roomNote.textContent = state.cleanliness >= 55 ? 'The room feels cosy.' : 'The room needs a little care.';
    miniStage.textContent = state.stage;
    miniMood.textContent = state.mood;

    stats.innerHTML = '';
    stats.appendChild(buildStatRow('Energy', state.energy));
    stats.appendChild(buildStatRow('Confidence', state.confidence));
    stats.appendChild(buildStatRow('Curiosity', state.curiosity));
    stats.appendChild(buildStatRow('Care', state.care));
    stats.appendChild(buildStatRow('Knowledge', state.knowledge));
    stats.appendChild(buildStatRow('Cleanliness', state.cleanliness));

    rootElements.xp.textContent = 'XP ' + Math.round(state.xp);
    rootElements.coins.textContent = 'Coins ' + Math.round(state.coins);

    if (state.lastEventAt && state.lastEventAt !== lastReactionAt) {
      lastReactionAt = state.lastEventAt;
      rootElements.scene.classList.remove('is-reacting');
      rootElements.scene.offsetHeight;
      rootElements.scene.classList.add('is-reacting');
      clearTimeout(rootElements.reactionTimer);
      rootElements.reactionTimer = setTimeout(function () {
        if (rootElements && rootElements.scene) {
          rootElements.scene.classList.remove('is-reacting');
        }
      }, 900);
    }
  }

  function closePanel() {
    if (!rootElements) return;
    rootElements.panel.classList.remove('is-open');
    rootElements.backdrop.classList.remove('is-open');
  }

  function openPanel() {
    if (!rootElements) return;
    rootElements.panel.classList.add('is-open');
    rootElements.backdrop.classList.add('is-open');
  }

  function mount(container, initialState) {
    var app = window.EduPet;
    var config = window.EduPetConfig;
    var widget = createEl('section', 'edupet-widget');
    var header = createEl('button', 'edupet-mini');
    var miniPet = createEl('div', 'edupet-mini-pet');
    var miniText = createEl('div', 'edupet-mini-text');
    var miniTitle = createEl('strong', '', 'EduPet');
    var miniMeta = createEl('div', 'edupet-mini-meta');
    var miniStage = createEl('span', 'edupet-mini-chip');
    var miniMood = createEl('span', 'edupet-mini-chip');
    var backdrop = createEl('div', 'edupet-backdrop');
    var panel = createEl('section', 'edupet-panel');
    var panelHeader = createEl('div', 'edupet-panel-header');
    var closeButton = createEl('button', 'edupet-close', 'Close');
    var content = createEl('div', 'edupet-layout');
    var scene = createEl('div', 'edupet-scene');
    var sky = createEl('div', 'edupet-sky');
    var bubble = createEl('div', 'edupet-bubble');
    var pet = createEl('div', 'edupet-pet');
    var eyes = createEl('div', 'edupet-eyes');
    var eyeLeft = createEl('span', 'edupet-eye');
    var eyeRight = createEl('span', 'edupet-eye');
    var beak = createEl('div', 'edupet-beak');
    var blush = createEl('div', 'edupet-blush');
    var variant = createEl('div', 'edupet-pet-variant');
    var mouth = createEl('div', 'edupet-mouth');
    var sparkle = createEl('div', 'edupet-effect sparkle');
    var sweat = createEl('div', 'edupet-effect sweat');
    var floor = createEl('div', 'edupet-floor');
    var roomNote = createEl('div', 'edupet-room-note');
    var sidebar = createEl('div', 'edupet-sidebar');
    var mood = createEl('div', 'edupet-meta-line');
    var stage = createEl('div', 'edupet-meta-line');
    var badges = createEl('div', 'edupet-badges');
    var xpBadge = createEl('span', 'edupet-badge');
    var coinsBadge = createEl('span', 'edupet-badge');
    var stats = createEl('div', 'edupet-stats');
    var actions = createEl('div', 'edupet-actions');

    container.innerHTML = '';
    header.type = 'button';
    closeButton.type = 'button';

    miniMeta.appendChild(miniStage);
    miniMeta.appendChild(miniMood);
    miniText.appendChild(miniTitle);
    miniText.appendChild(miniMeta);
    header.appendChild(miniPet);
    header.appendChild(miniText);

    panelHeader.innerHTML = '<div><strong>EduPet</strong><div class="edupet-panel-sub">A shared companion for learning apps</div></div>';
    panelHeader.appendChild(closeButton);

    eyes.appendChild(eyeLeft);
    eyes.appendChild(eyeRight);
    pet.appendChild(eyes);
    pet.appendChild(beak);
    pet.appendChild(blush);
    variant.appendChild(mouth);
    variant.appendChild(sparkle);
    variant.appendChild(sweat);
    pet.appendChild(variant);

    sky.innerHTML = '<span class="edupet-cloud cloud-a"></span><span class="edupet-cloud cloud-b"></span>';
    scene.appendChild(sky);
    scene.appendChild(bubble);
    scene.appendChild(pet);
    scene.appendChild(floor);
    scene.appendChild(roomNote);

    badges.appendChild(xpBadge);
    badges.appendChild(coinsBadge);

    sidebar.appendChild(mood);
    sidebar.appendChild(stage);
    sidebar.appendChild(badges);
    sidebar.appendChild(stats);

    ['feed_pet', 'tidy_room', 'encourage_pet', 'play_with_pet'].forEach(function (eventName) {
      var btn = createEl('button', 'edupet-action', config.careLabels[eventName] || eventName);
      btn.type = 'button';
      btn.addEventListener('click', function () {
        app.recordEvent({ type: eventName, appId: 'pet-actions', value: 1 });
      });
      actions.appendChild(btn);
    });

    sidebar.appendChild(actions);

    content.appendChild(scene);
    content.appendChild(sidebar);
    panel.appendChild(panelHeader);
    panel.appendChild(content);

    widget.appendChild(header);
    container.appendChild(widget);
    container.appendChild(backdrop);
    container.appendChild(panel);

    rootElements = {
      widget: widget,
      panel: panel,
      backdrop: backdrop,
      pet: pet,
      miniPet: miniPet,
      bubble: bubble,
      scene: scene,
      mood: mood,
      stage: stage,
      roomNote: roomNote,
      stats: stats,
      miniStage: miniStage,
      miniMood: miniMood,
      xp: xpBadge,
      coins: coinsBadge,
      reactionTimer: null
    };

    header.addEventListener('click', function () {
      openPanel();
    });

    closeButton.addEventListener('click', function () {
      closePanel();
    });

    backdrop.addEventListener('click', function () {
      closePanel();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closePanel();
    });

    refresh(initialState || window.EduPet.getState());
  }

  window.EduPetUI = {
    mount: mount,
    refresh: refresh,
    open: openPanel,
    close: closePanel
  };

  if (window.EduPet && typeof window.EduPet.attachUI === 'function') {
    window.EduPet.attachUI(window.EduPetUI);
  }
})();
