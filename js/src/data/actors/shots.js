var Game = Game || {};

Game.data = Game.data || {};

Game.data.actors = Game.data.actors || {};

Game.data.actors.shots = (function() {
	var _self = {};

	_self.smartRounds = {
		actor:		{
			payload:		{
				damage:		10,
				selfDestruct:	true
			},
			type:		'shot',
			battlecries:	[
				{name: 'thrust', thrust: 0.7}
				//{name: 'showVFX', effect: ''}
			],
			behaviors:	[
				{name: 'expire', delay: 200},
				{name: 'orient'},
				{name: 'thrust', thrust: 0.09}
			]
			//deathrattles:	[],
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'slug-part-1',
						width:	16,
						height:	8,
						x:		0,
						y:		0,
						attrs:	[],
						options:	{
							density:		0.01
						}
					}
				],
				sensors:		[
					{type: 'explosive', shape: 'rectangle', width: 16, height: 8, x: 0, y: 0}, // add a sprite?
					{type: 'sight', shape: 'circle', radius: 120}
				]
			},
			options:	{
				frictionAir:		0.1
			},
			custom:	{ignoresGravity: false},
			zindex:	'shot'
		}
	};

	_self.missile = {
		actor:		{
			payload:		{
				damage:		3,
				selfDestruct:	true
			},
			type:		'shot',
			battlecries:	[
				{name: 'thrust', thrust: 0.08},
				//{name: 'shakeScreen', pattern: 'rumble-1'}
			],
			behaviors:	[
				{name: 'expire', delay: 200},
				{name: 'thrust', thrust: 0.025, delay: 10}
			]
			//deathrattles:	[],
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'slug-part-1',
						width:	5,
						height:	3,
						x:		0,
						y:		0,
						attrs:	[],
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[
					{type: 'explosive', shape: 'rectangle', width: 8, height: 4, x: 0, y: 0}, // add a sprite
				]
			},
			options:	{
				frictionAir:		0.02
			},
			custom:	{ignoresGravity: false},
			zindex:	'shot'
		}
	};

	_self.kineticSlug = {
		actor:		{
			payload:		{
				damage:		3,
				selfDestruct:	true
			},
			type:		'shot',
			battlecries:	[
				{name: 'thrust', thrust: 0.003},
				//{name: 'showVFX', effect: ''}
			],
			behaviors:	[{name: 'expire', delay: 200}]
			//deathrattles:	[],
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'slug-part-1',
						width:	8,
						height:	2,
						x:		0,
						y:		0,
						attrs:	[],
						options:	{
							density:		0.01
						}
					}
				],
				sensors:		[
					{type: 'explosive', shape: 'rectangle', width: 20, height: 8, x: 0, y: 0} // add a sprite
				]
			},
			options:	{
				frictionAir:		0.01
			},
			custom:	{ignoresGravity: false},
			zindex:	'shot'
		}
	};

	_self.torpedoWeak = {
		actor:		{
			payload:			{
				selfDestruct:	true,
				damage:		40,
				penetration:	0,
				afflictions:	[],
				scenes:		[]
			},
			deathTimer:	2,
			type:		'shot',
			battlecries:	[],
			behaviors:	[
				{name: 'orient', interval: 7},
				{name: 'thrust', thrust: 16},
			],
			deathrattles:	[
				{name: 'showSFX', interval: 5, effect: 'smallExplosion'}
			]
		},
		body:		{
			parts: 	{
				structures:	[
					{
						shape:	'rectangle',
						width:	70,
						height:	18,
						x:		0,
						y:		0,
						attrs:	[],
						//sprites:	{},
						options:	{
							//frictionAir:	0.01
							density:		10
						}
					}
				],
				sensors:		[
					{type: 'sight', shape: 'circle', radius: 150},
					{type: 'explosive', shape: 'rectangle', width: 60, height: 20, x: 0, y: 0}
				]
			},
			options:	{
				frictionAir:		0.07
			},
			custom:	{ignoresGravity: true},
			zindex:	'shot'
		}
	};

	return _self;
}());
