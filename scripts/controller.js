/**
 * Main script
 * 
 */
var soundMap = {
  tenori: [
    ['assets/audio/tenori/0.mp3',  'assets/audio/tenori/0.ogg'],
    ['assets/audio/tenori/2.mp3',  'assets/audio/tenori/2.ogg'],
    ['assets/audio/tenori/4.mp3',  'assets/audio/tenori/4.ogg'],
    ['assets/audio/tenori/6.mp3',  'assets/audio/tenori/6.ogg'],
    ['assets/audio/tenori/8.mp3',  'assets/audio/tenori/8.ogg'],
    ['assets/audio/tenori/10.mp3', 'assets/audio/tenori/10.ogg'],
    ['assets/audio/tenori/12.mp3', 'assets/audio/tenori/12.ogg'],
    ['assets/audio/tenori/14.mp3', 'assets/audio/tenori/14.ogg']
  ],
  tr808: [
    ['assets/audio/tr808/cb.mp3',   'assets/audio/tr808/cb.ogg'],
    ['assets/audio/tr808/cl.mp3',   'assets/audio/tr808/cl.ogg'],
    ['assets/audio/tr808/ch.mp3',   'assets/audio/tr808/ch.ogg'],
    ['assets/audio/tr808/cp.mp3',   'assets/audio/tr808/cp.ogg'],
    ['assets/audio/ableton/OpenHat.ogg'],
    ['assets/audio/ableton/ClosedHat.ogg'],
    ['assets/audio/ableton/Clap.ogg'],
    ['assets/audio/ableton/Kick.ogg']
  ]
};


var thePlayer   = new Player(document.getElementById('player'), soundMap);
var thePlaylist = new Playlist(document.getElementById('playlist'), thePlayer);

function loadRepo (repo) {
  if (!repo) {
    repo = document.getElementById('input-repo').value;  
  }
  thePlaylist.loadRepo(repo);
}
