/**
 * Player
 * Component which get sound map as input and
 * get SHA to update the player.
 * @param {DOMelement} element  Player DOM
 * @param {Object}     soundMap Sound map
 */
function Player (element, soundMap) {
  this.isReady     = false;
  this.currentNote = this.notesLength - 1;
  this.bpm         = null;
  this.bpmInterval = null;
  this.part        = null;
  this.timeoutId   = null;

  this.createTemplate(element);
  this.soundLib = new SoundLib(soundMap, this.makeItReady.bind(this));
  this.channels = Object.keys(soundMap);
  this.notes = [];
}

Player.prototype.notesLength = 16;
Player.prototype.channelLength = 8;
Player.prototype.hashRegExp = /^[a-f0-9]{40}$/i;

Player.prototype.createTemplate = function (element) {
  var i, j, column, sound, ctrl, info;

  // Info
  this.eSha = document.createElement('p');
  this.eSha.className = 'monospace inline-text box cnt';
  this.eSha.textContent = '-';
  this.eBpm = document.createElement('h1');
  this.eBpm.className = 'cnt bpm';
  this.eBpm.textContent = '00';

  info = document.createElement('div');
  info.appendChild(this.eSha);
  info.appendChild(this.eBpm);

  // Controls
  this.ePlayBtn = document.createElement('button');
  this.ePlayBtn.className = 'cnt';
  this.ePlayBtn.textContent = '×';
  this.ePlayBtn.onclick = function () {
    this.triggerPlayer();
  }.bind(this);

  ctrl = document.createElement('div');
  ctrl.className = 'inline-action box player-info';
  ctrl.appendChild(info);
  ctrl.appendChild(this.ePlayBtn);

  // Grid
  this.eGrid = document.createElement('div');
  this.eGrid.className = 'grid';

  for (i = 0; i < this.notesLength; i++) {
    column = document.createElement('div');
    for (j = 0; j < this.channelLength; j++) {
      sound = document.createElement('div');
      column.appendChild(sound);
    }
    this.eGrid.appendChild(column);
  }

  // >> Packing
  element.appendChild(ctrl);
  element.appendChild(this.eGrid);
  this.element = element;
};

Player.prototype.setHash = function (hash) {
  // 169feb2702632459cb0eb37bf24a20e1d840f78c
  // -- BPM (7bits) + Grid order (1bit)
  //   -- Instruments
  //     ---- ??? (please make suggestions)
  //         -------------------------------- Grid
  if (!this.isReady) {
    return;
  }

  // BPM
  this.bpm         = hexToInt(hash.substr(0, 2))  + 60;
  this.bpmInterval = 60000 / this.bpm / 2;

  // Intruments
  var channelMap = hexToArray(hash.substr(2, 2));
  this.notes = [];
  channelMap.forEach(function (bit, index) {
    var channelName = this.channels[bit]
    this.notes.push(this.soundLib[channelName][index]);
  }.bind(this));

  // Partition
  this.part = [];
  for (var i = 0; i < 8; i++) {
    this.part[i] = hexToArray(hash.substr(8 + 4 * i, 4));
    this.part[i].forEach(function (value, index) {
      this.eGrid.childNodes[index].childNodes[i].className = value ? 'active' : '';
    }.bind(this));
  }

  this.eSha.textContent = hash;
  this.eBpm.textContent = this.bpm;

  window.smoothScrollTo(this.element);
  
  if (!this.timeoutId) {
    this.triggerPlayer();
  }
};


Player.prototype.play = function () {
  this.timeoutId = setTimeout(this.play.bind(this), this.bpmInterval);
  console.info('>>', this.currentNote);
  this.eGrid.childNodes[this.currentNote].classList.remove('playing');
  this.currentNote = (this.currentNote + 1) % 16;
  this.eGrid.childNodes[this.currentNote].classList.add('playing');
  for (var i = 0; i < 8; i++) {
    if (this.part[i][this.currentNote]) {
      this.notes[i].play();
    }
  }
};

Player.prototype.stop = function () {
  clearInterval(this.timeoutId);
  this.timeoutId = null;
};

Player.prototype.triggerPlayer = function () {
  if (this.timeoutId) {
    this.stop();
    this.ePlayBtn.textContent = 'Play ▶';
  }
  else {
    this.play();
    this.ePlayBtn.textContent = 'Stop ◼';
  }
  this.ePlayBtn.style.display = 'inline-block';
}

Player.prototype.makeItReady = function () {
  this.isReady = true;
  this.eSha.textContent = '- ready to play -';
};

Player.prototype.print = function () {
  var i, j, line, out;
  for (i = 0; i < this.part.length; i++) {
    line = this.part[i];
    out = '';
    for (j = 0; j < line.length; j++) {
      out += line[j] ? 'X' : '.';
    }
    console.log(out);
  }
};

function hexToArray (input) {
  var len = input.length * 4,
    val = hexToInt(input),
    output = new Int8Array(input.length * 4);

  for (len--; len >= 0; len--) {
    output[len] = (val % 2 === 0) ? 0 : 1;
    val = val >> 1;
  }
  console.log(output);
  return output;
}

function hexToInt (input) {
  return parseInt(input, 16);
}