module.exports = function() {
	var _self		= {};
	var _exists	= false;

	_self.player	= null;
	_self.map		= null;
	_self.world	= null;

	function _reset() {
		_exists = false;

		_self.player	= null;
		_self.map		= null;
		_self.world	= null;
	};

	function _setProfile(profile) {
		_self.map		= profile.map;
		_self.player	= profile.player;
		_self.world	= profile.world;

		_exists = true;
	}

	function _getProfile() {
		var profile = {
			map:		_self.map,
			player:	_self.player,
			world:	_self.world,
		};

		return profile;
	};

	_self.exists = function() {
		return _exists;
	};

	_self.create = function(callback = function() {}) {
		Game.TaskManager.createTask('create-profile', {slotID: Game.State.slotID}, function(response) {
			callback();
		});
	};

	_self.load = function(callback = function() {}) {
		Game.TaskManager.createTask('load-profile', {slotID: Game.State.slotID}, function(response) {
			if( response.status == 'success' ) {
				_setProfile(response.profile);
				callback();
			}
		});
	};

	_self.save = function() {
		Game.TaskManager.createTask('save-profile', {slotID: Game.State.slotID, profile: _getProfile()});
	};

	_self.enableSaving = function() {
		Game.Events.subscribe('500-ticks', _self.save, 'periodic-profile-saving');
	};

	_self.disableSaving = function() {
		Game.Events.unsubscribe('500-ticks', 'periodic-profile-saving');
	};

	return _self;
}();
