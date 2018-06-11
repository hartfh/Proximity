module.exports = new function() {
	const VPORT_BUFFER_X	= 8;
	const VPORT_BUFFER_Y	= 8;
	const PATHFIND_BUFFER_X	= 6;
	const PATHFIND_BUFFER_Y	= 5;
	const CONTENT_KEY		= [];
	const CONTENT_TYPES		= [
		{
			name:		'blockage',
			code:		'B',
			slot:		's',
			trackable:	false,
		},
		{
			name:		'building',
			code:		'G',
			slot:		's',
			trackable:	false,
		},
		{
			name:		'enemy',
			code:		'E',
			slot:		's',
			trackable:	true,
		},
		{
			name:		'friendly',
			code:		'F',
			slot:		's',
			trackable:	true,
		},
		{
			name:		'player',
			code:		'P',
			slot:		's',
			trackable:	true,
		},
		{
			name:		'npc',
			code:		'N',
			slot:		's',
			trackable:	true,
		},
		{
			name:		'obstruction',
			code:		'O',
			slot:		's',
			trackable:	false,
		},
		{
			name:		'sidewalk',
			code:		'W',
			slot:		'n',
			trackable:	false,
		},
		{
			name:		'street',
			code:		'R',
			slot:		'n',
			trackable:	false,
		},
		{
			name:		'temporary',
			code:		'X',
			slot:		's',
			trackable:	false,
		},
		/*
		{
			name:		'sunken',
			code:		'U',
			slot:		'm',
			trackable:	false,
		},
		*/
	];

	var _self			= this;
	var _bounds		= {min: false, max: false};
	var _grid			= new Grid(Constants.MAP_BLOCK_WIDTH * Constants.MAP_BLOCK_SIZE, Constants.MAP_BLOCK_HEIGHT * Constants.MAP_BLOCK_SIZE, {data: false});
	var _vportCenter	= {x: false, y: false};

	// Create two-way content key
	for(let data of CONTENT_TYPES) {
		CONTENT_KEY[data.code] = data;
		CONTENT_KEY[data.name] = data;
	}

	var _init = function() {};

	_self.start = function(saveData) {
		if( saveData ) {
			_unserializeGrid(saveData);
		}

		_enableProfileUpdating();
	};

	_self.die = function() {
		_disableProfileUpdating();
		_resetGrid();
	};

	function _getCodeFromType(name) {
		return CONTENT_KEY[name].code;
	}

	function _getTypeFromCode(code) {
		return CONTENT_KEY[code].name;
	}

	function _serializeGrid() {
		var serialized = [];

		// Represent each point by two characters, one for "solid" objects and the other for "non-solid" objects
		_grid.eachPoint(function(content, x, y) {
			if( content ) {
				var value = '';

				value += content.s || '0';
				value += content.m || '0';
				value += content.n || '0';

				value = value.replace('X', '0'); // remove any temporary values

				serialized.push(value);
			} else {
				serialized.push('000');
			}
		});

		return serialized.join(',');
	}

	function _unserializeGrid(serialized) {
		var gridDimensions = _grid.getDimensions();

		serialized = serialized.replace('X', '0');
		serialized = serialized.split(',');

		for(var index in serialized) {
			var value = serialized[index];

			var x = index % gridDimensions.width;
			var y = Math.floor( index / gridDimensions.width );

			if( value == '000' ) {
				_grid.setPoint(x, y, 0);
			} else {
				_grid.setPoint(x, y, {s: value[0], m: value[1], n: value[2], id: false});
			}
		}
	}

	function _pushMapGridProfile() {
		Game.Profile.map = _serializeGrid();
	}

	/**
	 * Sets up continous map grid information feedback to Game.Profile
	 */
	function _enableProfileUpdating() {
		Game.Events.subscribe('50-ticks', _pushMapGridProfile, 'mapgrid-push-profile');
	}

	/**
	 * Disables map grid profile information feedback to Game.Profile
	 */
	function _disableProfileUpdating() {
		Game.Events.unsubscribe('50-ticks', 'mapgrid-push-profile');
	}

	/**
	 * Converts a world position value into a pair of map grid cell indices.
	 *
	 * @method	convertPosition
	 * @public
	 * @param		{object}	position		World point object
	 * @return	{object}
	 */
	_self.convertPosition = function(position) {
		return {
			x:	Math.floor( position.x / Constants.TERRAIN_TILE_SIZE ),
			y:	Math.floor( position.y / Constants.TERRAIN_TILE_SIZE )
		};
	};

	/**
	 * Converts a set of Map Grid coordinates into a world position.
	 *
	 * @method	convertGridCoordinates
	 * @public
	 * @param		{object}	coordinates		Grid indices object
	 * @return	{object}
	 */
	_self.convertGridCoordinates = function(coordinates) {
		return {
			x:	(coordinates.x + 0.5) * Constants.TERRAIN_TILE_SIZE,
			y:	(coordinates.y + 0.5) * Constants.TERRAIN_TILE_SIZE
		};
	};

	/**
	 * Checks if a grid cell is empty.
	 *
	 * @method	isCellEmpty
	 * @public
	 * @param		{object}	gridPosition		Map grid coordinates
	 * @return	{boolean}
	 */
	_self.isCellEmpty = function(gridPosition) {
		var point = _grid.getPoint(gridPosition.x, gridPosition.y);

		if( point ) {
			if( point.s || point.m ) {
				return false;
			} else {
				return true;
			}
		}

		return true;
	};

	/**
	 * Checks if a world position point is within an empty grid cell.
	 *
	 * @method	isPositionEmpty
	 * @public
	 * @param		{object}	position		World position object with x- and y-coordinates
	 * @return	{boolean}
	 */
	_self.isPositionEmpty = function(position) {
		var gridPosition	= _self.convertPosition(position);
		var point			= _grid.getPoint(gridPosition.x, gridPosition.y);

		if( point ) {
			if( point.s || point.m ) {
				return false;
			} else {
				return true;
			}
		}

		return true;
	};

	/**
	 * Returns all filled grid coordinates with a matching supplied "type."
	 *
	 * @method	getAllWithinPoints
	 * @public
	 * @param		{string}	type		Content type to match against.
	 * @param		{object}	bounds	A object with min/max boundary properties.
	 * @return	{array}			Array of ????????
	 */
	_self.getAllWithinPoints = function(type, bounds) {
		var gridBounds = {
			min:		_self.convertPosition(bounds.min),
			max:		_self.convertPosition(bounds.max)
		};

		_grid.eachPointWithin(gridBounds.min, gridBounds.max, function(content, x, y) {
			if( content ) {
				if( content.type == type ) {
					// point contains the desired type
					// have access to body ID
					// Game.World.get(content.id);
				}
			}
		});
	};

	/**
	 * Returns _grid to its initial state with no filled ponts and all position-update events cleared.
	 *
	 * @method	_resetGrid
	 * @private
	 */
	function _resetGrid() {
		_grid.eachPoint(function(content, x, y) {
			if( content && content.id ) {
				_self.deregisterBody(content.id);
			}

			_grid.setPoint(x, y, 0);
		});
	};

	/**
	 * Checks that a supplied content type is considered valid.
	 *
	 * @method	isValidContentType
	 * @public
	 * @param		{string}	contentType	Type to check against
	 * @return	{boolean}
	 */
	_self.isValidContentType = function(type) {
		if( CONTENT_KEY[type] ) {
			return true;
		} else {
			return false;
		}
	};

	_self.isSolidContentType = function(type) {
		let slot = CONTENT_KEY[type].slot;

		return (slot == 's' || slot == 'm');
	};

	/*
	_self.isPermanentContentType = function(contentType) {
		var permanent = false;

		switch(contentType) {
			//case 'S':
			case 'T':
				permanent = true;
				break;
			default:
				break;
		}

		return permanent;
	};
	*/

	/**
	 * Registers a game event that checks against a body's current and last MapGrid positions and updates when changes occur.
	 *
	 * @method	registerBody
	 * @public
	 * @param		{object}		body		A Matter.js Body object
	 * @param		{integer}		x		X-coordinate
	 * @param		{integer}		y		Y-coordinate
	 */
	_self.registerBody = function(body, x, y) {
		body.mapgrid = {x: x, y: y};

		Game.Events.subscribe('50-ticks', function() {
			var latest = _self.convertPosition(body.position);

			if( latest.x != body.mapgrid.x || latest.y != body.mapgrid.y ) {
				var content = _grid.getPoint(body.mapgrid.x, body.mapgrid.y);

				_self.remove(body);
				_self.add( _getTypeFromCode(content.s), body, latest.x, latest.y );
				console.log(`shifting to: ${latest.x} ${latest.y}`);

				body.mapgrid = {x: latest.x, y: latest.y};
			}
		}, 'mapgrid-body-tracking-' + body.id);
	};

	/**
	 * Removes a position-update event from the game.
	 *
	 * @method	deregisterBody
	 * @public
	 * @param		{integer}		bodyID		A unique Matter.js Body ID property
	 */
	_self.deregisterBody = function(bodyID) {
		Game.Events.unsubscribe('50-ticks', 'mapgrid-body-tracking-' + bodyID);
	};

	/**
	 * Marks a _grid cell as being filled with a provided content type and optionally registers the provided body.
	 *
	 * @method	add
	 * @public
	 * @param		{string}	contentType		A valid content type
	 * @param		{object}	body				Matter.js Body object
	 * @param		{integer}	x				X-coordinate
	 * @param		{integer}	y				Y-coordinate
	 * @param		{boolean}	registerTracking	Whether or not to attach the position-updating event to the body
	 */
	_self.add = function(contentType, body, x, y, registerTracking = false) {
		if( !_self.isValidContentType(contentType) ) {
			return;
		}

		let point			= _grid.getPoint(x, y);
		let slot			= CONTENT_KEY[contentType].slot;
		let trackable		= CONTENT_KEY[contentType].trackable;
		let contentCode	= _getCodeFromType(contentType);

		if( !point ) {
			point = {s: false, m: false, n: false, id: false};
		}

		point[slot] = contentCode;

		if( trackable ) {
			point.id = body.id;
		}

		_grid.setPoint(x, y, point);

		if( trackable && registerTracking ) {
			_self.registerBody(body, x, y);
		}
	};

	/**
	 * Removes a body from the grid.
	 *
	 * @method	remove
	 * @public
	 * @param		{object}	body					Matter.js Body object
	 * @param		{boolean}	deregisterTracking		Whether or not to unattach the position-updating event from the body
	 */
	_self.remove = function(body, deregisterTracking = false) {
		if( deregisterTracking ) {
			_self.deregisterBody(body.id);
		}

		var point = _grid.getPoint(body.mapgrid.x, body.mapgrid.y);

		if( point.n || point.m ) {
			_grid.setPoint(body.mapgrid.x, body.mapgrid.y, {s: false, m: point.m, n: point.n, id: false});
		} else {
			_grid.setPoint(body.mapgrid.x, body.mapgrid.y, 0);
		}
	};

	/**
	 * Clears a specified point, regardless of what its current content is.
	 *
	 * @method	freePoint
	 * @public
	 * @param		{integer}		x	X-coordinate
	 * @param		{integer}		y	Y-coordinate
	 */
	_self.freePoint = function(x, y) {
		var content = _grid.getPoint(x, y);

		if( content && content.id ) {
			_self.deregisterBody(content.id);
		}

		_grid.setPoint(x, y, 0);
	};

	/**
	 * Flags a point as filled but with no data.
	 * @method	fillPoint
	 * @public
	 * @param		{integer}		x
	 * @param		{integer}		y
	 */
	_self.fillPoint = function(x, y) {
		if( !_grid.getPoint(x, y) ) {
			_grid.setPoint(x, y, {s: 'X', m: false, n: false, id: false});
		}
	};

	_self.getBounds = function() {
		return _bounds;
	};

	/*
	 *
	 *
	 *
	 */
	_self.setCenter = function(x, y) {
		var center = _grid.normalize(x, y);

		_vportCenter.x = center.x;
		_vportCenter.y = center.y;

		_self.updateBounds();
	};

	/*
	 *
	 *
	 *
	 */
	_self.updateBounds = function() {
		if( typeof(_vportCenter.x) == 'number' && typeof(_vportCenter.y) == 'number' ) {
			_bounds.min = {x: _vportCenter.x - VPORT_BUFFER_X, y: _vportCenter.y - VPORT_BUFFER_Y};
			_bounds.max = {x: _vportCenter.x + VPORT_BUFFER_X, y: _vportCenter.y + VPORT_BUFFER_Y};

			if( _bounds.min.x < 0 ) {
				_bounds.min.x = 0;
			}
			if( _bounds.min.y < 0 ) {
				_bounds.min.y = 0;
			}
		}
	};

	/**
	 * Returns cells considered to be within the instantiated game region.
	 *
	 * @method	getVisibleDimensions
	 * @public
	 * @return	{object}
	 */
	_self.getVisibleDimensions = function() {
		return {
			width:	VPORT_BUFFER_X * 2,
			height:	VPORT_BUFFER_Y * 2
		}
	};

	/**
	 * Gets an array of empty points.
	 *
	 * @method	getFreePoints
	 * @public
	 *
	 * @param		{object}	bounds	An objects containing "min" and "max" point objects
	 * @return	{array}
	 */
	_self.getFreePoints = function(bounds) {
		var freePoints = [];

		if( !bounds ) {
			return [];
		}

		_grid.eachPointWithin(bounds.min, bounds.max, function(point, x, y) {
			if( !point || (!point.s && !point.m) ) {
				freePoints.push({x: x, y: y});
			}
		});

		return freePoints;
	};

	/**
	 * Passes each point within the visible/instantiated world to a callback function.
	 *
	 * @method	eachVisiblePoint
	 * @public
	 * @param		{function}	callbacl
	 */
	_self.eachVisiblePoint = function(callback) {
		if( !_bounds.min || !_bounds.max ) {
			return false;
		}

		_grid.eachPointWithin(_bounds.min, _bounds.max, function(point, x, y) {
			callback(point, x, y);
		});
	};

	_self.eachPoint = function(callback) {
		_grid.eachPoint(function(point, x, y) {
			callback(point, x, y);
		});
	};

	/**
	 * Looks for a free path within _grid given two corresponding world positions and returns a set of grid coordinates.
	 *
	 * @method	pathfindPositions
	 * @public
	 * @param		{object}	startPosition		A set of world position coordinates
	 * @param		{object}	endPosition		A set of world position coordinates
	 * @return	{array}
	 */
	_self.pathfindPositions = function(startPosition, endPosition, noDiagonals = false) {
		var gridStart	= _self.convertPosition(startPosition);
		var gridEnd	= _self.convertPosition(endPosition);

		var bounds = {
			min:	{
				x:	gridStart.x - PATHFIND_BUFFER_X,
				y:	gridStart.y - PATHFIND_BUFFER_Y
			},
			max:	{
				x:	gridStart.x + PATHFIND_BUFFER_X,
				y:	gridStart.y + PATHFIND_BUFFER_Y
			}
		};

		var bounds = _grid.normalizeBounds(bounds);

		if( !Utilities.pointIntersectsRegion(gridStart, bounds.min, bounds.max) ) {
			return false;
		}
		if( !Utilities.pointIntersectsRegion(gridEnd, bounds.min, bounds.max) ) {
			return false;
		}

		var points = _grid.pathfind(gridStart, gridEnd, bounds, noDiagonals);

		// Convert MapGrid points back into world positions
		if( points ) {
			for(var point of points) {
				var positionPoint = _self.convertGridCoordinates(point);

				point.x = positionPoint.x;
				point.y = positionPoint.y;
			}

			return points;
		} else {
			return [];
		}
	};

	_self.hasLineOfSight = function(startPosition, endPosition) {
		var gridStart	= _self.convertPosition(startPosition);
		var gridEnd	= _self.convertPosition(endPosition);

		// Draw a line from A to B
		var segment = _grid.getLine(gridStart, gridEnd);

		// Check each point for solid objects
		for(var i in segment) {
			// Skip start and end points
			if( i == 0 || i == (segment.length - 1) ) {
				continue;
			}

			var testCoords	= segment[i];
			var point		= _grid.getPoint(testCoords.x, testCoords.y);

			if( point && point.s ) {
				return false;
			}
		}

		return true;
	};

	_init();
};
