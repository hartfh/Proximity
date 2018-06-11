module.exports = function() {
	var _self = {};
	var _db, _settings;

	function _init() {
		_reset();
	}

	function _reset() {
		_settings = {
			volume:	{
				effects:	1,
				master:	1,
				music:	1
			}
			// controls?
			// difficulty?
		};
	}

	_self.accessSettings = function() {
		_reset();

		var name = DB_PATH + '/settings';

		_db = new Datastore({filename: name, autoload: true});

		return _self;
	};

	_self.loadSettings = function(callback, callbackArgs) {
		_db.findOne({}, function(err, doc) {
			if( doc ) {
				if( settingsAreValid(doc.settings) ) {
					_settings = doc.settings;
				}
			}

			_self.getSettings(callback, callbackArgs);
		});
	};

	function settingsAreValid(settings) {
		function isValidVolume(vol) {
			if( vol >= 0 && vol <= 1 ) {
				return true;
			}

			return false;
		}

		if( typeof(settings) == 'object' ) {
			if( isValidVolume(settings.volume.effects) ) {
				if( isValidVolume(settings.volume.master) ) {
					if( isValidVolume(settings.volume.music) ) {
						return true;
					}
				}
			}
		}

		return false;
	}

	_self.saveSettings = function(callback, callbackArgs) {
		_db.update({}, {settings: _settings}, {upsert: true}, function(err, numReplaced, upsert) {
			callback(callbackArgs);
		});
	};

	_self.getSettings = function(callback, callbackArgs) {
		callbackArgs.settings	= _settings;
		callbackArgs.status		= 'success';

		callback(callbackArgs);
	};

	_self.setSettings = function(settings, callback, callbackArgs) {
		_settings = settings;

		_self.saveSettings(callback, callbackArgs);
	};

	_init();

	return _self;
}();
