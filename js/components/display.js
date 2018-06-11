module.exports = function(width = 0, height = 0, position = {x: 0, y: 0}, layer, config = {}, activeConfig = {}) {
	var _self				= this;
	var _active			= false;			// tracks "Active" vs "Normal" state
	var _hasBorder 		= false;
	var _hasCustomFunction	= false;
	var _hasInside 		= false;
	var _hasText			= false;
	var _position			= position;
	var _width			= width;			// total width
	var _height			= height;			// total height
	var _scroll			= {x: 0, y: 0};	// current amount text is scrolled
	var _textHeight		= 0;				// pixel height of text block
	var _kerning			= 0;				// negative right margin applied when rendering and calculating line widths
	var _scrollingID		= false;			// text scrolling setInterval ID
	var _varsCache			= {};			// Cache any text "vars". Changes to the values trigger reconfiguration
	var _printedChars		= 0;

	_self.id				= '';
	_self.layer			= layer;			// for now just takes on parent UI Box's layer
	_self.offset			= {x: 0, y: 0};
	_self.border			= {};
	_self.inside			= {};
	_self.text			= {};

	_self.updatePosition = function(position = {x: 0, y: 0}) {
		_position = {x: position.x, y: position.y};
	};

	/**
	 * Sets whether or not display is in "active" state.
	 *
	 * @method	setActivity
	 * @public
	 * @param		{boolean}		activity		Flags _active as true/false
	 */
	_self.setActivity = function(activity = false) {
		_active = Boolean(activity);

		if( _active ) {
			_configure(activeConfig, config);
		} else {
			_configure(config);
		}
	};

	/**
	 * Applies a y-offset to the Display's text while ensuring the text stays visible.
	 *
 	* @param		{integer}		yScroll	Amount to scroll text in y-direction
	 */
	_self.scrollText = function(yScroll = 0) {
		var newY = _scroll.y + Math.floor(yScroll);

		if( newY <= 0 ) {
			var boxHeight = _height - (2 * _self.border.width);

			if( boxHeight + Math.abs(newY) <= _textHeight ) {
				_scroll.y = newY;
			}
		}
	};

	/**
	 * Sets up a repeating scroll event and clears out any old scroll events.
	 */
	_self.startScrollingText = function(yScroll) {
		if( _scrollingID ) {
			_self.stopScrollingText();
		}

		_scrollingID = setInterval(function() {
			_self.scrollText(yScroll);
		}, 15);
	};

	/**
	 * Cancels the current scroll event.
	 */
	_self.stopScrollingText = function() {
		window.clearTimeout(_scrollingID);
	};

	/**
	 * Applies one or two configuration objects to determine the displays settings and contents.
	 *
	 * @method	_configure
	 * @private
	 * @param		{object}		config	A configuration object defining "Normal" state settings
	 * @param		{object}		fallback	An optional secondary configuration object defining "Active" state settings
	 */
	function _configure(config = {}, fallback = {}) {
		var borderConfig	= config.border || {};
		var insideConfig	= config.inside || {};
		var textConfig		= config.text || {};
		var functionConfig	= config.custom || false;

		var borderConfigFb	= fallback.border || {};
		var insideConfigFb	= fallback.inside || {};
		var textConfigFb	= fallback.text || {};

		// Border
		_self.border.color		= (borderConfig.color || borderConfigFb.color) || false;
		_self.border.image		= (borderConfig.image || borderConfigFb.image) || false;
		_self.border.width		= (borderConfig.width || borderConfigFb.width) || 0;

		if( _self.border.width != 0 ) {
			_self.border.regions = _calculateBorderRegions();
		}

		// Inside
		_self.inside.color		= (insideConfig.color || insideConfigFb.color) || false;
		_self.inside.image		= (insideConfig.image || insideConfigFb.image) || false;
		_self.inside.mode		= (insideConfig.mode || insideConfigFb.mode) || 'source-over';
		_self.inside.vars		= (insideConfig.vars || insideConfigFb.vars) || {};

		var insideOpacity = (insideConfig.opacity || insideConfigFb.opacity);
		_self.inside.opacity = (insideOpacity == undefined) ? 1.0 : insideOpacity;

		// Text
		_self.text.font		= (textConfig.font  || textConfigFb.font) || 'thintel';
		_self.text.color		= (textConfig.color  || textConfigFb.color) || 'white';
		_self.text.font		= _self.text.font + '-' + _self.text.color;
		_self.text.alignment	= (textConfig.alignment  || textConfigFb.alignment) || 'left';
		_self.text.padding		= (textConfig.padding  || textConfigFb.padding) || {h: 0, v: 0};
		_self.text.opacity		= (textConfig.opacity  || textConfigFb.opacity) || 1.0;
		_self.text.offset		= (textConfig.offset || textConfigFb.offset) || {x: 0, y: 0};
		_self.text.vars		= (textConfig.vars || textConfigFb.vars) || {};
		_self.text.mode		= (textConfig.mode || textConfig.mode) || 'source-over';
		_self.text.print		= (textConfig.print || textConfig.print) || false;

		// Render Function
		_self.custom			= functionConfig;

		_kerning = (Data.fonts[_self.text.font]) ? Data.fonts[_self.text.font].kerning : 0;

		var fontWidth	= (Data.fonts[_self.text.font]) ? Data.fonts[_self.text.font].width : 1;
		var fontHeight	= (Data.fonts[_self.text.font]) ? Data.fonts[_self.text.font].height : 1;

		_self.text.content = _convertImageTextToLines((textConfig.content || textConfigFb.content), fontWidth, width - _self.text.padding.h*2 - _self.border.width*2, _kerning) || [];

		_textHeight = _self.text.content.length * fontHeight

	}

	/**
	 * Initializes the display.
	 */
	function _init(config) {
		_configure(config);

		if( _self.border.width > 0 ) {
			_hasBorder = true;
		}
		if( _self.inside.color || _self.inside.image ) {
			_hasInside = true;
		}
		if( _self.text.content.length > 0 ) {
			_hasText = true;
		}
		if( _self.custom ) {
			_hasCustomFunction = true;
		}
	}

	/**
	 * Renders the display.
	 *
	 * @method	render
	 * @public
	 * @param		{object}	context	A Canvas context
	 */
	_self.render = function(context) {
		context.globalAlpha = 1.0;

		_updateVarsCache();

		_renderInside(context);
		_renderBorder(context);
		_renderImageText(context);
		_renderCustomFunction(context);
	};

	/**
	 * Renders the display's border.
	 *
	 * @method	_renderBorder
	 * @private
	 * @param		{object}		ctx		A Canvas context
	 */
	function _renderBorder(context) {
		if( _hasBorder ) {
			context.globalCompositeOperation = 'source-over';

			if( _self.border.color ) {
				context.fillStyle = _self.border.color;

				for(var region of _self.border.regions) {
					context.fillRect(region.position.x + _position.x + _self.offset.x, region.position.y + _position.y + _self.offset.y, region.width, region.height);
				}
			}
			if( _self.border.image ) {
				for(var index in _self.border.regions) {
					var region = _self.border.regions[index];

					var adjRegion = {
						position:	{
							x:	region.position.x + _position.x + _self.offset.x,
							y:	region.position.y + _position.y + _self.offset.y
						},
						width:	region.width,
						height:	region.height
					};

					var image = {
						name:	_self.border.image[index],
						width:	_self.border.width,
						height:	_self.border.width
					};

					_tileImage(image, adjRegion, context);
				}
			}
		}
	}

	/**
	 * Determines bounds of the eight regions that comprise the border.
	 *
	 * @method	_calculateBorderRegions
	 * @private
	 * @return	{array}
	 */
	function _calculateBorderRegions() {
		var regions = [];

		var region1 = {
			position:	{x: 0, y: 0},
			width:	_self.border.width,
			height:	_self.border.width
		};

		var region2 = {
			position:	{x: _self.border.width, y: 0},
			width:	_width - (_self.border.width * 2),
			height:	_self.border.width
		};

		var region3 = {
			position:	{x: _width - _self.border.width, y: 0},
			width:	_self.border.width,
			height:	_self.border.width
		};

		var region4 = {
			position:	{x: 0, y: _self.border.width},
			width:	_self.border.width,
			height:	_height - (_self.border.width * 2)
		};

		var region5 = {
			position:	{x: _width - _self.border.width, y: _self.border.width},
			width:	_self.border.width,
			height:	_height - (_self.border.width * 2)
		};

		var region6 = {
			position:	{x: 0, y: _height - _self.border.width},
			width:	_self.border.width,
			height:	_self.border.width
		};

		var region7 = {
			position:	{x: _self.border.width, y: _height - _self.border.width},
			width:	_width - (_self.border.width * 2),
			height:	_self.border.width
		};

		var region8 = {
			position:	{x: _width - _self.border.width, y: _height - _self.border.width},
			width:	_self.border.width,
			height:	_self.border.width
		};

		regions.push(region1);
		regions.push(region2);
		regions.push(region3);
		regions.push(region4);
		regions.push(region5);
		regions.push(region6);
		regions.push(region7);
		regions.push(region8);

		return regions;
	}

	function _renderCustomFunction(context) {
		if( _hasCustomFunction ) {
			_self.custom(context);
		}
	}

	/**
	 * Renders the display's interior background.
	 *
	 * @method	_renderInside
	 * @private
	 * @param		{object}		ctx		A Canvas context
	 */
	function _renderInside(context) {
		if( _hasInside ) {
			var rectPosition = {
				x:	_position.x + _self.offset.x + _self.border.width,
				y:	_position.y + _self.offset.y + _self.border.width
			};

			var rectWidth	= _width - _self.border.width * 2;
			var rectHeight	= _height - _self.border.width * 2;

			var rectRegion = {
				position:		rectPosition,
				width:		rectWidth,
				height:		rectHeight
			}

			for(var key in _self.inside.vars) {
				for(var prop of ['color', 'mode', 'opacity']) {
					if( _self.inside[prop] == key ) {
						var replacement = _self.inside.vars[key]();

						_self.inside[prop] = replacement;
					}
				}
			}

			if( _self.inside.mode != 'source-over' ) {
				context.globalCompositeOperation = _self.inside.mode;
			}
			if( _self.inside.opacity < 1.0 ) {
				context.globalAlpha = _self.inside.opacity;
			}
			if( _self.inside.color ) {
				context.fillStyle = _self.inside.color;
				context.fillRect(rectRegion.position.x, rectRegion.position.y, rectRegion.width, rectRegion.height);
			}
			if( _self.inside.image ) {
				var image = {
					name:	_self.inside.image,
					width:	Data.images[_self.inside.image].w,
					height:	Data.images[_self.inside.image].h,
					x:		Data.images[_self.inside.image].x,
					y:		Data.images[_self.inside.image].y
				};

				_tileImage(image, rectRegion, context);
			}

			// Reset context settings
			if( _self.inside.opacity < 1.0 ) {
				context.globalAlpha = 1.0;
			}

			context.globalCompositeOperation = 'source-over';
		}
	}

	/**
	 * Tiles an image over a supplied area.
	 *
	 * @method	_tileImage
	 * @private
	 * @param		{object}		img
	 * @param		{integer}		img.width		The image pixel width
	 * @param		{integer}		img.height	The image pixel height
	 * @param		{object}		img.data		Contains the image src as well as its x- and y-coordinates on its sprite sheet
	 * @param		{object}		region
	 * @param		{number}		region.x		X-position of tiled region
	 * @param		{number}		region.y		Y-position of tiled region
	 * @param		{integer}		region.width	Width of tiled region
	 * @param		{integer}		region.height	Height of tiled region
	 * @param		{object}		context		A Canvas context to draw to
	 */
	function _tileImage(img = {width: 0, height: 0, name: '', x: 0, y: 0}, region, context) {
		if( _self.inside.mode != 'source-over' ) {
			context.globalCompositeOperation = _self.inside.mode;
		}

		var image	= _getTexture(Game.Textures, img.name);

		for(var x = region.position.x, xMax = region.position.x + region.width; x < xMax; x += img.width) {
			for(var y = region.position.y, yMax = region.position.y + region.height; y < yMax; y += img.height) {
				var xOverflow	= x + img.width;
				var yOverflow	= y + img.height;
				var xSlice	= (xOverflow > xMax) ? (xOverflow - xMax) : 0;
				var ySlice	= (yOverflow > yMax) ? (yOverflow - yMax) : 0;

				context.drawImage(
					image,
					img.x,
					img.y,
					img.width - xSlice,
					img.height - ySlice,
					x,
					y,
					img.width - xSlice,
					img.height - ySlice
				);
			}
		}

		context.globalCompositeOperation = 'source-over';
	}

	function _getTexture(textures, imageName) {
		var image = textures[imageName];

		if( image ) {
			return image;
		}

		image = textures[imageName] = new Image();
		image.src = Data.sheets[ Data.images[imageName].sheet ];

		return image;
	};

	function _updateVarsCache() {
		var refresh = false;

		for(var key in _self.text.vars) {
			var replacement = _self.text.vars[key]();

			if( _varsCache[key] != replacement ) {
				refresh = true;
				_varsCache[key] = replacement;
			}

		}
		for(var key in _self.inside.vars) {
			var replacement = _self.inside.vars[key]();

			if( _varsCache[key] != replacement ) {
				refresh = true;
				_varsCache[key] = replacement;
			}

		}

		// If var values changed, reconfigure to recalculate line breaks
		if( refresh ) {
			if( _active ) {
				_configure(activeConfig, config);
			} else {
				_configure(config);
			}
		}
	}

	function _renderImageText(context) {
		if( _hasText ) {
			var printing = 0;

			_printedChars++;

			if( _self.text.mode != 'source-over' ) {
				context.globalCompositeOperation = _self.text.mode;
			}
			if( _self.text.opacity < 1.0 ) {
				context.globalAlpha = _self.text.opacity;
			}

			var fontData = Data.fonts[_self.text.font];

			context.beginPath();
			context.save();
			context.rect(
				_position.x + _self.offset.x + _self.border.width,
				_position.y + _self.offset.y + _self.border.width,
				_width - (_self.border.width * 2),
				_height - (_self.border.width * 2)
			);
			context.clip();

			linesLoop:
			for(var index in _self.text.content) {
				var line			= _self.text.content[index];
				var lineCharacters	= line.characters;
				var lineWidth		= line.width;
				var lineOffset		= index * fontData.height;
				var lineAlignOffset	= 0;

				if( _self.text.alignment == 'center' ) {
					lineAlignOffset = (_width - lineWidth) * 0.5;
				}

				var textPosition	= {
					x:	_self.text.offset.x + _position.x + _self.offset.x + _self.text.padding.h + _self.border.width + _scroll.x + lineAlignOffset,
					y:	_self.text.offset.y + _position.y + _self.offset.y + _self.text.padding.v + _self.border.width + _scroll.y + lineOffset
				};

				for(var key in _varsCache) {
					var keyIndex = lineCharacters.indexOf(key);

					if( keyIndex != -1 ) {
						var replacement = _varsCache[key];

						lineCharacters = lineCharacters.replace(key, replacement);
					}
				}

				charactersLoop:
				for(var i in lineCharacters) {
					if( _self.text.print ) {
						switch(_self.text.print) {
							case 'slow':
								printing += 3;
								break;
							case 'medium':
								printing += 2;
								break;
							case 'fast':
								printing += 1;
							default:
								break;
						}

						if( printing >= _printedChars ) {
							break charactersLoop;
						}
					}

					var character	= lineCharacters[i];
					var imageName	= _self.text.font + '-' + character;
					var escaped	= imageName.replace('.', 'escaped_dot'); // NEDB does not allow "." in data object properties
					var imageData	= Data.images[escaped];
					var texture	= _getTexture(Game.Textures, escaped);

					context.drawImage(
						texture,
						imageData.x,
						imageData.y,
						imageData.w,
						imageData.h,
						textPosition.x + ( i * (fontData.width + _kerning) ),
						textPosition.y,
						imageData.w,
						imageData.h
					);
				}
			}

			context.restore(); // remove the clipping region
			context.closePath();

			context.globalCompositeOperation = 'source-over';

			if( _self.text.opacity < 1.0 ) {
				context.globalAlpha = 1.0;
			}
		}
	}

	/**
	 * Renders the display's text.
	 *
	 * @method	_renderText
	 * @private
	 * @param		{object}		context		A Canvas context
	 */
	/*
	function _renderText(context) {
		if( _hasText ) {
			context.globalCompositeOperation = 'source-over';

			context.fillStyle		= _self.text.color;
			context.font			= _self.text.size + ' ' + _self.text.family;
			context.textBaseline	= 'top';


			context.save();
			context.beginPath();
			context.rect(
				_position.x + _self.offset.x + _self.border.width,
				_position.y + _self.offset.y + _self.border.width,
				_width - (_self.border.width * 2),
				_height - (_self.border.width * 2)
			);
			context.clip();

			for(var index in _self.text.content) {
				var line			= _self.text.content[index];
				var lineOffset		= index * _self.text.lineheight;

				var textPosition	= {
					x:	_self.text.offset.x + _position.x + _self.offset.x + _self.text.padding.h + _self.border.width + _scroll.x,
					y:	_self.text.offset.y + _position.y + _self.offset.y + _self.text.padding.v + _self.border.width + _scroll.y + lineOffset
				};

				for(var key in _self.text.vars) {
					var keyIndex = line.indexOf(key);

					if( keyIndex != -1 ) {
						var replacement = _self.text.vars[key]();

						line = line.replace(key, replacement);
					}
				}

				context.fillText(line, textPosition.x, textPosition.y);
			}

			context.closePath();
			context.restore(); // remove the clipping region

		}
	}
	*/

	function _convertImageTextToLines(text = false, fontSize = 16, containerWidth = false, kerning = 0) {
		const SEPARATOR = ' ';
		const FONT_SIZE = fontSize + kerning;

		if( !containerWidth || !text ) {
			return [];
		}
		if( typeof(text) == 'string' ) {
			text = [text];
		}

		var lines	= [];

		// Wrap each text piece separately and maintain linebreaks
		for(var piece of text) {
			// Make "vars" replacements before measuring, for accurate measurements
			for(var key in _varsCache) {
				var keyIndex = piece.indexOf(key);

				if( keyIndex != -1 ) {
					var replacement = _varsCache[key];

					piece = piece.replace(key, replacement);
				}
			}

			var words		= piece.split(SEPARATOR);
			var line		= '';
			var testWidth	= 0;

			for(var word of words) {
				var measured = (word.length + 1) * FONT_SIZE;

				if( testWidth + measured < containerWidth ) {
					testWidth += measured;
				} else {
					// Store current line
					lines.push({characters: line, width: testWidth});

					// Start a new line
					line = '';

					// Line width becomes word width
					testWidth = measured;
				}

				line += word + SEPARATOR;
			}

			lines.push({characters: line, width: testWidth});
		}

		return lines;
	}

	/**
	 * Line-wraps text into a defined container width.
	 *
	 * @method	_breakTextIntoLines
	 * @private
	 * @param		{array}	text				Array of strings, with each value representing a new line
	 * @param		{number}	containerWidth		The container width to wrap lines within
	 * @return	{array}
	 */
	function _convertTextToLines(text = false, containerWidth = false) {
		const SEPARATOR = ' ';

		if( !containerWidth || !text ) {
			return [];
		}
		if( typeof(text) == 'string' ) {
			text = [text];
		}

		var lines		= [];
		var context	= Game.Engine.render.context;

		context.font = _self.text.size + ' ' + _self.text.family;

		// Wrap each text piece separately and maintain linebreaks
		for(var piece of text) {
			var words		= piece.split(SEPARATOR);
			var line		= '';
			var testWidth	= 0;

			for(var word of words) {
				var measured = context.measureText(word + SEPARATOR);

				if( testWidth + measured.width < containerWidth ) {
					testWidth += measured.width;
				} else {
					// Store current line
					lines.push(line);

					// Start a new line
					line = '';

					// Line width becomes word width
					testWidth = measured.width;
				}

				line += word + SEPARATOR;
			}

			lines.push(line);
		}

		return lines;
	}

	_init(config);
};
