module.exports = function() {
	var _self = this;

	_self.volume = {};

	_self.pushSound = function() {
		Game.Audio.setEffectsVolume( _self.volume.effects || 1 );
		Game.Audio.setMasterVolume( _self.volume.master || 1 );
		Game.Audio.setMusicVolume( _self.volume.music || 1 );
	};

	function setSettings(settings) {
		_self.volume = settings.volume;
	}

	function getSettings() {
		var settings = {};

		settings.volume = _self.volume;

		return settings;
	}

	_self.load = function(callback = function(){}) {
		Game.TaskManager.createTask('load-settings', {}, function(response) {
			if( response.status == 'success' ) {
				setSettings(response.settings);
				callback();
			}
		});
	};

	_self.save = function() {
		Game.TaskManager.createTask('save-settings', {settings: getSettings()});
	};

	return _self;
}();
