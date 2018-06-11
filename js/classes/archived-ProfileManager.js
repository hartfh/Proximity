module.exports = function() {
	var _self = {};
	var _db, _profile;

	function _init() {
		_resetProfile();
	};

	function _resetProfile() {
		_db	= null;

		_profile = {
			playerX:		0,
			playerY:		0
			// items (common/unique)
			// location
			// current district
			// general progress
			// player data
		};
	};

	_self.accessProfile = function(slotID) {
		_clearData();

		var name = DB_PATH + slotID + '/profile';

		_db = new Datastore({filename: name, autoload: true});

		return _self;
	};

	_self.loadProfile = function() {
		// load data from file to memory
	};

	_self.saveProfile = function() {
		// write data from memory to file
	};

	_self.getProfile = function() {
		// give up profile to request


		return {};
	};

	_self.setProfile = function() {
		// own profile gets updated from external copy
	};


	return _self;
};
