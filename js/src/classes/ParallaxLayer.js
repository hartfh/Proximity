var Game = Game || {};

Game.ParallaxLayer = function(config) {
	var _self			= this;
	var _multiplier	= config.multiplier || 0.2;
	var _opacity		= config.opacity || 1.0;
	var _bgcolor		= config.bgcolor || '#000000';
	var _density		= config.density || 55;
	var _size			= false;
	var _grid			= false;

	/**
	 * Initializes object properties and hooks into game events.
	 *
	 * @method	init
	 * @public
	 * @param		{object}
	 */
	_self.init = function() {
		_size = Math.ceil( Game.constants.config.GRID_SIZE * Game.constants.config.SUBGRID_SIZE * (1 + _multiplier) );
		_grid = new Grid(_size);

		_grid.seedRandom(_density).setHexValues();

		Matter.Events.on(Game.render, 'beforeRenderBodies', _self.render);

		return _self;
	};

	/**
	 * Cleans up any events that refer to this object.
	 *
	 * @method	destroy
	 * @public
	 */
	_self.destroy = function() {
		Matter.Events.off(Game.render, 'beforeRenderBodies', _self.render);
	};

	/**
	 * Renders a background layer to the canvas.
	 *
	 * @method	render
	 * @public
	 * @param		{object}	event	Matter.js event object
	 */
	_self.render = function(event) {
		var c		= event.source.context;
		var minBounds	= event.source.bounds.min;
		var maxBounds	= event.source.bounds.max;
		var constants	= Game.constants.config;

		var xOffset = minBounds.x * _multiplier;
		var yOffset = minBounds.y * _multiplier;

		c.fillStyle = _bgcolor;

		_grid.eachMetaPoint(function(metapoint, x, y) {
			/*
			if( Game.utilities.isEmptyTileType(metapoint.type) ) {
				return;
			}
			*/

			// TODO: fix flickering?
			// NOTE: possibly reduce terrain size the further into the background it is

			// Determine tile position
			var xPosition = x * constants.TERRAIN_TILE_SIZE + xOffset;
			var yPosition = y * constants.TERRAIN_TILE_SIZE + yOffset;

			// Check if tile is within viewport boundaries. If not, don't render it
			if( !_boundariesAreWithinViewport(event.source, {x: xPosition, y: yPosition}) ) {
				return;
			}

			/*
			var actorName	= Game.options.tileset + '-' + metapoint.type + '-' + metapoint.rotations;
			var imgPath	= Game.data.actors[actorName].body.parts.structures[0].sprites.spriteFrames[0];
			var image		= new Image();

			image.src = imgPath;
			*/

			/*
			// Draw colored background
			c.globalAlpha = 1.0;
			c.fillRect(xPosition, yPosition, constants.TERRAIN_TILE_SIZE, constants.TERRAIN_TILE_SIZE);

			// Draw image with transparency
			c.globalAlpha = _opacity;
			c.drawImage(image, xPosition, yPosition, constants.TERRAIN_TILE_SIZE, constants.TERRAIN_TILE_SIZE);
			*/

			if( !Game.utilities.isEmptyTileType(metapoint.type) ) {
				var actorName	= Game.settings.tileset + '-' + metapoint.type + '-' + metapoint.rotations;
				var imgPath	= Game.data.actors.terrain[actorName].body.parts.structures[0].sprites.normal.spriteFrames[0];
				var image		= new Image();

				image.src = imgPath;
				//image.crossOrigin = 'Anonymous';

				c.globalAlpha = 1.0;
				c.drawImage(image, xPosition, yPosition, constants.TERRAIN_TILE_SIZE, constants.TERRAIN_TILE_SIZE);
			}

			c.globalAlpha = 1.0 - _opacity;
			c.fillRect(xPosition, yPosition, constants.TERRAIN_TILE_SIZE, constants.TERRAIN_TILE_SIZE);
		});

		// Reset transparency
		c.globalAlpha = 1.0;
	};

	/**
	 * Checks if a tile is within the canvas/viewport's boundaries.
	 *
	 * @method	_boundariesAreWithinViewport
	 * @private
	 * @param		{object}	renderer		Matter.js renderer
	 * @param		{object}	point		Point object with x- and y-coordinates
	 * @return	{boolean}
	 */
	var _boundariesAreWithinViewport = function(renderer, startPoint) {
		var tileAddon = Game.constants.config.TERRAIN_TILE_SIZE;

		var points = [
			{x: startPoint.x, y: startPoint.y},
			{x: startPoint.x + tileAddon, y: startPoint.y},
			{x: startPoint.x, y: startPoint.y + tileAddon},
			{x: startPoint.x + tileAddon, y: startPoint.y + tileAddon}
		];

		for(var point of points) {
			if( _pointIsWithinViewport(renderer, point) ) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Checks if a point is within the canvas/viewport's boundaries.
	 *
	 * @method	_pointIsWithinViewport
	 * @private
	 * @param		{object}	renderer		Matter.js renderer
	 * @param		{object}	point		Point object with x- and y-coordinates
	 * @return	{boolean}
	 */
	var _pointIsWithinViewport = function(renderer, point) {
		var minBounds = renderer.bounds.min;
		var maxBounds = renderer.bounds.max;

		if( point.x >= minBounds.x && point.x <= maxBounds.x ) {
			if( point.y >= minBounds.y && point.y <= maxBounds.y ) {
				return true;
			}
		}

		return false;
	};

	return _self.init();
};
