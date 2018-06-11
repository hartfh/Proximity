module.exports = new function() {
	var _self			= {};
	//var _actorFreezing	= false;
	//var _actorFreezers	= {n: false, e: false, s: false, w: false};
	var _shakeTimer	= 0;
	var _shakeMode		= 'none';
	var _shakeOffset	= {x: 0, y: 0};

	/**
	 * Sets up viewport game events.
	 *
	 * @method	init
	 * @public
	 */
	_self.init = function() {
		window.addEventListener('resize', _updateScreenSize);

		_enableObjectTracking();
	};

	_self.enableAreaTracking = function() {
		Game.Events.subscribe('tick', _updateMapAreaMatrix, 'viewport-area-updating');
	};

	_self.disableAreaTracking = function() {
		Game.Events.unsubscribe('tick', 'viewport-area-updating');
	};

	function _enableObjectTracking() {
		Game.Events.subscribe('tick', _trackObject, 'viewport-object-tracking');
	};

	function _disableObjectTracking() {
		Game.Events.unsubscribe('tick', 'viewport-object-tracking');
	};

	function _updateMapAreaMatrix() {
		var position = {
			x:	Game.Engine.render.bounds.min.x + (Constants.VPORT_WIDTH * 0.5),
			y:	Game.Engine.render.bounds.min.y + (Constants.VPORT_HEIGHT * 0.5)
		};

		Game.Map.update(position);
	};

	/**
	 * Calculates amount viewport should be offset.
	 *
	 * @method	_screenShakeOffsets
	 * @private
	 * @return	{object}
	 */
	function _screenShakeOffsets() {
		var data, elapsedPercent, offsets;

		offsets	= {x: 0, y: 0};
		data		= Data.shakePatterns[_shakeMode];

		if( data.duration != 0 ) {
			switch(data.shape) {
				case 'flat':
					elapsedPercent = 1;
					break;
				case 'trail':
				default:
					elapsedPercent = _shakeTimer / data.duration;
					break;
			}

			offsets.x = elapsedPercent * data.amplitude.x * Math.sin(_shakeTimer * data.frequency.x);
			offsets.y = elapsedPercent * data.amplitude.y * Math.sin(_shakeTimer * data.frequency.y);
		}

		return offsets;
	};

	/**
	 *
	 *
	 * @method	screenShakeWarmup
	 * @public
	 * @param		{Context}		context
	 */
	_self.screenShakeWarmup = function(context) {
		if( _shakeMode == 'none' ) {
			return;
		}

		var offsets = _screenShakeOffsets();

		//context.save();
		_shakeOffset.x = offsets.x;
		_shakeOffset.y = offsets.y;

		context.translate(offsets.x, offsets.y);
	};

	_self.screenShakeCooldown = function(context) {
		if( _shakeMode == 'none' ) {
			return;
		}

		//context.restore();
		context.translate(-_shakeOffset.x, -_shakeOffset.y);

		_shakeTimer--;

		if( _shakeTimer <= 0 ) {
			_shakeTimer = 0;

			_setShakeMode('none');
		}
	};

	/**
	 * Adds shake data into the viewport according to the supplied mode.
	 *
	 * @method	_setShakeMode
	 * @private
	 * @param		{string}	mode		A string referring to shakemode data
	 */
	function _setShakeMode(mode) {
		if( Data.shakePatterns.hasOwnProperty(mode) ) {
			_shakeMode	= mode;
			_shakeTimer	= Data.shakePatterns[mode].duration;
		}
	};

	/**
	 * Publicly accessible wrapper for _setShakeMode.
	 *
	 * @method	shake
	 * @public
	 * @param		{string}	mode		Shake mode to apply.
	 */
	_self.shake = function(mode) {
		_setShakeMode(mode);
	};

	/**
	 * Adjusts positions and sizes of HTML elements.
	 *
	 * @method	_updateScreenSize
	 * @private
	 * @param		{Event}	event	A resize Event object
	 */
	function _updateScreenSize(event) {
		var screenHeight	= window.innerHeight;
		//var screenWidth	= window.innerWidth;
		var screenWidth	= document.body.clientWidth;

		Game.State.screenHeight	= screenHeight;
		Game.State.screenWidth	= screenWidth;
		Game.State.pixelRatio	= Math.floor(screenWidth / Constants.VPORT_WIDTH);


		var vportHeight	= Constants.VPORT_HEIGHT * Game.State.pixelRatio;
		var vportWidth		= Constants.VPORT_WIDTH * Game.State.pixelRatio;
		var canvasFromTop	= (screenHeight - vportHeight) / 2;
		var canvasFromLeft	= (screenWidth - vportWidth) / 2;

		Game.State.viewport.width	= vportWidth;
		Game.State.viewport.height	= vportHeight;

		document.getElementById('viewport-container').style.height = screenHeight + 'px';

		Game.Engine.render.canvas.style.top	= canvasFromTop + 'px';
		Game.Engine.render.canvas.style.left	= canvasFromLeft + 'px';
		Game.Engine.render.canvas.width		= vportWidth
		Game.Engine.render.canvas.height		= vportHeight;

		//Game.VisualFX.updateSize(Game.State.pixelRatio * vportWidth, Game.State.pixelRatio * vportHeight);
		//Game.VisualFX.updateSize(vportWidth, vportHeight);
		Game.VisualFX.updateSize(vportWidth, vportHeight);

		Game.State.canvasPosition.y = canvasFromTop;
		Game.State.canvasPosition.x = canvasFromLeft;
	};

	_self.getViewportCursorPosition = function(cursorPosition) {
		var adjustedPosition = {
			x:	cursorPosition.x + Game.Engine.render.bounds.min.x,
			y:	cursorPosition.y + Game.Engine.render.bounds.min.y
		};

		return adjustedPosition;
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	function _trackObject() {
		if( !Game.Tracker.hasObject() ) {
			return;
		}

		const THRESHOLD = -0.8;

		var vportWidth		= Constants.VPORT_WIDTH;
		var vportHeight	= Constants.VPORT_HEIGHT;
		var buffer		= Constants.VPORT_BUFFER;
		var position		= Game.Tracker.getPosition();

		var min = Game.Engine.render.bounds.min;
		var max = Game.Engine.render.bounds.max;

		//Game.State.viewport.x	= min.x;
		//Game.State.viewport.y	= min.y;

		// X movement
		if( position.x < min.x + Constants.VPORT_X_BUFFER ) {
			// Check if the cursor viewport position should be updated
			var xBufferIntrusion = position.x - min.x - Constants.VPORT_X_BUFFER;

			if( xBufferIntrusion < THRESHOLD ) {
				Game.Interface.updateCursorFromScroll(xBufferIntrusion, 0);
			}

			// Adjust the viewport min and max
			min.x = position.x - Constants.VPORT_X_BUFFER;
			max.x = position.x - Constants.VPORT_X_BUFFER + vportWidth;
		}
		if( position.x > max.x - Constants.VPORT_X_BUFFER ) {
			// Check if the cursor viewport position should be updated
			var xBufferIntrusion = max.x - position.x - Constants.VPORT_X_BUFFER;

			if( xBufferIntrusion < THRESHOLD ) {
				Game.Interface.updateCursorFromScroll(-1 * xBufferIntrusion, 0);
			}

			// Adjust the viewport min and max
			min.x = position.x + Constants.VPORT_X_BUFFER - vportWidth;
			max.x = position.x + Constants.VPORT_X_BUFFER;
		}

		// Y movement
		if( position.y < min.y + Constants.VPORT_Y_BUFFER ) {
			// Check if the cursor viewport position should be updated
			var yBufferIntrusion = position.y - min.y - Constants.VPORT_Y_BUFFER;

			if( yBufferIntrusion < THRESHOLD ) {
				Game.Interface.updateCursorFromScroll(0, yBufferIntrusion);
			}

			// Adjust the viewport min and max
			min.y = position.y - Constants.VPORT_Y_BUFFER;
			max.y = position.y - Constants.VPORT_Y_BUFFER + vportHeight;
		}
		if( position.y > max.y - Constants.VPORT_Y_BUFFER ) {
			// Check if the cursor viewport position should be updated
			var yBufferIntrusion = max.y - position.y - Constants.VPORT_Y_BUFFER;

			if( yBufferIntrusion < THRESHOLD ) {
				Game.Interface.updateCursorFromScroll(0, -1 * yBufferIntrusion);
			}

			// Adjust the viewport min and max
			min.y = position.y + Constants.VPORT_Y_BUFFER - vportHeight;
			max.y = position.y + Constants.VPORT_Y_BUFFER;
		}

		Game.State.viewport.position = {
			x:	min.x + (Constants.VPORT_WIDTH * 0.5),
			y:	min.y + (Constants.VPORT_HEIGHT * 0.5)
		};

		var previous = {
			x:	Game.State.viewport.corner.x,
			y:	Game.State.viewport.corner.y
		};

		Game.State.viewport.corner = {
			x:	min.x,
			y:	min.y
		};

		// Track changes in the viewport's position and apply those to cursor body position
		var delta = {
			x:	Game.State.viewport.corner.x - previous.x,
			y:	Game.State.viewport.corner.y - previous.y
		};

		if( Math.abs(delta.x) > 0.01 || Math.abs(delta.y) > 0.01 ) {
			Game.Cursor.nudgePosition(delta);
		}

		// Calculate MapGrid position and update
		var mapGridX = Math.floor( Game.State.viewport.position.x / Constants.TERRAIN_TILE_SIZE );
		var mapGridY = Math.floor( Game.State.viewport.position.y / Constants.TERRAIN_TILE_SIZE );

		Game.MapGrid.setCenter(mapGridX, mapGridY);
	};

	return _self;
};
