var Grid = function(width, height, wrap = false) {
	/*
	 * The Grid class allows for creation of randomized two-dimensional arrays of values.
	 *
	 * @class		Grid
	 */
	var _self		= this;
	var _width	= width;
	var _height	= height;
	var _scratch	= [];
	var _points	= [];
	var _meta		= [];
	var _wrap		= Boolean(wrap);

	/**
	 * Perform basic initialization of arrays and seeding depending on configuration.
	 *
	 * @method	init
	 * @public
	 * @param		{integer}		percent	Percentage of grid to fill with "true" points
	 */
	_self.init = function() {
		// Setup _points and _scratch as two-dimensional arrays filled with 0's
		for(var y = 0; y < _height; y++) {
			var pointColumn	= [];
			var scratchColumn	= [];
			var metaColumn		= [];

			for(var x = 0; x < _width; x++) {
				pointColumn.push(0);
				scratchColumn.push(0);

				var meta = {
					actors:		{doodads: [], enemies: [], friendlies: [], terrain: []},
					edge:		false,
					inside:		false,
					hex:			0,
					neighbors:	0,
					rotations:	0,
					type:		''
				};

				metaColumn.push(meta);
			}

			_points.push(pointColumn);
			_scratch.push(scratchColumn);
			_meta.push(metaColumn);
		}
	}

	_self.empty = function() {
		_self.eachPoint(function(point, x, y) {
			_self.setPoint(x, y, 0);
		});

		return _self;
	};

	/**
	 * Iterates over each item in _points and passes them to a callback function.
	 *
	 * @method	eachPoint
	 * @public
	 * @param		{function}	callback		A callback function
	 */
	_self.eachPoint = function(callback) {
		for(var y = 0; y < _height; y++) {
			for(var x = 0; x < _width; x++) {
				var point = _points[y][x];

				callback(point, x, y);
			}
		}
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

			callback(point, coord.x, coord.y);
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
	_self.eachPointWithin = function(minBound, maxBound, callback) {
		minBound = _self.normalize(minBound.x, minBound.y) || {x: 0, y: 0};
		maxBound = _self.normalize(maxBound.x, maxBound.y) || {x: _width - 1, y: _height - 1};

		for(var x = minBound.x; x <= maxBound.x; x++) {
			for(var y = minBound.y; y <= maxBound.y; y++) {
				var point = _points[y][x];

				callback(point, x, y);
			}
		}
	};

	/**
	 * Iterates over each edge item in _points and passes them to a callback function.
	 *
	 * @method	eachEdgePoint
	 * @public
	 * @param		{function}	callback		A callback function
	 */
	_self.eachEdgePoint = function(callback) {
		// North edge
		for(var x = 0, y = 0; x < _width; x++) {
			var point = _points[y][x];

			callback(point, x, y);
		}

		// West edge
		for(var x = 0, y = 0; y < _height; y++) {
			var point = _points[y][x];

			callback(point, x, y);
		}

		// South edge
		for(var x = 0, y = _height - 1; x < _width; x++) {
			var point = _points[y][x];

			callback(point, x, y);
		}

		// West edge
		for(var x = _width - 1, y = 0; y < _height; y++) {
			var point = _points[y][x];

			callback(point, x, y);
		}
	};

	/**
	 * Iterate through each item in _scratch and pass them to a callback function.
	 *
	 * @method	eachScratchPoint
	 * @public
	 * @param		{function}	callback		A callback function
	 */
	_self.eachScratchPoint = function(callback) {
		for(var y = 0; y < _height; y++) {
			for(var x = 0; x < _width; x++) {
				var point = _scratch[y][x];

				callback(point, x, y);
			}
		}
	};

	/**
	 * Iterate through each item in _meta and pass them to a callback function.
	 *
	 * @method	eachScratchPoint
	 * @public
	 * @param		{function}	callback		A callback function
	 */
	_self.eachMetaPoint = function(callback) {
		for(var y = 0; y < _height; y++) {
			for(var x = 0; x < _width; x++) {
				var point = _meta[y][x];

				callback(point, x, y);
			}
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
		});

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
		});

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

	_self.getPoints = function() {
		return _points;
	};

	_self.getMetaPoints = function() {
		return _meta;
	};

	/**
	 * Get value at coordinates (x, y) from _points.
	 *
	 * @method	getPoint
	 * @public
	 * @return	{integer}
	 */
	_self.getPoint = function(x, y) {
		var coords = _self.normalize(x, y);

		if( coords ) {
			return _points[coords.y][coords.x];
		}

		return;
	};

	_self.getRandomPoint = function() {
		var randX		= Math.floor( Math.random() * _width );
		var randY		= Math.floor( Math.random() * _height );
		var randPoint	= {
			x:		randX,
			y:		randY,
			value:	_self.getPoint(randX, randY)
		};

		return randPoint;
	};

	/**
	 * Get value at coordinates (x, y) from _scratchPoints.
	 *
	 * @method	getScratcPoint
	 * @public
	 * @return	{integer}
	 */
	_self.getScratchPoint = function(x, y) {
		var coords = _self.normalize(x, y);

		if( coords ) {
			return _scratch[coords.y][coords.x];
		}

		return false;
	};

	/**
	 * Get metavalue at coordinates (x, y) from _meta.
	 *
	 * @method	getMetaPoint
	 * @public
	 * @return	{object}
	 */
	_self.getMetaPoint = function(x, y) {
		var coords = _self.normalize(x, y);

		if( coords ) {
			return _meta[coords.y][coords.x];
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
		var normalized = _self.normalize(x, y);

		if( normalized ) {
			_scratch[normalized.y][normalized.x] = value;
		}
	};

	_self.setMetaPoint = function(x, y, value) {
		var normalized = _self.normalize(x, y);

		if( normalized ) {
			_meta[normalized.y][normalized.x] = value;
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

	_self.hexToType = function(hex) {
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
					}
				} else if( north && east ) {
					rotations += 1;

					if( ne ) {
						type = 'corner';
					}
				} else if( east && south ) {
					rotations += 2;

					if( se ) {
						type = 'corner';
					}
				} else {
					rotations += 3;

					if( sw ) {
						type = 'corner';
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

		return {type: type, rotations: rotations};
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
			var inverted = !point;

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

	/**
	 * Sets each value in _points to 1 based on provided probabality value.
	 *
	 * @method	seed
	 * @public
	 * @param		{float}	percent		Percent chance for any given point to be set to one.
	 */
	_self.seedRandom = function(percent) {
		var decimal = percent / 100;

		_self.eachPoint(function(point, x, y) {
			var pointValue = (Math.random() < decimal) ? 1 : 0;

			_self.setPoint(x, y, pointValue);
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

				if( meta.neighbors > 6 ) {
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

	_self.seedSpires = function() {
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

			if( Game.utilities.pointsMatch(currentPoint, endPoint) ) {
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
				if( !Game.utilities.pointsHavePoint(coveredPoints, nextCoords) ) {
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
	 * @param		{integer}		segmentMin	Minimum segment length
	 * @param		{integer}		segmentMax	Maximum segment length
	 * @param		{integer}		width		Width of rectangle shapes
	 */
	_self.seedRectangularLattice = function(segmentMin = 1, segmentMax = 3, segmentWidth = 1, horzSpacing = 1, vertSpacing = 1) {
		var seedLength;
		var curLength	= 0;
		var space		= 1;
		var seeding	= false;

		_self.eachPoint(function(point, x, y) {
			// Seed every Nth row
			if( y % (segmentWidth + vertSpacing) == 0 ) {
				if( seeding ) {
					for(var w = 0; w < segmentWidth; w++) {
						_self.setPoint(x, y + w, 1);
					}

					curLength++;

					if( curLength == seedLength ) {
						seeding	= false;
						space	= 1;
					}
				} else {
					if( space == horzSpacing ) {
						seeding		= true;
						curLength		= 0;
						seedLength	= Math.floor( Math.random() * (segmentMax - segmentMin + 1) ) + segmentMin;
					}

					space ++;
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

	/*
	_self.findPointExtremes = function(points) {
		var xLowest	= 0;
		var yLowest	= 0;
		var xHighest	= 0;
		var yHighest	= 0;

		this.eachPoint(function(point) {
			if( point.x < xLowest ) {
				xLowest = point.x;
			}
			if( point.y < yLowest ) {
				yLowest = point.y;
			}
			if( point.x > xHighest ) {
				xHighest = point.x;
			}
			if( point.y > yHighest ) {
				yHighest = point.y;
			}
		});

		return {
			lowest:	{x: xLowest, y: yLowest},
			highest:	{x: xHighest, y: yHighest}
		};
	};
	*/

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


	// Set each point's value based on its number of neighbors and where those neighbors lie
	_self.setHexValues = function() {
		_self.eachPoint(function(point, x, y) {
			var value		= 0;
			var neighbors	= 0;
			var edge		= false;
			var inside	= false;

			// Self
			if( point ) {
				value += 256;
			}
			// NE
			if( _self.getPoint(x + 1, y - 1) ) {
				value += 128;
				neighbors++;
			}
			// SE
			if( _self.getPoint(x + 1, y + 1) ) {
				value += 64;
				neighbors++;
			}
			// SW
			if( _self.getPoint(x - 1, y + 1) ) {
				value += 32;
				neighbors++;
			}
			// NW
			if( _self.getPoint(x - 1, y - 1) ) {
				value += 16;
				neighbors++;
			}
			// N
			if( _self.getPoint(x, y - 1) ) {
				value += 8;
				neighbors++;
			}
			// E
			if( _self.getPoint(x + 1, y) ) {
				value += 4;
				neighbors++;
			}
			// S
			if( _self.getPoint(x, y + 1) ) {
				value += 2;
				neighbors++;
			}
			// W
			if( _self.getPoint(x - 1, y) ) {
				value += 1;
				neighbors++;
			}

			// Inside
			if( value == 511) {
				inside = true;
			}

			// Edge
			if( value >= 256 && value < 511 ) {
				edge = true;
			}

			var data = _self.hexToType(value);

			_self.updateMetaProp(x, y, 'hex', value);
			_self.updateMetaProp(x, y, 'neighbors', neighbors);
			_self.updateMetaProp(x, y, 'edge', edge);
			_self.updateMetaProp(x, y, 'inside', inside);
			_self.updateMetaProp(x, y, 'rotations', data.rotations);
			_self.updateMetaProp(x, y, 'type', data.type);

			/*
			var terrain = 'namespace-' + data.type + '-' + data.rotations;

			_self.updateMetaProp(x, y, 'hex', value);
			_self.updateMetaProp(x, y, 'type', data.type); // can be removed if terrain set
			_self.updateMetaProp(x, y, 'rotations', data.rotations); // can be removed if terrain set
			_self.updateMetaProp(x, y, 'terrain', terrain);
			*/

			// TODO: just generate and set terrain name here?
			// Can also possibly just discard hex value?

			//_self.setScratchPoint(x, y, value);
		});

		return _self;
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
		});

		_self.setHexValues();

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

	_self.subtractGrid = function(gridObj, offset = {x: 0, y: 0}) {
		// Reset point and meta values
		gridObj.eachPoint(function(point, x, y) {
			if( point ) {
				var adjX = x + offset.x;
				var adjY = y + offset.y;
				var meta = {
					actors:		{doodads: [], enemies: [], friendlies: [], terrain: []},
					edge:		false,
					inside:		false,
					hex:			0,
					neighbors:	0,
					rotations:	0,
					type:		''
				};

				_self.setPoint(adjX, adjY, 0);
				_self.setMetaPoint(adjX, adjY, meta);
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

		return _self;
	};

	/**
	 * Adds a character name into a metapoint actor array.
	 *
	 * @method	addPointActor
	 * @public
	 * @param		{integer}		x			X-coordinate
	 * @param		{integer}		y			Y-coordinate
	 * @param		{string}		actorType		Property name of meta actor array
	 * @param		{string}		actorName		Character name
	 */
	_self.addPointActor = function(x, y, actorType, actorName) {
		// Retrieve meta
		var metaPoint = _self.getMetaPoint(x, y);

		// Push to meta
		metaPoint[actorType].push(actorName);

		// Reinsert meta
		_self.setMetaPoint(x, y, metaPoint);
	};

	/**
	 * Removes a character name from a metapoint actor array.
	 *
	 * @method	pluckPointActor
	 * @public
	 * @param		{integer}		x			X-coordinate
	 * @param		{integer}		y			Y-coordinate
	 * @param		{string}		actorType		Property name of meta actor array
	 * @param		{string}		actorName		Character name
	 */
	_self.pluckPointActor = function(x, y, actorType, actorName) {
		// Retrieve meta
		var metaPoint = _self.getMetaPoint(x, y);

		// Check for instance of actor and splice out if present
		var index = metaPoint[actorType].indexOf(actorName);

		if( index != -1 ) {
			metaPoint[actorType].splice(index, 1);
		}

		// Reinsert meta
		_self.setMetaPoint(x, y, metaPoint);
	};

	/**
	 * Merges a grid's points into this one's as well as adds values into the metapoint's "actors" property.
	 *
	 * @method	absorbGridAsActor
	 * @public
	 *
	 * @param		{Grid}	gridObj	A Grid object
	 * @param		{object}	offset	A point object
	 * @param		{string}	key		Which actor type array to push to
	 * @param		{string}	value	Any value to be stored in the metapoint
	 */
	_self.absorbGridAsActor = function(gridObj, offset, key, value) {
		// Copy over point values
		gridObj.eachPoint(function(point, x, y) {
			if( point ) {
				var adjX = x + offset.x;
				var adjY = y + offset.y;
				var meta = _self.getMetaPoint(adjX, adjY);

				meta.actors[key].push(value);

				_self.setPoint(adjX, adjY, point);
				_self.setMetaPoint(adjX, adjY, meta);
			}
		});

		return _self;
	};

	_self.populate = function(percent = 50) {
		var chance = (1 - (percent / 100)) || 0.5;

		_self.eachPoint(function(point, x, y) {
			if( Math.random() > chance ) {
				_self.setPoint(x, y, 1);
			}
		});

		return _self;
	};

	_self.depopulate = function(percent = 50) {
		var chance = (1 - (percent / 100)) || 0.5;

		_self.eachPoint(function(point, x, y) {
			if( Math.random() > chance ) {
				_self.setPoint(x, y, 0);
			}
		});

		return _self;
	};

	_self.fill = function(minNeighbors = 8, strictMode = false) {
		_self.eachMetaPoint(function(metapoint, x, y) {
			if( metapoint.neighbors >= minNeighbors ) {
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
	_self.getOffsetPoints = function(x, y, offset = 1) {
		var offsetPoint;
		var points = [];

		var horzPoints = _self.getHorizontallyOffsetPoints(x, y, offset, offset);
		var vertPoints = _self.getVerticallyOffsetPoints(x, y, offset, offset);

		points = [...vertPoints, ...horzPoints];


		return points;
	};

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

	/**
	 * Checks if all supplied points match a specified metavalue.
	 *
	 * @method	pointsHaveMetavalue
	 * @public
	 * @param		{array}	points	An array of point objects
	 * @param		{string}	prop		A metapoint property
	 * @param		{string}	value	A metapoint value
	 * @return	{boolean}			Returns true if all metavalues match
	 */
	_self.pointsHaveMetavalue = function(points, prop, value) {
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
				if( !_self.pointsHaveMetavalue(extendedPoints, 'width', 1) || !_self.pointsHaveMetavalue(extendedPoints, 'height', 1) ) {
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
				if( !_self.pointsHaveMetavalue(extendedPoints, 'width', 1) || !_self.pointsHaveMetavalue(extendedPoints, 'height', 1) ) {
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

		var minBound = {
			x:	(pointTwo.x > pointOne.x ) ? pointOne.x : pointTwo.x,
			y:	(pointTwo.y > pointOne.y ) ? pointOne.y : pointTwo.y
		};

		var maxBound = {
			x:	(pointTwo.x < pointOne.x ) ? pointOne.x : pointTwo.x,
			y:	(pointTwo.y < pointOne.y ) ? pointOne.y : pointTwo.y
		};

		for(var x = minBound.x; x <= maxBound.x; x++) {
			for(var y = minBound.y; y <= maxBound.y; y++) {
				points.push({x: x, y: y});
			}
		}

		return points;
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

	_self.init();
};
