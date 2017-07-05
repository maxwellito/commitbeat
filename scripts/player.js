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
  //     ------------------------------------ Grid
  var i, j, channelName, binaryHash;

  if (!this.isReady) {
    return;
  }

  // BPM
  this.bpm         = hexToInt(hash.substr(0, 2))  + 60;
  this.bpmInterval = 60000 / this.bpm / 2;

  // Intruments
  var channelMap = hexToArray(hash.substr(2, 2));
  this.notes = [];
  for (i = 0; i < channelMap.length; i++) {
    channelName = this.channels[i > 4 ? 1 : channelMap[i]]
    this.notes.push(this.soundLib[channelName][i]);
  }

  // Partition
  this.part = [];
  binaryHash = hexToArray(hash.substr(4));

  for (i = 0; i < 8; i++) {
    this.part[i] = this.splicer(binaryHash.splice(0, 18));

    for (j = 0; j < this.part[i].length; j++) {
      this.eGrid.childNodes[j].childNodes[i].className = this.part[i][j] ? 'active' : '';
    }
  }

  this.eSha.textContent = hash;
  this.eBpm.textContent = this.bpm;

  window.smoothScrollTo(this.element);
  
  if (!this.timeoutId) {
    this.triggerPlayer();
  }
};


Player.prototype.splicer = function (input) {

  var map = [],
      output = [],
      bufferLength = 0,
      canGoOn = true,
      currentChunk,
      binaryMaxLoop;

  // Mapping of the Input
  while(canGoOn) {

    if (input.length < 2) {
      canGoOn = false;
      continue;
    }

    loopSize = Math.pow(2, input[0] * 2 + input[1] + 1);
    input.splice(0, 2);

    binaryMaxLoop = this.binarySizer(Math.ceil((16 - bufferLength) / loopSize));

    if (input.length < (loopSize + binaryMaxLoop)) {
      canGoOn = false;
      continue;
    }

    map.push({
      size: loopSize,
      data: input.splice(0, loopSize),
      loop: binToInt(input.splice(0, binaryMaxLoop)) + 1
    });
  }


  // Transform mapping into binary sequence
  if (!map.length) {
    throw new Error('Wrong mapping dude!')
    return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  }

  map.forEach(function (track) {
    for (var i = track.loop; i > 0; i--) {
      output = output.concat(track.data);
    }
  })

  while (output.length < 16) {
    output = output.concat(output);
  }

  return output.slice(0, 16);
};

Player.prototype.binarySizer = function (size) {
  switch (true) {
    case size >= 16:
      return 4;
    case size >= 8:
      return 3;
    case size >= 4:
      return 2;
    case size > 1:
      return 1;
    default:
      return 0;
  }
};

Player.prototype.play = function () {
  this.timeoutId = setTimeout(this.play.bind(this), this.bpmInterval);
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