var Game = Game || {};

Game.UI = Game.UI || {};

Game.UI.stats = function() {
	var _self = {};

	// Must Implement:
	// getBounds()
	// getID()
	// render()
	// setHover(boolean)

	var _bounds = {
		A:	{x: 0, y: 0},
		B:	{x: 0, y: 0}
	};

	_self.getBounds = function() {
		return _bounds;
	};

	// ailments represented (at least partially) with icons

	//var _init = function() {};

	// Need to create a connection between updating the player's stats and the information that is stored here
	// Display: HP, ammo, ailments, game progress/objectives (e.g. level 2, area name)

	// Display HP as number and meter
	// Torpedos (unsure if limited or not)


	_self.fetchPlayerStats = function() {
		var statData = {
			'health':		{
				label:		'HP'
			},
			'torpedo':		{
				label:		'Torpedos'
			}
		};

		for(var stat in statData) {
			statData[stat].current	= Game.Player.getCurrentStat(stat);
			statData[stat].max		= Game.Player.getMaxStat(stat);
		}


		return statData;
	};

	//stats.renderHP;

	_self.render = function(ctx) {
		var statData = _self.fetchPlayerStats();

		var startPoint = {x: 400, y: 30};
		//var ctx		= Game.RenderBuffer.context;

		// Draw background (temporary)
		ctx.fillStyle = '#606060';
		ctx.fillRect(startPoint.x, startPoint.y, 600, 100);

		// Draw text (temporary)
		ctx.fillStyle		= '#ffffff';
		ctx.font			= '20px Arial';
		ctx.textBaseline	= 'top';

		var i = 0;
		for(var prop in statData) {
			var stat = statData[prop];

			ctx.fillText(stat.label, startPoint.x, startPoint.y + i * 30);
			ctx.fillText(stat.current + '/' + stat.max, startPoint.x + 150, startPoint.y + i * 30);
			i++;
		}
	};

	return _self;
}();
