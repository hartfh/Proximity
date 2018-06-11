module.exports = function() {
	var _self		= {};
	var _canvas	= document.createElement('canvas'); // NOTE: for use with buffer
	var _context	= _canvas.getContext('2d', {alpha: false}); // NOTE: for use with buffer
	var _list		= new List();
	var _temp		= [];
	var _delayed	= new List();

	/**
	 * Initializes canvas to correct size.
	 *
	 * @method	_init
	 * @private
	 */
	function _init() {
		_self.updateSize(Constants.VPORT_WIDTH, Constants.VPORT_HEIGHT);

		_context.imageSmoothingEnabled = false;

		_canvas.oncontextmenu = function() { return false; };
		_canvas.onselectstart = function() { return false; };
	};

	_self.getLayerCanvas = function() {
		return _canvas;
	};

	_self.getLayerContext = function() {
		return _context;
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
	_self.clear = function() {
		_context.beginPath();
		_context.clearRect(0, 0, _canvas.width, _canvas.height);
		_context.closePath();
	};

	/**
	 * Interface method for List.addItem().
	 */
	_self.addElement = function(layer, renderFunc, handle, order = false, disabled = false) {
		_list.addItem({
			layer:	layer,
			render:	renderFunc
		}, handle, order, true);

		if( !disabled ) {
			_self.enableElement(handle);
		}

		return _self;
	};

	_self.addTemporaryElement = function(layer, renderFunc, handle) {
		_self.addElement(layer, renderFunc, handle);

		_temp.push(handle);

		return _self;
	};

	_self.addDelayedTemporaryElement = function(layer, renderFunc, handle, delay = 1) {
		_delayed.addItem({
			layer:		layer,
			renderFunc:	renderFunc,
			delay:		delay,
			handle:		handle
		}, handle);
	};

	/**
	 * Interface method for List.removeItem().
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

	function _sortRenderElements() {
		function sortByZIndex(a, b) {
			var zIndexA = Data.layers[a.layer];
			var zIndexB = Data.layers[b.layer];

			if(zIndexA > zIndexB) {
				return 1;
			} else if(zIndexA < zIndexB) {
				return -1;
			} else {
				return 0;
			}
		}

		var items = [];

		_list.eachItem(function(item, handle, index) {
			items.push(item);
		});

		return items.sort(sortByZIndex);
	}

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

		//ctx.imageSmoothingEnabled = false;
		_context.imageSmoothingEnabled = false; // NOTE: for use with buffer

		var orderedElements = _sortRenderElements();

		for(var renderElement of orderedElements) {
			//renderElement.render(ctx);
			renderElement.render(_context); // NOTE: for use with buffer
		}

		// Remove temporary elements
		for(var handle of _temp) {
			_self.removeElement(handle);
		}

		_temp = [];

		var delayRemove = [];

		_delayed.eachItem(function(item, handle) {
			item.delay--;

			if( item.delay <= 0 ) {
				delayRemove.push(handle);
			}
		});

		for(var delayHandle of delayRemove) {
			var item = _delayed.getItem(delayHandle);

			_self.addTemporaryElement(item.layer, item.renderFunc, item.handle);

			_delayed.removeItem(delayHandle);
		}
	};

	_self.printCanvas = function(ctx) {
		_context.setTransform(Game.State.pixelRatio, 0, 0, Game.State.pixelRatio, 0, 0);

		ctx.globalCompositeOperation = 'source-in';
		ctx.fillStyle = "transparent";
		ctx.fillRect(0, 0, Constants.VPORT_WIDTH * Game.State.pixelRatio, Constants.VPORT_HEIGHT * Game.State.pixelRatio);
		ctx.globalCompositeOperation = 'source-over';

		ctx.beginPath();
		ctx.drawImage(_canvas, 0, 0);
		ctx.closePath();
		//ctx.setTransform(Game.State.pixelRatio, 0, 0, Game.State.pixelRatio, 0, 0);

		_self.clear();
	};

	_init();

	return _self;
}
