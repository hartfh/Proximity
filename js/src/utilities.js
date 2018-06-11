var Game = Game || {};

Function.prototype.extend = function(superclass) {
	this.prototype = new superclass();
	this.prototype.constructor = this;
	this.prototype.parent = superclass.prototype;

	return this;
}

Game.utilities = (function() {
	var _self = {};

	/**
	 * Deep copy an object.
	 *
	 * @param		{object}	obj	An instance of the Object prototype
	 */
	_self.clone = function(obj) {
		return JSON.parse( JSON.stringify(obj) );
	};

	/**
	 * Correct for any angle outside of 0-360 degree range
	 *
	 * @param		{float}	degrees	An angle in degrees
	 * @return	{float}
	 */
	_self.normalize = function(degrees) {

		while( degrees < 0 ) {
			degrees += 360;
		}
		while( degrees > 360 ) {
			degrees -= 360;
		}

		return degrees;
	};

	/**
	 * Gets the angle in radians of a line formed by two points
	 *
	 * @param		{object}	pointA	A point object
	 * @param		{object}	pointA	A point object
	 * @return	{float}
	 */
	_self.getLineAngle = function(pointA, pointB) {
		var diffX = pointB.x - pointA.x;
		var diffY = pointB.y - pointA.y;
		var angle	= Math.atan2(diffY, diffX);

		return angle;
	};

	/**
	 * Checks if a point falls within the rectangular region created by two bounding points
	 *
	 * @method	pointIntersectsRegion
	 * @public
	 * @param		{object}		point	Test point
	 * @param		{object}		boundA	First bounding coordinate
	 * @param		{object}		boundB	Second bounding coordinate
	 * @return	{boolean}
	 */
	_self.pointIntersectsRegion = function(point, boundA, boundB) {
		if( !point ) {
			throw new Error('No point provided for point intersection testing.');
			return false;
		}
		if( !boundA || !boundB ) {
			throw new Error('Bound A or B missing from point intersection testing.');
			return false;
		}

		if( point.x >= boundA.x && point.x <= boundB.x ) {
			if( point.y >= boundA.y && point.y <= boundB.y ) {
				return true;
			}
		}

		return false;
	};

	_self.pointsHavePoint = function(points, testPoint) {
		for(var point of points) {
			if( point.x == testPoint.x && point.y == testPoint.y ) {
				return true;
			}
		}

		return false;
	};

	_self.pointsMatch = function(pointOne, pointTwo) {
		if( pointOne.x == pointTwo.x ) {
			if( pointOne.x == pointTwo.y ) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Converts an angle from degrees to radians.
	 */
	_self.degreesToRadians = function(degrees) {
		return Math.PI * degrees / 180;
	};

	/**
	 * Converts an angle from radians to degrees.
	 */
	_self.radiansToDegrees = function(radians) {
		return radians * 180 / Math.PI;
	};

	/**
	 * Locks all properties with an object.
	 *
	 * @param		{object}	obj		An instance of the Object prototype
	 */
	_self.deepFreeze = function(obj) {
		// Retrieve the property names defined on obj
		var propNames = Object.getOwnPropertyNames(obj);

		// Freeze properties before freezing self
		propNames.forEach(function(name) {
			var prop = obj[name];

			// Freeze prop if it is an object
			if (typeof prop == 'object' && prop !== null)
				Game.utilities.deepFreeze(prop);
		});

		// Freeze self (no-op if already frozen)
		return Object.freeze(obj);
	};

	/**
	 * Checks if a terrain tile is considered empty.
	 *
	 * @param		{string}		tileType		A tile type
	 * @return	{boolean}
	 */
	_self.isEmptyTileType = function(tileType) {
		var emptyTypes = ['empty', 'shore', 'riverbend', 'channel', 'cove', 'lake'];

		if( emptyTypes.indexOf(tileType) != -1 ) {
			return true;
		}

		return false;
	};

	/**
	 * Checks if a bounded area is considered free to create a Matter.js body in, such that no collisions will occur.
	 *
	 * @method	isSpawnableMapZone
	 * @public
	 * @param		{string}	allegiance	Actor allegiance
	 * @param		{string}	type			Actor type
	 * @param		{object}	position		Coordinate object denoting center of queryable area
	 * @param		{number}	width		Width of queryable area
	 * @param		{number}	height		Height of queryable area
	 * @return	{boolean}
	 */
	_self.isSpawnableMapZone = function(allegiance = 'neutral', type = 'vehicle', position = {x: 0, y: 0}, width = 50, height = 50) {
		// Incomplete arguments supplied. Return false to avoid unexpected behavior
		if( arguments.length < 4 ) {
			return false;
		}

		// Define the bounded area
		var halfHeight	= height * 0.5;
		var halfWidth	= width * 0.5;

		var bounds = {
			min:		{
				x:	position.x - halfWidth,
				y:	position.x - halfHeight
			},
			max:		{
				x:	position.x + halfWidth,
				y:	position.x + halfHeight
			}
		};

		// Get bitmask filter and query the area
		var queryFilter	= Game.data.bitmasks[allegiance][type];
		var queryBodies	= Matter.Query.region(Matter.Composite.allBodies(Game.engine.world), bounds);

		// Check found bodies against the selected bitmask filter
		for(var body of queryBodies) {
			if( body.actor ) {
				var bodyType		= body.actor.getType();
				var bodyAllegiance	= body.actor.allegiance;
				var bodyFilter		= Game.data.bitmasks[bodyAllegiance][bodyType];

				// If bodies can collide, area is unsafe to spawn in
				if( Matter.Detector.canCollide(queryFilter, bodyFilter) ) {
					return false;
				}
			}
		}

		// No collidable bodies detected
		return true;
	};

	/**
	 * Gets a random property from an object.
	 *
	 * @param		{object}		obj		An object
	 * @return	{string}
	 */
	_self.getRandomObjectProperty = function(obj) {
		var keys = [];

		for(var prop in obj) {
			keys.push(prop);
		}

		if( keys.length == 0 ) {
			return false;
		}

		var randIndex = Math.floor( Math.random() * keys.length );

		return keys[randIndex];
	};

	/**
	 * Combines two color values up to a maximum of pure white;
	 *
	 * @param		{number}		hex1		First color's hex value
	 * @param		{number}		hex2		Second color's hex value
	 */
	/*
	_self.addColors = function(hex1, hex2) {
		// Convert hex values to base10 numbers, sum them, then return to a base16 code
		var addedColor = ( parseInt(hex1, 10) + parseInt(hex2, 10) ).toString(16);

		// Cap the value at white's color code
		if( addedColor > 0xffffff ) {
			addedColor = 0xffffff;
		}

		//addedColor.replace('0x', '#');

		return addedColor;
	};
	*/

	_self.blendColors = function(hex1, hex2) {
		// Convert hex values to base10 numbers, sum them, then return to a base16 code
		var hex1piece1 = parseInt( '0x' + hex1.slice(1, 3) );
		var hex2piece1 = parseInt( '0x' + hex2.slice(1, 3) );
		var hex1piece2 = parseInt( '0x' + hex1.slice(3, 5) );
		var hex2piece2 = parseInt( '0x' + hex2.slice(3, 5) );
		var hex1piece3 = parseInt( '0x' + hex1.slice(5) );
		var hex2piece3 = parseInt( '0x' + hex2.slice(5) );

		var combined1 = (Math.ceil( ( hex1piece1 + hex2piece1 ) / 2)).toString(16);
		var combined2 = (Math.ceil( ( hex1piece2 + hex2piece2 ) / 2)).toString(16);
		var combined3 = (Math.ceil( ( hex1piece3 + hex2piece3 ) / 2)).toString(16);

		if( combined1.length == 1 ) {
			combined1 = '0' + combined1;
		}
		if( combined2.length == 1 ) {
			combined2 = '0' + combined2;
		}
		if( combined3.length == 1 ) {
			combined3 = '0' + combined3;
		}

		return '#' + combined1 + combined2 + combined3;
	};

	return _self;
}());
