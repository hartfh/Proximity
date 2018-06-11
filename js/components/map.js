module.exports = new function() {
	const _AREA_COORD_SIZE	= 3;
	const _PIXELS_PER_AREA_X	= Constants.AREA_TILE_SIZE_X * Constants.TERRAIN_TILE_SIZE;
	const _PIXELS_PER_AREA_Y	= Constants.AREA_TILE_SIZE_Y * Constants.TERRAIN_TILE_SIZE;
	const _MAP_AREAS_X		= Math.floor( Constants.MAP_BLOCK_WIDTH * Constants.MAP_BLOCK_SIZE / Constants.AREA_TILE_SIZE_X );
	const _MAP_AREAS_Y		= Math.floor( Constants.MAP_BLOCK_HEIGHT * Constants.MAP_BLOCK_SIZE / Constants.AREA_TILE_SIZE_Y );

	var _activeAreas, _activeParallaxAreas, _actorFreezing, _actorFreezers, _areaCoordinates, _hasMapConnection, _ranFastSpawn;
	var _self = this;

	function _init() {
		_self.reset();
	};

	_self.reset = function() {
		_activeAreas			= [];
		_activeParallaxAreas	= [];
		_actorFreezing			= false;
		_actorFreezers			= {n: false, e: false, s: false, w: false};
		_areaCoordinates		= {x: undefined, y: undefined};
		_hasMapConnection		= false;
		_ranFastSpawn			= false;

		// Load initial coordinates into _activeAreas
		for(var c = 0, max = Math.pow(_AREA_COORD_SIZE, 2); c < max; c++) {
			_activeAreas.push({x: false, y: false});
			_activeParallaxAreas.push({x: false, y: false});
		}
	};

	_self.setMapConnection = function(status) {
		_hasMapConnection = Boolean(status);
	};

	function _updateActiveCoordinates(position = false) {
		if( !position ) {
			// clear all active areas?
			return;
		}

		var newAreaPoint = {
			x:	Math.floor( position.x / _PIXELS_PER_AREA_X ),
			y:	Math.floor( position.y / _PIXELS_PER_AREA_Y )
		};

		if( newAreaPoint.x != _areaCoordinates.x || newAreaPoint.y != _areaCoordinates.y ) {
			_checkVicinity(newAreaPoint);
			_trackMapWithFreezers(newAreaPoint);

			//_checkParallaxVicinity(newAreaPoint, position);
		}
	};

	function _generateAreaMatrix(centerPoint) {
		var areaCoords	= [];
		var start		= -1; // possibly change to half of area_coord_size / 2 rounded up/down(?)
		var end		= start + _AREA_COORD_SIZE;

		for(var x = start; x < end; x++) {
			for(var y = start; y < end; y++) {
				areaCoords.push({
					x:	centerPoint.x + x,
					y:	centerPoint.y + y
				});
			}
		}

		return areaCoords;
	};

	function _checkParallaxVicinity(newAreaPoint, originalPoint) {
		var inverseParallax = 1 / (1 + Constants.PARALLAX_1);

		var positionOffset = {
			x:	originalPoint.x * Constants.PARALLAX_1,
			y:	originalPoint.y * Constants.PARALLAX_1
		};

		var parallaxPoint = {
			x:	originalPoint.x * inverseParallax,
			y:	originalPoint.y * inverseParallax
		};
		var parallaxAreaPoint = {
			x:	Math.floor( parallaxPoint.x / _PIXELS_PER_AREA_X ),
			y:	Math.floor( parallaxPoint.y / _PIXELS_PER_AREA_Y )
		};
		var newAreas = _generateAreaMatrix(parallaxAreaPoint);

		var createAreas	= [];
		var uncreateAreas	= [];

		if( !_hasMapConnection ) {
			return;
		}

		var combinedAreas = _combineAreas(_activeParallaxAreas, newAreas);

		for(var index in combinedAreas) {
			var area = combinedAreas[index];

			switch(area.value) {
				case 1:
					uncreateAreas.push({x: area.x, y: area.y});
					break;
				case 2:
					createAreas.push({x: area.x, y: area.y});
					break;
				case 3:
				default:
					break;
			}
		}

		_generateAreas(createAreas, 1);
		_ungenerateAreas(uncreateAreas, 1);

		_activeParallaxAreas = newAreas;
	}


	/**
	 * Combined two arrays of area coordinates into one with metadata about degree of overlap from source arrays.
	 *
	 * @method	_combineAreas
	 * @private
	 * @param		{array}	areasOne		Array of coordinate objects
	 * @param		{array}	areasTwo		Array of coordinate objects
	 * @return	{object}
	 */
	function _combineAreas(areasOne, areasTwo) {
		// Assign each area coordinate a value of 0. Add 1 if it exists in the old areas matrix, and
		// add 2 if it exists in the new areas matrix. A total value of 3 implies overlap, otherwise
		// a value of 1 or 2 signifies which matrix the point originated from.

		var coveredIndices; // used to avoid duplicate area keys
		var combinedAreas = {};

		coveredIndices = [];

		for(var area of areasOne) {
			var key = area.x + ',' + area.y;

			if( coveredIndices.indexOf(key) == -1 ) {
				if( !combinedAreas.hasOwnProperty(key) ) {
					combinedAreas[key] = {
						value:	0,
						x:		area.x,
						y:		area.y
					};
				}

				combinedAreas[key].value += 1;

				coveredIndices.push(key);
			}
		}

		coveredIndices = [];

		for(var area of areasTwo) {
			var key = area.x + ',' + area.y;

			if( coveredIndices.indexOf(key) == -1 ) {
				if( !combinedAreas.hasOwnProperty(key) ) {
					combinedAreas[key] = {
						value:	0,
						x:		area.x,
						y:		area.y
					};
				}

				combinedAreas[key].value += 2;

				coveredIndices.push(key);
			}
		}

		return combinedAreas;
	}

	function _checkVicinity(newAreaPoint) {
		// Calculate a new area matrix based on new area point
		var newAreas		= _generateAreaMatrix(newAreaPoint);
		var createAreas	= [];
		var uncreateAreas	= [];

		if( !_hasMapConnection ) {
			return;
		}

		var combinedAreas = _combineAreas(_activeAreas, newAreas);

		for(var index in combinedAreas) {
			var area = combinedAreas[index];

			switch(area.value) {
				case 1:
					uncreateAreas.push({x: area.x, y: area.y});
					break;
				case 2:
					createAreas.push({x: area.x, y: area.y});
					break;
				case 3:
				default:
					break;
			}
		}

		_ungenerateAreas(uncreateAreas);
		_generateAreas(createAreas);

		// Update current information with the latest data
		_activeAreas		= newAreas;
		_areaCoordinates	= newAreaPoint;
	};

	function _isValidArea(area) {
		if( area.x == undefined || area.y == undefined ) {
			return false;
		}
		if( area.x < 0 || area.y < 0 ) {
			return false;
		}
		if( area.x > _MAP_AREAS_X || area.y > _MAP_AREAS_Y ) {
			return false;
		}

		return true;
	};

	function _generateAreas(areas = [], layer = 0) {
		var fetchTiles = [];
		var validAreas = [];

		for(var area of areas) {
			if( _isValidArea(area) ) {
				validAreas.push({x: area.x, y: area.y});

				fetchTiles = [...fetchTiles, ..._getAreaTiles(area.x, area.y)];
			}
		}

		Game.TaskManager.createTask('get-profiles', {slotID: Game.State.slotID, tiles: fetchTiles, layer: layer}, function(response) {
			Game.Spawner.spawn(validAreas, response.profiles, !_ranFastSpawn);

			_ranFastSpawn = true;
		});
	};

	function _getAreaTiles(areaX, areaY) {
		let tiles = [];

		for(var x = areaX * Constants.AREA_TILE_SIZE_X, xMax = (areaX + 1) * Constants.AREA_TILE_SIZE_X; x < xMax; x++) {
			for(var y = areaY * Constants.AREA_TILE_SIZE_Y, yMax = (areaY + 1) * Constants.AREA_TILE_SIZE_Y; y < yMax; y++) {
				tiles.push({x: x, y: y});
			}
		}

		return tiles;
	}

	function _ungenerateAreas(areas = [], layer = 0) {
		var saveAreas = [];

		for(var area of areas) {
			if( _isValidArea(area) ) {
				saveAreas.push(area);
			}
		}

		var query = _queryAreas(saveAreas, layer);

		if( query.profiles.length > 0 ) {
			Game.Spawner.despawn(query.profiles);
			//Game.TaskManager.createTask('set-tiles', {profiles: query.profiles});
		}
		if( query.actors.length > 0 ) {
			Game.Throttler.despawn(query.actors);
		}

		for(var body of query.actorless) {
			Game.World.remove(body);
		}
	};

	function _queryAreas(areas = [], layer = 0) {
		var profiles	= [];
		var actors	= [];
		var actorless	= [];

		for(var area of areas) {
			query	= _queryArea(area, layer);
			profiles	= profiles.concat( query.profiles );
			actors	= actors.concat( query.actors );
			actorless	= actorless.concat( query.actorless );
		}

		return {
			profiles:		profiles,
			actors:		actors,
			actorless:	actorless
		};
	};

	function _queryArea(area, layer = 0) {
		// Calculate area boundaries
		var bounds = {
			min:	{
				x:	area.x * _PIXELS_PER_AREA_X,
				y:	area.y * _PIXELS_PER_AREA_Y
			},
			max:	{
				x:	(area.x + 1) * _PIXELS_PER_AREA_X - 1,
				y:	(area.y + 1) * _PIXELS_PER_AREA_Y - 1
			}
		};

		bounds.min.x += 1;
		bounds.min.y += 1;
		bounds.max.x -= 1;
		bounds.max.y -= 1;

		switch(layer) {
			case 0:
				break;
			case 1:
				if( Game.Tracker.hasObject() ) {
					var position = Game.Tracker.getPosition();
					var shift = {
						x:	position.x * Constants.PARALLAX_1,
						y:	position.y * Constants.PARALLAX_1
					};

					bounds.min.x += shift.x;
					bounds.min.y += shift.y;
					bounds.max.x += shift.x;
					bounds.max.y += shift.y;
				}
				break;
			default:
				break;
		}

		// Find all actors in the area
		var bodiesQuery	= Matter.Query.region(Game.World.all(), bounds);
		var saveProfiles	= [];
		var destructibles	= [];
		var actorless		= [];

		for(var body of bodiesQuery) {
			if( body.ignoresVicinity ) {
				continue;
			}

			var actor = body.actor;

			if( actor ) {
				if( actor.parallax == layer ) {
					if( actor.hasSaveProfile() && !actor.isPlayer() ) {
						saveProfiles.push( actor.getSaveProfile() );
					}
					if( !actor.isPlayer() ) {
						destructibles.push(actor);
					}
				}
			}

			// Catch anything that might normally have an actor but was intentionally spawned without one
			if( body.actorless ) {
				actorless.push(body);
			}
		}

		return {
			actors:		destructibles,
			profiles:		saveProfiles,
			actorless:	actorless
		};
	};

	_self.enableFreezers = function() {
		if( !_actorFreezing ) {
			var viewportPosition = Game.State.viewport.position;

			// Spawn sensor bodies
			_actorFreezers.s = ActorFactory.create('neutral', ['special', 'horz-viewport-sensor'], viewportPosition.x, viewportPosition.y);
			_actorFreezers.n = ActorFactory.create('neutral', ['special', 'horz-viewport-sensor'], viewportPosition.x, viewportPosition.y);
			_actorFreezers.e = ActorFactory.create('neutral', ['special', 'vert-viewport-sensor'], viewportPosition.x, viewportPosition.y);
			_actorFreezers.w = ActorFactory.create('neutral', ['special', 'vert-viewport-sensor'], viewportPosition.x, viewportPosition.y);
			Game.World.add(_actorFreezers.n);
			Game.World.add(_actorFreezers.e);
			Game.World.add(_actorFreezers.w);
			Game.World.add(_actorFreezers.s);

			_actorFreezing = true;
		}
	};

	_self.disableFreezers = function() {
		if( _actorFreezing ) {
			// Remove freezers from world
			for(var d in _actorFreezers) {
				var freezer = _actorFreezers[d];

				Game.World.remove(freezer);
			}

			_actorFreezers	= {n: false, e: false, s: false, w: false};
			_actorFreezing = false;
		}
	};

	function _trackMapWithFreezers(areaCoordinates) {
		var mapCenterPoint = {
			x: (areaCoordinates.x * _PIXELS_PER_AREA_X) + (_PIXELS_PER_AREA_X * 0.5),
			y: (areaCoordinates.y * _PIXELS_PER_AREA_Y) + (_PIXELS_PER_AREA_Y * 0.5)
		};

		var distanceX = _PIXELS_PER_AREA_X * 1.5 + 5;
		var distanceY = _PIXELS_PER_AREA_Y * 1.5 + 5;

		var offsets = {
			'n':	{x: 0, y: -distanceY},
			'e':	{x: distanceX, y: 0},
			's':	{x: 0, y:	distanceY},
			'w':	{x: -distanceX, y: 0}
		};

		var maxWidth	= Constants.MAP_BLOCK_WIDTH * Constants.MAP_BLOCK_SIZE * Constants.TERRAIN_TILE_SIZE;
		var maxHeight	= Constants.MAP_BLOCK_HEIGHT * Constants.MAP_BLOCK_SIZE * Constants.TERRAIN_TILE_SIZE;

		for(var direction in _actorFreezers) {
			if( _actorFreezers[direction] ) {
				var position = {
					x: mapCenterPoint.x + offsets[direction].x,
					y: mapCenterPoint.y + offsets[direction].y
				};

				if( position.x < -5 ) {
					position.x = -5;
				}
				if( position.y < -5 ) {
					position.y = -5;
				}
				if( position.x > maxWidth ) {
					position.x = maxWidth;
				}
				if( position.y > maxHeight ) {
					position.y = maxHeight;
				}

				Matter.Body.setPosition(_actorFreezers[direction], position);
			}
		}
	}

	_self.update = function(position) {
		_updateActiveCoordinates(position);
	};

	_self.query = function(args = {}, callback = function(){}) {
		let areaCoords	= [];
		let tileData	= [];
		let matches	= [];

		for(let y = 0; y < _MAP_AREAS_Y; y++) {
			for(let x = 0; x < _MAP_AREAS_X; x++) {
				areaCoords.push({x: x, y: y});
			}
		}

		getArea();

		let getArea = function(index = 0) {
			if( index < areaCoords.length ) {
				let areaCoord	= areaCoords[index];
				let fetchTiles	= _getAreaTiles(areaCoord.x, areaCoord.y);

				Game.TaskManager.createTask('get-tiles', {slotID: Game.State.slotID, tiles: fetchTiles}, function(response) {
					tileData = [...tileData, ...response.tiles];
					getArea(index + 1);
				});
			} else {
				resolveQuery();
				callback(matches);
			}
		}

		let resolveQuery = function() {
			tileData.forEach(function(tile) {
				let match = true;

				if( args.open ) {
					if( tile.c.length > 0 || tile.o.length > 0 || tile.t.length > 0 ) {
						match = false;
					}
				}

				if( match ) {
					matches.push({x: tile.x, y: tile.y});
				}
			});
		};
	};

	_init();
};
