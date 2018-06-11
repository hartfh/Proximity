var Game = Game || {};

/**
 * A class for drawing elements to the screen from a buffer canvas during render.
 */
Game.RenderLayer = function() {
	var _self		= {};
	var _canvas	= document.createElement('canvas');
	var _context	= _canvas.getContext('2d');
	var _list		= new List();
	var _temp		= [];

	/**
	 * Initializes canvas to correct size.
	 *
	 * @method	_init
	 * @private
	 */
	var _init = function() {
		var cfg = Game.constants.config;

		_self.updateSize(cfg.VPORT_WIDTH * cfg.PIXEL_RATIO, cfg.VPORT_HEIGHT * cfg.PIXEL_RATIO);
	};

	/**
	 * Updates the layer's canvas size to the provided dimensions.
	 *
	 * @method	updateSize
	 * @public
	 * @param		{integer}		width	Width pixel size
	 * @param		{integer}		height	Height pixel size
	 */
	_self.updateSize = function(width, height) {
		_canvas.width	= width;
		_canvas.height	= height;
	};

	/**
	 * Clears all data from the layer and resets its image compositing mode.
	 *
	 * @method	clear
	 * @public
	 */
	_self.clear = function(ctx) {
		_context.beginPath();
		_context.clearRect(0, 0, _canvas.width, _canvas.height);
		_context.closePath();

		ctx.globalCompositeOperation = 'source-over';
	};

	/**
	 * Interface method for List.addItem().
	 */
	_self.addElement = function(renderFunc, handle, order = false) {
		_list.addItem(renderFunc, handle, order, true);

		return _self;
	};

	_self.addTemporaryElement = function(renderFunc, handle, order = false) {
		_self.addElement(renderFunc, handle, order);

		_temp.push(handle);
	};

	/**
	 * Interface method for List.addRemove().
	 */
	_self.removeElement = function(handle) {
		_list.removeItem(handle);

		return _self;
	};

	/**
	 * Interface method for List.disableItem().
	 */
	_self.disableElement = function(handle) {
		_list.disableItem(handle);

		return _self;
	};

	/**
	 * Interface method for List.enableItem().
	 */
	_self.enableElement = function(handle) {
		_list.enableItem(handle);

		return _self;
	};

	/**
	 * Draws the layer to a canvas.
	 *
	 * @method	render
	 * @public
	 * @param		{object}	ctx		A canvas 2D context
	 * @param		{string}	mode		The image compositing mode to draw the layer in
	 */
	_self.render = function(ctx, mode = 'source-over') {
		if( _list.countEnabledItems() == 0 ) {
			return;
		}

		_list.eachItem(function(item, handle, index) {
			item(_context);
		});

		// Remove temporary elements
		for(var handle of _temp) {
			_self.removeItem(handle);
		}

		ctx.globalCompositeOperation = mode;
		ctx.beginPath();
		ctx.drawImage(_canvas, 0, 0);
		ctx.closePath();

		_self.clear(ctx);
	};

	_init();

	return _self;
};
