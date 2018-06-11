module.exports = new function() {
	var _self 	= this;
	var _db		= false;
	var _encoded	= {};
	var _images	= Data.images;
	var _sheets	= Data.sheets;
	var _canvas	= false;
	var _context	= false;

	_self.decode = function(callback = function(){}) {
		_db = new Datastore({filename: Constants.ASSETS_DIR + '/encoded-img-data', autoload: true});

		_db.findOne({}, function(err, doc) {
			if( doc ) {
				log('starting decode')
				_loadSheet(doc, 0, callback);
			}
		});
	};

	function _loadSheet(encoded, index, callback) {
		var key	= Object.keys(encoded.sheets)[index];
		var data	= encoded.sheets[key];
		var image = new Image();

		image.onload = function() {
			index++;

			if( index < Object.keys(encoded.sheets).length ) {
				_loadSheet(encoded, index, callback);
			} else {
				// Adjust image data
				for(var i in encoded.images) {
					var imgData = encoded.images[i];

					_images[i].x		= imgData.x;
					_images[i].y		= imgData.y;
					_images[i].sheet	= imgData.sheet;
				}

				// Adjust sheet data
				Data.sheets = {};

				for(var s in encoded.sheets) {
					Data.sheets[s] = encoded.sheets[s];
				}

				log('sheet loading done');

				callback();
			}
		}

		image.src = data;
	}

	function _loadImages(encoded, index, callback) {
		var key	= Object.keys(encoded.images)[index];
		var sheet	= encoded.images[key].sheet;
		var data	= encoded.sheets[sheet];
		var image = new Image();

		image.onload = function() {
			index++;

			Data.images[key].src	= data;
			Data.images[key].x		= encoded.images[key].x;
			Data.images[key].y		= encoded.images[key].y;

			if( index < Object.keys(_images).length ) {
				_loadImages(encoded, index, callback);
			} else {
				callback();
			}
		}

		image.src = data;
	}

	_self.encode = function() {
		fs.unlink(Constants.ASSETS_DIR + '/encoded-img-data', function(err) {
			_canvas	= document.createElement('canvas');
			_context	= _canvas.getContext('2d');

			_db = new Datastore({filename: Constants.ASSETS_DIR + '/encoded-img-data', autoload: true});

			if( Object.keys(_images).length > 0 ) {
				_binImages();
			}
		});
	};

	function _binImages() {
		var packer = new MaxRectsPacker(1024, 1024);

		var contents = [];

		for(var i in _images) {
			var image = _images[i];
			var shape = {width: image.w, height: image.h, data: i};

			contents.push(shape);
		}

		packer.addArray(contents);

		_pasteBin(packer, 0, function() {
			_db.insert({sheets: _encoded, images: _images}, function(err, newDoc) {

				if( err ) {
					log('Bin encoding problem occurred');
				} else {
					log('Bin encoding complete');
				}

				for(var s in _encoded) {
					var sheet	= _encoded[s];
					var data	= sheet.replace(/^data:image\/\w+;base64,/, '');
					var buffer = new Buffer(data, 'base64');

					fs.writeFile('assets/test-' + s + '.png', buffer, function(err){
						log('completed writing');
					});
				}
			});
		})
	}

	function _pasteBin(packer, binIndex = 0, binsComplete = function(){}) {
		log('Doing bin ' + binIndex);
		var bin = packer.bins[binIndex];

		_canvas.width	= bin.width;
		_canvas.height	= bin.height;

		_context.globalCompositeOperation = 'source-over';
		_context.fillStyle = 'transparent';
		_context.fillRect(0, 0, _canvas.width, _canvas.height);

		_pasteBinImages(packer, binIndex, 0, function() {
			// Dump canvas data
			_encoded['spritesheet-' + binIndex] = _canvas.toDataURL('image/png');

			binIndex++;

			if( binIndex < packer.bins.length ) {
				// Move on to the next bin
				_pasteBin(packer, binIndex, binsComplete);
			} else {
				binsComplete();
			}
		});
	}

	function _pasteBinImages(packer, binIndex = 0, rectIndex = 0, binComplete = function(){}) {
		var bin		= packer.bins[binIndex];
		var image		= new Image();
		var binImgData	= bin.rects[rectIndex];

		image.onload = function() {
			_context.drawImage(
				this,
				_images[binImgData.data].x,
				_images[binImgData.data].y,
				_images[binImgData.data].w,
				_images[binImgData.data].h,
				binImgData.x,
				binImgData.y,
				binImgData.width,
				binImgData.height
			);

			// Update the image data with their new sheets and positions within them
			_images[binImgData.data].x		= binImgData.x;
			_images[binImgData.data].y		= binImgData.y;
			_images[binImgData.data].sheet	= 'spritesheet-' + binIndex;


			rectIndex++;

			if( rectIndex < packer.bins[binIndex].rects.length ) {
				_pasteBinImages(packer, binIndex, rectIndex, binComplete);
			} else {
				binComplete();
			}
		}

		image.src = Constants.IMG_DIR + _sheets[ _images[binImgData.data].sheet ];
	}

	/*
	function _enlargeCanvas() {
		_canvas.width	= 0;
		_canvas.height	= 0;

		var width = 0;
		var maxHeight = 0;

		for(var i in _images) {
			var image = _images[i];

			width += image.w + 5;

			if( image.h > maxHeight ) {
				maxHeight = image.h;
			}
		}

		_canvas.width = width;
		_canvas.height = maxHeight;

		_canvas.width = 2000;

		_pasteData();
	}

	function _pasteData(index = 0, position = 0) {
		var key	= Object.keys(_images)[index];
		var data	= _images[key];
		var image = new Image();

		image.onload = function () {
			_context.drawImage(
				this,
				data.x,
				data.y,
				data.w,
				data.h,
				position,
				0,
				data.w,
				data.h
			);

			index++;

			position += (data.w + 5);

			if( index < Object.keys(_images).length ) {
				_pasteData(index, position);
			} else {
				var encoded = _canvas.toDataURL('image/png');

				_db.insert(encoded, function(err, newDoc) {

					if( err ) {
						log('Image encoding problem occurred');
					} else {
						log('Image encoding complete');
					}
				});
			}
		};

		image.src = Constants.IMG_DIR + _sheets[data.sheet];
	}

	_self.encode = function() {
		fs.unlink(Constants.ASSETS_DIR + '/encoded-img-data', function(err) {
			_canvas	= document.createElement('canvas');
			_context	= _canvas.getContext('2d');

			_db = new Datastore({filename: Constants.ASSETS_DIR + '/encoded-img-data', autoload: true});

			if( Object.keys(_images).length > 0 ) {
				_convertImage(0);
			}
		});
	};

	function _convertImage(index) {
		var key	= Object.keys(_images)[index];
		var data	= _images[key];
		var image = new Image();

		var masterWidth = 0;

		image.onload = function () {
			_canvas.width	= data.w;
			_canvas.height	= data.h;

			// Clear the canvas and draw the image to it
			_context.globalCompositeOperation = 'source-over';
			_context.fillStyle = 'transparent';
			_context.fillRect(0, 0, _canvas.width, _canvas.height);
			_context.drawImage(
				this,
				data.x,
				data.y,
				data.w,
				data.h,
				0,
				0,
				data.w,
				data.h
			);

			_encoded[key] = _canvas.toDataURL('image/png');

			index++;

			if( index < Object.keys(_images).length ) {
				_convertImage(index);
			} else {
				_db.insert(_encoded, function(err, newDoc) {
					if( err ) {
						log('Image encoding problem occurred');
					} else {
						log('Image encoding complete');
					}
				});
			}
		};

		image.src = Constants.IMG_DIR + _sheets[data.sheet];
	}
	*/
};
