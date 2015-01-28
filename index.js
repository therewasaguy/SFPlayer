var ac = new AudioContext();

var sf = SoundFilePlayer(ac);

sf.load('audio/BOPD_-_21205_elevator.mp3', songLoaded);


function songLoaded(s) {
  console.log(s);
  s.connect(ac.destination);
  s.start();
}