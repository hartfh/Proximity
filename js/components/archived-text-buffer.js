module.exports = new function() {
	var _self		= this;
	var _canvas	= document.createElement('canvas');
	var _context	= _canvas.getContext('2d', {alpha: false});
	var _bounds	= false;

	function _init() {
		_context.imageSmoothingEnabled = false;

		_canvas.width	= Constants.VPORT_WIDTH;
		_canvas.height	= Constants.VPORT_HEIGHT;
	}

	function _clear() {
		_context.clearRect(0, 0, _canvas.width, _canvas.height);

		_bounds = false;
	}

	function _includeBounds(bounds) {
		if( _bounds ) {
			_bounds.min = bounds.min;
			_bounds.max = bounds.max;
		}

		// if more extreme than current bounds, expand to contain
	}

	_self.updateSize = function(width, height) {
		_canvas.width	= width;
		_canvas.height	= height;
	};

	_self.setColor = function(hex = '#ffffff') {
		_context.fillStyle = hex;
	};

	_self.setFont = function(font = '6px Arial') {
		_context.font = font;
	};

	_self.drawText = function(text = '', position = {x: 0, y: 0}) {
		_context.imageSmoothingEnabled = false;
		_context.fillText(text, position.x, position.y);
	};

	_self.clearArea = function(bounds) {
		_context.clearRect(bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y);
	};

	_self.purge = function(renderLayerName) {
		var layer		= Game.VisualFX.getLayer(renderLayerName);
		var context	= layer.getLayerContext();
		var canvas	= layer.getLayerCanvas();

		_context.imageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;

		// Works to other canvas but slow
		_context.setTransform(Game.State.pixelRatio * Game.State.pixelRatio, 0, 0, Game.State.pixelRatio * Game.State.pixelRatio, 0, 0);
		context.drawImage(_canvas, 0, 0, canvas.width / Game.State.pixelRatio, canvas.height / Game.State.pixelRatio);


		/*
		// Works, directly to main canvas
		_context.setTransform(Game.State.pixelRatio, 0, 0, Game.State.pixelRatio, 0, 0);
		Game.Engine.render.context.imageSmoothingEnabled = false;
		Game.Engine.render.context.drawImage(_canvas, 0, 0, Game.Engine.render.canvas.width, Game.Engine.render.canvas.height);
		*/

		_clear();
	};

	_init();
}
