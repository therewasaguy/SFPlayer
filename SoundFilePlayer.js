/*
  Soundfile Player

  Trying out the openmusic module template (http://openmusic.github.io/)
  inspired by the sample-player

  with the ability to schedule callbacks during playback,
  inspired by Chinmay @ Sonoport http://chinpen.net/talks/wac-paper/#/37
 */

function SoundFilePlayer(ac) {
  var node = ac.createGain();
  var bufferSource;
  var bufferSourceProperties = {};

  var scheduledCallbacks = [];

  ['buffer', 'loop', 'loopStart', 'loopEnd'].forEach( function(name) {
    Object.defineProperty(node, name, makeBufferSourceGetterSetter(name));
  });

  node.start = function(when, offset, duration) {
    var buffer = bufferSourceProperties['buffer'];
    var when = when || 0;
    initBufferSource();
    bufferSource.start(when)
  };

  node.stop = function(when) {
    var when = when || 0;
    bufferSource.stop(when);
  };

  node.load = function(src, callback) {
    var self = this;
    var request = new XMLHttpRequest();
    request.open('GET', src, true);
    request.responseType = 'arraybuffer';

    // decode asyncrohonously
    request.onload = function() {
      ac.decodeAudioData(request.response, function(buff) {
        self.buffer = buff;
        if (callback) {
          callback(self);
        }
      });
    };
    request.send();
  };

  // TO DO: playback rate

  node.addEvent = function(time, callback) {
    scheduledCallbacks.push({time: callback});
  };

  return node;

  function initBufferSource() {
    bufferSource = ac.createBufferSource();
    bufferSource.connect(node);

    Object.keys(bufferSourceProperties).forEach(function(name) {
      bufferSource[name] = bufferSourceProperties[name];
    });
  }

  function makeBufferSourceGetterSetter(property) {
    return {
      get: function() {
        return getBufferSourceProperty(property);
      },
      set: function(v) {
        setBufferSourceProperty(property, v);
      },
      enumerable: true
    };
  }

  function getBufferSourceProperty(name) {
    return bufferSourceProperties[name];
  }

  function setBufferSourceProperty(name, value) {
    bufferSourceProperties[name] = value;
    if(bufferSource) {
      bufferSource[name] = value;
    }
  }

}

