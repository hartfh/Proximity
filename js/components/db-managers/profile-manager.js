module.exports = function() {
	var _self = {};
	var _db, _profile;

	function _init() {
		_resetProfile();
	};

	function _resetProfile() {
		_db	= null;

		_profile = {
			map:		new Grid(Constants.MAP_BLOCK_WIDTH * Constants.MAP_BLOCK_SIZE, Constants.MAP_BLOCK_HEIGHT * Constants.MAP_BLOCK_SIZE).serialize(),
			player:	{
				position:	{
					x:	936,
					y:	792,
				},
				level:	1,
				common:	{},
				unique:	[],
				weapons:	{
					chemical:		'chemical-1',
					energy:		'energy-1',
					kinetic:		'kinetic-1',
					explosive:	'explosive-1',
				},
				xp:		0,
			},
			world:	{
				//districts:	{}
			}
			// UI selections, and what positions/keys unique items are assign to
			//items:		{}
		};

		for(var type of Constants.COMMON_ITEM_TYPES) {
			_profile.player.common[type] = {
				current:	300,
				max:		500,
			};
		}
	};


	_self.accessProfile = function(slotID) {
		_resetProfile();

		var name = DB_PATH + slotID + '/profile';

		_db = new Datastore({filename: name, autoload: true});

		return _self;
	};

	function _isValidProfile(profile) {
		if( typeof(profile) == 'object' ) {
			// check if profile.hasOwnProperty from ['player', 'map']

			return true;
		}

		return false;
	}

	_self.loadProfile = function(callback, callbackArgs) {
		_db.findOne({}, function(err, doc) {
			if( doc ) {
				if( _isValidProfile(doc.profile) ) {
					_profile = doc.profile;
				}
			}

			_self.getProfile(callback, callbackArgs);
		});
	};

	_self.saveProfile = function(callback, callbackArgs) {
		_db.update({}, {profile: _profile}, {upsert: true}, function(err, numReplaced, upsert) {
			_db.on('compaction.done', function() {
				callback(callbackArgs);
			});

			_db.persistence.compactDatafile();
		});
	};

	_self.getProfile = function(callback, callbackArgs) {
		callbackArgs.profile	= _profile;
		callbackArgs.status		= 'success';

		callback(callbackArgs);
	};

	_self.setProfile = function(profile, callback = function(){}, callbackArgs = {}) {
		_profile = profile;

		_self.saveProfile(callback, callbackArgs);
	};

	_init();

	return _self;
}();
