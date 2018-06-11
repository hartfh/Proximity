var WavDecoder	= require('wav-decoder');
var fs		= require('fs');

module.exports = function(audioCtx, trackData, maxToLoad = false) {
	var _self		= new List();
	var _library	= new List();
	var _maxToLoad	= maxToLoad;
	var _audioCtx	= audioCtx;

	function _init(trackData) {
		_loadLibrary(trackData);
	};

	function _loadLibrary(audioData) {
		for(var audioDatum of audioData) {
			_library.addItem(audioDatum);
		}
	};

	_self.setMax = function(max) {
		if( typeof(max) == 'number' ) {
			_maxToLoad = Math.floor(max);
		}
	};

	_self.clear = function() {
		_self.reset();
	};

	_self.bufferOne = function(trackName, complete) {
		var trackMeta = _library.getItem(trackName);

		if( trackMeta ) {
			_bufferTrack(trackMeta, complete);
		}
	};

	_self.bufferRandom = function(complete) {
		// Halt buffering if we're already at the max that's been specified
		if( _maxToLoad ) {
			if( _maxToLoad >= _self.countItems() ) {
				return;
			}
		}

		var trackMeta = _library.getRandomItem();

		_bufferTrack(trackMeta, complete);
	};

	_self.bufferAll = function(complete) {
		_library.eachItem(function(trackMeta, handle) {
			_bufferTrack(trackMeta, complete);
		});
	};

	function _bufferTrack(trackMeta, complete) {
		var filePath = Constants.SOUND_DIR + trackMeta.file;

		_bufferFile(trackMeta.name, filePath, complete);
	};

	function _checkBufferFull(complete) {
		var maxCounter = ( _maxToLoad ) ? _maxToLoad : _library.countItems();

		if( maxCounter == _self.countItems() ) {
			complete();
		}
	};

	function _bufferFile(name, file, complete) {
		_loadFile(file, function(audioData) {
			var channels	= audioData.channelData.length;
			var frameCount	= audioData.channelData[0].length;
			var duration	= frameCount / audioData.sampleRate;

			var myArrayBuffer = _audioCtx.createBuffer(channels, frameCount, audioData.sampleRate);

			for (var channel = 0; channel < channels; channel++) {
				var nowBuffering = myArrayBuffer.getChannelData(channel);

				for (var i = 0; i < frameCount; i++) {
					nowBuffering[i] = 0.3 * audioData.channelData[0][i];
				}
			}

			_self.addItem(myArrayBuffer, name);

			_checkBufferFull(complete);
		});
	};

	function _loadFile(filepath, callback) {
		fs.readFile(filepath, function(err, buffer) {
			if(err) {
				return false;
			} else {
				WavDecoder.decode(buffer).then(callback);
			}
		});
	};

	_init(trackData);

	return _self;
};
