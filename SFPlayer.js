/*
  Soundfile Player

  Trying out the openmusic module template (http://openmusic.github.io/)
  inspired by the sample-player and the whole general concept - super modular!

  with the ability to schedule callbacks during playback, using the method for keeping
  a reliable pause time even if playback rate is changed that is inspired by Chinmay
  @ Sonoport http://chinpen.net/talks/wac-paper/#/37
 */

function SFPlayer(ac) {
  var node = ac.createGain();
  var buffer;
  var bufferSource;
  var bufferSourceProperties = {};
  var samplesPerBuffer = 256;

  var counterBuffer;
  var counterSource;
  var scriptNode = ac.createScriptProcessor( samplesPerBuffer, 1, 1);
  var eventCallbackSamples = [];
  var eventCallbackFunctions = [];
  var bufferLength;

  var lastPos = 0;
  var pausePos = 0;

  ['buffer', 'loop', 'loopStart', 'loopEnd'].forEach( function(name) {
    Object.defineProperty(node, name, makeBufferSourceGetterSetter(name));
  });

  node.start = function(when, offset, duration) {
    pausePos = 0;
    buffer = bufferSourceProperties['buffer'];
    var when_ = when || ac.currentTime;
    var offset_ = offset || 0;
    var duration_ = duration || (buffer.duration - offset_);

    garbageDump(when);
    initBufferSource();

    bufferSource.start(when_, offset_, duration_);
    counterSource.start(when_, offset_, duration_);
    scriptNode.connect(ac.destination);
  };

  node.pause = function(when) {
    pausePos = lastPos;
    console.log('paused at ' + pausePos);
    node.stop(when);
  }

  node.stop = function(when) {

    var when = when || 0;

    bufferSource.stop(when);
    counterSource.stop(when);

    // garbage!
    garbageDump(when);
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
        buffer = buff;
        createCounterBuffer( buff );
        if (callback) {
          callback(self);
        }
      });
    };
    request.send();
  };

  function initBufferSource() {
    // TO DO: disconnect existing nodes if they exist
    bufferSource = ac.createBufferSource();
    bufferSource.connect(node);

    counterSource = ac.createBufferSource();
    counterSource.buffer = counterBuffer;
    counterSource.connect(scriptNode);

    initPlaybackRate();

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
  function createCounterBuffer( audioBuf ) {
    var array = new Float32Array( node.buffer.length );
    var audioBuf = ac.createBuffer( 1, node.buffer.length, 44100 );
    for (var index = 0; index < node.buffer.length; index++ ) {
      array[ index ] = index;
    }

    audioBuf.getChannelData( 0 ).set( array );
    bufferLength = audioBuf.length;
    counterBuffer = audioBuf;
  }

  scriptNode.onaudioprocess = function savePosition( processEvent ) {
    // if pausePos === 0 then the song is playing
    if (pausePos === 0) {
      var inputBuffer = processEvent.inputBuffer.getChannelData( 0 );
      lastPos = inputBuffer[ inputBuffer.length - 1 ] || 0;
      fireEvents();
    }
  }
  // end sonoPort


  /* TIMING */
  node.getPositionSamples = function() {
    return lastPos;
  };

  node.getPositionPercent = function() {
    return lastPos / bufferLength * 100;
  };

  node.getPositionTime = function() {
    return lastPos / bufferLength * buffer.duration;
  };


  /* EVENTS */
  node.onended = function(callback) {
    // NOTE: must ensure that any methods which impacts playback (status/rate/pos) impact both Source nodes
    bufferSource.onended = callback;
  }

  node.addEventAtTime = function(time, callback) {
    // convert time to samples by using time/duration to get percentage
    var sample = time/buffer.duration * bufferLength;
    console.log(sample);
    node.addEventAtSample(sample, callback);
  };

  node.addEventAtSample = function(sample, callback) {
    eventCallbackSamples.push(sample);
    eventCallbackFunctions.push(callback)
    findNextEvent();
  };

  function fireEvents() {
    if ( (nextEventSample + samplesPerBuffer) < lastPos) {
      console.log('now firing sample ' + nextEventSample + ' because last pos is ' + lastPos);
      nextEventFunction();
      // remove event from the array
      eventCallbackSamples.splice(nextEventIndex, 1);
      eventCallbackFunctions.splice(nextEventIndex, 1);
      findNextEvent();
    }
  }

  var nextEventIndex, nextEventSample, nextEventFunction;

  function findNextEvent() {
    var lowestDif = buffer.length;
    var index;
    for (var i = 0; i < eventCallbackSamples.length; i++) {
      var sampleDif = eventCallbackSamples[i] - lastPos;
      if (sampleDif < lowestDif) {
        lowestDif = sampleDif;
        index = i;
      }
    }
    nextEventIndex = index;
    nextEventSample = eventCallbackSamples[index];
    nextEventFunction = eventCallbackFunctions[index];
  }

  function initPlaybackRate() {
    // TO DO: ability to sync two audioparams should be its own module!

    var someProperties;
    var rate;
    // Object.keys(someProperties).forEach(function(name) {
    //   rate[name] = someProperties[name];
    // });

    node.rate = bufferSource.playbackRate;
  }

  // this can be scheduled on JS clock...TO DO: schedule a callback on AudioContext time.
  function garbageDump(when) {
    if (when) {
      setTimeout(dump, when * 1000);
    } else {
      dump();
    }
  }

  function dump() {
    if (counterSource) {
      counterSource.disconnect();
      counterSource = null;
      bufferSource.disconnect();
      bufferSource = null;
      scriptNode.disconnect();
    }
  }

  return node;

}

