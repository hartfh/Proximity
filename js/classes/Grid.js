module.exports = function(width, height, config = {}) {
	/*
	 * The Grid class allows for creation of randomized two-dimensional arrays of values.
	 *
	 * @class		Grid
	 */
	var _self			= this;
	var _width		= width;
	var _height		= height;
	var _scratch		= [];
	var _points		= [];
	var _meta			= [];
	var _data			= [];
	var _hasMeta		= true;
	var _hasScratch	= true;
	var _hasData		= true;
	var _wrap			= false;
	var _pointFilter	= false;

	function _createBlankMeta() {
		return {
			edge:		false,
			inside:		false,
			hex:			0,
			neighbors:	{n: false, ne: false, e: false, se: false, s: false, sw: false, w: false, nw: false},
			numNeighbors:	0,
			rotations:	0,
			type:		'',
			variation:	0
		};
	}

	/**
	 * Perform basic initialization of arrays and seeding depending on configuration.
	 *
	 * @method	init
	 * @public
	 * @param		{integer}		percent	Percentage of grid to fill with "true" points
	 */
	_self.init = function(config) {
		_wrap		= Boolean( config.wrap );
		_hasMeta		= !( config.meta === false );
		_hasScratch	= !( config.scratch === false );
		_hasData		= !( config.data === false );

		// Setup _points and _scratch as two-dimensional arrays filled with 0's
		for(var y = 0; y < _height; y++) {
			let pointRow	= [];
			let scratchRow	= [];
			let metaRow	= [];
			let dataRow	= [];

			for(var x = 0; x < _width; x++) {
				pointRow.push(0);
				scratchRow.push(0);
				dataRow.push(0);
				metaRow.push( _createBlankMeta() );
			}

			_points.push(pointRow);

			if( _hasScratch ) {
				_scratch.push(scratchRow);
			}
			if( _hasMeta ) {
				_meta.push(metaRow);
			}
			if( _hasData ) {
				_data.push(dataRow);
			}
		}
	};

	// Converts a Grid's points into a string of 1's and 0's.
	_self.serialize = function() {
		var serialized = '';

		_self.eachPoint(function(point, x, y) {
			if( point ) {
				serialized += '1';
			} else {
				serialized += '0';
			}
		});

		return serialized;
	};

	_self.unserialize = function(serialized) {
		for(var y = 0; y < _height; y++) {
			for(var x = 0; x < _width; x++) {
				var index = (y * _width) + x;

				if( serialized[index] == '1' ) {
					_self.setPoint(x, y, 1);
				} else {
					_self.setPoint(x, y, 0);
				}
			}
		}

		return _self;
	};

	/**
	 * Getter function for _height and _width values.
	 *
	 * @method	getDimnensions
	 * @public
	 *
	 * @returns	{object}
	 */
	_self.getDimensions = function() {
		return {
			height:	_height,
			width:	_width
		};
	};

	/**
	 * Checks if a given set of coordinates fall within the grid's bounds. Does not take wrapping into account.
	 *
	 * @method	hasInternalPoint
	 * @public
	 * @param		{integer}		x
	 * @param		{integer}		y
	 * @return	{boolean}
	 */
	_self.hasInternalPoint = function(x, y) {
		if( x >= 0 && x < _width ) {
			if( y >= 0 && y < _height ) {
				return true;
			}
		}

		return false;
	};

	_self.empty = function() {
		_self.eachPoint(function(point, x, y) {
			_self.setPoint(x, y, 0);
			_self.setMetaPoint(x, y, {
				edge:		false,
				inside:		false,
				hex:			0,
				neighbors:	{n: false, ne: false, e: false, se: false, s: false, sw: false, w: false, nw: false},
				numNeighbors:	0,
				rotations:	0,
				type:		'',
				variation:	0
			});
		});

		return _self;
	};

	_self.addFilter = function(filter = function(point, x, y) { return point; }) {
		_pointFilter = filter;

		return _self;
	};

	_self.clearFilter = function() {
		_pointFilter = false;

		return _self;
	};

	_self.filterPoint = function(point, x, y) {
		if( _pointFilter ) {
			return _pointFilter(point, x, y);
		}

		return point;
	};

	/**
	 * Iterates over each item in _points and passes them to a callback function.
	 *
	 * @method	eachPoint
	 * @public
	 * @param		{function}	callback		A callback function
	 */
	_self.eachPoint = function(callback, clearFilter = true) {
		for(var y = 0; y < _height; y++) {
			for(var x = 0; x < _width; x++) {
				var point = _points[y][x];

				point = _self.filterPoint(point, x, y);

				if( callback(point, x, y, _self) ) {
					return;
				};
			}
		}

		if( clearFilter && _pointFilter ) {
			_pointFilter = false;
		}
	};

	_self.eachPointRandom = function(callback, clearFilter = true) {
		var randXIndices = [];
		var randYIndices = [];

		for(var x = 0; x < _width; x++) {
			randXIndices.push(x);
		}
		for(var y = 0; y < _height; y++) {
			randYIndices.push(y);
		}

		Utilities.shuffleArray(randXIndices);
		Utilities.shuffleArray(randYIndices);

		for(var x = 0; x < _width; x++) {
			for(var y = 0; y < _height; y++) {
				var xTrue = randXIndices[x];
				var yTrue = randYIndices[y];

				var point = _points[yTrue][xTrue];

				point = _self.filterPoint(point, x, y);

				if( callback(point, xTrue, yTrue, _self) ) {
					return;
				};
			}
		}

		if( clearFilter && _pointFilter ) {
			_pointFilter = false;
		}
	};

	/**
	 * Iterates over each item in _points in reverse order and passes them to a callback function.
	 *
	 * @method	eachPointReverse
	 * @public
	 * @param		{function}	callback		A callback function
	 */
	_self.eachPointReverse = function(callback, clearFilter = true) {
		for(var y = _height - 1; y >= 0; y--) {
			for(var x = _width - 1; x >= 0; x--) {
				var point = _points[y][x];

				point = _self.filterPoint(point, x, y);

				if( callback(point, x, y, _self) ) {
					return;
				};
			}
		}

		if( clearFilter && _pointFilter ) {
			_pointFilter = false;
		}
	};

	_self.getOrdinalNeighbors = function(x, y) {
		var points = [];
		var coords = [
			{x: 0, y: -1},
			{x: 1, y: 0},
			{x: 0, y: 1},
			{x: -1, y: 0},
		];

		for(var coord of coords) {
			points.push({
				x: x + coord.x,
				y: y + coord.y,
			});
		}

		return points;
	};

	_self.getDiagonalNeighbors = function(x, y) {
		var points = [];
		var coords = [
			{x: 1, y: -1},
			{x: 1, y: 1},
			{x: -1, y: 1},
			{x: -1, y: -1},
		];

		for(var coord of coords) {
			points.push({
				x: x + coord.x,
				y: y + coord.y,
			});
		}

		return points;
	};

	_self.getNeighbors = function(x, y) {
		var diagonal	= _self.getDiagonalNeighbors(x, y);
		var ordinal	= _self.getOrdinalNeighbors(x, y);

		// Returned order: [ne, se, sw, nw, n, e, s, w]
		return [...diagonal, ...ordinal];
	};

	/**
	 * Iterates over an array of supplied point coordinates and applies a callback to each.
	 *
	 * @method	withPoints
	 * @public
	 * @param		{array}		points		An array of point objects
	 * @param		{function}	callback		A callback function
	 */
	_self.withPoints = function(points = [], callback) {
		for(var coord of points) {
			var point = _self.getPoint(coord.x, coord.y);

			if( callback(point, coord.x, coord.y, _self) ) {
				return;
			}
		}
	};

	/**
	 * Iterates over each item in _points within a bounded region and passes them to a callback function.
	 *
	 * @method	eachPointWithin
	 * @public
	 * @param		{object}		minBound		First bounding point
	 * @param		{object}		maxBound		Second bounding point
	 * @param		{function}	callback		A callback function
	 */
	_self.eachPointWithin = function(minBound, maxBound, callback, clearFilter = true) {
		var bounds = _self.normalizeBounds({min: minBound, max: maxBound});

		for(var x = bounds.min.x; x <= bounds.max.x; x++) {
			for(var y = bounds.min.y; y <= bounds.max.y; y++) {
				var point = _points[y][x];

				point = _self.filterPoint(point, x, y);

				if( callback(point, x, y, _self) ) {
					return;
				}
			}
		}

		if( clearFilter && _pointFilter ) {
			_pointFilter = false;
		}
	};

	/**
	 * Iterates over each edge item in _points and passes them to a callback function.
	 *
	 * @method	eachEdgePoint
	 * @public
	 * @param		{function}	callback		A callback function
	 */
	_self.eachEdgePoint = function(callback, clearFilter = true) {
		// North edge
		for(var x = 0, y = 0; x < _width; x++) {
			var point = _points[y][x];

			point = _self.filterPoint(point, x, y);

			callback(point, x, y, _self);
		}

		// West edge
		for(var x = 0, y = 0; y < _height; y++) {
			var point = _points[y][x];

			point = _self.filterPoint(point, x, y);

			callback(point, x, y, _self);
		}

		// South edge
		for(var x = 0, y = _height - 1; x < _width; x++) {
			var point = _points[y][x];

			point = _self.filterPoint(point, x, y);

			callback(point, x, y, _self);
		}

		// West edge
		for(var x = _width - 1, y = 0; y < _height; y++) {
			var point = _points[y][x];

			point = _self.filterPoint(point, x, y);

			callback(point, x, y, _self);
		}

		if( clearFilter && _pointFilter ) {
			_pointFilter = false;
		}
	};

	/**
	 * Iterate through each item in _scratch and pass them to a callback function.
	 *
	 * @method	eachScratchPoint
	 * @public
	 * @param		{function}	callback		A callback function
	 */
	_self.eachScratchPoint = function(callback, clearFilter = true) {
		if( !_hasScratch ) {
			return;
		}

		for(var y = 0; y < _height; y++) {
			for(var x = 0; x < _width; x++) {
				var point = _scratch[y][x];

				//point = _self.filterPoint(point, x, y);

				if( callback(point, x, y, _self) ) {
					return;
				};
			}
		}

		if( clearFilter && _pointFilter ) {
			_pointFilter = false;
		}
	};

	/**
	 * Iterate through each item in _meta and pass them to a callback function.
	 *
	 * @method	eachScratchPoint
	 * @public
	 * @param		{function}	callback		A callback function
	 */
	_self.eachMetaPoint = function(callback, clearFilter = true) {
		if( !_hasMeta ) {
			return;
		}

		for(var y = 0; y < _height; y++) {
			for(var x = 0; x < _width; x++) {
				var point = _meta[y][x];

				point = _self.filterPoint(point, x, y);

				if( callback(point, x, y, _self) ) {
					return;
				};
			}
		}

		if( clearFilter && _pointFilter ) {
			_pointFilter = false;
		}
	};

	_self.eachMetaPointReverse = function(callback, clearFilter = true) {
		for(var y = _height - 1; y >= 0; y--) {
			for(var x = _width - 1; x >= 0; x--) {
				var point = _meta[y][x];

				point = _self.filterPoint(point, x, y);

				if( callback(point, x, y, _self) ) {
					return;
				};
			}
		}

		if( clearFilter && _pointFilter ) {
			_pointFilter = false;
		}
	};

	/**
	 * Iterate through each item in _data and pass them to a callback function.
	 *
	 * @method	eachDataPoint
	 * @public
	 * @param		{function}	callback		A callback function
	 */
	_self.eachDataPoint = function(callback, clearFilter = true) {
		if( !_hasData ) {
			return;
		}

		for(var y = 0; y < _height; y++) {
			for(var x = 0; x < _width; x++) {
				var point = _data[y][x];

				point = _self.filterPoint(point, x, y);

				if( callback(point, x, y, _self) ) {
					return;
				};
			}
		}

		if( clearFilter && _pointFilter ) {
			_pointFilter = false;
		}
	};

	_self.eachDataPointReverse = function(callback, clearFilter = true) {
		for(var y = _height - 1; y >= 0; y--) {
			for(var x = _width - 1; x >= 0; x--) {
				var point = _data[y][x];

				point = _self.filterPoint(point, x, y);

				if( callback(point, x, y, _self) ) {
					return;
				};
			}
		}

		if( clearFilter && _pointFilter ) {
			_pointFilter = false;
		}
	};

	/**
	 * Copy values from _points to _scratchPoints.
	 *
	 * @method	copyToScratch
	 * @public
	 */
	_self.copyToScratch = function() {
		_self.eachPoint(function(point, x, y) {
			_self.setScratchPoint(x, y, point);
		}, false);

		return _self;
	};

	/**
	 * Copy values from _scratchPoints to _points.
	 *
	 * @method	copyFromScratch
	 * @public
	 */
	_self.copyFromScratch = function() {
		_self.eachScratchPoint(function(point, x, y) {
			_self.setPoint(x, y, point);
		}, false);

		return _self;
	};

	/**
	 * Convert x- and y-coordinates into values that occur within the grid boundaries.
	 *
	 * @method	normalize
	 * @public
	 * @param		{integer}		x
	 * @param		{integer}		y
	 * @return	{object}
	 */
	_self.normalize = function(x, y) {
		if( typeof(x) != 'number' ) {
			throw new Error('Grid x-coordinate must be an integer');
		}
		if( typeof(y) != 'number' ) {
			throw new Error('Grid y-coordinate must be an integer');
		}

		var outOfBounds = false;

		// Offset each value by grid width/height until value is within grid boundaries.
		while( x < 0 ) {
			x += _width;
			outOfBounds = true;
		}
		while( x >= _width ) {
			x -= _width;
			outOfBounds = true;
		}
		while( y < 0 ) {
			y += _height;
			outOfBounds = true;
		}
		while( y >= _height ) {
			return false;

			y -= _height;
		}

		// Check if coordinate falls outside grid and _wrap has not been enabled
		if( outOfBounds && !_wrap  ) {
			return false;
		}

		return {x: x, y: y};
	};

	_self.normalizeBounds = function(bounds) {
		var normMinBounds = _self.normalize(bounds.min.x, bounds.min.y) || {x: 0, y: 0};
		var normMaxBounds = _self.normalize(bounds.max.x, bounds.max.y) || {x: _width - 1, y: _height - 1};

		return {
			min:	normMinBounds,
			max:	normMaxBounds
		};
	};

	_self.getPoints = function() {
		return _points;
	};

	_self.getMetaPoints = function() {
		return _meta;
	};

	_self.getDataPoints = function() {
		return _data;
	}

	/**
	 * Get value at coordinates (x, y) from _points.
	 *
	 * @method	getPoint
	 * @public
	 * @return	{integer}
	 */
	_self.getPoint = function(x, y, applyFilter = false) {
		var coords = _self.normalize(x, y);
		var point;

		if( coords ) {
			point = _points[coords.y][coords.x];

			if( applyFilter ) {
				point = _self.filterPoint(point, coords.x, coords.y);
			}
		}

		return point;
	};

	/**
	 * Get a random point. Optional min and max bound parameters.
	 *
	 * @method	getRandomPoint
	 * @public
	 * @param		{object}		minBound		Minimum normalized bounds
	 * @param		{object}		maxBound		Maximum normalized bounds
	 * @return	{object}					An object containing the x- and y-coordinates of the point, as well as its value
	 */
	_self.getRandomPoint = function(minBound = {x: 0, y: 0}, maxBound = {x: _width - 1, y: _height - 1}) {
		var minBound	= _self.normalize(minBound.x, minBound.y);
		var maxBound	= _self.normalize(maxBound.x, maxBound.y);
		var randX		= minBound.x + Math.floor( Math.random() * (maxBound.x - minBound.x) );
		var randY		= minBound.y + Math.floor( Math.random() * (maxBound.y - minBound.y) );
		var randPoint	= {
			x:		randX,
			y:		randY,
			value:	_self.getPoint(randX, randY),
		};

		return randPoint;
	};

	/**
	 * Get value at coordinates (x, y) from _scratch
	 *
	 * @method	getScratchPoint
	 * @public
	 * @return	{integer}
	 */
	_self.getScratchPoint = function(x, y) {
		if( !_hasScratch ) {
			return;
		}

		var coords = _self.normalize(x, y);

		if( coords ) {
			return _scratch[coords.y][coords.x];
		}

		return false;
	};

	/**
	 * Get metavalue at coordinates (x, y) from _meta
	 *
	 * @method	getMetaPoint
	 * @public
	 * @return	{object}
	 */
	_self.getMetaPoint = function(x, y, applyFilter = false) {
		if( !_hasMeta ) {
			return;
		}

		var coords = _self.normalize(x, y);

		if( coords ) {
			var meta = _meta[coords.y][coords.x];

			// NOTE: meta filters not yet implemented
			/*
			if( applyFilter ) {
				meta = _self.filterPoint(meta, coords.x, coords.y);
			}
			*/

			return meta;
		}

		return false;
	};

	/**
	 * Get value at coordinates (x, y) from _data
	 *
	 * @method	getDataPoint
	 * @public
	 * @return	{object}
	 */
	_self.getDataPoint = function(x, y) {
		if( !_hasData ) {
			return;
		}

		var coords = _self.normalize(x, y);

		if( coords ) {
			return _data[coords.y][coords.x];
		}

		return false;
	};

	_self.setPoint = function(x, y, value) {
		var normalized = _self.normalize(x, y);

		if( normalized ) {
			_points[normalized.y][normalized.x] = value;
		}
	};

	_self.setScratchPoint = function(x, y, value) {
		if( !_hasScratch ) {
			return;
		}

		var normalized = _self.normalize(x, y);

		if( normalized ) {
			_scratch[normalized.y][normalized.x] = value;
		}
	};

	_self.setMetaPoint = function(x, y, value) {
		if( !_hasMeta ) {
			return;
		}

		var normalized = _self.normalize(x, y);

		if( normalized ) {
			_meta[normalized.y][normalized.x] = value;
		}
	};

	_self.setDataPoint = function(x, y, value) {
		if( !_hasData ) {
			return;
		}

		var normalized = _self.normalize(x, y);

		if( normalized ) {
			_data[normalized.y][normalized.x] = value;
		}
	};

	/**
	 * Sets a value for a metaPoint property.
	 *
	 * @method	updateMetaProp
	 * @public
	 * @param		{integer}		x		X-coordinate
	 * @param		{integer}		y		Y-coordinate
	 * @param		{string}		prop		A metaPoint object property
	 * @param		{object}		value	Value to set
	 */
	_self.updateMetaProp = function(x, y, prop, value) {
		var normalized = _self.normalize(x, y);

		if( normalized ) {
			_meta[normalized.y][normalized.x][prop] = value;
		}
	};

	/**
	 * Adds a value into a metaPoint property array.
	 *
	 * @method	pushMetaProp
	 * @public
	 * @param		{integer}		x		X-coordinate
	 * @param		{integer}		y		Y-coordinate
	 * @param		{string}		prop		A metaPoint object property
	 * @param		{object}		value	Value to add to array
	 */
	_self.pushMetaProp = function(x, y, prop, value) {
		var normalized = _self.normalize(x, y);

		if( normalized ) {
			_meta[normalized.y][normalized.x][prop].push(value);
		}
	};

	_self.hexToType = function(hex, emptyTypes = false) {
		var north = east = south = west = false;
		var nw = ne = sw = se = false;
		var center	= false;
		var count		= 0;
		var corners	= 0;
		var edges		= 0;
		var rotations	= 0;
		var type		= 'empty';

		if( hex == 0 ) {
			return {type: type, rotations: rotations};
		}
		if( hex >= 256 ) {
			hex -= 256;
			center = true;
		}
		if( hex >= 128 ) {
			hex -= 128;
			ne = true;
			count++;
			corners++;
		}
		if( hex >= 64 ) {
			hex -= 64;
			se = true;
			count++;
			corners++;
		}
		if( hex >= 32 ) {
			hex -= 32;
			sw = true;
			count++;
			corners++;
		}
		if( hex >= 16 ) {
			hex -= 16;
			nw = true;
			count++;
			corners++;
		}
		if( hex >= 8 ) {
			hex -= 8;
			north = true;
			count++;
			edges++;
		}
		if( hex >= 4 ) {
			hex -= 4;
			east = true;
			count++;
			edges++;
		}
		if( hex >= 2 ) {
			hex -= 2;
			south = true;
			count++;
			edges++;
		}
		if( hex >= 1 ) {
			hex -= 1;
			west = true;
			count++;
			edges++;
		}

		if( !center ) {
			if( edges == 1 ) {
				type = 'shore';

				if( north ) {
					// no rotation
				} else if( east ) {
					rotations += 1;
				} else if( south ) {
					rotations += 2;
				} else if( west ) {
					rotations += 3;
				}
			} else if( edges == 2 ) {
				if( north && south || east && west ) {
					type = 'channel';

					if( north ) {
						// no rotations
					} else {
						rotations += 1;
					}
				} else {
					type = 'riverbend';

					if( west && north ) {
						// no rotations
					} else if( north && east ) {
						rotations += 1;
					} else if( east && south ) {
						rotations += 2;
					} else if( south && west ) {
						rotations += 3;
					}
				}
			} else if( edges == 3 ) {
				type = 'cove';

				if( !north ) {
					// no rotation
				} else if( !east ) {
					rotations += 1;
				} else if( !south ) {
					rotations += 2;
				} else if( !west ) {
					rotations += 3;
				}
			} else {
				type = 'lake';
			}

			return {type: type, rotations: rotations};
		}

		if( edges == 0 || corners == count ) {
			type = 'island';

			return {type: type, rotations: rotations};
		}

		if( edges == 1 ) {
			type = 'end';

			if( north ) {
				// no rotations
			} else if( east ) {
				rotations += 1;
			} else if( south ) {
				rotations += 2;
			} else if( west ) {
				rotations += 3;
			}
		} else if( edges == 2 ) {
			if( north && south || east && west ) {
				type = 'pipe';

				if( east ) {
					rotations += 1;
				}
			} else {
				type = 'elbow';

				if( north && west ) {
					// no rotations

					if( nw ) {
						type = 'corner';

						if( ne && sw ) {
							//type = 'diagonal';
						}
					}
				} else if( north && east ) {
					rotations += 1;

					if( ne ) {
						type = 'corner';

						if( nw && se ) {
							//type = 'diagonal';
						}
					}
				} else if( east && south ) {
					rotations += 2;

					if( se ) {
						type = 'corner';

						if( ne && sw ) {
							//type = 'diagonal';
						}
					}
				} else {
					rotations += 3;

					if( sw ) {
						type = 'corner';

						if( nw && se ) {
							//type = 'diagonal';
						}
					}
				}
			}
		} else if( edges == 3 ) {
			if( corners == 0 ) {
				type = 'tee';
			} else if( corners == 1 || corners == 2 || corners == 3 ) {
				type = 'tee';

				if( !south ) {
					if( nw ) {
						type = 'kayleft';
					}
					if( ne ) {
						type = 'kayright';
					}
					if( nw && ne ) {
						type = 'edge';
					}
				}
				if( !west ) {
					if( ne ) {
						type = 'kayleft';
					}
					if( se ) {
						type = 'kayright';
					}
					if( ne && se ) {
						type = 'edge';
					}
				}
				if( !north ) {
					if( se ) {
						type = 'kayleft';
					}
					if( sw ) {
						type = 'kayright';
					}
					if( se && sw ) {
						type = 'edge';
					}
				}
				if( !east ) {
					if( sw ) {
						type = 'kayleft';
					}
					if( nw ) {
						type = 'kayright';
					}
					if( sw && nw ) {
						type = 'edge';
					}
				}
			} else if( corners == 4 ) {
				type = 'edge';
			}

			if( !north ) {
				rotations += 2;
			} else if( !east ) {
				rotations += 3;
			} else if( !south ) {
				// no rotations
			} else if( !west ) {
				rotations += 1;
			}
		} else if( edges == 4 ) {
			if( corners == 0 ) {
				type = 'cross';
			} else if( corners == 1 ) {
				type = 'wye';

				if( ne ) {
					rotations += 1;
				} else if( se ) {
					rotations += 2;
				} else if( sw ) {
					rotations += 3;
				}
			} else if( corners == 2 ) {
				if( (nw && se) || (ne && sw) ) {
					type = 'eight';

					if( ne ) {
						rotations += 1;
					}
				} else {
					type = 'edgetee';

					if( nw && ne ) {
						// no rotations
					} else if( ne && se ) {
						rotations += 1;
					} else if( sw && se ) {
						rotations += 2;
					} else if( nw && sw ) {
						rotations += 3;
					}
				}
			} else if( corners == 3 ) {
				type = 'bend';

				if( !se ) {
					// no rotations
				} else if( !sw ) {
					rotations += 1;
				} else if( !nw ) {
					rotations += 2;
				} else {
					rotations += 3;
				}
			} else if( corners == 4 ) {
				type = 'inside';
			}
		}

		var finalMeta = {
			type:		type,
			rotations:	rotations,
		};

		return finalMeta;
	};

	/**
	 * Shifts all points by x and y amounts.
	 *
	 * @method	translate
	 * @public
	 *
	 * @param		{integer}		xOffset		Amount to shift along x-axis
	 * @param		{integer}		yOffset		Amount to shift along y-axis
	 * @return	{Grid}
	 */
	_self.translate = function(xOffset = 0, yOffset = 0) {
		_self.copyToScratch().empty().eachScratchPoint(function(scratchPoint, x, y) {
			if( scratchPoint ) {
				_self.setPoint(x + xOffset, y + yOffset, 1);
			}
		});

		return _self;
	};

	/**
	 * Mirrors the grid's points along a vertical axis.
	 *
	 * @method	flipHorizontally
	 * @public
	 */
	_self.flipHorizontally = function() {
		_self.copyToScratch();

		_self.eachScratchPoint(function(point, x, y) {
			var newX = _width - x - 1;

			_self.setPoint(newX, y, point);
		});

		return _self;
	};

	/**
	 * Mirrors the grid's points along a horizontal axis.
	 *
	 * @method	flipVertically
	 * @public
	 */
	_self.flipVertically = function() {
		_self.copyToScratch();

		_self.eachScratchPoint(function(point, x, y) {
			var newY = _height - y - 1;

			_self.setPoint(x, newY, point);
		});

		return _self;
	};

	_self.invert = function() {
		_self.copyToScratch();

		_self.eachScratchPoint(function(point, x, y) {
			var inverted = 0;

			if( !point ) {
				inverted = 1;
			}

			_self.setPoint(x, y, inverted);
		});

		return _self;
	};

	/**
	 * Rotate the entire grid 90 degrees clockwise.
	 *
	 * @method	rotate
	 * @public
	 */
	_self.rotate = function() {
		_self.copyToScratch();

		_self.eachScratchPoint(function(point, x, y) {
			var start	= {x: x, y: y};
			var end	= {x: 0, y: 0};
			var pivot	= {
				x: (_width + 1) / 2,
				y: (_height + 1) / 2
			};

			start.x += 1;
			start.y += 1;

			start.x -= pivot.x;
			start.y -= pivot.y;

			end.x = -1 * start.y;
			end.y = start.x

			end.x += pivot.x;
			end.y += pivot.y;

			end.x -= 1;
			end.y -= 1;

			_self.setPoint(end.x, end.y, point);
		});

		return _self;
	};

	_self.seedChamber = function() {
		var blobRadius = 50;
		var blobPoints = _self.getBlob({x: 60, y: 60}, blobRadius);
		//var digLength = Math.floor( blobRadius / 4 );
		var digLength = Math.floor( blobRadius / 5.5 );
		//var digLength = 10;

		// Create blob points
		_self.withPoints(blobPoints, function(point, x, y) {
			_self.setPoint(x, y, 1);
		});

		_self.setHexValues();

		// Carve out tunnels
		_self.eachPoint(function(point, x, y) {
			if( Math.random() > 0.965 ) {
				var meta = _self.getMetaPoint(x, y);

				if( meta.numNeighbors > 6 ) {
					var compass = new Compass();

					_self.setPoint(x, y, 0);

					compass.randomize();

					var state		= compass.getState();
					var direction	= state.coordinates;

					digLoop:
					for(var d = 0; d < digLength; d++) {
						var digCoords	= {x: x + d * direction.x, y: y + d * direction.y};

						// possibly rotate compass
						if( Math.random() > 0.9 ) {
							compass.rotate();

							direction = compass.getState().coordinates;
						}

						_self.setPoint(digCoords.x, digCoords.y, 0);
					}
				}
			}
		});

		// Finalize the pattern
		//_self.setHexValues().fill().invert().setHexValues();
		//_self.setHexValues().fill().winnow(3).invert().setHexValues().fill(7).winnow(4).winnow(1);
		_self.setHexValues().fill().winnow(3).invert().setHexValues();


		return _self;
	};

	/**
	 * Fills grid with points south to north to a specified depth.
	 *
	 * @method	seedLiquid
	 * @public
	 *
	 * @param		{integer}		depth	How many rows to fill from bottom of grid
	 */
	/*
	_self.seedLiquid = function(depth = 0) {
		// Loop through all points, and set those that are unset and in a row under or equal to specified depth
		_self.eachPoint(function(point, x, y) {
			if( !point ) {
				if( _height - y <= depth ) {
					_self.setPoint(x, y, 1);
				}
			}
		});

		return _self;
	};
	*/

	/**
	 * Get the points that make up an irregular, recursively branching path.
	 *
	 * @method	getBranch
	 * @public
	 * @param		{object}		startPoint	A point object with x- and y-coordinates
	 * @param		{integer}		length		Length of branch to create
	 * @param		{string}		direction		A cardinal direction to initialize the compass to
	 * @return	{array}
	 */
	/*
	_self.getBranch = function(startPoint, length, direction, maxBranches = 3) {
		var adjustment, nudge1, nudge2;
		var branched		= 0;
		var chanceRecurse	= 1 - 0.06;
		var chanceNudge	= 1 - 0.5;
		var chanceRechart	= 1 - 0.5;
		var subLengthRatio	= 0.7;
		var points		= [];
		var compass		= new Compass();
		var trendTimer		= 0;
		var trendReset		= 3;
		var lateral		= 3; // max. amount of lateral branch movement at a time
		var nudge			= {x: 0, y: 0};


		// Create a compass with either pre-defined or random direction
		if( direction ) {
			compass.setState(direction);
		} else {
			compass.randomize();
		}

		// Get the direction of branch extension
		adjustment = compass.getState().coordinates;

		// Rotate compass -90 and +90 from direction of extension to get directions to nudge the branch in
		compass.rotate();
		nudge1 = compass.getState().coordinates;
		compass.rotate(2);
		nudge2 = compass.getState().coordinates;

		// Set initial nudge direction
		nudge = ( Math.random() > 0.5 ) ? nudge1 : nudge2;

		// Create a series of points offset from original starting point
		for(var i= 0; i < length; i++) {
			// Repeated the chance at nudging to give the line so noticeable perpendicular movement
			for(var k = 0; k < lateral; k++) {
				var point = {x: startPoint.x + adjustment.x * i, y: startPoint.y + adjustment.y * i};

				if( trendTimer == 0 ) {
					// Chance to nudge point
					if( Math.random() > chanceNudge ) {
						point.x += nudge.x;
						point.y += nudge.y;
						startPoint.x += nudge.x;
						startPoint.y += nudge.y;

						// Chance to re-choose direction
						if( Math.random() > chanceRechart) {
							nudge = ( Math.random() > 0.5 ) ? nudge1 : nudge2;

							// Increment timer, so path will be straight for a bit to smooth
							trendTimer = trendReset;
						}
					}
				} else {
					trendTimer--;
				}

				points.push(point);
			}

			// Chance to spawn a child branch
			if( branched < maxBranches ) {
				if( Math.random() > chanceRecurse ) {
					// Child branch is shorter than its parent
					var subLength = Math.floor(length * subLengthRatio);

					// Don't recurse if child branch would be too short
					if( subLength > 1 ) {
						// Compass is already at -90 degrees from branch direction, so 50% chance to rotate to +90 degrees
						if( Math.random() > 0.5 ) {
							compass.rotate(2);
						}

						var subDirection	= compass.getState().direction;
						var subPoints		= _self.getBranch({x: point.x, y: point.y}, subLength, subDirection, maxBranches - 1);

						// Merge child branch into parent
						points = [...points, ...subPoints];

						branched++;
					}
				}
			}
		}

		return points;
	};
	*/

	/*
	_self.seedBranches = function() {
		// possible parameters: number of branches
		// determine where to start branches and how long they should be (possibly based on _width, or supplied as arguments)


		var branchPoints = _self.getBranch({x: 55, y: 55}, 50, 'east', 3);

		branchPoints = _self.purgeDuplicates(branchPoints);

		_self.withPoints(branchPoints, function(point, x, y) {
			_self.setPoint(x, y, 1);
		});

		_self.setHexValues();

		return _self;
	};
	*/

	/**
	 * Recursively finds all possible complete paths within a grid's filled points, provided a start and end point.
	 *
	 * @method	pathfinder
	 * @public
	 * @param		{object}		currentPoint		Tracks what point the routine is currently on. Defaults to (0,0) but acts as the start point if defined
	 * @param		{object}		endPoint			End point for all paths
	 * @param		{array}		coveredPoints		Points that have already been traversed within a path
	 * @param		{integer}		depth			Recursion depth. Used to track the root routine
	 * @return	{mixed}
	 */
	_self.pathfinder = function(currentPoint = {x: 0, y: 0}, endPoint = {x: _width - 1, y: _height - 1}, coveredPoints = [], depth = 0, compassDirs = false) {
		var routes	= 0;
		var paths		= [];

		// Root routine initialization
		if( depth == 0 ) {
			var compass = new Compass();
			compassDirs = compass.states;

			coveredPoints.push(currentPoint);

			if( Utilities.pointsMatch(currentPoint, endPoint) ) {
				return [];
			}
		}

		// If we're at the endpoint, return the total path and a signifier that we've reached the end
		if( currentPoint.x == endPoint.x && currentPoint.y == endPoint.y ) {
			return {points: coveredPoints, terminus: true};
		}

		for(var dirIndex in compassDirs) {
			// NOTE: "north" direction currently skipped to allow for larger path grid
			if( dirIndex == 0 ) {
				continue;
			}

			var direction	= compassDirs[dirIndex];
			var nextCoords	= {x: currentPoint.x + direction.coordinates.x, y: currentPoint.y + direction.coordinates.y};
			var nextPoint	= _self.getPoint(nextCoords.x, nextCoords.y);

			// Check if point is within grid
			if( nextPoint ) {
				// Check if point has been covered in path yet
				if( !Utilities.pointsHavePoint(coveredPoints, nextCoords) ) {
					var subPoints = _self.pathfinder(nextCoords, endPoint, [...coveredPoints, nextCoords], depth + 1, compassDirs);

					// Format the data such that "paths" will always be an array of arrays of point objects
					if( subPoints.terminus ) {
						paths.push(subPoints.points);
					} else if( subPoints.paths ) {
						for( var subPath of subPoints.paths ) {
							paths.push(subPath);
						}
					}

					routes++;
				}
			}
		}

		// Dead-end that cannot reach end point. Path can be discarded
		if( routes == 0 ) {
			if( depth == 0 ) {
				return [];
			}

			return {paths: false, terminus: false};
		}

		// Root routine return value. Return just the paths
		if( depth == 0 ) {
			return paths;
		}

		// Return whatever paths were passed to this routine along with a signifier that this was not an endpoint
		return {paths: paths, terminus: false};
	}

	_self.seedWindingPaths = function() {
		const PATH_SIZE	= 6; // 7 max with no north
		const BOX_SIZE		= Math.floor(_width / PATH_SIZE);

		var pathGrid		= new Grid(PATH_SIZE, PATH_SIZE, false);
		var paths			= pathGrid.fill(0).pathfinder();
		var randPathIndex	= Math.floor( Math.random() * paths.length );
		var randPath		= paths[randPathIndex];
		var boxPoints		= [];

		// With path points, convert them into bounded boxes and find a random point within them
		for(var pathPoint of randPath) {
			var boxBounds = {
				min:		{x: BOX_SIZE * pathPoint.x, y: BOX_SIZE * pathPoint.y},
				max:		{x: BOX_SIZE * (pathPoint.x + 1) - 1, y: BOX_SIZE * (pathPoint.y + 1) - 1}
			};

			var randBoxPoint = {
				x:	Math.floor( Math.random() * (boxBounds.max.x - boxBounds.min.x + 1) ) + boxBounds.min.x,
				y:	Math.floor( Math.random() * (boxBounds.max.y - boxBounds.min.y + 1) ) + boxBounds.min.y
			};

			boxPoints.push(randBoxPoint);
		}

		// Create line segments with each pair of successive box points
		for(var i in boxPoints) {
			// Skip first point since it doesn't have a previous pair point
			if( i == 0) {
				continue;
			}

			var pointOne	= boxPoints[i - 1];
			var pointTwo	= boxPoints[i];
			var segment	= _self.getLine(pointOne, pointTwo);

			_self.withPoints(segment, function(point, x, y) {
				_self.setPoint(x, y, 1);
			});
		}

		// Grow the path
		_self.expandPoints(true).expandPoints(true).growPoints().growPoints();
		_self.depopulate(20).winnow(5).expandPoints().expandPoints().growPoints().growPoints().growPoints();
		_self.depopulate(2.3).setHexValues().erodePoints().winnow(5).setHexValues();
		_self.growPoints().winnow(6).fill(7);

		return _self;
	};

	_self.seedTessellation = function() {
		var fillGrid = new Grid(_width, _height, false);

		// Center points
		_self.populate(1.5);

		var radius = 0;
		var pointAdded = true;
		var cycles = 0;

		while( pointAdded ) {
			pointAdded = false;
			_self.eachPoint(function(point, x, y) {
				if( point ) {
					var circlePlusOne	= _self.getCircle({x: x, y: y}, radius + 1, 'edge');

					for( var testPoint of circlePlusOne ) {
						if( !fillGrid.getPoint(testPoint.x, testPoint.y) ) {
							fillGrid.setPoint(testPoint.x, testPoint.y, x + y);
							pointAdded = true;
						}
					}
				}
			});

			radius++;

			cycles++;
			if( cycles > 100 ) {
				pointAdded = false;
			}
		}

		_self.absorbGrid(fillGrid);
		// absorb fillGrid into _self

		return _self;
	};

	/**
	 * Seeds stacked rectangles of points separated by a single point.
	 *
	 * @method	seedLinearLattice
	 * @public
	 * @param		{integer}		segmentMin			Minimum segment length
	 * @param		{integer}		segmentMax			Maximum segment length
	 * @param		{integer}		segmentHeight			Height of rectangle shapes
	 * @param		{object}		config				Configuation object
	 * @param		{integer}		config.randomExtendX	Percent chance to extend a block right in amount equal to vertical padding
	 * @param		{integer}		config.randomExtendY	Percent chance to extend a block downwards in amount equal to vertical padding
	 */
	// TODO: add option to only seed rectangles if full extension can be reached (no partial rectangles)
	_self.seedRectangularLattice = function(segmentMin = 1, segmentMax = 3, segmentHeight = 1, horzSpacing = 1, vertSpacing = 1, config = {}) {
		var seedLength;
		var curLength		= 0;
		var space			= 1;
		var seeding		= false;
		var randomExtendY	= 0;
		var blockID		= 0;

		var reset = function() {
			seeding		= true;
			curLength		= 0;
			seedLength	= Math.floor( Math.random() * (segmentMax - segmentMin + 1) ) + segmentMin;
		};

		_self.eachPoint(function(point, x, y) {
			// Seed every Nth row
			if( y % (segmentHeight + vertSpacing) == 0 ) {
				if( seeding ) {
					var trueHeight = segmentHeight + randomExtendY;

					for(var w = 0; w < trueHeight; w++) {
						_self.setPoint(x, y + w, 1);
						_self.setDataPoint(x, y + w, {block: blockID, x: x-curLength, y: y, width: seedLength, height: trueHeight});
					}

					curLength++;

					if( curLength == seedLength || x == (_width - 1) ) {
						seeding		= false;
						space		= 1;
						randomExtendY	= 0;

						if( config.randomExtendY && (Math.random() < config.randomExtendY / 100) ) {
							randomExtendY = vertSpacing;
						}
						if( config.randomExtendX && (Math.random() < config.randomExtendX / 100) ) {
							space = horzSpacing;
							reset();
						}

						blockID++;
					}
				} else {
					if( space == horzSpacing ) {
						reset();
					}

					space++;
				}
			}
		});

		return _self;
	};

	_self.verticallyExtendEndPoints = function() {
		_self.copyToScratch();

		_self.eachMetaPoint(function(metaPoint, x, y) {
			if( metaPoint.hex == 260 || metaPoint.hex == 257 ) {
				var length	= 1;
				var extend	= true;
				var direction	= ( Math.random() > 0.5 ) ? 1 : -1;

				while( extend ) {
					var point = _self.getPoint(x, y + direction * length);

					if( point || typeof(point) == 'undefined' ) {
						extend = false;
						length = 1;
					}

					_self.setScratchPoint(x, y  + direction * length, 1);

					length++;
				}
			}
		});

		_self.copyFromScratch();

		return _self;
	};

	/**
	 * Sets grouped lines of points extending south from initial set points.
	 *
	 * @method	seedHangingGrowth
	 * @public
	 * @param		{object}		height	Contains minimum and maximum values for height of growth areas
	 * @param		{object}		width	Contains minimum and maximum values for width of growth areas
	 * @param		{object}		spacing	Contains minimum and maximum values for horizontal spacing
	 */
	/*
	_self.seedHangingGrowth = function(height = {min: 2, max: 8}, width = {min: 2, max: 7}, spacing = {min: 16, max: 25}) {
		var widthTimer = 0;
		var spaceTimer = 1;

		_self.copyToScratch().empty();

		_self.eachScratchPoint(function(scratchPoint, x, y) {
			// Only start growth loop on set scratch points and unset corresponding real points
			if( scratchPoint ) {
				if( !_self.getPoint(x, y) ) {
					// Growth width mode
					if( widthTimer > 0 ) {
						var growthHeight = Math.floor( Math.random() * (height.max - height.min + 1) ) + height.min;

						// Start setting points
						growthLoop:
						for(var g = 0; g < growthHeight; g++) {
							// Break loop if we venture out of the grid
							if( typeof( _self.getPoint(x, y + g) ) == 'undefined' ) {
								break growthLoop;
							}

							var newValue = 1;

							if( g == 0 ) {
								if( Math.random() > 0.85 ) {
									newValue = 0;
								}
							}

							_self.setPoint(x, y + g, newValue);
						}

						widthTimer--;

						// Determine width of next spacer and switch to spacer mode
						if( widthTimer == 0 ) {
							spaceTimer = Math.floor( Math.random() * (spacing.max - spacing.min + 1) ) + spacing.min;
						}
					}

					// Growth spacer mode
					if( spaceTimer > 0 ) {
						spaceTimer--;

						// Determine width of next growth and switch to growth mode
						if( spaceTimer == 0 ) {
							widthTimer = Math.floor( Math.random() * (width.max - width.min + 1) ) + width.min;
						}
					}
				}
			}
		});

		return _self;
	};
	*/

	/**
	 * Extends solid points by a semi-random amount.
	 *
	 * @method	seedLinearGrowth
	 * @public
	 * @param		{string}		direction		Cardinal direction to extend the points
	 * @param		{integer}		min			Minimum amount to extend
	 * @param		{integer}		max			Maximum amount to extend
	 * @param		{integer}		spacing		Horizontal spacing of growths
	 * @param		{number}		miss			Percent chance to skip a growth loop
	 */
	/*
	_self.seedLinearGrowth = function(direction = 'north', min = 4, max = 7, spacing = 0, miss = 0) {
		var xModifier, yModifier;
		var chanceMiss = miss / 100;

		switch(direction) {
			case 'north':
				xModifier = 0;
				yModifier = -1;
				break;
			case 'east':
				xModifier = 1;
				yModifier = 0;
				break;
			case 'south':
				xModifier = 0;
				yModifier = 1;
				break;
			case 'west':
				xModifier = -1;
				yModifier = 0;
				break;
			default:
				return _self;
				break;
		}

		_self.copyToScratch();

		_self.eachScratchPoint(function(point, x, y) {
			if( point ) {
				// Space out the growth start points
				if( spacing > 0 ) {
					if( x % (spacing + 1) != 0 ) {
						return;
					}
				}

				// Percent chance to miss a growth loop
				if( chanceMiss > 0 ) {
					if( Math.random() < chanceMiss ) {
						return;
					}
				}

				var maxExtend = Math.floor( Math.random() * (max - min + 1) ) + min;

				extendLoop: // Extend and fill until we hit a solid point or are outside the grid
				for(var h = 1; h <= maxExtend; h++) {
					var offsetPoint = _self.getPoint(x + h * xModifier, y + h * yModifier);

					if( offsetPoint || typeof(offsetPoint) == 'undefined' ) {
						break extendLoop;
					}

					_self.setPoint(x + h * xModifier, y + h * yModifier, 1);
				}
			}
		});

		_self.setHexValues();

		return _self;
	};
	*/

	/*
	_self.getBlob = function(center, radius) {
		var maxOffset = Math.ceil(radius / 2);
		var numCircles = maxOffset;
		var points = [];

		for(var c = 0; c < numCircles; c++) {
			var xOffset = Math.ceil(Math.random() * maxOffset);
			var yOffset = Math.ceil(Math.random() * maxOffset);

			var xFlip = ( Math.random() > 0.5 ) ? 1 : -1;
			var yFlip = ( Math.random() > 0.5 ) ? 1 : -1;

			xOffset *= xFlip;
			yOffset *= yFlip;

			var subRadius = Math.ceil( Math.random() * (maxOffset - 1) ) + 3;

			var circlePoints = _self.getCircle({x: center.x + xOffset, y: center.y + yOffset}, subRadius);

			points = [...points, ...circlePoints];
		}

		return _self.purgeDuplicates(points);
	};
	*/

	/*
	_self.purgeDuplicates = function(points = []) {
		var cleanedPoints = [];

		var xMax = 0;
		var yMax = 0;

		for(var point of points) {
			if( point.x > xMax ) {
				xMax = point.x;
			}
			if( point.y > yMax ) {
				yMax = point.y;
			}
		}

		var tempGrid = new Grid(xMax + 1, yMax + 1, false);

		for(var point of points) {
			tempGrid.setPoint(point.x, point.y, 1);
		}

		tempGrid.eachPoint(function(point, x, y){
			if( point ) {
				cleanedPoints.push({x: x, y: y});
			}
		});

		return cleanedPoints;
	};
	*/

	_self.findExtremes = function(points) {
		var unset		= true;
		var xLowest	= false;
		var yLowest	= false;
		var xHighest	= false;
		var yHighest	= false;

		_self.eachPoint(function(point, x, y) {
			if( point ) {
				if( unset ) {
					xLowest = x;
					yLowest = y;
					xHighest = x;
					yHighest = y;
					unset = false;
				} else {
					if( x < xLowest ) {
						xLowest = x;
					}
					if( y < yLowest ) {
						yLowest = y;
					}
					if( x > xHighest ) {
						xHighest = x;
					}
					if( y > yHighest ) {
						yHighest = y;
					}
				}
			}
		});

		return {
			lowest:	{x: xLowest, y: yLowest},
			highest:	{x: xHighest, y: yHighest}
		};
	};

	// Set each point's value based on its number of neighbors and where those neighbors lie
	_self.setHexValues = function(filterRule = false, clearFilter = true, emptyTypes = false) {
		_self.eachPoint(function(point, x, y) {
			var value			= 0;
			var numNeighbors	= 0;
			var numCorners		= 0;
			var neighbors		= {n: false, ne: false, e: false, se: false, s: false, sw: false, w: false, nw: false};
			var edge			= false;
			var inside		= false;
			var filterPoints	= (_pointFilter);

			// Self
			if( point ) {
				value += 256;
			}
			// NE
			if( _self.getPoint(x + 1, y - 1, filterPoints) ) {
				value += 128;
				numNeighbors++;
				numCorners++;
				neighbors.ne = true;
			}
			// SE
			if( _self.getPoint(x + 1, y + 1, filterPoints) ) {
				value += 64;
				numNeighbors++;
				numCorners++;
				neighbors.se = true;
			}
			// SW
			if( _self.getPoint(x - 1, y + 1, filterPoints) ) {
				value += 32;
				numNeighbors++;
				numCorners++;
				neighbors.sw = true;
			}
			// NW
			if( _self.getPoint(x - 1, y - 1, filterPoints) ) {
				value += 16;
				numNeighbors++;
				numCorners++;
				neighbors.nw = true;
			}
			// N
			if( _self.getPoint(x, y - 1, filterPoints) ) {
				value += 8;
				numNeighbors++;
				neighbors.n = true;
			}
			// E
			if( _self.getPoint(x + 1, y, filterPoints) ) {
				value += 4;
				numNeighbors++;
				neighbors.e = true;
			}
			// S
			if( _self.getPoint(x, y + 1, filterPoints) ) {
				value += 2;
				numNeighbors++;
				neighbors.s = true;
			}
			// W
			if( _self.getPoint(x - 1, y, filterPoints) ) {
				value += 1;
				numNeighbors++;
				neighbors.w = true;
			}

			// Inside
			if( value == 511) {
				inside = true;
			}

			// Edge
			if( value >= 256 && value < 511 ) {
				edge = true;

				// TODO: clean this up
				if( numNeighbors == 6 && numCorners == 2 ) {
					edge		= false;
					inside	= true;
				}
				if( numNeighbors == 7 && numCorners == 3 ) {
					edge		= false;
					inside	= true;
				}
			}

			var data = _self.hexToType(value, emptyTypes);

			// Apply filtering rule to filled points
			if( point && filterRule ) {
				data = _applyHexFilter(filterRule, data);
			}

			_self.updateMetaProp(x, y, 'hex', value);
			_self.updateMetaProp(x, y, 'numNeighbors', numNeighbors);
			_self.updateMetaProp(x, y, 'neighbors', neighbors);
			_self.updateMetaProp(x, y, 'edge', edge);
			_self.updateMetaProp(x, y, 'inside', inside);
			_self.updateMetaProp(x, y, 'rotations', data.rotations);
			_self.updateMetaProp(x, y, 'type', data.type);
			//_self.updateMetaProp(x, y, 'depth', 0);
		}, clearFilter);

		return _self;
	};

	// Replace neighbor boolean values with hex/integer values
	_self.setHexRelationships = function() {
		var nghbrOrder = ['ne', 'se', 'sw', 'nw', 'n', 'e', 's', 'w'];

		_self.eachPoint(function(point, x ,y) {
			if( point ) {
				var metaPoint	= _self.getMetaPoint(x, y);
				var neighbors	= _self.getNeighbors(x, y);
				var index		= 0;

				_self.withPoints(neighbors, function(point, nx, ny) {
					if( point ) {
						var neighborMeta = _self.getMetaPoint(nx, ny);
						var direction = nghbrOrder[index];

						metaPoint.neighbors[direction] = neighborMeta.type;
					}

					index++;
				});

				_self.setMetaPoint(x, y, metaPoint);
			}
		}, false);

		return _self;
	};

	_self.applyVariations = function(tileset) {
		_self.eachPoint(function(point, x, y) {
			if( point ) {
				var metaPoint	= _self.getMetaPoint(x, y);
				var possible	= Tilesets[tileset][metaPoint.type][metaPoint.rotations];
				var variation	= Math.floor( Math.random() * possible );

				_self.updateMetaProp(x, y, 'variation', variation);
			}
		});

		return _self;
	};

	/**
	 * Adjusted a point's "type" and "rotation" metavalues according to a filtering rule.
	 *
	 * @method	_applyHexFilter
	 * @private

	 * @param		{string}		rule			The name of a filter from the filtering chart
	 * @param		{object}		hexData		Point data object containing "type" and "rotation" properties
	 * @return	{object}
	 */
	var _applyHexFilter = function(rule, hexData) {
		var filter		= TilesetFilters[rule];
		var rule			= filter.rules[hexData.type];
		var whitelisted	= (filter.whitelist.indexOf(hexData.type) != -1);

		// If "type" is on the whitelist or no matching filter was found from the table, send back the original data untouched
		if( whitelisted || !filter ) {
			return hexData;
		}

		// If no defined specific rule, fallback to the filter's default
		if( !rule ) {
			return filter.default;
		}

		return rule[hexData.rotations];
	};

	_self.growPoints = function(greedy = false, chance = 50) {
		chance = chance / 100;

		_self.copyToScratch();

		_self.eachScratchPoint(function(scratchPoint, x, y) {
			if( scratchPoint ) {
				var metaPoint = _self.getMetaPoint(x, y);

				// Copy over scratch data
				_self.setPoint(x, y, 1);

				// Only expand edge points
				if( metaPoint.edge ) {
					// Set the ordinal direction neighbors as true
					var args = [
						{
							x: x - 1,
							y: y
						},
						{
							x: x + 1,
							y: y
						},
						{
							x: x,
							y: y - 1
						},
						{
							x: x,
							y: y + 1
						}
					];

					for(var arg of args) {
						if( Math.random() < chance ) {
							_self.setPoint(arg.x, arg.y, 1);
						}
					}

					if( greedy ) {
						// Set the diagonal direction neighbors as true
						_self.setPoint(x - 1, y - 1, 1);
						_self.setPoint(x - 1, y + 1, 1);
						_self.setPoint(x + 1, y - 1, 1);
						_self.setPoint(x + 1, y + 1, 1);
					}
				}
			}
		}, false);

		_self.setHexValues(false, false);

		return _self;
	};

	_self.erodePoints = function(chance = 50) {
		chance = chance / 100;

		_self.copyToScratch();

		_self.eachScratchPoint(function(scratchPoint, x, y) {
			if( scratchPoint ) {
				var metaPoint = _self.getMetaPoint(x, y);

				// Only retain inside points from scratch
				if( metaPoint.inside ) {
					_self.setPoint(x, y, 1);
				}
				if( metaPoint.edge && Math.random() < chance ) {
					_self.setPoint(x, y, 0);
				}
			}
		});

		_self.setHexValues();

		return _self;
	};

	/**
	 * Expands filled edge points into neighboring cells. Requires that hex values be set.
	 *
	 * @method	expandPoints
	 * @public
	 *
	 * @param		{boolean}		greedy	If true, all eight neighboring cells are modified rather than just the cardinal four
	 */
	_self.expandPoints = function(greedy = false, size = 1) {
		_self.copyToScratch();

		_self.eachScratchPoint(function(scratchPoint, x, y) {
			if( scratchPoint ) {
				var metaPoint = _self.getMetaPoint(x, y);

				// Copy over scratch data
				_self.setPoint(x, y, 1);

				// Only expand edge points
				if( metaPoint.edge ) {
					if( greedy ) {
						// Create a shape of points around the primary point to expand into
						var shape;

						// Modify the shape of the expansion region depending on size
						if( size == 1 ) {
							shape = _self.getRectangle({x: x - 1, y: y - 1}, {x: x + 1, y: y + 1});
						} else {
							shape = _self.getCircle({x: x, y: y}, size);
						}

						_self.withPoints(shape, function(point, x, y) {
							_self.setPoint(x, y, 1);
						});
					} else {
						// Set the cardinal direction neighbors as true
						var args = [
							{
								x: x - 1,
								y: y
							},
							{
								x: x + 1,
								y: y
							},
							{
								x: x,
								y: y - 1
							},
							{
								x: x,
								y: y + 1
							}
						];

						for(var arg of args) {
							_self.setPoint(arg.x, arg.y, 1);
						}
					}
				}
			}
		});

		_self.setHexValues();

		return _self;
	};

	/**
	 * Strips filled edge points. Requires that hex values be set.
	 *
	 * @method	shrinkPoints
	 * @public
	 */
	_self.shrinkPoints = function() {
		_self.copyToScratch();

		_self.eachScratchPoint(function(scratchPoint, x, y) {
			if( scratchPoint ) {
				var metaPoint = _self.getMetaPoint(x, y);

				// Only retain inside points from scratch
				if( metaPoint.inside ) {
					_self.setPoint(x, y, 1);
				}
			}
		});

		_self.setHexValues();

		return _self;
	};

	/**
	 * Copies over points values into a new grid.
	 *
	 * @method	clone
	 * @public
	 * @return 	{Grid}
	 */
	_self.clone = function() {
		var clone = new Grid(_width, _height, _wrap);

		_self.eachPoint(function(point, x, y) {
			if( point ) {
				clone.setPoint(x, y, 1);
			}
		});

		return clone;
	};

	_self.resize = function(negativeDir, positiveDir, pointDefault = 0, dataDefaultFunc = function(x, y){}) {
		if( !negativeDir ) {
			negativeDir = {x: 0, y: 0};
		}
		if( !positiveDir ) {
			positiveDir = {x: 0, y: 0};
		}

		// Adjust in X-direction
		for(let y = 0; y < _height; y++) {
			for(let i = 0, diff = Math.abs(positiveDir.x); i < diff; i++) {
				if( positiveDir.x > 0 ) {
					_points[y].push(pointDefault);

					if( _hasScratch ) {
						_scratch[y].push(0);
					}
					if( _hasData ) {
						_data[y].push( dataDefaultFunc(_width + i, y) );
					}
					if( _hasMeta ) {
						_meta[y].push( _createBlankMeta() );
					}
				} else {
					_points[y].pop();

					if( _hasScratch ) {
						_scratch[y].pop();
					}
					if( _hasData ) {
						_data[y].pop();
					}
					if( _hasMeta ) {
						_meta[y].pop();
					}
				}
			}
		}

		_width += (negativeDir.x + positiveDir.x);
		_height += (negativeDir.y + positiveDir.y);

		// Adjust in Y-direction

		/*
		for negativeDir.y
		+y: unshift rows
		-y: shift rows
		*/

		for(let i = 0, diff = Math.abs(positiveDir.y); i < diff; i++) {
			if( positiveDir.y > 0 ) {
				let pointRow	= [];
				let scratchRow	= [];
				let metaRow	= [];
				let dataRow	= [];

				for(let x = 0; x < _width; x++) {
					pointRow.push(pointDefault);
					scratchRow.push(0);
					dataRow.push( dataDefaultFunc(x, _height + i) );
					metaRow.push( _createBlankMeta() );
				}

				_points.push(pointRow);

				if( _hasScratch ) {
					_scratch.push(scratchRow);
				}
				if( _hasMeta ) {
					_meta.push(metaRow);
				}
				if( _hasData ) {
					_data.push(dataRow);
				}
			} else {
				_points.pop();

				if( _hasScratch ) {
					_scratch.pop();
				}
				if( _hasMeta ) {
					_meta.pop();
				}
				if( _hasData ) {
					_data.pop();
				}
			}
		}
	};

	_self.subtractGrid = function(gridObj, offset = {x: 0, y: 0}) {
		// Reset point and meta values
		gridObj.eachPoint(function(point, x, y) {
			var adjX = x + offset.x;
			var adjY = y + offset.y;

			if( point ) {
				_self.setPoint(adjX, adjY, 0);
			}
			if( _hasMeta ) {
				_self.setMetaPoint(adjX, adjY, _createBlankMeta());
			}
			if( _hasScratch ) {
				_self.setScratchPoint(adjX, adjY, 0);
			}
			if( _hasData ) {
				_self.setDataPoint(adjX, adjY, undefined);
			}
		});

		return _self;
	};

	/**
	 * Merges another grid's points into this one's.
	 *
	 * @method	absorbGrid
	 * @public
	 * @param		{Grid}	gridObj	A Grid object
	 * @param		{object}	offset	A point object
	 */
	_self.absorbGrid = function(gridObj, offset = {x: 0, y: 0}) {
		// Copy over point values
		gridObj.eachPoint(function(point, x, y) {
			if( point ) {
				var adjX = x + offset.x;
				var adjY = y + offset.y;

				_self.setPoint(adjX, adjY, point);
			}
		});

		if( _hasMeta ) {
			// Copy over metapoint values
			gridObj.eachMetaPoint(function(metapoint, x, y) {
				var adjX = x + offset.x;
				var adjY = y + offset.y;

				// Clone the meta point object
				for(var prop in metapoint) {
					var value = metapoint[prop];

					_self.updateMetaProp(adjX, adjY, prop, value);
				}
			});
		}

		if( _hasScratch ) {
			// Copy over scratch values
			gridObj.eachScratchPoint(function(scratchpoint, x, y) {
				if( scratchpoint ) {
					var adjX = x + offset.x;
					var adjY = y + offset.y;

					_self.setScratchPoint(adjX, adjY, scratchpoint);
				}
			});
		}

		if( _hasData ) {
			// Copy over datapoint values
			gridObj.eachDataPoint(function(datapoint, x, y) {
				var adjX = x + offset.x;
				var adjY = y + offset.y;

				var clonedData = Utilities.clone(datapoint);

				_self.setDataPoint(adjX, adjY, clonedData);
			});
		}

		return _self;
	};

	_self.populate = function(percent = 50) {
		var chance = (1 - (percent / 100)) || 0.5;

		if( percent == 100 ) {
			chance = 0;
		}

		_self.eachPoint(function(point, x, y) {
			if( Math.random() > chance ) {
				_self.setPoint(x, y, 1);
			}
		});

		return _self;
	};

	_self.depopulate = function(percent = 50) {
		var chance = (1 - (percent / 100)) || 0.5;

		if( percent == 100 ) {
			chance = 0;
		}

		_self.eachPoint(function(point, x, y) {
			if( Math.random() > chance ) {
				_self.setPoint(x, y, 0);
			}
		});

		return _self;
	};

	_self.fill = function(minNeighbors = 8, strictMode = false) {
		_self.eachMetaPoint(function(metapoint, x, y) {
			if( metapoint.numNeighbors >= minNeighbors ) {
				_self.setPoint(x, y, 1);
			}
		});

		return _self;
	};

	/**
	 * Set any points that don't meet the minimum neighbor threshold to zero.
	 *
	 * @method	winnow
	 * @public
	 * @param		{integer}		minNeighbors		Minimum number of non-zero neighbors a point must have to retain its value.
	 * @param		{boolean}		strictMode		If set to true, counting will ignore diagonal neighbors
	 */
	_self.winnow = function(minNeighbors, strictMode = false) {
		_self.copyToScratch();

		_self.eachScratchPoint(function(point, x, y) {
			if( !point ) {
				return;
			}

			var count = 0;

			// Get all eight of point's neighbor points
			xLoop:
			for(var i = -1; i < 2; i++) {
				yLoop:
				for(var j = -1; j < 2; j++) {
					if( i == 0 && j == 0) {
						continue yLoop;
					}
					if( strictMode ) {
						if( i == j ) {
							continue yLoop;
						}
						if( i + j == 0 ) {
							continue yLoop;
						}
					}

					var neighbor = _self.getScratchPoint(x + i, y + j);

					// Count any neighbor points with non-zero values
					if( neighbor != 0 ) {
						count++;
					}
				}
			}

			// Zero the point if it doesn't meet minimum threshold
			if( count < minNeighbors ) {
				_self.setPoint(x, y, 0);
			}
		});

		return _self;
	};

	/**
	 * Returns all points that lie along a region defined as the bottom and right sides of a square with dimensions equal to "offset."
	 *
	 * @method	getExtendedPoints
	 * @public
	 * @param		{integer}		x		X-Coordinate
	 * @param		{integer}		y		Y-Coordinate
	 * @param		{integer}		offset	Amount to offset from base point
	 * @return	{array}				An array of point objects
	 */
	/*
	_self.getOffsetPoints = function(x, y, offset = 1) {
		var offsetPoint;
		var points = [];

		var horzPoints = _self.getHorizontallyOffsetPoints(x, y, offset, offset);
		var vertPoints = _self.getVerticallyOffsetPoints(x, y, offset, offset);

		points = [...vertPoints, ...horzPoints];


		return points;
	};
	*/

	/**
	 * Returns all points that lie offset horizontally from a base point.
	 *
	 * @method	getHorizontallyOffsetPoints
	 * @public
	 * @param		{integer}		x		X-Coordinate
	 * @param		{integer}		y		Y-Coordinate
	 * @param		{integer}		offset	Amount to offset from base point
	 * @param		{integer}		length	"Height" value of the base point
	 * @return	{array}				An array of point objects
	 */
	/*
	_self.getHorizontallyOffsetPoints = function(x, y, offset = 1, length = 0) {
		var offsetPoint;
		var points = [];

		for(var offsetY = 0; offsetY <= length; offsetY++) {
			offsetPoint = {
				x:	x + offset,
				y:	y + offsetY
			};

			points.push(offsetPoint);
		}

		return points;
	};
	*/

	/**
	 * Returns all points that lie offset vertically from a base point.
	 *
	 * @method	getVerticallyOffsetPoints
	 * @public
	 * @param		{integer}		x		X-Coordinate
	 * @param		{integer}		y		Y-Coordinate
	 * @param		{integer}		offset	Amount to offset from base point
	 * @param		{integer}		length	"Width" value of the base point
	 * @return	{array}				An array of point objects
	 */
	/*
	_self.getVerticallyOffsetPoints = function(x, y, offset = 1, length = 0) {
		var offsetPoint;
		var points = [];

		for(var offsetX = 0; offsetX <= length; offsetX++) {
			offsetPoint = {
				x:	x + offsetX,
				y:	y + offset
			};

			points.push(offsetPoint);
		}

		return points;
	};
	*/

	/**
	 * Test one or more of a point's metavalues against those of another group of points.
	 *
	 * @method	pointMetaMatchesPoints
	 * @public
	 * @param		{integer}		x		X-Coordinate
	 * @param		{integer}		y		Y-Coordinate
	 * @param		{array}		points	Array of point objects
	 * @param		{array}		props	Array of metapoint properties to test
	 * @return	{boolean}				Returns true if metavalues match
	 */
	/*
	_self.pointsMatchPointMeta = function(x, y, points, props = []) {
		// Convert props into an array if only a single property was supplied as a string
		if( typeof(props) == 'string' ) {
			props = [props];
		}

		var metaPoint = _self.getMetaPoint(x, y);

		for(var compareCoords of points) {
			var compareMetaPoint = _self.getMetaPoint(compareCoords.x, compareCoords.y);

			// Compare each property value in the two points
			for(var prop of props) {
				var metaValue			= metaPoint[prop];
				var compareMetaValue	= compareMetaPoint[prop];

				if( compareMetaValue != metaValue ) {
					return false;
				}
			}
		}

		return true;
	};
	*/

	/**
	 * Checks if all supplied points match a specified metavalue.
	 *
	 * @method	pointsHaveMetaValue
	 * @public
	 * @param		{array}	points	An array of point objects
	 * @param		{string}	prop		A metapoint property
	 * @param		{string}	value	A metapoint value
	 * @return	{boolean}			Returns true if all metavalues match
	 */
	_self.pointsHaveMetaValue = function(points, prop, value) {
		for(var point of points) {
			var metapoint = _self.getMetaPoint(point.x, point.y);
			var metavalue = metapoint[prop];

			if( metavalue != value ) {
				return false;
			}
		}

		return true;
	};

	/**
	 * Updates point "width/height" metavalues based on similarity of nearby "type" and "rotation" metavalues.
	 *
	 * @method	setMetaPointSizes
	 * @public
	 */
	/*
	_self.setMetaPointSizes = function() {
		// Extend points out in both directly simultaneously (create squares)
		_self.eachMetaPoint(function(metaPoint, x, y) {
			// Skip any point which has already been merged
			if( metaPoint.width != 1 || metaPoint.height != 1 ) {
				return;
			}

			var extendOffset	= true;
			var currentOffset	= 1;

			while( extendOffset ) {
				var extendedPoints = _self.getOffsetPoints(x, y, currentOffset);
				var match = _self.pointsMatchPointMeta(x, y, extendedPoints, ['type', 'rotations']);

				// If all metavalues match, set the extended points' sizes to 0
				if( match ) {
					currentOffset++;

					for(var extendedPoint of extendedPoints) {
						_self.updateMetaProp(extendedPoint.x, extendedPoint.y, 'width', 0);
						_self.updateMetaProp(extendedPoint.x, extendedPoint.y, 'height', 0);
					}
				} else {
					extendOffset = false;
				}
			}

			// Set the base point's "width/height" metavalues as the last used offset
			_self.updateMetaProp(x, y, 'width', currentOffset);
			_self.updateMetaProp(x, y, 'height', currentOffset);
		});

		// Extend points out horizontally (create rows)
		_self.eachMetaPoint(function(metaPoint, x, y) {
			// Skip base points which have been merged into another
			if( metaPoint.width == 0 || metaPoint.height == 0 ) {
				return;
			}

			var extendOffset	= true;
			var currentOffset	= 1;

			while( extendOffset ) {
				var extendedPoints = _self.getHorizontallyOffsetPoints(x, y, currentOffset, metaPoint.height - 1);
				var match = _self.pointsMatchPointMeta(x, y, extendedPoints, ['type', 'rotations']);

				// If any of the extension points have been merged (height or width != 1), flag match as false
				if( !_self.pointsHaveMetaValue(extendedPoints, 'width', 1) || !_self.pointsHaveMetaValue(extendedPoints, 'height', 1) ) {
					match = false;
				}

				if( match ) {
					currentOffset++;

					if( currentOffset >= _width ) {
						extendOffset = false;
					}

					for(var extendedPoint of extendedPoints) {
						_self.updateMetaProp(extendedPoint.x, extendedPoint.y, 'width', 0);
						_self.updateMetaProp(extendedPoint.x, extendedPoint.y, 'height', 0);
					}
				} else {
					extendOffset = false;
				}
			}

			// Set the base point's "width" metavalue as the last used offset
			_self.updateMetaProp(x, y, 'width', currentOffset);
		});

		// Extend points out vertically (create columns)
		_self.eachMetaPoint(function(metaPoint, x, y) {
			// Skip base points which have been merged into another
			if( metaPoint.width == 0 || metaPoint.height == 0 ) {
				return;
			}

			var extendOffset	= true;
			var currentOffset	= 1;

			while( extendOffset ) {
				var extendedPoints = _self.getVerticallyOffsetPoints(x, y, currentOffset, metaPoint.width - 1);
				var match = _self.pointsMatchPointMeta(x, y, extendedPoints, ['type', 'rotations']);

				// If any of the extension points have been merged (height or width != 1), flag match as false
				if( !_self.pointsHaveMetaValue(extendedPoints, 'width', 1) || !_self.pointsHaveMetaValue(extendedPoints, 'height', 1) ) {
					match = false;
				}

				if( match ) {
					currentOffset++;

					if( currentOffset >= _height ) {
						extendOffset = false;
					}

					for(var extendedPoint of extendedPoints) {
						_self.updateMetaProp(extendedPoint.x, extendedPoint.y, 'width', 0);
						_self.updateMetaProp(extendedPoint.x, extendedPoint.y, 'height', 0);
					}
				} else {
					extendOffset = false;
				}
			}

			// Set the base point's "height" metavalue as the last used offset
			_self.updateMetaProp(x, y, 'height', currentOffset);
		});

		return _self;
	};
	*/

	_self.getEdge = function() {
		var points = [];

		_self.eachMetaPoint(function(metapoint, x, y) {
			if( metapoint.edge ) {
				points.push({x: x, y: y});
			}
		});

		return points;
	};

	_self.getInside = function() {
		var points = [];

		_self.eachMetaPoint(function(metapoint, x, y) {
			if( metapoint.inside ) {
				points.push({x: x, y: y});
			}
		});

		return points;
	};

	_self.getLine = function(startPoint, endPoint) {
		var points	= [];
		var slope		= (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);

		if( startPoint.x == endPoint.x && startPoint.y == endPoint.y ) {
			return [];
		}

		if( Math.abs(slope) > 1 ) {
			slope = (endPoint.x - startPoint.x) / (endPoint.y - startPoint.y);

			if( startPoint.y < endPoint.y ) {
				var start	= startPoint;
				var end	= endPoint;
			} else {
				var start	= endPoint;
				var end	= startPoint;
			}

			var offset = start.x - slope * start.y;

			for(var y = start.y; y <= end.y; y++) {
				var x = Math.round(slope * y + offset);

				points.push({x: x, y: y});
			}
		} else {
			if( startPoint.x < endPoint.x ) {
				var start	= startPoint;
				var end	= endPoint;
			} else {
				var start	= endPoint;
				var end	= startPoint;
			}

			var offset = start.y - slope * start.x;

			for(var x = start.x; x <= end.x; x++) {
				var y = Math.round(slope * x + offset);

				points.push({x: x, y: y});
			}
		}

		return points;
	};

	_self.getRectangle = function(pointOne, pointTwo) {
		var points = [];

		if( pointOne.x == pointTwo.x && pointOne.y == pointTwo.y ) {
			return [{x: pointOne.x, y: pointOne.y}];
		}

		var minBound = {
			x:	(pointTwo.x > pointOne.x ) ? pointOne.x : pointTwo.x,
			y:	(pointTwo.y > pointOne.y ) ? pointOne.y : pointTwo.y
		};

		var maxBound = {
			x:	(pointTwo.x < pointOne.x ) ? pointOne.x : pointTwo.x,
			y:	(pointTwo.y < pointOne.y ) ? pointOne.y : pointTwo.y
		};

		var bounds = _self.normalizeBounds({min: minBound, max: maxBound});

		for(var x = bounds.min.x; x <= bounds.max.x; x++) {
			for(var y = bounds.min.y; y <= bounds.max.y; y++) {
				points.push({x: x, y: y});
			}
		}

		return points;
	};

	_self.seedLoop = function() {
		var start		= _self.getRandomPoint();
		var width		= Math.ceil(Math.random() * 60) + 9;
		var height	= Math.ceil(Math.random() * 60) + 9;

		// North edge
		for(var x = 0, y = 0; x < width; x++) {
			if( _self.getPoint(start.x + x, start.y + y) == undefined ) {
				width = x;
				break;
			}

			_self.setPoint(start.x + x, start.y + y, 1);
		}

		// West edge
		for(var x = 0, y = 0; y < height; y++) {
			if( _self.getPoint(start.x + x, start.y + y) == undefined ) {
				height = y;
				break;
			}

			_self.setPoint(start.x + x, start.y + y, 1);
		}

		// South edge
		for(var x = 0, y = height - 1; x < width; x++) {
			if( _self.getPoint(start.x + x, start.y + y) == undefined ) {
				break;
			}

			_self.setPoint(start.x + x, start.y + y, 1);
		}

		// West edge
		for(var x = width - 1, y = 0; y < height; y++) {
			if( _self.getPoint(start.x + x, start.y + y) == undefined ) {
				break;
			}

			_self.setPoint(start.x + x, start.y + y, 1);
		}
	};

	_self.getCircle = function(origin, radius, type) {
		var type			= type || 'all';
		var points		= [];
		var offsetPoints	= [];

		// Check against "type" argument to see if point should be included. Optionally check for duplicate points
		var shouldIncludePoint = function(point, checkDupes = false) {
			if( point.type == type || type == 'all' ) {
				if( checkDupes ) {
					for(var testPoint of points) {
						if( testPoint.x == point.x && testPoint.y == point.y ) {
							return false;
						}
					}
				}

				return true;
			}

			return false;
		};

		// Get edge points on one 45 deg arc
		for(var i = 0; i < radius; i++) {
			var edgePoint = {type: 'edge'};
			var j = Math.sqrt( (radius * radius) - (i * i) );

			j = Math.round(j);

			if( !isNaN(j) ) {
				edgePoint.x = i;
				edgePoint.y = j;

				if( shouldIncludePoint(edgePoint) ) {
					points.push(edgePoint);
				}
			}
		}

		// Mirror the points into a 90 degree arc
		for(var index in points) {
			var point = points[index];
			var mirrorPoint = {type: 'edge'};

			// Skip any points that will turn out the same after being mirrored
			if( point.x == point.y ) {
				continue;
			}

			mirrorPoint.x = point.y;
			mirrorPoint.y = point.x;

			if( shouldIncludePoint(mirrorPoint, true) ) {
				points.push(mirrorPoint);
			}
		}

		// Add all points inside the arc
		var previousX;

		for(var index in points) {
			var point = points[index];

			// Ensure that the Y values don't repeat to avoid duplicate points
			if(point.x == previousX) {
				continue;
			}

			for(var insideY = point.y - 1; insideY > -1; insideY--) {
				var insidePoint = {type: 'interior'};

				insidePoint.x = point.x;
				insidePoint.y = insideY;

				if( shouldIncludePoint(insidePoint, true) ) {
					points.push(insidePoint);
				}
			}

			previousX = point.x;
		}

		// Mirror points about Y-axis
		for(var index in points) {
			var point = points[index];
			var mirrorPoint = {};

			if( point.x != 0 ) {
				mirrorPoint.x = -1 * point.x;
				mirrorPoint.y = point.y;
				mirrorPoint.type = point.type;

				if( shouldIncludePoint(mirrorPoint) ) {
					points.push(mirrorPoint);
				}
			}
		}

		// Mirror points about X-axis
		for(var index in points) {
			var point = points[index];
			var mirrorPoint = {};

			if( point.y != 0 ) {
				mirrorPoint.x = point.x;
				mirrorPoint.y = -1 * point.y;
				mirrorPoint.type = point.type;

				if( shouldIncludePoint(mirrorPoint) ) {
					points.push(mirrorPoint);
				}
			}
		}

		// Apply offset to points based on origin
		for(var index in points) {
			var point = points[index];
			var offsetPoint = {};

			offsetPoint.x = point.x + origin.x;
			offsetPoint.y = point.y + origin.y;

			offsetPoints.push(offsetPoint);
		}

		return offsetPoints;
	};

	_self.getVectorPath = function() {
		var points = [];

		points = points.concat( _self.getHull() );
		points = points.concat( _self.getInterior() );

		return points;
	};

	_self.getLeftMostPoint = function() {
		var startPoint = false;

		_self.eachPoint(function(point, x, y) {
			if( point ) {
				if( !startPoint ) {
					startPoint = {x: x, y: y};
				} else {
					if( x < startPoint.x ) {
						startPoint.x = x;
						startPoint.y = y;
					}
				}
			}
		});

		return startPoint;
	};

	_self.getHull = function() {
		var startPoint	= _self.getLeftMostPoint();
		var hullPoints	= [];
		var visited	= {};
		var dirs		= [
			{dir: 'e',	x: 1,	y: 0},
			//{dir: 'se',	x: 1,	y: 1},
			{dir: 's',	x: 0,	y: 1},
			//{dir: 'sw',	x: -1,	y: 1},
			{dir: 'w',	x: -1,	y: 0},
			//{dir: 'nw',	x: -1,	y: -1},
			{dir: 'n',	x: 0,	y: -1},
			//{dir: 'ne',	x: 1,	y: -1}
		];

		if( !startPoint ) {
			return [];
		}

		function hullBranch(sourcePoint) {
			var sourceMeta		= _self.getMetaPoint(sourcePoint.x, sourcePoint.y);
			var visitedIndex	= sourcePoint.x + ',' + sourcePoint.y;

			if( sourceMeta.edge ) {
				if( !visited.hasOwnProperty(visitedIndex) ) {
					hullPoints.push({x: sourcePoint.x, y: sourcePoint.y});
					visited[visitedIndex] = true;

					for(var direction of dirs) {
						if( sourceMeta.neighbors[direction.dir] ) {
							var branchPoint = {
								x:	sourcePoint.x + direction.x,
								y:	sourcePoint.y + direction.y
							};

							hullBranch(branchPoint);
						}
					}
				}
			}
		}

		hullBranch(startPoint);

		return hullPoints;
	};

	_self.getInterior = function() {
		var interiorPoints = [];

		_self.eachPoint(function(point, x, y) {
			if( point ) {
				var meta = _self.getMetaPoint(x, y);

				if( meta.inside ) {
					interiorPoints.push({x: x, y: y});
				}
			}
		});

		return interiorPoints;
	};

	_self.findSpace = function(width, height) {
		var testWidth	= width - 1;
		var testHeight	= height - 1;
		var freePoints	= false;

		_self.eachPointRandom(function(point, x, y) {
			if( point ) {
				var subRectangle	= _self.getRectangle({x: x, y: y}, {x: x + testWidth, y: y + testHeight});
				var subIsFree		= true;

				// Check that all points in the rectangle are set
				_self.withPoints(subRectangle, function(subPoint, subX, subY) {
					// If point is not set, area is not usable
					if( !subPoint ) {
						subIsFree = false;

						return true;
					}
				});

				// If freePoints found, break outer eachPoint loop
				if( subIsFree ) {
					freePoints = {
						starter:	{
							x:	x,
							y:	y
						},
						points:	subRectangle
					};

					return true;
				}
			}
		});

		return freePoints;
	};

	_self.pathfind = function(start, end, bounds = false, noDiagonals = false) {
		var pathPoints	= [];
		var pathFound	= false;

		if( bounds ) {
			var subWidth	= bounds.max.x - bounds.min.x + 1;
			var subHeight	= bounds.max.y - bounds.min.y + 1;
			var grid		= new Grid(subWidth, subHeight);

			_self.eachPointWithin(bounds.min, bounds.max, function(point, x, y) {
				if( point ) {
					grid.setPoint(x - bounds.min.x, y - bounds.min.y, 1);
				}
			});

			start.x -= bounds.min.x;
			start.y -= bounds.min.y;
			end.x -= bounds.min.x;
			end.y -= bounds.min.y;
		} else {
			var grid = _self.clone();
		}

		grid.invert().setHexValues();

		var directionCoords = {
			'n':		{coords: {x: 0, y: -1}, diagonal: false, adjacent: ['nw', 'ne']},
			'e':		{coords: {x: 1, y: 0}, diagonal: false, adjacent: ['ne', 'se']},
			's':		{coords: {x: 0, y: 1}, diagonal: false, adjacent: ['sw', 'se']},
			'w':		{coords: {x: -1, y: 0}, diagonal: false, adjacent: ['nw', 'sw']},
			'ne':	{coords: {x: 1, y: -1}, diagonal: true, adjacent: ['n', 'e']},
			'se':	{coords: {x: 1, y: 1}, diagonal: true, adjacent: ['s', 'e']},
			'sw':	{coords: {x: -1, y: 1}, diagonal: true, adjacent: ['s', 'w']},
			'nw':	{coords: {x: -1, y: -1}, diagonal: true, adjacent: ['n', 'w']}
		};

		function isNonSquareDirection(dir) {
			if( dir == 'ne' || dir == 'nw' || dir == 'se' || dir == 'sw' ) {
				return true;
			}

			return false;
		}

		function setAdjacentStepValues(basePoints, endPoint, step = 2) {
			if( step == 2 ) {
				grid.setPoint(basePoints.x, basePoints.y, 2);

				basePoints = [basePoints];
			}

			var nextBasePoints = [];

			for(var basePoint of basePoints) {
				var meta = grid.getMetaPoint(basePoint.x, basePoint.y);

				for(var dir in meta.neighbors) {
					/*
					if( noDiagonals && isNonSquareDirection(dir) ) {
						continue;
					}
					*/

					var dirValue = meta.neighbors[dir];

					if( dirValue ) {
						var neighbor		= {x: basePoint.x + directionCoords[dir].coords.x, y: basePoint.y + directionCoords[dir].coords.y};
						var neighborValue	= grid.getPoint(neighbor.x, neighbor.y);

						if( neighbor.x == endPoint.x && neighbor.y == endPoint.y ) {
							pathFound = true; // end point has been reached
						}

						// If neighbor is diagonal, check adjacent non-diagonal neigbors to see if they are traversable.
						// A diagonal is only considered a valid path if all three spaces are free.
						if( directionCoords[dir].diagonal ) { // && !noDiagonals
							var diagAvailable = true;

							// For each of adjacenet neighbors
							for(var adjacentDir of directionCoords[dir].adjacent) {
								var adjNeighbor		= {x: basePoint.x + directionCoords[adjacentDir].coords.x, y: basePoint.y + directionCoords[adjacentDir].coords.y};
								var adjNeighborValue	= grid.getPoint(adjNeighbor.x, adjNeighbor.y);

								// If adjacenet neighbor is non-traversable, diagonal is not a valid option
								if( !adjNeighborValue ) {
									diagAvailable = false;
									break;
								}
							}

							if( !diagAvailable ) {
								pathFound = false;
								continue;
							}
						}

						if( neighborValue == 1 ) {
							grid.setPoint(neighbor.x, neighbor.y, step + 1);

							nextBasePoints.push(neighbor);
						}
					}
				}
			}

			// Recurse if the routine hasn't deadended without having hit the end point
			if( nextBasePoints.length > 0 && !pathFound ) {
				setAdjacentStepValues(nextBasePoints, endPoint, step + 1);
			}
		}

		// Supply points in reverse order, since at conclusion the path will be created from end to start
		setAdjacentStepValues(start, end);

		if( !pathFound ) {
			return false;
		}

		function assembleShortestPathPoints(grid, currentPoint, endPoint, path = []) {
			var point			= grid.getPoint(currentPoint.x, currentPoint.y);
			var meta			= grid.getMetaPoint(currentPoint.x, currentPoint.y);
			var possiblePoints	= [];
			var finished		= false;

			for(var dir in meta.neighbors) {
				/*
				if( noDiagonals && isNonSquareDirection(dir) ) {
					continue;
				}
				*/

				var dirValue = meta.neighbors[dir];

				if( dirValue ) {
					var neighbor		= {x: currentPoint.x + directionCoords[dir].coords.x, y: currentPoint.y + directionCoords[dir].coords.y};
					var neighborValue	= grid.getPoint(neighbor.x, neighbor.y);

					if( neighborValue == point - 1 ) {
						possiblePoints.push(neighbor);
					}
				}
			}

			if( possiblePoints.length == 0 ) {
				return path;
			}

			var randIndex = Math.floor( Math.random() * possiblePoints.length );
			var randPoint = possiblePoints[randIndex];

			if( randPoint.x == endPoint.x && randPoint.y == endPoint.y ) {
				finished = true;
			}

			path.push(randPoint);

			if( !finished ) {
				assembleShortestPathPoints(grid, randPoint, endPoint, path);
			}

			return path;
		}

		pathPoints = assembleShortestPathPoints(grid, end, start, [end]);

		// Offset points by min bounds
		if( bounds && pathPoints ) {
			for(var point of pathPoints) {
				point.x += bounds.min.x;
				point.y += bounds.min.y;
			}
		}

		return pathPoints;
	};

	_self.init(config);
};
