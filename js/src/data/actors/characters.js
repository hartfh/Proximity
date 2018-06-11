var Game = Game || {};

Game.data = Game.data || {};

Game.data.actors = Game.data.actors || {};

Game.data.actors.characters = {
	floating:		{},
	stationary:	{},
	turret:		{}
};

Game.data.actors.characters.floating = (function() {
	var _self = {};

	_self.playerChasis = {
		actor:		{
			classification:	'Test Vehicle',
			type:			'vehicle',
			battlecries:		[],
			behaviors:		[
				{name: 'followCourse', thrust: 40, distance: 60, disallowed: false}
			],
			deathrattles:		[]
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						x:		0,
						y: 		0,
						width:	60,
						height:	26,
						//sprites:	Game.data.sprites.player,
						options:	{
							density:	200
						}
					}
				],
				sensors:		[]
			},
			options:		{},
			custom:		{ignoresGravity: true, balancer: false, isLevel: true},
			zindex:		'vehicle'
		}
	};

	_self.testShield = {
		actor:			{
			classification:	'Shield',
			type:			'shield',
			/*
			commonItems:	{
				health:	{current: 30, max: 30}
			},
			*/
			behaviors:	[
				//{name: 'fade', duration: 36, interval: 36, disabled: true}
			]
		},
		body:			{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'shield-wall',
						width:	300,
						height:	20,
						x:		0,
						y:		0,
						attrs:	[],
						//sprites:	{},
						options:	{
							//frictionAir:	0.01,
							density:		3
						}
					}
				],
				sensors:	[],
			},
			custom:		{ignoresGravity: true, isLevel: true},
			zindex:		'vehicle'
		}
	};

	_self.insectTestBody = {
		actor:	{
			classification:	'Insect Enemy Test',
			deathTimer:		0,
			spawnItems:		false,
			type:			'vehicle',
			battlecries:		[],
			behaviors:		[
				{name: 'followCourse', interval: 100, distance: 45, thrust: 1},
				{name: 'flutter', interval: 50, force: 2},
				{name: 'expire', delay: 200}
			],
			deathrattles:		[]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						width:	10,
						height:	10,
						x:		0,
						y:		0,
						//sprites:	Game.data.sprites.freighterChasis,
						//attrs:	[],
						options:	{
							//frictionAir:	0.01
							density:		5
						}
					}
				],
				sensors:		[
					{type: 'sight', shape: 'circle', radius: 30}
				]
			},
			options:		{
				frictionAir:		0.3
				//frictionAir:		0.07,
			},
			custom:		{ignoresGravity: true, isLevel: true},
			zindex:		'vehicle'
		}
	};

	_self.sphereTestBody = {
		actor:	{
			classification:	'Sphere Enemy Test',
			deathTimer:		100,
			spawnItems:		false,
			type:			'vehicle',
			battlecries:		[],
			behaviors:		[
				{name: 'orient', interval: 3},
				{name: 'followCourse', interval: 100, distance: 75, thrust: 1}
			],
			deathrattles:		[]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'circle',
						radius:	25,
						x:		0,
						y:		0,
						//sprites:	Game.data.sprites.freighterChasis,
						//attrs:	[],
						options:	{
							//frictionAir:	0.01
							density:		5
						}
					}
				],
				sensors:		[
					{type: 'sight', shape: 'circle', radius: 50}
				],
				ornaments:	[]
			},
			options:		{
				frictionAir:		0.35
				//frictionAir:		0.07,
			},
			custom:		{ignoresGravity: true},
			zindex:		'vehicle'
		}
	};

	_self.sphereTestCannon = {
		actor:	{
			classification:	'Sphere Enemy Test Cannon',
			deathTimer:		100,
			spawnItems:		false,
			type:			'vehicle',
			battlecries:		[],
			behaviors:		[
				{name: 'shootLaser', width: 1, damage: 1}
			],
			deathrattles:		[]
		},
		body:	{
			parts:	{
				structures:	[],
				sensors:		[],
				ornaments:	[
					{
						shape:	'rectangle',
						width:	10,
						height:	25,
						x:		0,
						y:		0,
						//sprites:	Game.data.sprites.freighterChasis,
						options:	{
							//frictionAir:	0.01
							density:		5
						}
					}
				]
			},
			options:		{
				frictionAir:		0.35
			},
			custom:		{ignoresGravity: true},
			zindex:		'turret'
		}
	};

	_self.hydraLinkTest = {
		actor:	{
			classification:	'Hydra Link Test Piece',
			deathTimer:		5,
			spawnItems:		false,
			type:			'turret',
			behaviors:		[],
			deathrattles:		[]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						width:	15,
						height:	35,
						x:		0,
						y:		0,
						//sprites:	Game.data.sprites.freighterChasis,
						//attrs:	[],
						options:	{
							//frictionAir:	0.01
							density:		2
						}
					}
				],
				sensors:		[]
			},
			options:		{
				frictionAir:		0.3
				//frictionAir:		0.07,
			},
			custom:		{ignoresGravity: true, isLevel: true},
			zindex:		'link'
		}
	};

	_self.hydraHeadTest = {
		actor:	{
			classification:	'Hydra Head Test Piece',
			deathTimer:		5,
			spawnItems:		false,
			type:			'vehicle',
			battlecries:		[],
			behaviors:		[
				//{name: 'nudge', force: 1, angle: -Math.PI * 0.5, delay: 0, duration: 50, interval: 140, id: 'nudge-1'},
				//{name: 'nudge', force: 1, angle: Math.PI * 0.5, delay: 70, duration: 50, interval: 140, id: 'nudge-2'},
				//{name: 'followCourse', interval: 100, distance: 70, thrust: 5000}
			],
			deathrattles:		[]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						width:	60,
						height:	30,
						x:		0,
						y:		0,
						//sprites:	Game.data.sprites.freighterChasis,
						attrs:	[],
						options:	{
							//frictionAir:	0.01
							density:		2
						}
					}
				],
				sensors:		[
					{type: 'sight', shape: 'circle', radius: 100}
				]
			},
			options:		{
				frictionAir:		0.3
				//frictionAir:		0.07,
			},
			custom:		{ignoresGravity: true, isLevel: true},
			zindex:		'vehicle'
		}
	};

	_self.enemyChasis = {
		actor:	{
			classification:	'Unclassified Vehicle',
			deathTimer:		180,
			spawnItems:		true,
			type:			'vehicle',
			battlecries:		[],
			behaviors:		[
				{name: 'followCourse', distance: 100, thrust: 3000}
			],
			deathrattles:		[
				{name: 'showVFX', interval: 60, type: 'smallExplosion'},
				{name: 'shakeScreen', pattern: 'rumble-1', id: 'shake-1'},
				//{name: 'shakeScreen', pattern: 'rumble-1', interval: 30, id: 'shake-3'},
				//{name: 'shakeScreen', pattern: 'violent', delay: 150, id: 'shake-2'}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						width:	82,
						height:	35,
						x:		0,
						y:		0,
						//sprites:	Game.data.sprites.freighterChasis,
						attrs:	[],	// behaviors for the structure to exhibit (determines what events handlers to attach to it)
						options:	{
							//frictionAir:	0.01
							density:		2000
						}
					}
				],
				sensors:		[
					{type: 'sight', shape: 'circle', radius: 130}
				]
			},
			options:		{
				frictionAir:		0.3
				//frictionAir:		0.07,
			},
			custom:		{ignoresGravity: true, isLevel: true},
			zindex:		'vehicle'
		}
	};

	return _self;
}());

