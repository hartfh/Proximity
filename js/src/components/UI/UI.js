var Game = Game || {};

Game.UI = (function() {
	var _self = {};

	// define all screens and their UI elements
	var _screenElements = {
		'loading':		[],
		'main-menu':		[],
		'settings':		[],
		'battlefield':		['HUD', 'stats']
	};

	_self.getElement = function(element) {
		return Game.UI[element];
	};

	_self.getCursorElements = function(screenPoint) {
		var elements		= [];
		var curScreen		= Game.State.getScreen();
		var testElements	= _screenElements[curScreen];

		for(var elementName of testElements) {
			var bounds = _self.getElement(elementName).getBounds();

			if( Game.utilities.pointIntersectsRegion(screenPoint, bounds.A, bounds.B) ) {
				elements.push(elementName);
			}
		}

		return elements;
	};

	return _self;
}());
