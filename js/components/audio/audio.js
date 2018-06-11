var TrackLibrary = require('./track-library');
var TrackManager = require('./track-manager');

module.exports = new function() {
	var _self			= this;
	var _audioCtx		= new (window.AudioContext || window.webkitAudioContext)();
	var _effectsVolume	= 1;
	var _masterVolume	= 0.8;
	var _musicVolume	= 1;


	function _isValidVolume(volume) {
		if( volume >= 0 && volume <= 1 ) {
			return true;
		}

		return false;
	};

	_self.getContext = function() {
		return _audioCtx;
	};

	_self.setEffectsVolume = function(volume) {
		if( _isValidVolume(volume) ) {
			_effectsVolume = volume;
		}
	};

	_self.setMasterVolume = function(volume) {
		if( _isValidVolume(volume) ) {
			_masterVolume = volume;
		}
	};

	_self.setMusicVolume = function(volume) {
		if( _isValidVolume(volume) ) {
			_musicVolume = volume;
		}
	};

	_self.playTrack = function(buffer, activeList, specificVolume, name, position = 0) {
		var sourceNode			= _audioCtx.createBufferSource();
		var masterGainNode		= _audioCtx.createGain();
		var specificGainNode	= _audioCtx.createGain();
		var bufferData			= buffer.getItem(name);

		// Adjust node settings
		masterGainNode.gain.value	= _masterVolume;
		specificGainNode.gain.value	= specificVolume;
		sourceNode.buffer			= bufferData;

		// Connect up our nodes
		sourceNode.connect(specificGainNode);
		specificGainNode.connect(masterGainNode);
		masterGainNode.connect(_audioCtx.destination);

		var handle = activeList.addItem({
			name:		name,
			source:		sourceNode,
			timestamp:	_audioCtx.currentTime
		});

		sourceNode.start(0, position);
		sourceNode.onended = function() {
			activeList.removeItem(handle);
		}
	};

	_self.init = async function(responseCallback = function(){}) {
		var effectsBuffer	= new TrackLibrary(_audioCtx, Data.sounds);
		var musicBuffer	= new TrackLibrary(_audioCtx, Data.sounds, 1);

		_self.BattlefieldEffects	= new TrackManager(_self, effectsBuffer, _effectsVolume);
		_self.MenuEffects		= new TrackManager(_self, effectsBuffer, _effectsVolume);
		_self.Music			= new TrackManager(_self, musicBuffer, _musicVolume);

		effectsBuffer.bufferAll(function() {
			//_self.MenuEffects.playTrack('testAudioThree');
			responseCallback();
		});
	};
};
