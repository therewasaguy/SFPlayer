var ac = new AudioContext();

var sf = new SFPlayer(ac);
var playerSkin;

sf.load('audio/Alaclair_Ensemble_-_14_-_Twit_JournalisT.mp3', songLoaded);
// sf.load('audio/BOPD_-_21205_elevator.mp3', songLoaded);

var playerDiv, lyricsDiv;

window.onload = function() {
  playerDiv = document.getElementById('SFPlayer');
  lyricsDiv = document.getElementById('lyrics');
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

function displayLyric(params){
  lyricsDiv.innerHTML = params;
}

function scheduleEvents() {
  sf.onended(stopPlaying);
  sf.addEventAtTime(0.5, displayLyric, '?');
  sf.addEventAtTime(0.8, displayLyric, '??');
  sf.addEventAtTime(0.9, displayLyric, '???');
  sf.addEventAtTime(0.95, displayLyric, '????');
  sf.addEventAtTime(1.0, displayLyric, '?????');
  sf.addEventAtTime(1.02, displayLyric, '??????');
  sf.addEventAtTime(1.08, displayLyric, '???????');
  sf.addEventAtTime(1.5, displayLyric, 'jour');
  sf.addEventAtTime(1.7, displayLyric, 'journa');
  sf.addEventAtTime(1.9, displayLyric, 'journalist');
  sf.addEventAtTime(2.25, displayLyric, 'tweet');
  sf.addEventAtTime(3.17, displayLyric, 'crate');
  sf.addEventAtTime(3.5, displayLyric, 'dig');
  sf.addEventAtTime(3.8, displayLyric, 'wrong');
  sf.addEventAtTime(4.2, displayLyric, 'link');
  sf.addEventAtTime(4.6, displayLyric, 'still');
  sf.addEventAtTime(5.8, displayLyric, 'the');
  sf.addEventAtTime(5.81, displayLyric, 'the3');
  sf.addEventAtTime(5.82, displayLyric, 'the33');
  sf.addEventAtTime(5.83, displayLyric, 'the33S');
  sf.addEventAtTime(6.0, displayLyric, 'the33Sa');
  sf.addEventAtTime(6.1, displayLyric, 'the33Sam');
  sf.addEventAtTime(6.3, displayLyric, 'the Sample');
  sf.addEventAtTime(7.2, displayLyric, 'is');
  sf.addEventAtTime(7.5, displayLyric, 'all');
  sf.addEventAtTime(7.8, displayLyric, 'ready');
  sf.addEventAtTime(4, displayLyric, 'a');
  sf.addEventAtTime(4, displayLyric, 'be');
  sf.addEventAtTime(4, displayLyric, 'bee');
  sf.addEventAtTime(4, displayLyric, 'beea');
  sf.addEventAtTime(4, displayLyric, 'beeat');
}

function stopPlaying() {
  sf.stop();
}

// var lyrics = "journalist tweet crate dig wrong link still the sample is already a beat dont ever send me a link that we can't sample Vlooper against vinyls this is how its simple t'es-tu pour t'es-tu contre Bas-Canada t'es-tu down.. t'es-tu pour t'es-tu contre Bas-Canada all right t'es-tu pour t'es-tu contre Bas-Canada t'es-tu all all all right";