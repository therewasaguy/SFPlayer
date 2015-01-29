var ac = new AudioContext();

var sf = new SFPlayer(ac);
var playerSkin;

sf.load('audio/mouth-rhythm.wav', songLoaded);
// sf.load('audio/BOPD_-_21205_elevator.mp3', songLoaded);

var playerDiv;

window.onload = function() {
  playerDiv = document.getElementById('SFPlayer');
}

function songLoaded(s) {
  s.connect(ac.destination);
  s.start();
  s.onended(doneCallback);
  playerSkin = new SFPlayerSkin(sf, playerDiv);

  scheduleEvents();
}

function doneCallback() {
  console.log('done!');
}

function logTheTime(){
  console.log(sf.getPositionTime());
}

function scheduleEvents() {
  sf.onended(stopPlaying);
  sf.addEventAtTime(1, logTheTime);
  sf.addEventAtTime(2, logTheTime);
  sf.addEventAtTime(3, logTheTime);
  sf.addEventAtTime(4, logTheTime);
}

function stopPlaying() {
  sf.stop();
}