(function () {
  function render(container) {
    var app = window.EduPet;
    var config = window.EduPetConfig;

    if (!app || !config) {
      throw new Error('EduPet UI requires core + config scripts.');
    }

    container.innerHTML = '';

    var widget = document.createElement('div');
    widget.className = 'edupet-widget';

    var toggle = document.createElement('button');
    toggle.className = 'edupet-toggle';
    toggle.type = 'button';
    toggle.textContent = '🐣 EduPet';

    var panel = document.createElement('section');
    panel.className = 'edupet-panel is-open';

    var mood = document.createElement('div');
    mood.className = 'edupet-mood';

    var stage = document.createElement('div');
    stage.className = 'edupet-stage';

    var message = document.createElement('p');
    message.className = 'edupet-message';

    var stats = document.createElement('div');
    stats.className = 'edupet-stats';

    var actions = document.createElement('div');
    actions.className = 'edupet-actions';

    ['feed_pet', 'tidy_room', 'encourage_pet', 'play_with_pet'].forEach(function (eventName) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'edupet-action';
      button.textContent = eventName.replace(/_/g, ' ');
      button.addEventListener('click', function () {
        app.recordEvent(eventName);
      });
      actions.appendChild(button);
    });

    panel.appendChild(mood);
    panel.appendChild(stage);
    panel.appendChild(message);
    panel.appendChild(stats);
    panel.appendChild(actions);

    widget.appendChild(toggle);
    widget.appendChild(panel);
    container.appendChild(widget);

    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });

    app.onChange(function (state) {
      mood.textContent = 'Mood: ' + state.mood;
      stage.textContent = 'Stage: ' + state.stage;
      message.textContent = config.moodMessages[state.mood] || config.moodMessages.happy;

      stats.innerHTML = [
        ['energy', state.energy],
        ['confidence', state.confidence],
        ['curiosity', state.curiosity],
        ['care', state.care],
        ['knowledge', state.knowledge],
        ['xp', state.xp]
      ]
        .map(function (pair) {
          return '<div><strong>' + pair[0] + ':</strong> ' + pair[1] + '</div>';
        })
        .join('');
    });
  }

  window.EduPetUI = {
    render: render
  };
})();
