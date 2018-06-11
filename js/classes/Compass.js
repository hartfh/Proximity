/**
 * A class for tracking directionality in square, 2-dimensional arrays.
 */
module.exports = function(width) {
	var _self		= this;

	_self.state	= 0;
	_self.width	= width || 1;
	_self.key		= ['north', 'east', 'south', 'west'];
	_self.states	= [
		{
			direction:	'north',
			coordinates:	{x: 0, y: -1},
			cornerA:		{x: 0, y: 0},
			cornerB:		{x: _self.width - 1, y: 0}
		},
		{
			direction:	'east',
			coordinates:	{x: 1, y: 0},
			cornerA:		{x: _self.width - 1, y: 0},
			cornerB:		{x: _self.width - 1, y: _self.width - 1}
		},
		{
			direction:	'south',
			coordinates:	{x: 0, y: 1},
			cornerA:		{x: _self.width - 1, y: _self.width - 1},
			cornerB:		{x: 0, y: _self.width - 1}
		},
		{
			direction:	'west',
			coordinates:	{x: -1, y: 0},
			cornerA:		{x: 0, y: _self.width - 1},
			cornerB:		{x: 0, y: 0}
		}
	];

	/**
	 * Set the compass to the specified direction.
	 *
	 * @param		{string}	direction		One of the directions in _self.key
	 */
	_self.setState = function(direction) {
		var index = _self.key.indexOf(direction);

		if( index != -1 ) {
			_self.state = index;
		}

		return _self;
	}

	_self.getState = function() {
		return _self.states[_self.state];
	}

	/**
	 * Rotate the compass by N 90-degree rotations. Defaults to one rotation if no argument supplied.
	 *
	 * @param		{integer}		rotations
	 */
	_self.rotate = function(rotations) {
		var rotations = rotations || 1;

		for(var i = 0; i < rotations; i++) {
			_self.state++;

			if( _self.state == _self.key.length ) {
				_self.state = 0;
			}
		}

		return _self;
	}

	_self.maybeRotate = function() {
		var rand = Math.random();

		if( rand > 0.3333 ) {
			var rotations;

			if( rand > 0.6666 ) {
				rotations = 1;
			} else {
				rotations = 3;
			}

			_self.rotate(rotations);
		}
	};

	/**
	 * Sets the compass to a random direction.
	 */
	_self.randomize = function() {
		var maxIndex	= _self.key.length;
		var randIndex	= Math.floor( Math.random() * maxIndex );
		var randDir	= _self.key[randIndex];

		_self.setState(randDir);
	}
}
