module.exports = function() {
	var _self = {};

	_self['flameshot-1'] = {
		actor:		{
			payload:		{
				selfDestruct:	true
			},
			type:		'shot',
			battlecries:	[
				{name: 'thrust', force: 0.06}
			],
			behaviors:	[
				{name: 'thrust', force: 0.005},
				{name: 'expire', delay: 90}
			],
			deathrattles:	[]
		},
		body:		{
			parts:	{
				structures:	[],
				sensors:		[
					{
						types: ['explosive'],
						shape: 'rectangle',
						width: 16,
						height: 16,
						x: 0,
						y: 0,
						sensorOptions: {effect: {name: 'flame-hazard-1'}}
					}
				],
				ornaments:	[
					{
						shape: 'rectangle',
						width: 2,
						height: 2,
						x: 0,
						y: 0
					}
				]
			},
			options:	{},
			custom:	{},
			zindex:	'shot'
		}
	};

	_self.waveOne = {
		actor:		{
			payload:		{
				damage:		3,
				damageType:	'electronic',
				knockback:	0.1
			},
			type:		'shot',
			battlecries:	[
				{name: 'thrust', force: 0.06}
				//{name: 'thrust', force: 0.09}
			],
			behaviors:	[
				{name: 'expire', delay: 77},
				{name: 'thrust', force: 0.001, interval: 2}
			],
			deathrattles:	[]
		},
		body:		{
			parts:	{
				structures:	[],
				sensors:		[
					{types: ['payload'], sensorOptions: {effect: {name: 'expl1', offset: 'random'}}, shape: 'rectangle', width: 16, height: 60, x: 0, y: 0, sprite: 'waveOne'}
				],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'ornament-1',
						width:	4,
						height:	2,
						x:		0,
						y:		0,
						options:	{
							density:		0.5
						}
					}
				]
			},
			options:	{
				frictionAir:		0.02
			},
			custom:	{},
			zindex:	'shot'
		}
	};

	_self['grenade-1'] = {
		actor:		{
			payload:		{
				damage:		3,
				damageType:	'explosive',
				selfDestruct:	true,
				radius:		40
			},
			type:		'shot',
			battlecries:	[
				{name: 'thrust', force: 0.4},
			],
			behaviors:	[
				{name: 'expire', delay: 25, detonate: true},
			],
			deathrattles:	[
				{name: 'show-vfx', number: 1, radius: 30, type: 'explLarge'},
				{name: 'shake-screen', pattern: 'soft'}
			]
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'part-1',
						width:	5,
						height:	3,
						x:		0,
						y:		0,
						options:	{
							density:		0.5
						}
						 // add a sprite
					}
				],
				sensors:		[
					{types: ['payload'], shape: 'rectangle', width: 10, height: 4, x: 5, y: 0, sensorOptions: {actorless: true}},
				],
				ornaments:	[
					/*
					{
						shape:	'rectangle',
						name:	'part-1',
						width:	5,
						height:	3,
						x:		0,
						y:		0,
						options:	{
							density:		0.5
						}
						 // add a sprite
					}
					*/
				]
			},
			options:	{
				frictionAir:		0.042,
				//restitution:		1.0
			},
			custom:	{
				ballistic:	true
			},
			zindex:	'shot'
		}
	};

	_self.rpg = {
		actor:		{
			payload:		{
				damage:		3,
				damageType:	'explosive',
				selfDestruct:	true,
				radius:		40
			},
			type:		'shot',
			battlecries:	[
				{name: 'thrust', force: 0.08},
			],
			behaviors:	[
				{name: 'expire', delay: 25, detonate: true},
				{name: 'thrust', force: 0.025, delay: 10}
			],
			deathrattles:	[
				{name: 'show-vfx', number: 1, radius: 30, type: 'explLarge'},
				{name: 'shake-screen', pattern: 'soft'}
			]
		},
		body:		{
			parts:	{
				structures:	[],
				sensors:		[
					{types: ['payload'], shape: 'rectangle', width: 10, height: 4, x: 12, y: 0}, // add a sprite
				],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'part-1',
						width:	5,
						height:	3,
						x:		0,
						y:		0,
						options:	{
							density:		0.5
						}
					}
				]
			},
			options:	{
				frictionAir:		0.02
			},
			custom:	{},
			zindex:	'shot'
		}
	};

	_self.missile = {
		actor:		{
			payload:		{
				damage:		3,
				damageType:	'explosive',
				selfDestruct:	true
			},
			type:		'shot',
			battlecries:	[
				{name: 'thrust', force: 0.08},
			],
			behaviors:	[
				{name: 'expire', delay: 200},
				{name: 'thrust', force: 0.025, delay: 10}
			],
			deathrattles:	[

			]
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
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[
					{types: ['payload'], shape: 'rectangle', width: 10, height: 4, x: 12, y: 0}, // add a sprite
				]
			},
			options:	{
				frictionAir:		0.02
			},
			custom:	{},
			zindex:	'shot'
		}
	};

	_self.twinCannonSlug = {
		actor:		{
			payload:		{
				damage:		3,
				damageType:	'kinetic',
				selfDestruct:	true
			},
			type:		'shot',
			battlecries:	[
				{name: 'thrust', force: 0.006},
				{name: 'play-sfx', sound: 'shoot-light-1'}
				//{name: 'show-vfx', number: 1, type: 'expl1', part: 'slug-part-1'},
				//{name: 'shake-screen', pattern: 'soft', id: 'shake-1'}
			],
			behaviors:	[{name: 'expire', delay: 200}]
		},
		body:		{
			parts:	{
				structures:	[],
				sensors:		[
					{types: ['payload'], shape: 'rectangle', width: 10, height: 4, x: 10, y: 0} // add a sprite
				],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'slug-part-1',
						width:	4,
						height:	2,
						x:		0,
						y:		0,
						options:	{
							density:		0.01
						}
					}
				]
			},
			options:	{
				//frictionAir:		0.01
			},
			custom:	{},
			zindex:	'shot'
		}
	};

	_self.kineticSlugTest = {
		actor:		{
			payload:		{
				damage:		3,
				damageType:	'kinetic',
				selfDestruct:	true
			},
			type:		'shot',
			battlecries:	[
				{name: 'thrust', force: 0.003},
				//{name: 'showVFX', effect: ''}
			],
			behaviors:	[{name: 'expire', delay: 200}]
			//deathrattles:	[],
		},
		body:		{
			parts:	{
				structures:	[],
				sensors:		[
					{types: ['payload'], shape: 'rectangle', width: 10, height: 4, x: 4, y: 0} // add a sprite
				],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'slug-part-1',
						width:	4,
						height:	2,
						x:		0,
						y:		0,
						options:	{
							density:		0.01
						}
					}
				]
			},
			options:	{
				frictionAir:		0.01
			},
			custom:	{},
			zindex:	'shot'
		}
	};

	_self.torpedoWeak = {
		actor:		{
			payload:			{
				selfDestruct:	true,
				damage:		40,
				damageType:	'explosive',
				afflictions:	[]
			},
			deathTimer:	2,
			type:		'shot',
			battlecries:	[],
			behaviors:	[
				{name: 'orient', interval: 7},
				{name: 'thrust', force: 16},
			],
			deathrattles:	[
				{name: 'show-sfx', interval: 5, effect: 'smallExplosion'}
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
						//sprite:	'',
						options:	{
							//frictionAir:	0.01
							density:		10
						}
					}
				],
				sensors:		[
					{types: ['sight'], shape: 'circle', radius: 150},
					{types: ['payload'], shape: 'rectangle', width: 60, height: 20, x: 0, y: 0}
				]
			},
			options:	{
				frictionAir:		0.07
			},
			custom:	{},
			zindex:	'shot'
		}
	};

	return _self;
}();
