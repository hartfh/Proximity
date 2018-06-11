module.exports = new function() {
	const CELL_SIZE	= 3;
	const SECTIONS		= 5;
	const MAX_INTENSITY	= 6;

	var _self			= this;
	var _canvas		= document.createElement('canvas');
	var _context		= _canvas.getContext('2d');
	var _width		= Constants.VPORT_WIDTH / CELL_SIZE;
	var _height		= Constants.VPORT_HEIGHT / CELL_SIZE;
	var _grid			= new Grid(_width, _height);
	var _renderCounter	= 0;


	function _init() {
		_canvas.width	= _width;
		_canvas.height	= _height;

		_grid.eachPoint(function(point, x, y) {
			_grid.setPoint(x, y, {color: false, intensity: 0});
		});
	}

	// TODO: need way to something like VisualFX to add data into this. Also data to be added in within body rendering loop

	// Loop through one section of the grid
	function _loopGrid(callback) {
		var yPointOffset	= Math.floor( (_renderCounter * _height) / SECTIONS );

		for(var x = 0, xMax = _width; x < xMax; x++) {
			for(var y = 0, yMax = _height / SECTIONS; y < yMax; y++) {
				var offsetY = y + yPointOffset;

				var point = _grid.getPoint(x, offsetY);

				callback(point, x, offsetY);
			}
		}
	}

	/*
	//////// OLD ////////
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
	*/

	_self.loadBodiesData = function(bodies) {
		// Find all bodies with light
		for(var body of bodies) {
			if( body.hasLight ) {

				// Find all parts with light
				for(var part of body.parts) {
					if( part.render.sprite.light ) {
						_addCellData(part.position.x, part.position.y, part.render.sprite.light);
					}
				}
			}
		}
	};

	function _addRectangularCellData(gridX, gridY, lightData, falloff, falloffIncr) {
		// Ensure odd widths and heights
		if( lightData.width % 2 != 1 ) {
			lightData.width--;

			if( lightData.width < 0 ) {
				lightData.width = 0;
			}
		}
		if( lightData.height % 2 != 1 ) {
			lightData.height--;

			if( lightData.height < 0 ) {
				lightData.height = 0;
			}
		}

		var rectWidth	= lightData.width + (2 * falloff);
		var rectHeight	= lightData.height + (2 * falloff);

		if( rectWidth == 0 && rectHeight == 0 ) {
			log('exiting rectangle light calculations');
			return;
		}

		var rectOrigin	= {
			x:	gridX - Math.floor(rectWidth / 2),
			y:	gridY - Math.floor(rectHeight / 2)
		};

		var hasXFalloff, hasYFalloff, xFalloff, yFalloff;

		for(var x = 0; x < rectWidth; x++) {
			hasXFalloff = false;

			if( x <= falloff || x >= rectWidth - falloff ) {
				hasXFalloff = true;

				if( x <= falloff ) {
					xFalloff = Math.abs(x - falloff);
				}
				if( x >= rectWidth - falloff ) {
					xFalloff = Math.abs( (rectWidth - x) - falloff );
				}
			}

			for(var y = 0; y < rectHeight; y++) {
				hasYFalloff = false;

				if( y <= falloff || y >= rectHeight - falloff ) {
					hasYFalloff = true;

					if( y <= falloff ) {
						yFalloff = Math.abs(y - falloff);
					}
					if( y >= rectHeight - falloff ) {
						yFalloff = Math.abs( (rectHeight - y) - falloff );
					}
				}

				var adjustedX = x + rectOrigin.x;
				var adjustedY = y + rectOrigin.y;

				var cell = _grid.getPoint(adjustedX, adjustedY);

				if( !cell ) {
					continue;
				}

				var color = ''; // luminosity, soft-light, hard-light, lighten, lighter

				// TODO: adjust intensity that is being added based on xReduction and yReduction
				// check diff absolute difference between falloff and x/y and see if it's less than (something).

				var intensity = lightData.intensity;

				if( hasXFalloff ) {
					intensity *= 1 - (falloffIncr * xFalloff);
				}
				if( hasYFalloff ) {
					intensity *= 1 - (falloffIncr * yFalloff);
				}

				intensity += cell.intensity;

				if( intensity > MAX_INTENSITY ) {
					intensity = MAX_INTENSITY;
				}

				_grid.setPoint(adjustedX, adjustedY, {
					color:		color,
					intensity:	intensity
				});
			}
		}
	}

	function _addCircularCellData(gridX, gridY, lightData, falloff, falloffIncr) {

	}

	function _addCellData(xPos, yPos, lightData = {}) {
		var gridX = Math.floor( (xPos - Game.Engine.render.bounds.min.x) / CELL_SIZE );
		var gridY = Math.floor( (yPos - Game.Engine.render.bounds.min.y) / CELL_SIZE );

		var falloff		= lightData.falloff || 0;
		var falloffIncr	= 1 / (falloff + 1);

		switch( lightData.shape ) {
			case 'circle':
				_addCircularCellData(gridX, gridY, lightData, falloff, falloffIncr);
				break;
			case 'rectangle':
				_addRectangularCellData(gridX, gridY, lightData, falloff, falloffIncr);
				break;
			default:
				return;
				break;
		}
	};

	_self.render = function(context) {
		_context.fillStyle = '#000000';
		_context.fillRect(0, (_height * _renderCounter) / SECTIONS, _width, _height / SECTIONS);

		_loopGrid(function(point, x, y) {
			if( point.intensity > 0 ) {
				_context.clearRect(x, y, 1, 1);

				_context.globalAlpha = 1 - (point.intensity / MAX_INTENSITY);
				_context.fillRect(x, y, 1, 1);

				// Reset point to zero light
				_grid.setPoint(x, y, {color: false, intensity: 0});
			}
		});

		_context.globalAlpha = 1.0;

		context.drawImage(_canvas, 0, 0, Constants.VPORT_WIDTH, Constants.VPORT_HEIGHT);

		_incrementCounter();
	};

	function _incrementCounter() {
		_renderCounter++;

		if( _renderCounter >= SECTIONS ) {
			_renderCounter = 0;
		}
	}

	_init();
};
