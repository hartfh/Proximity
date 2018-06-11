var Game = Game || {};

Game.map = function() {
	var _self			= {};
	var _REGION_SIZE	= 16; // TODO: change to 10? Will render 3x3 grid of regions around player. Each map section (5x5 sections?) would have ~100 regions
						// Unsure if ALL map data should be stored as one file, or chunked into one file per section.
	var _REGION_BUFFER	= 1;
	var _config		= Game.constants.config;
	//var _currentRegion	= {x: 0, y: 0};
	var _currentRegion	= {x: false, y: false};
	//var _regions		= new Grid(_REGION_BUFFER * 2 + 1, _REGION_BUFFER * 2 + 1, false);
	var _regions		= new Grid(_config.MAP_WIDTH / _REGION_SIZE, _config.MAP_WIDTH / _REGION_SIZE);
	var _mapGrid;		// Holds full terrain data for the map

	var _playerX = 4; // temp
	var _playerY = 4; // temp

	/*
	var XXX = {};

	XXX.getRegion = async function(coords) {

	};

	XXX.generateRegion = function(regionData) {

	};

	XXX.getRegion(coords).then(function(regionData) {
		XXX.generateRegion(regionData);
	});
	*/


	/**
	 * Updates _currentRegion data and checks _regions to see if any should be generated/ungenerated.
	 *
	 * @method	updateRegionCoordinates
	 * @public
	 * @param		{number}	playerX		Player body X position
	 * @param		{number}	playerY		Player body Y position
	 */
	_self.updateRegionCoordinates = function(playerX, playerY) {
		var newRegionX = Math.floor(playerX / (_REGION_SIZE * _config.TERRAIN_TILE_SIZE) );
		var newRegionY = Math.floor(playerY / (_REGION_SIZE * _config.TERRAIN_TILE_SIZE) );

		_playerX = Math.floor(playerX / _config.TERRAIN_TILE_SIZE ); // temp
		_playerY = Math.floor(playerY / _config.TERRAIN_TILE_SIZE ); // temp

		// Player region has changed, so recheck each region
		if( newRegionX != _currentRegion.x || newRegionY != _currentRegion.y ) {
			var regions	= []; // regions to add
			var unregions	= []; // regions to remove

			// Check each point to see if it falls inside or outside the region buffer
			_regions.eachPoint(function(point, x, y) {
				var xDiff = Math.abs(x - newRegionX);
				var yDiff = Math.abs(y - newRegionY);

				if( xDiff > _REGION_BUFFER || yDiff > _REGION_BUFFER ) {
					// Point is set but outside the region buffer. Should be ungenerated
					if( point ) {
						unregions.push({x: x, y: y});
					}
				} else {
					// Point is unset but inside the region buffer. Should be generated
					if( !point ) {
						regions.push({x: x, y: y});
					}
				}
			});

			// Add/remove regions as delayed/spaced callbacks, to reduce CPU load
			var delay = 250;

			for(var i in regions) {
				var region = regions[i];

				setTimeout(function(x, y) {
					_generateRegion(x, y);
					_regions.setPoint(x, y, 1);
				}(region.x, region.y), i * delay);
			}

			for(var i in unregions) {
				var unregion = unregions[i];

				setTimeout(function(x, y) {
					_ungenerateRegion(x, y);
					_regions.setPoint(x, y, 0);
				}(unregion.x, unregion.y), i * delay);
			}

			// Update current region coordinates with latest data
			_currentRegion.x = newRegionX;
			_currentRegion.y = newRegionY;
		}
	};

	/**
	 * Creates all terrain actors/bodies within a region.
	 *
	 * @method	_generateRegion
	 * @private
	 * @param		{integer}		regionX		Region X-coordinate
	 * @param		{integer}		regionY		Region Y-coordinate
	 */
	var _generateRegion = function(regionX, regionY) {
		var mapMinX = regionX * _REGION_SIZE;
		var mapMinY = regionY * _REGION_SIZE;
		var mapMaxX = (regionX + 1) * _REGION_SIZE - 1;
		var mapMaxY = (regionY + 1) * _REGION_SIZE - 1;

		var minBound = {
			x:	mapMinX,
			y:	mapMinY
		};
		var maxBound = {
			x:	mapMaxX,
			y:	mapMaxY
		};

		_mapGrid.eachPointWithin(minBound, maxBound, function(point, x, y) {
			var metapoint	= _mapGrid.getMetaPoint(x, y);
			var xPos		= _config.TERRAIN_TILE_SIZE * x;
			var yPos		= _config.TERRAIN_TILE_SIZE * y;
			var type		= metapoint.type; // to be removed
			var rotations	= metapoint.rotations;
			var groups	= metapoint.actors;
			var index		= 0;
			var delay		= 25;
			// Track all changes to actor positions in a regional snapshot, and periodically save that snapshot into the map file
			// This can cover terrain destruction, if implemented.

			for(var actorType in groups) {
				////////////////////////////////
				continue; // disabled for now //
				////////////////////////////////

				var actors = groups[actorType];

				for(var actorName of actors) {
					switch( actorType ) {
						case 'doodads':
							_self.placeDoodad(actorName, type, rotations, xPos, yPos);
							break;
						case 'enemies':
							_self.placeEnemy(actorName, xPos, yPos);
							break;
						case 'friendlies':
							_self.placeFriendly(actorName, xPos, yPos);
							break;
						case 'terrain':
							_self.placeTerrain(actorName, type, rotations, xPos, yPos);
							break;
						default:
							break;
					}
				}
			}

			if( !Game.utilities.isEmptyTileType(type) ) {
				// Add terrain as delayed/spaced callbacks, to reduce CPU load
				setTimeout(function(type, rotations, xPos, yPos) {
					//_self.getTerrain(type, rotations, xPos, yPos);


					//_self.getDoodad(type, rotations, xPos, yPos);
				}(type, rotations, xPos, yPos), index * delay);

				index++
			}
		});

		var bounds = {
			min:	{
				x:	mapMinX * _config.TERRAIN_TILE_SIZE,
				y:	mapMinY * _config.TERRAIN_TILE_SIZE
			},
			max:	{
				x:	mapMaxX * _config.TERRAIN_TILE_SIZE,
				y:	mapMaxY * _config.TERRAIN_TILE_SIZE
			}
		};

		var bodiesQuery = Matter.Query.region(Matter.Composite.allBodies(Game.engine.world), bounds);

		// Wake up all non-terrain/doodad actors within the region
		for(var body of bodiesQuery) {
			var actor = body.actor;

			if( actor ) {
				var type = actor.getType();

				if( type != 'terrain' && type != 'doodad' ) {
					actor.wake();
				}
			}
		}
	};


	/**
	 * Removes all terrain bodies/actors from a region without triggering actor death events.
	 *
	 * @method	_ungenerateRegion
	 * @private
	 * @param		{integer}		regionX	Region grid X-coordinate
	 * @param		{integer}		regionY	Region grid Y-coordinate
	 */
	var _ungenerateRegion = function(regionX, regionY) {
		var bounds = {
			min:	{
				x:	regionX * _REGION_SIZE * _config.TERRAIN_TILE_SIZE,
				y:	regionY * _REGION_SIZE * _config.TERRAIN_TILE_SIZE
			},
			max:	{
				x:	( (regionX + 1) * _REGION_SIZE - 1 ) * _config.TERRAIN_TILE_SIZE,
				y:	( (regionY + 1) * _REGION_SIZE - 1 ) * _config.TERRAIN_TILE_SIZE
			}
		};

		// TODO: possibly save region to map file before ungeneration?
		// Consider whether to put actors to sleep or totally destroy them
		// Also need to update regions that characters left, not just ones that they've moved into or within. Otherwise wind up with duplicate characters.
		// Might need some sort of rolling query that hits all regions??
		// Query all bodies, Check their positions, convert positions into map coordinates. Then recreate grid metavalues and insert into file.
		// Might present difficulties if map data is serialized.

		var bodiesQuery = Matter.Query.region(Matter.Composite.allBodies(Game.engine.world), bounds);

		for(var body of bodiesQuery) {
			var actor = body.actor;

			if( actor ) {
				// NOTE: currently this also removes items from existence. Might be good since this way items can't build up over time, although
				// this could be remedied by giving them very long expiration times.
				// Although could probably easily adjust to skip type = "item".
				actor.finishDestructing();

				/*
				if( actor.getType() == 'terrain' ) {
					actor.finishDestructing();
				} else {
					actor.sleep();
				}
				*/
			}
		}
	};

	_self.placeDoodad = function(name, type, rotations) {
		var actorName	= name + '-' + type + '-' + rotations;

		Game.ActorFactory.create('neutral', ['doodads', actorName], xPos, yPos, {});
	};

	_self.placeEnemy = function(name, xPos, yPos) {
		Game.TroupeFactory.create('enemy', name, xPos, yPos);
	};

	_self.placeFriendly = function(name, xPos, yPos) {
		Game.TroupeFactory.create('friendly', name, xPos, yPos);
	};

	_self.placeTerrain = function(name, type, rotations) {
		var actorName	= name + '-' + type + '-' + rotations;

		Game.ActorFactory.create('neutral', ['terrain', actorName], xPos, yPos, {});
	};

	_self.generate2 = function() {
		// Base map with chamber
		_mapGrid = new Grid(_config.MAP_WIDTH, _config.MAP_HEIGHT);
		_mapGrid.seedChamber();

		// Upgrowth and trees
		_upgrowth = new Grid(_config.MAP_WIDTH, _config.MAP_HEIGHT);
		_upgrowth.absorbGrid(_mapGrid);
		_upgrowth.seedLinearGrowth('north', 2, 6);
		_upgrowth.subtractGrid(_mapGrid);

		// Recursive branches
		_branches = new Grid(_config.MAP_WIDTH, _config.MAP_HEIGHT);
		_branches.seedBranches().setHexValues().growPoints(false, 16);

		// Flooded area
		_liquid = new Grid(_config.MAP_WIDTH, _config.MAP_HEIGHT);
		_liquid.seedLiquid(60);
		_liquid.subtractGrid(_mapGrid).setHexValues();

		// Vines
		_vines = _mapGrid.clone();
		_vines.seedHangingGrowth();
		var roughBlob = _mapGrid.clone();
		roughBlob.invert().fill(1).setHexValues().expandPoints(true, 6).invert();
		_vines.subtractGrid(roughBlob);


		// Thin Film (e.g. spikes)
		var boundsMin = {x: 30, y: 30};
		var boundsMax = {x: 80, y: 80};
		_thinFilmGrid = new Grid(_config.MAP_WIDTH, _config.MAP_HEIGHT);
		_thinFilmGrid.absorbGrid(_mapGrid).expandPoints().growPoints().subtractGrid(_mapGrid);
		var rectangle = _thinFilmGrid.getRectangle(boundsMin, boundsMax);
		_thinFilmGrid.eachPoint(function(point, x, y) {
			if( point ) {
				// unset any point outside of bounding region
				if( !Game.utilities.pointIntersectsRegion({x: x, y: y}, {x: 30, y: 30}, {x: 80, y: 80}) ) {
					_thinFilmGrid.setPoint(x, y, 0);
				}
				/*
				// Unset any coordinate not within list of rectangle points
				// This approach can be used for non-rectangular bounding shapes
				if( !Game.utilities.pointsHavePoint(rectangle, {x: x, y: y}) ) {
					_thinFilmGrid.setPoint(x, y, 0);
				}
				*/
			}
		});
	};

	// TEMP
	var _upgrowth;
	var _branches;
	var _liquid;
	var _thinFilmGrid;
	var _vines;

	var _windingPaths = new Grid(126, 126);
	_windingPaths.seedWindingPaths().setHexValues();

	// Ruined Rooms
	//var _linearLattice = new Grid(120, 120);
	//_linearLattice.seedRectangularLattice(7, 22, 9).invert().setHexValues().erodePoints(43).growPoints(false, 35).growPoints(false, 25).fill(6);

	// Ruined Rooms 2 (better)
	var _linearLattice = new Grid(120, 120);
	_linearLattice.seedRectangularLattice(7, 19, 1, 4, 8).setHexValues().verticallyExtendEndPoints().depopulate(25).setHexValues().growPoints(false, 35).growPoints(false, 25).winnow(4).fill(7).winnow(2).winnow(1);


	// Rough Horizontal Platforms
	//var _linearLattice = new Grid(120, 120);
	//_linearLattice.seedRectangularLattice(6, 28, 2, 4, 7).setHexValues().erodePoints(20).growPoints(false, 7).growPoints(false, 50).winnow(4).fill();

	var _tessellation = new Grid(50, 50);
	_tessellation.seedTessellation();


	_self.tempRenderMap = function(bufferC) {
		var cellSize = 2;
		var startPoint = {x: 100, y: 10};

		_mapGrid.eachPoint(function(point, x, y) {
			if( point ) {
				bufferC.fillStyle = '#cccccc';
			} else {
				bufferC.fillStyle = '#303030';
			}

			bufferC.fillRect(x * cellSize + startPoint.x, y * cellSize + startPoint.y, cellSize, cellSize);
		});

		/*
		bufferC.fillStyle = '#cc3300';
		_upgrowth.eachPoint(function(point, x, y) {
			if( point ) {
				bufferC.fillRect(x * cellSize + startPoint.x, y * cellSize + startPoint.y, cellSize, cellSize);
			}
		});
		*/

		bufferC.fillStyle = '#00ccff';
		_liquid.eachPoint(function(point, x, y) {
			if( point ) {
				bufferC.fillRect(x * cellSize + startPoint.x, y * cellSize + startPoint.y, cellSize, cellSize);
			}
		});


		//bufferC.fillStyle = '#44ffaa';

		/*
		bufferC.fillStyle = '#dd4400';
		_windingPaths.eachPoint(function(point, x, y) {
			if( point ) {
				bufferC.fillRect(x * cellSize + startPoint.x, y * cellSize + startPoint.y, cellSize, cellSize);
			}
		});
		*/

		/*

		*/

		/*
		bufferC.fillStyle = '#229966';
		_vines.eachPoint(function(point, x, y) {
			if( point ) {
				bufferC.fillRect(x * cellSize + startPoint.x, y * cellSize + startPoint.y, cellSize, cellSize);
			}
		});

		_linearLattice.eachPoint(function(point, x, y) {
			bufferC.fillStyle = '#303030';
			bufferC.fillRect(x * cellSize + startPoint.x, y * cellSize + startPoint.y, cellSize, cellSize);

			if( point ) {
				bufferC.fillStyle = '#f0f0f0';
				bufferC.fillRect(x * cellSize + startPoint.x, y * cellSize + startPoint.y, cellSize, cellSize);
			}
		});

		bufferC.fillStyle = '#ff5566';
		_branches.eachPoint(function(point, x, y) {
			if( point ) {
				bufferC.fillRect(x * cellSize + startPoint.x, y * cellSize + startPoint.y, cellSize, cellSize);
			}
		});
		*/

		bufferC.fillStyle = '#dd3311';
		_thinFilmGrid.eachPoint(function(point, x, y) {
			if( point ) {
				bufferC.fillRect(x * cellSize + startPoint.x, y * cellSize + startPoint.y, cellSize, cellSize);
			}
		});



		/*
		var colors = [];
		_tessellation.eachPoint(function(point, x, y) {
			return; // KILL SWITCH

			bufferC.fillStyle = '#55aa88';
			bufferC.fillRect(x * cellSize + startPoint.x, y * cellSize + startPoint.y, cellSize, cellSize);

			if( point ) {
				if( !colors[point] ) {
					var randColor = '#';

					for(var c = 0; c < 6; c++) {
						var piece = Math.floor( Math.random() * 10 );

						randColor += piece;
					}

					colors[point] = randColor;
				}

				bufferC.fillStyle = colors[point];

				//bufferC.fillStyle = '#cc4400';
				bufferC.fillRect(x * cellSize + startPoint.x, y * cellSize + startPoint.y, cellSize, cellSize);
			}
		});
		*/

		bufferC.fillStyle = '#ffaa00';
		bufferC.fillRect(_playerX * cellSize + startPoint.x, _playerY * cellSize + startPoint.y, cellSize, cellSize);
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.generate = function() {
		var emptyTypes = ['empty', 'shore', 'riverbend', 'channel', 'cove', 'lake'];

		_layoutGrid	= new Grid(_config.GRID_SIZE, _config.GRID_SIZE, {metaInfo: {type: '', rotations: 0, width: 1, height: 1}});
		_mapGrid		= new Grid(_config.GRID_SIZE * _config.SUBGRID_SIZE, _config.GRID_SIZE * _config.SUBGRID_SIZE, {metaInfo: {type: '', rotations: 0, width: 1, height: 1}});

		_layoutGrid.seedRandom(60).winnow(3).winnow(1).setHexValues();

		_layoutGrid.eachPoint(function(point, x, y) {
			var bigXCoord = (x + 1) * _config.GRID_TILE_SIZE;
			var bigYCoord = (y + 1) * _config.GRID_TILE_SIZE;

			if( point >= 256 ) {
				var typeData = _layoutGrid.hexToType(point);

				if( emptyTypes.indexOf(typeData.type) == -1 ) {
					var subGrid = new Grid(_config.SUBGRID_SIZE, _config.SUBGRID_SIZE, {metaInfo: {type: '', rotations: 0, width: 1, height: 1}});

					subGrid.seedAsType(typeData.type, typeData.rotations);

					_mapGrid.absorbGrid(subGrid, {x: _config.SUBGRID_SIZE * x, y: _config.SUBGRID_SIZE * y});
				}
			}
		});

		// Ring edge with solid tiles
		_mapGrid.eachEdgePoint(function(point, x, y) {
			_mapGrid.setPoint(x, y, 1);
		});

		// TODO: add some fuzziness to edge section. possibly more depth too somehow. could add a "depth" parameter to the eachEdge grid method

		_mapGrid.setHexValues().setMetaPointSizes();
		//_mapGrid.setHexValues();
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.placeBodies = function() {
		_placed = {
			characters:	0,
			doodads:		0,
			items:		0,
			players:		0
		};

		_mapGrid.eachMetaPoint(function(metapoint, x, y) {
			var xPos		= _config.TERRAIN_TILE_SIZE * x;
			var yPos		= _config.TERRAIN_TILE_SIZE * y;
			var bodies	= [];
			var type		= metapoint.type;
			var rotations	= metapoint.rotations;
			var width		= metapoint.width;
			var height	= metapoint.height;

			if( Game.utilities.isEmptyTileType(type) ) {
				// Place a doodad, enemy and/or item

				//var doodad	= _self.getDoodad(type, rotations);
				//var character	= _self.getCharacter(type, rotations);
				//var item		= _self.getPowerup();

				/*
				if( doodad ) {
					bodies.push(doodad);
				}
				if( character ) {
					bodies.push(character);
				}
				if( item ) {
					bodies.push(item);
				}
				*/
			} else {
				// Otherwise, place a piece of terrain
				if( width != 0 && height != 0 ) {
					bodies.push( _self.getTerrain(type, rotations, xPos, yPos, width, height) );
				}
			}

			// Place all bodies for this tile
			/*
			for(var body of bodies) {
				_self.placeBody(body);
			}
			*/
		});

		// place the player somewhere
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.getTerrain = function(tileType, tileRotations, xPos, yPos, width, height) {
		//var actorName	= Game.settings.tileset + '-' + tileType + '-' + tileRotations;
		var actorName	= 'lt' + '-' + tileType + '-' + tileRotations;
		var config	= {};

		if( width > 1 || height > 1 ) {
			config.width	= width;
			config.height	= height;
		}

		return Game.ActorFactory.create('neutral', ['doodads', actorName], xPos, yPos, config);
		//return Game.ActorFactory.create('neutral', ['terrain', actorName], xPos, yPos, config);
	};

	/*
	_self.getPowerup = function() {
		if( Math.random() > 0.985 ) {
			_placed.items++;

			var actorName = Game.utilities.getRandomObjectProperty( Game.data.actors.items.unique );

			return Game.ActorFactory.create('neutral', ['items', 'unique', actorName], xPos, yPos);
		}

		return false;
	};
	*/

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.getCharacter = function(tileType, tileRotations) {
		var characterType;

		if( Math.random() > 0.97 ) {
			_placed.characters++;

			if( tileType == 'empty' ) {
				characterType = 'floating';
			} else {
				characterType = 'stationary';
			}

			var actorName = Game.utilities.getRandomObjectProperty( Game.data.actors.characters[characterType] );

			return Game.ActorFactory.create('enemy', ['characters', characterType, actorName], xPos, yPos, {rotate: tileRotations * 90});
		}

		return false;
	};

	_self.getDoodad = function(tileType, tileRotations) {
		if( tileType == 'empty' ) {
			return false;
		}

		if( Math.random() > 0.97 ) {
			_placed.doodads++;

			var actorName = Game.utilities.getRandomObjectProperty( Game.actors.data.doodads );

			return Game.ActorFactory.create('neutral', ['doodads', actorName], xPos, yPos, {rotate: tileRotations * 90});
		}

		return false;
	};

	// TODO: eventually remove this in favor of placeBodies()
	_self.placeActors = function() {
		_mapGrid.eachMetaPoint(function(metapoint, x, y) {
			var xPos	= _config.TERRAIN_TILE_SIZE * x;
			var yPos	= _config.TERRAIN_TILE_SIZE * y;

			if( Game.utilities.isEmptyTileType(metapoint.type) ) {
				return;
			}

			var actorName = Game.settings.tileset + '-' + metapoint.type + '-' + metapoint.rotations;
			var box = Game.ActorFactory.create('neutral', ['terrain', actorName], xPos, yPos);

			//Matter.World.add(Game.engine.world, box);
		});
	};

	return _self;
}();
