module.exports = function() {
	var _self = {};

	// Selects a random value from the array
	Array.prototype.random = function() {
		if( this.length == 0 ) {
			return false;
		}

		var randomIndex = Math.floor( Math.random() * this.length );

		return this[randomIndex];
	};
	Object.defineProperty(Array.prototype, 'random', {enumerable: false});

	// Selects a random value from the array
	Array.prototype.remove = function(value) {
		var index = this.indexOf(value);

		if( index != -1 ) {
			this.splice(index, 1);
		}
	};
	Object.defineProperty(Array.prototype, 'remove', {enumerable: false});

	_self.randomFromTo = function(min, max) {
		return (Math.random() * (max - min) ) + min;
	};

	_self.mergeSort = function(items = [], compare = function(){}) {
		var numItems = items.length;

		if(numItems == 1) {
			return items;
		}

		// Split
		if (numItems > 1) {
			// Pivot about the last item
			var pieceA = items;
			var pieceB = [items.pop()];

			// Recurse
			if( pieceA.length > 1 ) {
				pieceA = _self.mergeSort(pieceA, compare);
			}
		}

		// Merge
		var indexA = 0;
		var indexB = 0;
		var sorted = [];

		// Keep comparing as long as one piece has more items
		while( indexA < pieceA.length || indexB < pieceB.length ) {
			var itemA = pieceA[indexA];
			var itemB = pieceB[indexB];

			// Only one item, no comparisons needed
			if(itemA && !itemB) {
				sorted.push(itemA);
				indexA++;
			}
			if(!itemA && itemB) {
				sorted.push(itemB);
				indexB++;
			}

			// Compare items
			if(itemA && itemB) {
				var comparison = compare(itemA, itemB);

				if( comparison === 1 ) {
					sorted.push(itemB);
					indexB++;
				} else {
					sorted.push(itemA);
					indexA++;
				}
			}
		}

		return sorted;
	};

	_self.subdivideLength = function(length, sizes = [1, 2, 3, 4, 5, 6]) {
		var pieces = [];
		var filled = false;
		var current = 0;

		while( current != length ) {
			// Select a random size
			var randIndex	= Math.floor( Math.random() * sizes.length );
			var testSize	= sizes[randIndex];

			// Test if the size is too long
			if( current + testSize > length ) {
				// Continually reduce it by 1 until it fits
				while( current + testSize > length ) {
					testSize--;
				}
			}

			current += testSize;

			pieces.push(testSize);
		}

		return pieces;
	};

	_self.padStart = function(string, targetLength, padString) {
		targetLength	= targetLength>>0; //floor if number or convert non-number to 0;
		padString		= String(padString || ' ');

		if (string.length > targetLength) {
			return String(string);
		} else {
			targetLength = targetLength - string.length;

			if (targetLength > padString.length) {
				padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
			}

			return padString.slice(0,targetLength) + String(string);
		}
	};

	_self.shuffleArray = function(a) {
		var j, x, i;

		for (i = a.length; i; i--) {
			j = Math.floor( Math.random() * i );
			x = a[i - 1];
			a[i - 1] = a[j];
			a[j] = x;
		}
	};

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

	_self.normalizeRadians = function() {

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

	/*
	 * Rounds an angle to one of four ordinal directions
	 */
	_self.ordinalizeRadians = function(angle) {
		var positive = true;

		if( angle < 0 ) {
			positive = false;
		}

		angle = Math.abs(angle);

		if( angle > Math.PI * 3/4 ) {
			angle = Math.PI;
		} else if( angle > Math.PI * 1/4 ) {
			angle = Math.PI / 2;
		} else {
			angle = 0;
		}

		// Restore positive/negative
		if( !positive ) {
			return -angle;
		} else {
			return angle;
		}
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

	_self.getFacingFromAngle = function(angle = 0) {
		var facing = 'e';

		if( angle > 0 ) {
			if( angle > Math.PI*7/8 ) {
				facing = 'w';
			} else if( angle > Math.PI*5/8 ) {
				facing = 'sw';
			} else if( angle > Math.PI*3/8 ) {
				facing = 's';
			} else if( angle > Math.PI*1/8 ) {
				facing = 'se';
			} else {
				facing = 'e';
			}
		} else {
			if( angle < -Math.PI*7/8 ) {
				facing = 'w';
			} else if( angle < -Math.PI*5/8 ) {
				facing = 'nw';
			} else if( angle < -Math.PI*3/8 ) {
				facing = 'n';
			} else if( angle < -Math.PI*1/8 ) {
				facing = 'ne';
			} else {
				facing = 'e';
			}
		}

		return facing;
	}

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
		var queryFilter	= Data.bitmasks[allegiance][type];
		var queryBodies	= Matter.Query.region(Matter.Composite.allBodies(Game.engine.world), bounds);

		// Check found bodies against the selected bitmask filter
		for(var body of queryBodies) {
			if( body.actor ) {
				var bodyType		= body.actor.getType();
				var bodyAllegiance	= body.actor.allegiance;
				var bodyFilter		= Data.bitmasks[bodyAllegiance][bodyType];

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
	 *
	 *
	 *
	 * @param		{string}
	 * @return	{integer}
	*/
	_self.getRandomTilesetVariation = function(tilesetData, type, rotations) {
		var variations	= tilesetData[type][rotations];
		var variation	= 0;
		var numVariations;

		if( typeof(variations) == 'number' ) {
			numVariations = variations;
		} else {
			numVariations = variations.length;
		}

		variation = Math.floor( Math.random() * numVariations );

		return variation;
	};

	_self.hexToBinary = function(hex, bytes = 1) {
		hex = hex.replace('#', '');
		
		let binary = parseInt(hex, 16).toString(2).padStart(bytes * 8, '0');

		return binary;
	}

	return _self;
}();
