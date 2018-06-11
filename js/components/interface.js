var UIBox = require('./ui-box');
var Display = require('./display');

module.exports = new function() {
	var _self				= this;
	var _allUIBoxes		= new List();
	var _KeyboardPressUIBoxes	= new List();
	var _KeyboardUpUIBoxes	= new List();
	var _MouseClickUIBoxes	= new List();
	var _MouseUnclickUIBoxes	= new List();
	var _MouseDragUIBoxes	= new List();
	var _MouseMoveUIBoxes	= new List();
	var _MouseWheelUIBoxes	= new List();
	var _cursorVportPosition = {x: 0, y: 0};
	var _mouseDown			= false;
	var _mouseButton		= false;
	var _direction			= false;
	var _boxCount			= -1;

	/**
	 * Sets up all user inputs events.
	 *
	 * @method	_init
	 * @private
	 */
	function _init() {
		window.addEventListener('mousedown',	_mouseInput);
		window.addEventListener('mouseup',		_mouseInput);
		window.addEventListener('mousewheel',	_mouseInput);
		window.addEventListener('mousemove',	_mouseMove);
		window.addEventListener('keydown',		_keyboardInput);
		window.addEventListener('keyup',		_keyboardInput);
	}

	function _mouseInput(event) {
		event.preventDefault();

		var type			= event.type;
		var mouseButton	= _getMouseEventButton(event);

		if( type == 'mousedown' ) {
			_mouseDown	= true;
			_mouseButton	= mouseButton;
			_direction	= false;

			_triggerClickEvents(_cursorVportPosition);
		}
		if( type == 'mouseup' ) {
			_triggerUnclickEvents(_cursorVportPosition);

			_mouseButton	= false;
			_mouseDown	= false;
			_direction	= false;
		}
		if( type == 'mousewheel' ) {
			_direction	= (event.deltaY > 0) ? 'down' : 'up';
			_mouseButton	= 'wheel';

			_triggerWheelEvents(_cursorVportPosition);
		}
	}

	function _getMouseEventButton(event) {
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

	function _mouseMove(event) {
		_cursorVportPosition = _updateCursorPosition(event);

		if( _mouseDown ) {
			_mouseDrag(_cursorVportPosition);
		} else {
			//_mouseButton = false;
		}

		_triggerMoveEvents(_cursorVportPosition);
	}

	function _mouseDrag(position) {
		_triggerDragEvents(position);
	}

	function _keyboardInput(event) {
		event.preventDefault();

		var key = event.key;

		if( event.type == 'keyup' ) {
			_triggerKeyupEvents(key);
		} else if( event.type == 'keydown' ) {
			_triggerKeypressEvents(key);
		}
	}

	function _updateCursorPosition(event) {
		var pixelRatio = Game.State.pixelRatio;

		var point = {
			x:	event.pageX,
			y:	event.pageY
		};

		// Convert browser coordinates into viewport coordinates
		point.x -= Game.State.canvasPosition.x;
		point.y -= Game.State.canvasPosition.y;

		point.x /= Game.State.pixelRatio;
		point.y /= Game.State.pixelRatio;

		return point;
	}

	_self.updateCursorFromScroll = function(xAdjust = 0, yAdjust = 0) {
		if( !_mouseDown ) {
			return;
		}

		// BUG: needs to only trigger move event somehow.
		_triggerClickEvents(_cursorVportPosition, true);
	};

	function _createEventObject() {
		return {
			position:		_cursorVportPosition,
			mouseButton:	_mouseButton,
			mouseDown:	_mouseDown,
			direction:	_direction
		};
	}

	function _triggerUnclickEvents(point = {x: 0, y: 0}) {
		var highestIndex	= 0;
		var highestCallback	= null;

		_MouseUnclickUIBoxes.eachItem(function(uiBoxData) {
			var box = uiBoxData.box;

			if( box.hasKey(_mouseButton) ) {
				var zIndex = Data.layers[box.layer];

				if( zIndex > highestIndex ) {
					if( box.hasPoint(point) ) {
						highestIndex		= zIndex;
						highestCallback	= uiBoxData.callback;
					}
				}
			}
		});

		if( highestCallback ) {
			highestCallback( _createEventObject() );
		}
	}

	// loop through all click boxes and check their bounds
	function _triggerClickEvents(point = {x: 0, y: 0}, scroll = false) {
		var highestIndex	= 0;
		var highestCallback	= null;

		_MouseClickUIBoxes.eachItem(function(uiBoxData) {
			var box = uiBoxData.box;

			if( box.hasKey(_mouseButton, scroll) ) {
				var zIndex = Data.layers[box.layer];

				if( zIndex > highestIndex ) {
					if( box.hasPoint(point) ) {
						highestIndex		= zIndex;
						highestCallback	= uiBoxData.callback;
					}
				}
			}
		});

		if( highestCallback ) {
			highestCallback( _createEventObject() );
		}
	}

	function _triggerWheelEvents(point = {x: 0, y: 0}, scroll = false) {
		var highestIndex	= 0;
		var highestCallback	= null;

		_MouseWheelUIBoxes.eachItem(function(uiBoxData) {
			var box = uiBoxData.box;

			if( box.hasKey(_mouseButton, scroll) ) {
				var zIndex = Data.layers[box.layer];

				if( zIndex > highestIndex ) {
					if( box.hasPoint(point) ) {
						highestIndex		= zIndex;
						highestCallback	= uiBoxData.callback;
					}
				}
			}
		});

		if( highestCallback ) {
			highestCallback( _createEventObject() );
		}
	}

	// loop through all drag boxes and check their bounds
	function _triggerDragEvents(point = {x: 0, y: 0}) {
		var highestIndex	= 0;
		var highestCallback	= null;

		_MouseDragUIBoxes.eachItem(function(uiBoxData) {
			var box = uiBoxData.box;

			if( box.hasKey(_mouseButton) ) {
				var zIndex = Data.layers[box.layer];

				if( zIndex > highestIndex ) {
					if( box.hasPoint(point) ) {
						highestIndex		= zIndex;
						highestCallback	= uiBoxData.callback;
					}
				}
			}
		});

		if( highestCallback ) {
			highestCallback( _createEventObject() );
		}
	}

	// loop through all move boxes and check their bounds
	function _triggerMoveEvents(point = {x: 0, y: 0}) {
		var highestIndex	= 0;
		var highestCallback	= null;
		var secondCallbacks	= [];

		_MouseMoveUIBoxes.eachItem(function(uiBoxData) {
			var box		= uiBoxData.box;
			var zIndex	= Data.layers[box.layer];

			if( zIndex > highestIndex ) {
				if( box.hasPoint(point) ) {
					highestIndex		= zIndex;
					highestCallback	= uiBoxData.callback;
				} else {
					secondCallbacks.push(uiBoxData.secondary);
				}
			}
		});

		for(var secondaryCallback of secondCallbacks) {
			secondaryCallback( _createEventObject() );
		}

		if( highestCallback ) {
			highestCallback( _createEventObject() );
		}
	}

	// loop through all keypress boxes and check their keys
	function _triggerKeypressEvents(key = false) {
		_KeyboardPressUIBoxes.eachItem(function(uiBoxData) {
			if( uiBoxData.box.hasKey(key) ) {
				uiBoxData.callback(key);
			}
		});
	}

	// loop through all keyup boxes and check their keys
	function _triggerKeyupEvents(key = false) {
		_KeyboardUpUIBoxes.eachItem(function(uiBoxData) {
			if( uiBoxData.box.hasKey(key) ) {
				uiBoxData.callback(key);
			}
		});
	}

	/**
	 * Adds a UI Box to one of the interface's lists.
	 *
	 * @method	createUIBox
	 * @public
	 */
	_self.addUIBox = function(label, args) {
		if( _self.UIBoxExists(label) ) {
			return;
		}

		_boxCount++;

		args.id = _boxCount;

		var box	= new UIBox(label, args);

		var created = {
			box:		box,
			name:	label
		};

		_allUIBoxes.addItem(created, label);

		return created;
	};

	/**
	 * Stores a UI box in the appropriate lists.
	 *
	 * @method	addUIBoxTrigger
	 * @public
	 * @param		{UIBox}		uiBox			A UIBox object
	 * @param		{string}		trigger			The name of the user event that triggers the ui box
	 * @param		{function}	callback			A callback function
	 * @param		{function}	secondaryCallback	An alternate callback function for the case of events that toggle states
	 */
	_self.addUIBoxTrigger = function(uiBox, trigger, callback = function(){}, secondaryCallback = function(){}) {
		switch(trigger) {
			case 'click':
				_MouseClickUIBoxes.addItem({box: uiBox, callback: callback}, uiBox.id);
				break;
			case 'unclick':
				_MouseUnclickUIBoxes.addItem({box: uiBox, callback: callback}, uiBox.id);
				break;
			case 'drag':
				_MouseDragUIBoxes.addItem({box: uiBox, callback: callback}, uiBox.id);
				break;
			case 'wheel':
				_MouseWheelUIBoxes.addItem({box: uiBox, callback: callback}, uiBox.id);
				break;
			case 'move':
				_MouseMoveUIBoxes.addItem({box: uiBox, callback: callback, secondary: secondaryCallback}, uiBox.id);
				break;
			case 'keydown':
				_KeyboardPressUIBoxes.addItem({box: uiBox, callback: callback}, uiBox.id);
				break;
			case 'keyup':
				_KeyboardUpUIBoxes.addItem({box: uiBox, callback: callback}, uiBox.id);
				break;
			default:
				break;
		}

		//_allUIBoxes.addItem({box: uiBox, callback: callback}, uiBox.id);
	};

	/**
	 * Passes each UI box list to a callback function.
	 *
	 * @method	eachUIBoxList
	 * @public
	 * @param		{function}	callback
	 */
	_self.eachUIBoxList = function(callback = function(){}) {
		var lists = [_KeyboardPressUIBoxes, _KeyboardUpUIBoxes, _MouseClickUIBoxes, _MouseUnclickUIBoxes, _MouseDragUIBoxes, _MouseWheelUIBoxes, _MouseMoveUIBoxes, _allUIBoxes];

		for(var list of lists) {
			callback(list);
		}
	};

	/**
	 * Removes a UI box from this component's lists, effectively destroying it.
	 *
	 * @method	destroyUIBox
	 * @public
	 * @param		{string}		boxName	Unique name of UI box
	 */
	_self.removeUIBox = function(boxName) {
		var item = _allUIBoxes.getItem(boxName);

		if( item ) {
			item.box.destruct();

			_self.eachUIBoxList(function(list) {
				list.removeItem(boxName);
			});
		}
	};

	/**
	 * Checks if a UI box already exists.
	 *
	 * @method	UIBoxExists
	 * @public
	 * @param		{string}		boxName	Unique name of UI box
	 * @return	{boolean}
	 */
	_self.UIBoxExists = function(boxName) {
		return Boolean( _allUIBoxes.getItem(boxName) );
	};

	/**
	 * Disables a UI box in all UI lists.
	 *
	 * @param		{string}		boxName	Unique name of UI box
	 */
	_self.disable = function(boxName, hide = true) {
		_self.eachUIBoxList(function(list) {
			var item = list.getItem(boxName);

			if( item ) {
				if( hide ) {
					item.box.hideDisplay();
				}

				list.disableItem(boxName);
			}
		});
	};

	/**
	 * Enables a UI box in all UI lists.
	 *
	 * @param		{string}		boxName	Unique name of UI box
	 */
	_self.enable = function(boxName, hide = true) {
		_self.eachUIBoxList(function(list) {
			var item = list.getItem(boxName);

			if( item ) {
				if( hide ) {
					item.box.showDisplay();
				}

				list.enableItem(boxName);
			}
		});
	};

	/**
	 *
	 *
	 * @param		{string}		boxName	Unique name of UI box
	 */
	_self.create = function(boxName, creationRoutine = function() {}, args = false) {
		if( _self.UIBoxExists(boxName) ) {
			return;
		}

		return creationRoutine(args);

		switch(boxName) {
			case 'playerMove':
				break;
			case 'playerShoot':

				// *DISPLAY TESTING* //
				/*
				var args = {
					border:	{
						//color:	'#bbffcc',
						image:	[
							'test-border-1',
							'test-border-2',
							'test-border-3',
							'test-border-4',
							'test-border-5',
							'test-border-6',
							'test-border-7',
							'test-border-8'
						],
						width:	10
					},
					inside:	{
						//image:	'test-border-7'
						color: '#6a73f5'
					},
					text:	{
						content:	[
							'Phasellus orci $1.',
							'',
							'Fermentum $2 sit amet orci ultricies.',
							'Vehicula elementum odio. Sed at volutpat ligula. Suspendisse potenti. Sed ac volutpat arcu. Proin placerat elit.',
							'Vitae consectetur tristique.',
							'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.',
							'',
							'Praesent aliquet sem dolor, et viverra lacus interdum et.',
							'Proin nisl massa, fermentum ornare ex ut, laoreet condimentum elit. Aliquam vitae augue eget tellus dignissim mattis a vel odio.',
							'',
							'Vivamus cursus, mauris eget eleifend hendrerit, orci est tincidunt lorem, vel pellentesque nisi arcu sed erat. Curabitur aliquam felis sit amet pretium feugiat.',
							'Donec auctor congue libero, non mollis justo volutpat sit amet. In hac habitasse platea dictumst. Phasellus aliquam est eu erat iaculis, eu porta eros sollicitudin.',
							'Maecenas suscipit sapien nec tempor sollicitudin. Aliquam sed dolor eget nulla placerat egestas. Suspendisse potenti.'
						],
						font:	'sad-machine-white'
						offset:	{x: 0, y: 0},
						vars:	{
							'$1':	function() {
								return Math.floor(Game.Profile.player.position.x);
							},
							'$2':	function() {
								return Math.floor(Game.Profile.player.position.y);
							}
						}
					}
				};

				var activeArgs = {
					border:	{
						//image:	[],
						color:	'#bbffcc'
					},
					inside:	{
						color:	'#cc6699'
						//image:	'test-border-7'
					},
					text:	{
						//offset:	{x: 0, y: 10},
						padding:	15,
						vars:	{
							'$1':	function() {
								return 4444;
							},
							'$2':	function() {
								return 1111;
							}
						}
					}
				};

				var testDisplay = new Display(150, 110, {x: 10, y: 10}, 'test-layer-1', args, activeArgs);
				created.box.setDisplay(testDisplay);
				*/

				// *END DISPLAY TESTING* //


				/*
				// BEGIN SCROLL BUTTON TESTING //

				var args = {
					inside:	{
						color: '#ff9999'
					}
				};
				var activeArgs = {
					inside:	{
						color: '#ff5555'
					}
				}
				var testScrollOne = new Display(20, 20, {x: 0, y: 0}, 'test-layer-1', args, activeArgs);
				var testScrollTwo = new Display(20, 20, {x: 0, y: 0}, 'test-layer-1', args, activeArgs);
				var args = {
					position:		{x: 0, y: 0},
					width:		20,
					height:		20,
					keys:		['left'],
					//zindex:		5
					layer:		'battlefield-input'
				};
				var scrollOneUI = _self.addUIBox('playerScrollOne', args);
				var args = {
					position:		{x: 0, y: 50},
					width:		20,
					height:		20,
					keys:		['left'],
					//zindex:		5
					layer:		'battlefield-input'
				};
				var scrollTwoUI = _self.addUIBox('playerScrollTwo', args);
				_self.addUIBoxTrigger(scrollOneUI.box, 'click', function() {
					testScrollOne.toggleActive();

					testDisplay.startScrollingText(1);
				});
				_self.addUIBoxTrigger(scrollOneUI.box, 'unclick', function() {
					testScrollOne.toggleActive();
					testDisplay.stopScrollingText();
				});

				scrollOneUI.box.setDisplay(testScrollOne);

				_self.addUIBoxTrigger(scrollTwoUI.box, 'click', function() {
					testScrollTwo.toggleActive();

					testDisplay.startScrollingText(-1);
				});
				_self.addUIBoxTrigger(scrollTwoUI.box, 'unclick', function() {
					testScrollTwo.toggleActive();
					testDisplay.stopScrollingText();
				});

				scrollTwoUI.box.setDisplay(testScrollTwo);

				// END SCROLL BUTTON TESTING //
				*/


				break;
			default:
				break;
		}
	};

	/**
	 * Wrapper function for removeUIBox().
	 *
	 * @param		{string}		boxName	Unique name of UI box
	 */
	_self.remove = function(boxName) {
		_self.removeUIBox(boxName);
	};

	_init();
};
