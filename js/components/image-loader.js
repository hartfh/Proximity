module.exports = new function() {
	var _self		= this;
	var _sheets	= Data.sheets;
	var _images	= Data.images;
	var _callback	= null;

	_self.load = function(callback = function() {}) {
		_callback = callback;

		if( Object.keys(_sheets).length > 0 ) {
			_loadSheets(0);
		}
	};

	function _loadSheets(index) {
		var self	= arguments.callee;
		var key	= Object.keys(_sheets)[index];
		var data	= _sheets[key];
		var image	= document.getElementById('img-loader');

		image.onload = function() {
			index++;

			_sheets[key] = image.src;

			if( index < Object.keys(_sheets).length ) {
				_loadSheets(index);
			} else {
				_setupImages();
			}
		}

		image.src = Constants.IMG_DIR + data;
	}

	function _setupImages() {
		for(var index in _images) {
			var image = _images[index];

			_images[index].src = _sheets[image.sheet];
		}

		_callback();
	}
};
