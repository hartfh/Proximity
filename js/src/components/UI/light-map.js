var Game = Game || {};

Game.UI = Game.UI || {};

Game.UI.LightMap = (function() {
	var _self			= {};
	var _CELL_SIZE		= 16; // pixel with of light cells
	var _GRID_PADDING	= 10; // extra cells on each screen edge
	var _LIGHT_LEVELS	= 20; // steps from 1 to 0 alpha
	var _grid;

	var _init = function() {
		_createGrid();
	};

	var _createGrid = function() {
		// Create a grid based on the current viewport size
		var gridWidth	= Math.ceil(Game.constants.config.VPORT_WIDTH / _CELL_SIZE);
		var gridHeight	= Math.ceil(Game.constants.config.VPORT_HEIGHT / _CELL_SIZE);

		var config = {
			wrap:		false,
			metaInfo:		{colors: []}
		};

		_grid = new Grid(gridWidth + 2 * _GRID_PADDING, gridHeight + 2 * _GRID_PADDING, config);
	};

	/**
	 * Query the padded viewport for all bodies.
	 *
	 * @method	getVisibleBodies
	 * @public
	 * @return	{array}
	 */
	_self.getVisibleBodies = function() {
		var pixelPadding = _CELL_SIZE * _GRID_PADDING;

		// Determine viewport bounds adjusted by padding
		var bounds = {
			min:	{
				x:	Game.render.bounds.min.x - pixelPadding,
				y:	Game.render.bounds.min.y - pixelPadding
			},
			max:	{
				x:	Game.render.bounds.max.x + pixelPadding,
				y:	Game.render.bounds.max.y + pixelPadding
			}
		};

		return Matter.Query.region(Matter.Composite.allBodies(Game.engine.world), bounds);
	};

	/**
	 * Sets all grid cell light levels back to zero.
	 *
	 * @method	resetGrid
	 * @public
	 */
	_self.resetGrid = function() {
		_grid.eachPoint(function(point, x, y) {
			_grid.setPoint(x, y, 0);
			_grid.setMetaPoint(x, y, {colors: []});
		});
	};

	_self.updateGrid = function(bodies) {
		_self.resetGrid();

		var bodies = _self.getVisibleBodies();

		visibleBodies:
		for(var body of bodies) {
			if( body.hasFrames ) {
				var frames;

				partLoop:
				for(var part of body.parts) {
					if(part.frames) {
						frames = part.frames;
						break partLoop;
					}
				}

				if( !frames[body.actor.spriteMode].light ) {
					continue visibleBodies;
				}

				var frameIndex = frames.frameIndex;
				var actorLight = frames[body.actor.spriteMode].light[frameIndex];

				if( actorLight.intensity > 0 ) {
					// Find body's position relative to the viewport
					var relativePosition = {
						x:	Math.floor(body.position.x) - Game.render.bounds.min.x,
						y:	Math.floor(body.position.y) - Game.render.bounds.min.y
					};

					// Convert body's relative position into a grid coordinate
					var bodyCoordinates = {
						x:	Math.floor(relativePosition.x / _CELL_SIZE) + _GRID_PADDING,
						y:	Math.floor(relativePosition.y / _CELL_SIZE) + _GRID_PADDING
					};

					// Apply light modifications to that grid cell and those surrounding it within radius
					_grid.eachCirclePoint(bodyCoordinates, actorLight.intensity, function(point, x, y) {
						var xDiff = Math.abs(bodyCoordinates.x - x);
						var yDiff = Math.abs(bodyCoordinates.y - y);

						var angle = Math.atan(yDiff/xDiff);

						if( isNaN(angle) ) {
							angle = 0;
						}

						var reduction = xDiff / Math.cos(angle) || yDiff;
						var reducedLight = actorLight.intensity - reduction;

						// NOTE: possible change: only add light if current level is less than light source

						if( reducedLight > 0 ) {
							var totalLight = point + reducedLight;

							if( totalLight > _LIGHT_LEVELS ) {
								totalLight = _LIGHT_LEVELS;
							}

							_grid.setPoint(x, y, totalLight);
							_grid.pushMetaProp(x, y, 'colors', actorLight.color);
						}
					});
				}
			}
		}
	};

	/**
	 * Renders light levels onto the supplied context.
	 *
	 * @method	render
	 * @public
	 * @param		{object}		ctx		A canvas context
	 */
	_self.render = function(ctx) {
		_self.updateGrid();

		var pxPadding	= _GRID_PADDING * _CELL_SIZE;

		//ctx.fillStyle = 0xf3cc66;
		ctx.fillStyle = '#fff588';
		ctx.beginPath();
		//ctx.fillStyle = 0xff7766;

		_grid.eachPoint(function(level, x, y) {
			// Skip over unlit cells since they'll have no lighting applied
			if( level > 0 ) {
				var reduction = 0.6; // was 0.4
				ctx.globalAlpha = reduction * level / _LIGHT_LEVELS;

				var xCoord	= x * _CELL_SIZE - pxPadding;
				var yCoord	= y * _CELL_SIZE - pxPadding;
				var meta		= _grid.getMetaPoint(x, y);
				var colors	= meta.colors;
				var finalColor	= '#000000';

				// Combine all colors
				for(var i in colors) {
					var color = colors[i];

					if( i == 0 ) {
						finalColor = color;
					} else {
						finalColor = Game.utilities.blendColors(finalColor, Game.data.light[color]);
					}
				}

				ctx.fillStyle = finalColor;
				ctx.fillRect(xCoord, yCoord, _CELL_SIZE, _CELL_SIZE);
			}
		});

		ctx.closePath();
	};

	_init();

	return _self;
}());
