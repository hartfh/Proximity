var Game = Game || {};

Game.UI = Game.UI || {};

Game.UI.HUD = function() {
	var _self = {};

	var _hudGrid;

	// Must Implement:
	// getBounds()
	// getID()
	// render()
	// setHover(boolean)

	var _bounds = {
		A:	{x: 30, y: 30},
		B:	{}
	};

	_self.getBounds = function() {
		return _bounds;
	};

	/**
	 * Initializes HUD's Grid object and resets metapoints.
	 *
	 * @method	_init
	 * @private
	 */
	var _init = function() {
		// Create a new Grid object to house the map data
		_hudGrid = new Grid(Game.constants.config.GRID_SIZE * Game.constants.config.SUBGRID_SIZE, Game.constants.config.GRID_SIZE * Game.constants.config.SUBGRID_SIZE);

		// Reset grid metapoint values
		_resetGrid(_hudGrid);
	};

	/**
	 * Sets grid's metapoints to initial values.
	 *
	 * @method	_resetGrid
	 * @private
	 * @param		{Grid}	grid		A Grid object
	 */
	var _resetGrid = function(grid) {
		grid.eachMetaPoint(function(metapoint, x, y) {
			metapoint = {
				enemy:		false,
				player:		false,
				terrain:		false
			};

			grid.setMetaPoint(x, y, metapoint);
		});
	};

	/**
	 * Renders the HUD to the canvas defined in Matter.Render.
	 *
	 * @method	render
	 * @public
	 */
	_self.render = function(ctx) {
		var pixelDim		= 2;
		//var ctx			= Game.RenderBuffer.context;
		var startPoint		= {x: 30, y: 30};
		var playerPoint	= false;

		// TODO: if base layer alpha is below 1.0 then we need to clear entire region before redrawing map
		ctx.globalAlpha = 1.0;

		_hudGrid.eachMetaPoint(function(metapoint, x, y) {
			var xPoint = startPoint.x + (x * pixelDim);
			var yPoint = startPoint.y + (y * pixelDim);

			if( metapoint.player ) {
				ctx.fillStyle = '#ffff00';
				playerPoint = {x: x, y: y};
			} else if( metapoint.terrain ) {
				ctx.fillStyle = '#ff3300';
			} else {
				ctx.fillStyle = '#0099cc';
			}

			ctx.fillRect(xPoint, yPoint, pixelDim, pixelDim);
		});

		// Draw shadowing to all points that aren't within a certain distance of player
		// TODO: need to draw shadowing even if no player point is set. Only check "returns" if playerPoint is set?
		if( playerPoint ) {
			ctx.fillStyle		= '#000000';
			ctx.globalAlpha	= 0.6;

			_hudGrid.eachPoint(function(point, x, y) {
				if( x > playerPoint.x + 3 || x < playerPoint.x - 3 ) {
					return;
				}
				if( y > playerPoint.y + 3 || y < playerPoint.y - 3 ) {
					return;
				}

				var xPoint = startPoint.x + (x * pixelDim);
				var yPoint = startPoint.y + (y * pixelDim);

				ctx.fillRect(xPoint, yPoint, pixelDim, pixelDim);
			});

			ctx.globalAlpha = 1.0;
		}

		// TODO: finally, draw flourishes. could be a pre-rendered .png on top of everything else
	};

	/**
	 * Getter method for _hudGrid.
	 *
	 * @method	getGrid
	 * @public
	 * @return	{Grid}
	 */
	_self.getGrid = function() {
		return _hudGrid;
	};

	/**
	 *
	 *
	 * @method	updateInfo
	 * @public
	 * @param		{integer}		x		X-coordinate
	 * @param		{integer}		y		Y-coordinate
	 * @param		{string}		type		A Grid metapoint property
	 */
	_self.updateInfo = function(x, y, type) {
		var validTypes = ['player', 'enemy', 'terrain'];

		if( !validTypes.indexOf(type) ) {
			return;
		}

		_hudGrid.updateMetaProp(x, y, type, true);
	};

	_init();

	return _self;
}();
