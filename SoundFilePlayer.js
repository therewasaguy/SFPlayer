/*
  Soundfile Player

  Trying out the openmusic module template (http://openmusic.github.io/)
  inspired by the sample-player

  with the ability to schedule callbacks during playback,
  inspired by Chinmay @ Sonoport http://chinpen.net/talks/wac-paper/#/37
 */

function SoundFilePlayer(ac) {
  var node = ac.createGain();
  var buffer;
  var bufferSource;
  var bufferSourceProperties = {};

  var counterNode = ac.createBufferSource();
  var scopeNode = ac.createScriptProcessor( 256, 1, 1);
  var scheduledCallbacks = [];
  var lastPos;
  var bufferLength;

  ['buffer', 'loop', 'loopStart', 'loopEnd'].forEach( function(name) {
    Object.defineProperty(node, name, makeBufferSourceGetterSetter(name));
  });

  node.start = function(when, offset, duration) {
    buffer = bufferSourceProperties['buffer'];
    var when = when || 0;
    initBufferSource();
    bufferSource.start(when);
    counterNode.start(when);
  };

  node.stop = function(when) {
    var when = when || 0;
    bufferSource.stop(when);
    counterNode.stop(when);
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
        counterNode.buffer = createCounterBuffer( buff );
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

  /*** from http://chinpen.net/talks/wac-paper/#/38 ***/
  counterNode.connect(scopeNode);
  scopeNode.connect(ac.destination);

  function createCounterBuffer( audioBuf ) {
    var array = new Float32Array( node.buffer.length );
    var audioBuf = ac.createBuffer( 1, node.buffer.length, 44100 );
    for (var index = 0; index < node.buffer.length; index++ ) {
      array[ index ] = index;
    }

    audioBuf.getChannelData( 0 ).set( array );
    bufferLength = audioBuf.length;
    return audioBuf;
  }

  scopeNode.onaudioprocess = function savePosition( processEvent ) {
    var inputBuffer = processEvent.inputBuffer.getChannelData( 0 );
    lastPos = inputBuffer[ inputBuffer.length - 1 ] || 0;
  }
  // end sonoPort

  node.getPosition = function() {
    return lastPos / bufferLength;
  };

  return node;

}

