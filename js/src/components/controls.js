var Game = Game || {};

Game.Controls = (function() {
	var _self			= {};
	var _cursorRealPosition	= {x: 0, y: 0};
	var _cursorVportPosition = {x: 0, y: 0};
	var _mouseDown			= false;
	var _mouseButton		= false;

	/**
	 * Sets up all user inputs events.
	 *
	 * @method	_init
	 * @private
	 */
	var _init = function() {
		window.addEventListener('mousedown',	_mouseInput);
		window.addEventListener('mouseup',		_mouseInput);
		window.addEventListener('mousemove',	_mouseMove);
		window.addEventListener('keypress',	_keyboardInput);
	};

	var _destroy = function() {
		// unset all events?
		// needed at all?
	};

	/**
	 * Updates cursor real and viewport positions with latest data.
	 *
	 * @method	updateCursorPosition
	 * @private
	 * @param		{Event}	event	A mousemove Event object
	 */
	var _updateCursorPositions = function(event) {
		// Viewport top-left position
		var vportX = Game.render.bounds.min.x;
		var vportY = Game.render.bounds.min.y;

		// Window mouse position
		var winX = event.pageX / Game.constants.config.PIXEL_RATIO;
		var winY = event.pageY / Game.constants.config.PIXEL_RATIO;

		_cursorRealPosition.x = winX;
		_cursorRealPosition.y = winY;

		// Combined window and viewport positions
		_cursorVportPosition.x = winX + vportX;
		_cursorVportPosition.y = winY + vportY;
	};

	var _getMouseEventButton = function(event) {
		var button;

		switch(event.button) {
			case 0:
				button = 'left';
				break;
			case 1:
				button = 'wheel';
				break;
			case 2:
				button = 'right';
				break;
			default:
				button = false;
				break;
		}

		return button;
	}

	/**
	 * Returns the real and viewport positions of the cursor.
	 *
	 * @method	getCursorPositions
	 * @private
	 * @return	{object}
	 */
	var _getCursorPositions = function() {
		var positions = {
			real:	{
				x:	_cursorRealPosition.x,
				y:	_cursorRealPosition.y
			},
			viewport:	{
				x:	_cursorVportPosition.x,
				y:	_cursorVportPosition.y
			}
		};

		return positions;
	};

	/**
	 *
	 *
	 * @method	renderCursor
	 * @public
	 */
	_self.renderCursor = function() {
		var positions	= _getCursorPositions();

		// make sure we don't render outside the region the cursor is in. e.g. crosshairs should not be rendered outside viewport region

		switch( Game.State.getScreen() ) {
			case 'battlefield':
				/*
				if region == viewport area
					if _mouseDown && button == 0
						// move to location icon
					if _mouseDown && button == 2
						// crosshairs/firing icon
				*/
				break;
			default:
				break;
		}
	};

	/**
	 * Delegates actions based on a mouse click event.
	 *
	 * @method	_mouseInput
	 * @private
	 * @param		{Event}	event	A mouse click Event object
	 */
	var _mouseInput = function(event) {
		event.preventDefault();

		var type = event.type;

		_mouseButton = _getMouseEventButton(event);

		if( type == 'mousedown' ) {
			_mouseDown = true;
		}
		if( type == 'mouseup' ) {
			_mouseDown = false;
		}

		switch( Game.State.getScreen() ) {
			case 'battlefield':
				_battlefieldMouseActions();
				break;
			case 'encyclopedia':
				break;
			case 'game-settings':
				break;
			case 'main-menu':
				break;
			case 'pause':
				break;
			default:
				break;
		}

		return false;
	};

	/**
	 * Delegates actions based on a mouse move event.
	 *
	 * @method	_mouseMove
	 * @private
	 * @param		{Event}	event	A mouse move Event object
	 */
	var _mouseMove = function(event) {
		_updateCursorPositions(event);

		// rerender custom cursors based on _cursorPosition (e.g. battle mode crosshairs)

		if( _mouseDown ) {
			_mouseInput(event);
		}
	};

	/**
	 * Delegates actions based on a keyboard event.
	 *
	 * @method	_keyboardInput
	 * @private
	 * @param		{Event}	event	A keyboard Event object
	 */
	var _keyboardInput = function(event) {
		var key = event.code;

		switch( Game.State.getScreen() ) {
			case 'battlefield':
				_battlefieldKeyboardActions(key);
				break;
			case 'encyclopedia':
				break;
			case 'game-settings':
				break;
			case 'main-menu':
				break;
			case 'pause':
				break;
			default:
				break;
		}
	};

	var _battlefieldMouseActions = function() {
		// if( regions.indexOf("weapon-select") != -1 ) { // switch weapons }
		var point		= _getCursorPositions();
		var elements	= Game.UI.getCursorElements(point.viewport);

		if( _mouseButton == 'left' ) {
			// Enemy Targeting: if right-click an enemy, becomes targetted with weapons
			if( _mouseDown ) {
				// TODO: possibly do a query for enemies at point. Wind up setting _target rather than _firePoint in Actor
				Game.Player.startFireWeapon(point.viewport); // Temporary. Will need "if in map area" conditional

				// if in map area: shoot: Game.Player.startFireWeapon(point.viewport);


				// select weapon: Game.Player.setWeapon(type); Game.UI.getElement(weaponUI).setActive(true);
				// open menu/pause
			} else {
				Game.Player.endFireWeapon(point.viewport);
			}
		}
		if( _mouseButton == 'right' ) {
			// Do a query for what's being clicked on
			var query = Matter.Query.point( Matter.Composite.allBodies(Game.engine.world) , point.viewport);

			for(var body of query) {
				var type = body.actor.getType();

				// Clear course if in terrain
				if( type == 'terrain' ) {
					Game.Player.getActor().clearCourse();
					return;
				}

				// Set enemy as target
				if( type == 'enemy' ) {
					if( body.actor.role == 'chasis' ) {
						// NOTE: bugged. sensors interfere with this
						Game.Player.getActor().target(body.actor);
						return;
					}
				}
			}

			Game.Player.moveTo(point.viewport); // Temporary. Will need "if in map area" conditional


			// outside map area: pause and open encyclopedia entry about thing right-clicked
		}
	};

	_self.updateCursorFromScroll = function(xAdjust = 0, yAdjust = 0) {
		// do update
		if( !_mouseDown ) {
			return;
		}

		_cursorVportPosition.x += xAdjust;
		_cursorVportPosition.y += yAdjust;

		_battlefieldMouseActions();
	};

	var _battlefieldKeyboardActions = function(key) {
		// number keys switch weapons regardless of the element being hovered over.

		var forceV; // this will eventually need to be stored somewhere else.
		// TODO: possible replace direct force application with setting a short course in a particular direction and letting Player.moveTo() do the rest.

		switch(key) {
			case 'ArrowLeft':
			case 'KeyA':
				forceV = {x: -40, y: 0};
				break;
			case 'ArrowRight':
			case 'KeyD':
				forceV = {x: 40, y: 0};
				break;
			case 'ArrowUp':
			case 'KeyW':
				forceV = {x: 0, y: -40};
				break;
			case 'ArrowDown':
			case 'KeyS':
				forceV = {x: 0, y: 40};
				break;
			case 'Digit1':
				// Game.Player.setWeapon(type);
				// Game.UI.getElement(weaponUI).setActive(true);
				break;
			case 'Digit2':
				break;
			case 'Digit3':
				break;
			case 'Digit4':
				break;
			case 'Digit5':
				break;
			case 'Digit6':
				break;
			case 'Digit7':
				break;
			case 'Digit8':
				break;
			case 'Escape':
				// pause game
				break;
			case 'Space':
				// toggle item of some sort
				break;
			default:
				break;
		}

		if( forceV ) {
			Game.Player.moveCancel();
			Matter.Body.applyForce(Game.Player.getBody(), Game.Player.getPosition(), forceV);
			// TODO: player clear move target
		}
	};

	var _encylopediaMouseActions = function() {

	};

	var _encylopediaKeyboardActions = function() {
		// escape: return to pause
		// left, right
	};

	var _mainMenuMouseActions = function() {

	};

	var _mainMenuKeyboardActions = function() {
		// escape: return to pause
		// left, right
	};

	_init();

	return _self;
}());