Game.data.actors.characters.stationary = (function() {
	var _self = {};

	_self.insectSpawner = {}; // have spawn every 80 ticks. Limit 8

	return _self;
}());

Game.data.actors.characters.turret = (function() {
	var _self = {};

	_self.turretOne = {
		actor:	{
			classification:	'Light Repeater',
			//indestructible:	true,
			type:			'turret',
			deathTimer:		120,
			battlecries:		[],
			behaviors:		[
				//{name: 'pivot', id: '1', about: 'part1', angle: 0.01, interval: 300, duration: 150, delay: 0},
				//{name: 'pivot', id: '2', about: 'part1', angle: -0.01, interval: 300, duration: 150, delay: 150},
				{name: 'orient', interval: 3},
				//{name: 'shoot', style: 'straight', pattern: 'full', shot: 'kineticSlug', number: 4, width: 50, interval: 2}
				//{name: 'shoot', style: 'spread', pattern: 'random', shot: 'smartRounds', number: 4, width: 70, interval: 6}
				//{name: 'shoot', style: 'spread', pattern: 'random', shot: 'smartRounds', number: 5, arc: 0.8, interval: 6}
				{name: 'shoot', style: 'straight', pattern: 'random', shot: 'missile', number: 4, width: 18, interval: 6}
				//{name: 'shootLaser', width: 1, damage: 1}
				// shootGrenades
				// arc energy weapon

				//{name: 'shootRepeater', interval: 2, point: {x: 0, y: 0}, part: 'turretPart'},
				//{name: 'shootTorpedo', interval: 100, point: {x: 0, y: 0}, part: 'part1'},
			],
			deathrattles:	[
				//{name: 'showVFX', interval: 60, type: 'smallExplosion', offset: 'random', number: 'random'}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	24,
						height:	16,
						x:		0,
						y:		0,
						attrs:	[],
						//sprites:	{},
						options:	{
							//frictionAir:	0.01,
							density:		3
						}
					}
				],
				sensors:	[]
			},
			options:	{},
			custom:	{ignoresGravity: true},
			zindex:	'turret'
		}
	};

	// NOTE: Keep as reference
	/*
	_self.testTurret = {
		actor:		{
			type:		'effect',
			battlecries:	[],
			behaviors:	[
				//{name: 'thrust', thrust: 5, interval: 5},
				//{name: 'expire', delay: 1000},
				{name: 'pivot', id: '1', about: 'part1', angle: 0.01, interval: 300, duration: 150, delay: 0},
				{name: 'pivot', id: '2', about: 'part1', angle: -0.01, interval: 300, duration: 150, delay: 150},
				{name: 'orient', interval: 3, about: 'part1'},
				//{name: 'shootTorpedo', interval: 100, point: {x: 0, y: 0}, part: 'part1'},
				{name: 'shootSlug', interval: 7, point: {x: 0, y: 0}, part: 'part1'}
			],
			deathrattles:	[]
		},
		body:		{
			parts:	{
				structures:	[
					{
						name:	'part1',
						width:	26,
						height:	26,
						x:		0,
						y:		0,
						attrs:	[],
						//sprites:	{},
						options:	{
							//frictionAir:	0.01
							density:		Game.constants.densities.metal
						}
					},
					{
						name:	'xpart5',
						width:	26,
						height:	26,
						x:		-50,
						y:		0,
						attrs:	[],
						//sprites:	{},
						options:	{
							//frictionAir:	0.01
							density:		Game.constants.densities.metal
						}
					},
				],
				sensors:		[
					{type: 'sight', shape: 'rectangle', x: 150, y: 0, height: 10, width: 300, name:	'part2'}
				]
			},
			options:	{
				collisionFilter:	{
					//category:	Game.data.bitmasks.specialfx.category,
					//mask:	Game.data.bitmasks.specialfx.mask
					category:	Game.data.bitmasks.enemy.category,
					mask:	Game.data.bitmasks.enemy.mask
				}
			},
			custom:	{ignoresGravity: true}
		}
	};
	*/

	return _self;
}());
