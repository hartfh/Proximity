var Game = Game || {};

Game.Viewport = (function() {
	var _self			= {};
	var _lastPosition	= {x: 0, y: 0};
	var _shakeTimer	= 0;
	var _shakeMode		= 'none';
	var _shakePatterns	= {
		'none':	{
			duration:		0,
			amplitude:	{
				x:	0,
				y:	0
			},
			frequency:	{
				x:	0,
				y:	0
			}
		},
		'mild':	{
			duration:		30,
			amplitude:	{
				x:	65,
				y:	0
			},
			frequency:	{
				x:	1,
				y:	0
			}
		},
		'rumble-1':	{
			duration:		7,
			amplitude:	{
				x:	4,
				y:	0
			},
			frequency:	{
				x:	1.8,
				y:	0
			}
		},
		'violent':	{
			duration:		27,
			amplitude:	{
				x:	0,
				y:	40
			},
			frequency:	{
				x:	0,
				y:	2.5
			}
		}
	};

	/**
	 * Sets up viewport game events.
	 *
	 * @method	init
	 * @public
	 */
	_self.init = function() {
		Matter.Events.on(Game.engine, 'afterUpdate', _trackPlayer);
		window.addEventListener('resize', _updateScreenSize);
	};

	var _screenShakeOffsets = function() {
		var data, elapsedPercent, offsets;

		offsets	= {x: 0, y: 0};
		data		= _shakePatterns[_shakeMode];

		if( data.duration != 0 ) {
			elapsedPercent = _shakeTimer / data.duration;

			offsets.x = elapsedPercent * data.amplitude.x * Math.sin(_shakeTimer * data.frequency.x);
			offsets.y = elapsedPercent * data.amplitude.y * Math.sin(_shakeTimer * data.frequency.y);
		}

		return offsets;
	};

	_self.screenShakeWarmup = function(context) {
		if( _shakeMode == 'none' ) {
			return;
		}

		var offsets = _screenShakeOffsets();

		context.save();
		context.translate(offsets.x, offsets.y);
	};

	_self.screenShakeCooldown = function(context) {
		if( _shakeMode == 'none' ) {
			return;
		}

		context.restore();

		_shakeTimer--;

		if( _shakeTimer <= 0 ) {
			_shakeTimer = 0;

			_self.setShakeMode('none');
		}
	};

	_self.setShakeMode = function(mode) {
		if( _shakePatterns.hasOwnProperty(mode) ) {
			_shakeMode	= mode;
			_shakeTimer	= _shakePatterns[mode].duration;
		}
	};

	/**
	 *
	 *
	 * @method	_updateScreenSize
	 * @private
	 * @param		{Event}	event	A resize Event object
	 */
	var _updateScreenSize = function(event) {
		// possibly have canvas scale with increased screen size??
		// Define master Scale amount that gets updated. Rendering would be adjusted according to it.
		// Matter.Render.setPixelRatio(?)
		// canvas.width = window.innerWidth;
		// canvas.height = window.innerHeight;

		// need to update Game.constants.config.VPORT_HEIGHT/WIDTH
		// also update Game.render.bounds/options???
	};

	/**
	 * Checks if the objects the viewport depends on exist.
	 *
	 * @method	_dependentsExist
	 * @private
	 * @return	{boolean}
	 */
	var _dependentsExist = function() {
		if( !Game.Player ) {
			return false;
		}
		if( !Game.UI ) {
			return false;
		}

		return true;
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	var _trackPlayer = function() {
		if( !_dependentsExist() ) {
			return;
		}

		var vportWidth		= Game.constants.config.VPORT_WIDTH;
		var vportHeight	= Game.constants.config.VPORT_HEIGHT;

		var buffer		= Game.constants.config.VPORT_BUFFER;
		var position		= Game.Player.getPosition();

		var min = Game.render.bounds.min;
		var max = Game.render.bounds.max;


		// X movement
		if( position.x < min.x + buffer ) {
			// Check if the cursor viewport position should be updated
			var xBufferIntrusion = position.x - min.x - buffer;

			if( xBufferIntrusion < -1 ) {
				Game.Controls.updateCursorFromScroll(xBufferIntrusion, 0);
			}

			// Adjust the viewport min and max
			min.x = position.x - buffer;
			max.x = position.x - buffer + vportWidth;
		}
		if( position.x > max.x - buffer ) {
			// Check if the cursor viewport position should be updated
			var xBufferIntrusion = max.x - position.x - buffer;

			if( xBufferIntrusion < -1 ) {
				Game.Controls.updateCursorFromScroll(-1 * xBufferIntrusion, 0);
			}

			// Adjust the viewport min and max
			min.x = position.x + buffer - vportWidth;
			max.x = position.x + buffer;
		}

		// Y movement
		if( position.y < min.y + buffer ) {
			// Check if the cursor viewport position should be updated
			var yBufferIntrusion = position.y - min.y - buffer;

			if( yBufferIntrusion < -1 ) {
				Game.Controls.updateCursorFromScroll(0, yBufferIntrusion);
			}

			// Adjust the viewport min and max
			min.y = position.y - buffer;
			max.y = position.y - buffer + vportHeight;
		}
		if( position.y > max.y - buffer ) {
			// Check if the cursor viewport position should be updated
			var yBufferIntrusion = max.y - position.y - buffer;

			if( yBufferIntrusion < -1 ) {
				Game.Controls.updateCursorFromScroll(0, -1 * yBufferIntrusion);
			}

			// Adjust the viewport min and max
			min.y = position.y + buffer - vportHeight;
			max.y = position.y + buffer;
		}

		var xHUDPosition = Math.floor(position.x / Game.constants.config.TERRAIN_TILE_SIZE);
		var yHUDPosition = Math.floor(position.y / Game.constants.config.TERRAIN_TILE_SIZE);

		Game.map.updateRegionCoordinates(position.x, position.y);

		// Have player "vision" sensor, which covers entire screen(?), tie in with updateInfo.
		// This way we can send data about seen terrain and enemies.

		Game.UI.HUD.updateInfo(xHUDPosition, yHUDPosition, 'player');
	};

	return _self;
}());
