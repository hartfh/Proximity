module.exports = new function() {
	var _self		= this;
	//var _layers	= new List();
	var _queue	= new List();
	var _tempQueue	= new List();

	_self.addElement = function(zindex = 0, renderFunc = function() {}, handle = false) {
		_queue.addItem({
			zindex:	zindex,
			render:	renderFunc
		}, handle);
	};

	_self.addTempElement = function(zindex = 0, renderFunc = function() {}) {
		_tempQueue.addItem({
			zindex:	zindex,
			render:	renderFunc
		});
	};

	_self.render = function() {
		// sort queue and tempQueue into ordered buckets, then render each bucket
		_queue.eachItem(function(item) {
			item.render(Game.Engine.render.context);
		});

		_tempQueue.eachItem(function(item) {
			item.render(Game.Engine.render.context);
		});


		_tempQueue.reset();
	};

	/*
	_self.addLayer = function(name) {
		var layer = new RenderLayer();

		_layers.addItem(layer, name);
	};

	_self.removeLayer = function(name) {
		_layers.removeItem(name);
	};

	_self.getLayer = function(name) {
		return _layers.getItem(name);
	};

	_self.render = function() {
		_layers.eachItem(function(layer) {
			layer.render(Game.Engine.render.context);
		});
	};

	_self.updateSize = function(width, height) {
		_layers.eachItem(function(layer) {
			layer.updateSize(width, height);
		});
	};
	*/
}
