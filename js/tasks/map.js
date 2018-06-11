module.exports = new function() {
	var _mapDocs, _resolveTask, _slotID;
	var _self = this;

	var _createMap = function() {
		var mapData = _generateMap();

		if( mapData ) {
			_insertMap(mapData);
		}
	};

	var _generateMap = function() {
		return MapFactory.create('testMap');
	};

	var _insertMap = function(mapData) {
		var xChunks = Math.ceil( Constants.MAP_TILE_WIDTH / Constants.MAP_CHUNK_SIZE );
		var yChunks = Math.ceil( Constants.MAP_TILE_HEIGHT / Constants.MAP_CHUNK_SIZE );

		_mapDocs = new Grid(xChunks, yChunks, {data: false});

		_mapDocs.eachPoint(function(point, x, y) {
			_mapDocs.setPoint(x, y, []);
		});

		mapData.eachPoint(function(pointData, x, y) {
			var targetChunkX = Math.floor( x / Constants.MAP_CHUNK_SIZE );
			var targetChunkY = Math.floor( y / Constants.MAP_CHUNK_SIZE );

			var mapDoc = _mapDocs.getPoint(targetChunkX, targetChunkY);

			mapDoc.push(pointData);
		});
		log('map data combined. inserting...');

		_insertMapChunk(0, 0);
	};

	// Sequentially insert map chunks, then fire _resolveTask upon completion
	var _insertMapChunk = function(x, y) {
		log('inserting chunk');
		var self	= arguments.callee;

		var name	= DB_PATH + _slotID + '/map-chunk-' + x + '-' + y;
		var db	= new Datastore({filename: name, autoload: true});
		var data	= _mapDocs.getPoint(x, y);

		var xChunks = Math.ceil( Constants.MAP_TILE_WIDTH / Constants.MAP_CHUNK_SIZE );
		var yChunks = Math.ceil( Constants.MAP_TILE_WIDTH / Constants.MAP_CHUNK_SIZE );

		db.insert( data, function(err, newDoc) {
			if( newDoc ) {
				x++;

				if( x >= xChunks ) {
					x = 0;
					y++;
				}
				if( y < yChunks ) {
					self(x, y);
				} else {
					_resolveTask('Map creation task finished');
				}
			}
		});
	};

	var _accessArea = function(area) {
		var chunk = _areaToChunk(area);

		return _accessChunk(chunk);
	};

	var _accessChunk = function(chunk) {
		// Connect to the correct chunk database file
		var name	= DB_PATH + _slotID + '/map-chunk-' + chunk.x + '-' + chunk.y;
		var db	= new Datastore({filename: name, autoload: true});

		return db;
	};

	var _areaToChunk = function(area) {
		var tiles = _convertAreaToTiles(area);

		// Isolate correct map chunk
		var chunk = {
			x:	Math.floor(tiles.start.x / Constants.MAP_CHUNK_SIZE),
			y:	Math.floor(tiles.start.y / Constants.MAP_CHUNK_SIZE)
		};

		return chunk;
	};

	var _convertAreaToTiles = function(area) {
		var xTileStart = area.x * Constants.AREA_TILE_SIZE;
		var yTileStart = area.y * Constants.AREA_TILE_SIZE;

		var tiles = {
			start:	{
				x:	xTileStart,
				y:	yTileStart
			},
			end:	{
				x:	xTileStart + 10,
				y:	yTileStart + 10
			}
		};

		return tiles;
	};

	// Sort area coordinates into an order that will require least number of database chunks to be accessed
	var _sortAreasByChunk = function(areas) {
		var sorted	= [];
		var buckets	= {};

		for(var area of areas) {
			var chunk	= _areaToChunk(area);
			var key	= chunk.x + '-' + chunk.y;

			if( !buckets.hasOwnProperty(key) ) {
				buckets[key] = [];
			}

			buckets[key].push(area);
		}

		for(var key in buckets) {
			var bucket = buckets[key];

			sorted = sorted.concat(bucket);
		}

		return sorted;
	};

	var _getAreas = function(areas) {
		areas = _sortAreasByChunk(areas);

		_getAreasInSeries(areas, 0);
	};

	var _getAreasInSeries = function(areas, index, lastChunk = {}, db = false, resolvePackage = []) {
		if( index < areas.length ) {
			var area	= areas[index];
			var chunk	= _areaToChunk(area);
			var tiles	= _convertAreaToTiles(area);

			// If this chunk matches up with the previous one, reuse the database connection
			if( chunk.x != lastChunk.x && chunk.y != lastChunk.y ) {
				db = _accessChunk(chunk);
			}

			// Prepare query
			var query = {
				$and:	[
					{
						x:	{
							$gte:	tiles.start.x
						}
					},
					{
						x:	{
							$lt:		tiles.end.x
						}
					},
					{
						y:	{
							$gte:	tiles.start.y
						}
					},
					{
						y:	{
							$lt:		tiles.end.y
						}
					}
				]
			};

			// Retrieve matching documents
			db.find(query, function(err, areaRows) {
				var rowData = _packageAreaRowData(areaRows);

				resolvePackage = resolvePackage.concat(rowData);

				index++;

				_getAreasInSeries(areas, index, chunk, db, resolvePackage);
			});
		} else {
			db = null;
			_resolveTask(resolvePackage);
		}
	};

	var _packageAreaRowData = function(rows) {
		var data = [];

		for(var row of rows) {
			for(var char of row.c) {
				data.push(char);
			}
			for(var terrain of row.t) {
				data.push(terrain);
			}
		}

		return data;
	};

	var _saveProfiles = function(profiles) {
		var profileGroups = _groupProfilesByTile(profiles);

		var sortedProfileGroups = _sortProfileGroupsByChunk(profileGroups);

		_saveProfilesInSeries(sortedProfileGroups, 0);
	};

	var _groupProfilesByTile = function(profiles = []) {
		// Group profiles by tile x- and y-values into buckets
		var groups = {};

		for(var profile of profiles) {
			var bucketX	= Math.floor( profile.x / Constants.AREA_TILE_SIZE );
			var bucketY	= Math.floor( profile.y / Constants.AREA_TILE_SIZE );
			var key		= bucketX + ',' + bucketY;

			if( !groups.hasOwnProperty(key) ) {
				groups[key] = {x: bucketX, y: bucketY, data: []};
			}

			groups[key].data.push(profile);
		}

		return groups;
	};

	var _saveProfilesInSeries = function(profiles, index, lastChunk = {}, db = false) {
		if( index < profiles.length ) {
			var profile	= profiles[index];
			var chunk		= _getTileChunk(profile);

			// If this chunk matches up with the previous one, reuse the database connection
			if( chunk.x != lastChunk.x && chunk.y != lastChunk.y ) {
				db = _accessChunk(chunk);
			}

			var x = Math.floor( profile.x );
			var y = Math.floor( profile.y );

			///////////////////////
			///////////////////////
			///////////////////////
			//return;
			///////////////////////
			///////////////////////
			///////////////////////

			// Update character data in each tile
			db.update({$and: [{x: x}, {y: y}]}, {c: profile.data}, function(err, numReplaced) {
				index++;

				_saveProfilesInSeries(profiles, index, chunk, db);
			});
		} else {
			db = null;
			_resolveTask('save test');
		}
	};

	var _getTileChunk = function(tile) {
		// Isolate correct map chunk
		var chunk = {
			x:	Math.floor(tile.x / Constants.MAP_CHUNK_SIZE ),
			y:	Math.floor(tile.y / Constants.MAP_CHUNK_SIZE )
		};

		return chunk;
	};

	var _sortProfileGroupsByChunk = function(profileGroups) {
		var sorted	= [];
		var buckets	= {};

		for(var i in profileGroups) {
			var profileGroup	= profileGroups[i];
			var chunk			= _getTileChunk(profileGroup);
			var key			= chunk.x + '-' + chunk.y;

			if( !buckets.hasOwnProperty(key) ) {
				buckets[key] = [];
			}

			buckets[key].push(profileGroup);
		}

		for(var key in buckets) {
			var bucket = buckets[key];

			sorted = sorted.concat(bucket);
		}

		return sorted;
	};

	_self.task = function(taskName, slotID = false, resolveTask, data = false) {
		var result;

		if( !slotID ) {
			return;
		}

		_slotID		= slotID;
		_resolveTask	= resolveTask;

		switch(taskName) {
			case 'createMap':
				_createMap();
				break;
			/*
			case 'clearMap':
				// clear out old map data?
				// fs delete folder?
				break;
			*/
			case 'getAreas':
				_getAreas(data);
				break;
			case 'saveProfiles':
				_saveProfiles(data);
				break;
			default:
				break;
		}
	};
};
