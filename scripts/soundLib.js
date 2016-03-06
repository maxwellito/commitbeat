/**
 * SoundLib
 * Class to load maps of sounds with Howler
 * then trigger the callback once loaded.
 * @param {object}   map      Map of sounds to load
 * @param {function} callback Callback called once all of the sounds are loaded
 */
function SoundLib (map, callback) {
  var i, channel;

  this.toLoad = 0;
  this.callback = callback;

  var loadCount = this.loadCount.bind(this);
  for (var channelName in map) {
    channel = map[channelName];
    this[channelName] = [];
    for (i = 0; i < channel.length; i++) {
      this.toLoad++;
      this[channelName].push(new Howl({
        urls: channel[i],
        onload: loadCount
      }));
    }
  }
}

SoundLib.prototype.loadCount = function () {
  if (!(--this.loadCount)) {
    this.callback();
  }
};

SoundLib.prototype.isReady = function () {
  return !this.loadCount;
}