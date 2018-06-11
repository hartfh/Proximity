var Game = Game || {};

Game.data = Game.data || {};

Game.data.actors = Game.data.actors || {};

Game.data.actors.items = {
	common:	{},
	unique:	{}
};

Game.data.actors.items.common = (function() {
	var _self = {};

	_self.powerupOne = {
		actor:	{
			indestructible:	true,
			payload:			{
				health:		10,
				commonItems:	[
					//{type: 'health', current: 0, max: 20},
					{type: 'torpedo', current: 0, max: 3}
				],
				uniqueItems:	[],
				fixes:		[], // ailment fixes
				selfDestruct:	true
			},
			deathTimer:		0, // matches length of item "active" sprite animation
			type:			'item',
			battlecries:		[],
			behaviors:		[
				{name: 'nudge', force: 0.002, angle: -Math.PI * 0.5, delay: 0, duration: 50, interval: 140, id: 'nudge-1'},
				{name: 'nudge', force: 0.002, angle: Math.PI * 0.5, delay: 70, duration: 50, interval: 140, id: 'nudge-2'},
				{name: 'followCourse', force: 0.005}
			],
			deathrattles:		[]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'slug-part-1',
						width:	1,
						height:	1,
						x:		0,
						y:		0,
						attrs:	[],
						options:	{
							density:		10
						}
					}
				],
				sensors:		[
					{type: 'powerup', shape: 'rectangle', x: 0, y: 0, width: 20, height: 20, sprites: Game.data.sprites.powerupOne},
					{type: 'sight', shape: 'circle', radius: 100}
				]
			},
			options:		{
				frictionAir:		0.05,
				density:			1
			},
			custom:		{ignoresGravity: true, isLevel: true},
			zindex:		'item'
		}
	};

	_self.healthSmall = Game.utilities.clone(_self.powerupOne);

	return _self;
}());

Game.data.actors.items.unique = (function() {
	var _self = {};

	// _self.xxxxx = {};

	return _self;
}());
