var Display = require('./display');

module.exports = function(label, config = {}) {
	var _self		= this;
	var _width	= config.width || 0;
	var _height	= config.height || 0;
	var _position	= config.position || {x: 0, y: 0};
	//var _offset	= config.offset || {x: 0, y: 0};
	var _actor	= false;
	var _keys		= [];
	var _scroll	= Boolean(config.scroll) || false;
	var _visible	= false;

	_self.layer	= config.layer || '';
	_self.id		= label;
	_self.display	= false;

	function _init(keys) {
		if( typeof(keys) == 'string' ) {
			keys = [keys];
		}

		for(var key of keys) {
			_keys.push(key);
		}
	};

	_self.getDisplay = function() {
		if( _self.hasDisplay() ) {
			return _self.display;
		}

		return false;
	};

	_self.addDisplay = function(args = {}) {
		var width			= args.width || 0;
		var height		= args.height || 0;
		var position		= args.position || {x: 0, y: 0};
		var layer			= _self.layer;
		var config		= args.config || {};
		var activeConfig	= args.activeConfig || {};

		var display = new Display(width, height, position, layer, config, activeConfig);

		_self.setDisplay(display);

		return display;
	};

	_self.setDisplay = function(display) {
		display.id	= _self.id + '-display';
		display.offset	= {x: _position.x, y: _position.y};

		_self.display	= display;

		_visible = true;

		Game.VisualFX.addElement(display.layer, display.render, 'render-' + display.id);
	};

	_self.showDisplay = function() {
		if( !_visible ) {
			Game.VisualFX.enableElement('render-' + _self.display.id);

			_visible = true;
		}
	};

	_self.hideDisplay = function() {
		if( _visible ) {
			Game.VisualFX.disableElement('render-' + _self.display.id);

			_visible = false;
		}
	};

	_self.removeDisplay = function() {
		Game.VisualFX.removeElement('render-' + _self.display.id);

		_visible = false;

		_self.display = null;
	};

	_self.hasDisplay = function() {
		return Boolean(_self.display);
	};

	_self.hasActor = function() {
		return Boolean(_actor);
	};

	_self.destruct = function() {
		if( _self.hasActor() ) {
			_self.disconnectActor();
		}
		if( _self.hasDisplay() ) {
			_self.removeDisplay();
		}
	};

	_self.connectActor = function(actor) {
		_actor = actor;

		_actor.connectUIBox(_self.id, _self);
	};

	_self.disconnectActor = function() {
		_actor.disconnectUIBox(_self.id);

		_actor = null;
	};

	_self.updatePosition = function(position = {x: 0, y: 0}) {
		// Update own position
		_position.x = position.x;
		_position.y = position.y;

		// Account for viewport offset
		_position.x -= Game.Engine.render.bounds.min.x;
		_position.y -= Game.Engine.render.bounds.min.y;

		if( _self.hasDisplay() ) {
			// update display's offset
			_self.display.offset = {x: _position.x, y: _position.y};
		}
	};

	_self.hasPoint = function(point) {
		// Calculate box bounds
		var bounds = {
			min:	{
				x:	_position.x,
				y:	_position.y
			},
			max:	{
				x:	_position.x + _width,
				y:	_position.y + _height
			}
		};

		return Utilities.pointIntersectsRegion(point, bounds.min, bounds.max);
	};

	/**
	 * Checks if both the UI Box is triggered by a button, and if that trigger should occur while scrolling.
	 *
	 * @method	hasKey
	 * @public
	 * @param		{string}		key		Name of the trigger
	 * @param		{boolean}		scroll	If the event is occuring due to viewport scrolling
	 * @return	{boolean}
	 */
	_self.hasKey = function(key, scroll = false) {
		// Prevent the trigger if scrolling values don't match up
		if( scroll && !_scroll ) {
			return false;
		}

		// Check for the key
		return Boolean( _keys.indexOf(key) != -1 );
	};

	_init(config.keys || []);
};
