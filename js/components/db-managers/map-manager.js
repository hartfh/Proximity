module.exports = function() {
	//const _CHUNK_SIZE	= 25;	// tiles (was 40)
	const _CHUNK_SIZE	= Constants.MAP_BLOCK_SIZE;
	const _SAVE_PERIOD	= 20;	// seconds

	var _self		= {};
	var _saving	= false;
	var _chunks, _db, _map;

	function _initChunks() {
		_chunks = new Grid(Constants.MAP_BLOCK_WIDTH * Constants.MAP_BLOCK_SIZE / _CHUNK_SIZE, Constants.MAP_BLOCK_HEIGHT * Constants.MAP_BLOCK_SIZE / _CHUNK_SIZE, {data: false, scratch: false});
	}

	function _resetChunks() {
		_chunks.eachPoint(function(point, x, y) {
			point = 0;
		});
	};

	function _clearData() {
		_db	= null;
		_map	= null;
	};

	_self.accessMap = function(slotID) {
		_clearData();
		_initChunks();

		var name = DB_PATH + slotID + '/map';

		_db = new Datastore({filename: name, autoload: true});

		return _self;
	};

	_self.loadMap = function(callback, callbackArgs) {
		if( !_db ) {
			return false;
		}

		_map = MapFactory.createV7('blank');

		_rollingLoad(callback, callbackArgs);

		return _self;
	};

	_self.createMap = function(callback, callbackArgs) {
		//_map = MapFactory.createV4();
		_map = MapFactory.createV7();

		_saveNewMap(callback, callbackArgs);
	};

	_self.getTiles = function(tiles = []) {
		let tileData = [];

		for(var tile of tiles) {
			let point = _map.getPoint(tile.x, tile.y);

			tileData.push(point);
		}

		return tileData;
	};

	_self.getProfiles = function(tiles = [], layer = 0) {
		var profiles = [];

		for(var tile of tiles) {
			var point			= _map.getPoint(tile.x, tile.y);
			var tileProfiles	= [];

			switch(layer) {
				case 1:
					tileProfiles = point.p1;
					break;
				case 0:
				default:
					tileProfiles = [...point.c, ...point.t, ...point.d, ...point.o];
					break;
			}

			for(var profile of tileProfiles) {
				profiles.push(profile);
			}

			// Clear out point's character data if any exists
			if( point.c.length > 0 ) {
				point.c = [];

				_map.setPoint(tile.x, tile.y, point);
			}
		}

		return profiles;
	};

	_self.setProfiles = function(profiles = []) {
		var tileGroups = _sortProfilesIntoGroups(profiles);

		for(var i in tileGroups) {
			var tileGroup	= tileGroups[i];
			var pointData	= _map.getPoint(tileGroup.x, tileGroup.y);
			var chunk		= _convertTileToChunk(tileGroup.x, tileGroup.y);

			pointData.c = tileGroup.contents;

			_map.setPoint(tileGroup.x, tileGroup.y, pointData);

			_setChunkAsDirty(chunk.x, chunk.y);
		}
	};

	function _sortProfilesIntoGroups(profiles = []) {
		var tileGroups = {};

		for(var profile of profiles) {
			var tileX = Math.floor(profile.x / Constants.TERRAIN_TILE_SIZE);
			var tileY = Math.floor(profile.y / Constants.TERRAIN_TILE_SIZE);
			var key	= tileX + ',' + tileY;

			if( !tileGroups.hasOwnProperty(key) ) {
				tileGroups[key] = {
					x:		tileX,
					y:		tileY,
					contents:	[]
				}
			}

			tileGroups[key].contents.push(profile);
		}

		return tileGroups;
	}

	_self.enableSaving = function() {
		_toggleSaving(true);
	};

	_self.disableSaving = function() {
		_toggleSaving(false);
	};

	function _toggleSaving(status) {
		status = Boolean(status);

		// Enable
		if( status ) {
			if( !_saving ) {
				_saving = setInterval(function() {
					_rollingSave();
				}, _SAVE_PERIOD * 1000);
			}
		}

		// Disable
		if( !status ) {
			if( _saving ) {
				clearInterval(_saving);
				_saving = false;
			}
		}
	}

	// Save entire map to file
	function _saveNewMap(callback, callbackArgs) {
		var saveShell = [];

		_chunks.eachPoint(function(point, x, y) {
			_chunks.setPoint(x, y, 1); // set chunks to dirty so they'll be saved
			saveShell.push({x: x, y: y, contents: {}}); // setup initial save data
		});

		_db.insert(saveShell, function(err, newDoc) {
			_rollingSave(true, function() {
				callback(callbackArgs);
			});
		});
	};

	function _rollingLoad(callback = function(){}, callbackArgs = {}) {
		log('doing rolling load');

		var chunks = [];

		_chunks.eachPoint(function(point, x, y) {
			chunks.push({x: x, y: y});
		});

		// Recursive loading of chunks
		(function(index) {
			var self = arguments.callee;

			if( index < chunks.length ) {
				log('loading...')
				var chunk = chunks[index];

				_loadChunk(chunk.x, chunk.y, function() {
					index++;

					self(index);
				});
			} else {
				log('map fully loaded from file');
				callbackArgs.status = 'map loaded';

				callback(callbackArgs);
			}
		}(0));
	};

	function _rollingSave(compact = true, callback = function(){}) {
		log('doing rolling save');

		var chunks = [];

		// Add all dirty map chunks to array
		_chunks.eachPoint(function(point, x, y) {
			if( point ) {
				chunks.push({x: x, y: y});
			}
		});

		var save = function(index) {
			if( index < chunks.length ) {
				log('saving...');
				var chunk = chunks[index];

				_saveChunk(chunk.x, chunk.y, function() {
					index++;

					save(index);
				});
			} else {
				// Unless otherwise specified, compact the file (reduces size by up to 50% after a complete re-save)
				if( compact ) {
					_db.on('compaction.done', function() {
						callback();
					});

					_db.persistence.compactDatafile();
				} else {
					callback();
				}
			}
		};

		save(0);
	};

	function _exportChunk(x, y) {
		var saveable = [];
		var pointOne = {
			x:	x * _CHUNK_SIZE,
			y:	y * _CHUNK_SIZE
		};
		var pointTwo = {
			x:	x * _CHUNK_SIZE + _CHUNK_SIZE - 1,
			y:	y * _CHUNK_SIZE + _CHUNK_SIZE - 1
		};

		var chunkPoints = _map.getRectangle(pointOne, pointTwo);

		_map.withPoints(chunkPoints, function(point, x, y) {
			if( !point ) {
				log('exception!')
				log(x);
				log(y);
			}
			point.x = x;
			point.y = y;
			saveable.push(point);
		});

		log('have saveable')

		return saveable;
	};

	function _loadChunk(x, y, callback) {
		_db.findOne({$and: [{x: x}, {y: y}]}, function(err, doc) {
			var contents		= doc.contents;
			var chunkOffset	= {x: doc.x * _CHUNK_SIZE, y: doc.y * _CHUNK_SIZE};

			for(var l = 0, chunkLength = contents.length; l < chunkLength; l++) {
				var tile = contents[l];

				var actors = {
					t:	tile.t,
					c:	tile.c,
					d:	tile.d,
					o:	tile.o,
				};

				_map.setPoint(tile.x, tile.y, actors);
			}

			doc = null; // free up memory

			if( callback ) {
				callback();
			}
		});
	};

	function _saveChunk(x, y, callback) {
		log('saving chunk');
		var saveable = _exportChunk(x, y);

		var query = {$and: [{x: x}, {y: y}]};

		_db.update(query, {$set: {contents: saveable}}, {}, function(err, numReplaced) {
			_setChunkAsClean(x, y);

			if( callback ) {
				callback();
			}
		});
	};

	function _setChunkAsClean(x, y) {
		_chunks.setPoint(x, y, 0);
	};

	function _setChunkAsDirty(x, y) {
		_chunks.setPoint(x, y, 1);
	};

	function _convertTileToChunk(x, y) {
		var chunk = {
			x:	Math.floor(x / _CHUNK_SIZE),
			y:	Math.floor(y / _CHUNK_SIZE)
		};

		return chunk;
	};

	return _self;
}();
