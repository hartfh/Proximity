module.exports = function(audioEnvironment, library, volume) {
	var _self			= this;
	var _paused		= false;
	var _env			= audioEnvironment;
	var _ctx			= audioEnvironment.getContext();
	var _activeTracks	= new List();
	var _pausedTracks	= new List();
	var _library		= library;

	_self.stop = function() {
		if( !_paused ) {
			_paused = true;
			_self.pauseTracks();
		}
	};

	_self.start = function() {
		if( _paused ) {
			_paused = false;
			_self.resumeTracks();
		}
	};

	_self.clear = function() {
		_activeTracks.reset();
		_pausedTracks.reset();
	};

	_self.playTrack = function(name, position = 0) {
		_env.playTrack(_library, _activeTracks, volume, name, position);
	};

	_self.pauseTracks = function() {
		var timestamp = _ctx.currentTime;

		_activeTracks.popEachItem(function(item, handle, order) {
			var elapsedTime = timestamp - item.timestamp;

			item.source.onended = null;
			item.source.stop();

			_pausedTracks.addItem({
				name:		item.name,
				position:		elapsedTime
			});
		});
	};

	_self.resumeTracks = function() {
		_pausedTracks.popEachItem(function(item, handle, order) {
			_self.playTrack(item.name, item.position);
		});
	};
};
