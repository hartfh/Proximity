module.exports = new function() {
	const _TIME_DELAY	= 50;
	const _BATCH_SIZE	= 12;

	var _self = this;

	/**
	 * Instantiates large numbers of actor/body pairs while minimizing CPU load.
	 *
	 * @method	spawn
	 * @public
	 *
	 * @param		{array}		saveProfiles		An array of actor saveProfiles to instantiate
	 */
	_self.spawn = function(saveProfiles = [], callback = function(){}, forceFastSpawn = false) {
 		_spawnThrottler(saveProfiles, 0, callback, forceFastSpawn);
 	};

	_self.despawn = function(actors) {
		for(var actor of actors) {
			actor.finishDestructing();
		}
	};

	/**
	 * Runs through a batch of spawn jobs, then asynchronously recurses.
	 *
	 * @method	_spawnThrottler
	 * @private
	 *
	 * @param		{array}		saveProfiles		An array of actor saveProfiles to instantiate
	 * @param		{integer}		index			Array index
	 * @param		{boolean}		forceFastSpawn		Option to bypass throttling and spawn as quickly as possible
	 */
	function _spawnThrottler(saveProfiles, index, callback, forceFastSpawn) {
		var self		= arguments.callee;
		var batchSize	= (forceFastSpawn) ? 400 : _BATCH_SIZE;
		var timeDelay	= (forceFastSpawn) ? 10 : _TIME_DELAY;
		var maxLength	= index + batchSize;

		// Ensure end index does not exceed total array length
		if( maxLength >= saveProfiles.length ) {
			maxLength = saveProfiles.length;
		}

		// Run through batch of spawn jobs
		for(var x = index; x < maxLength; x++) {
			var profile	= saveProfiles[x];

			_spawn(profile);
		}

		index += batchSize;

		if( index < saveProfiles.length ) {
			setTimeout(function() {
				self(saveProfiles, index, callback);
			}, timeDelay);
		} else {
			callback();
		}
	};

	/**
	 * Instantiates one actor/body pair based on a saveProfile.
	 *
	 * @method	_spawn
	 * @private
	 *
	 * @param		{object}		profiles		An actor or troupe saveProfile object
	 */
	function _spawn(profile) {
		var body, nameArr, allegiance;
		var mapGridCoords = Game.MapGrid.convertPosition({x: profile.x, y: profile.y});

		switch(profile.type) {
			case 'ac':
				allegiance = profile.allg;
				nameArr = ['characters', profile.name];
				break;
			case 'de':
				allegiance = 'enemy';
				nameArr = ['destructibles', profile.name];
				break;
			case 'ob':
				allegiance = 'neutral';
				nameArr = ['obstacles', profile.name];
				break;
			case 'wt':
				nameArr = ['weather', profile.name];
				break;
			default:
				break;
		}

		switch(profile.type) {
			// Actor & Obstacle (and destructible?)
			case 'ac':
			case 'de':
			case 'ob':
				body = ActorFactory.create(allegiance, nameArr, profile.x, profile.y);

				if( body && profile.yv ) {
					body.yv = profile.yv;
				}

				Game.MapGrid.add('terrain', body, mapGridCoords.x, mapGridCoords.y);
				break;
			// Doodad
			case 'do':
				body = DoodadFactory.create(profile.name, false, profile.t, profile.r, profile.v, profile.x, profile.y);
				break;
			// Terrain
			case 'te':
				body = TerrainFactory.create(profile.name, profile.t, profile.r, profile.v, profile.x, profile.y);
				Game.MapGrid.add('terrain', body, mapGridCoords.x, mapGridCoords.y);
				break;
			// Troupe
			case 'tp':
				body = TroupeFactory.create(profile.group, profile.name, profile.x, profile.y);
				Game.MapGrid.add(profile.group, body, mapGridCoords.x, mapGridCoords.y, true);
				// ????? // Game.MapGrid.add('terrain', body, mapGridCoords.x, mapGridCoords.y);
				break;
			case 'wt':
				body = ActorFactory.create('neutral', nameArr, profile.x, profile.y);
				break;
			default:
				break;
		}

		if( body ) {
			Game.World.add(body);
		}
	};
};
