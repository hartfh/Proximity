var destructibles = require('./destructibles');

module.exports = function() {
	var _self = {
		floating:		{},
		stationary:	{},
		turret:		{},
	};

	for(var i in destructibles) {
		_self.stationary[i] = destructibles[i];
	}

	_self.playerPerson = {
		actor:		{
			classification:	'Test Player Person',
			type:			'person',
			battlecries:		[],
			behaviors:		[
				//{name: 'follow-course', force: 1.9, distance: 25, updateDirection: false},
				{name: 'follow-course', force: 3.2, distance: 20, updateDirection: false}, // debug settings
				//{name: 'play-sfx', id: 'walk-sound', interval: 33, mode: 'moving', sound: 'walk-1'},
			],
			deathrattles:		[],
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						x:		0,
						y: 		0,
						width:	25,
						height:	43,
						//sprite:	'playerPerson',
						sprite:	'armored-trooper-1',
						options:	{
							density:	2
						},
					}
				],
				sensors:		[
					/*
					{
						shape:	'rectangle',
						x:		0,
						y: 		0,
						width:	Constants.TERRAIN_TILE_SIZE,
						height:	Constants.TERRAIN_TILE_SIZE,
						types:	['sight'],
						reset:	1500,
					},
					*/
				],
			},
			options:		{
				frictionAir:		0.13,
				//frictionStatic:	0.5,
			},
			custom:		{isLevel: true},
			zindex:		'vehicle',
		}
	};

	//_self['npc-person-1'] = {};

	//_self['npc-vehicle-1'] = {};

	_self['test-enemy-1'] = {
		actor:	{
			type:			'vehicle',
			battlecries:		[],
			deathTimer:		70,
			behaviors:		[
				{name: 'follow-course', distance: 20, force: 40},
				{name: 'wander', interval: 1000, distance: 4},
			],
			deathrattles:		[
				{name: 'show-vfx', interval: 8, number: 1, type: 'expl1', part: 'hit-box-1', sound: false},
				{name: 'spawn-items', interval: 70, part: 'hit-box-1'},
			],
		},
		body:	{
			parts:	{
				structures:	[
					{
						name:	'hit-box-1',
						shape:	'rectangle',
						width:	49,
						height:	31,
						x:		0,
						y:		0,
						sprite:	'test-enemy-1',
						options:	{
							density:		30
						},
					}
				],
				sensors:		[
					{types: ['sight'], shape: 'rectangle', width: 200, height: 200, x: 0, y: 0},
				],
			},
			options:		{
				frictionAir:		0.2
			},
			custom:		{
				isLevel:		true
			},
			zindex:		'vehicle',
		}
	};

	_self['test-enemy-2'] = Utilities.clone(_self['test-enemy-1']);
	_self['test-enemy-3'] = Utilities.clone(_self['test-enemy-1']);
	_self['test-enemy-4'] = Utilities.clone(_self['test-enemy-1']);
	_self['test-enemy-5'] = Utilities.clone(_self['test-enemy-1']);
	_self['armored-trooper-1'] = Utilities.clone(_self['test-enemy-1']);

	_self['test-enemy-2'].body.parts.structures[0].sprite = 'test-enemy-2';
	_self['test-enemy-3'].body.parts.structures[0].sprite = 'test-enemy-3';
	_self['test-enemy-4'].body.parts.structures[0].sprite = 'test-enemy-4';
	_self['test-enemy-5'].body.parts.structures[0].sprite = 'test-enemy-5';

	_self['armored-trooper-1'].body.parts.structures[0].sprite = 'armored-trooper-1';
	_self['armored-trooper-1'].body.parts.structures[0].width = 47;

	_self.vendorChassis = {
		actor:	{
			//menu:			'test-store',
			type:			'vehicle',
			battlecries:		[],
			behaviors:		[
				//{name: 'wander', interval: 550, distance: 5},
				// move forward
				//{name: 'alert-allies', interval: 250, distance: 3},
				//{name: 'follow-course', distance: 25, force: 44}, // updateDirection: false, straight: true
				//{name: 'orient', interval: 4, updateTroupeDirection: true},
				{name: 'thrust', interval: 5, force: 120},
			],
			deathrattles:		[],
		},
		body:	{
			parts:	{
				structures:	[
					{
						name:	'hit-box-1',
						shape:	'rectangle',
						width:	50,
						height:	50,
						//width:	90,
						//height:	50,
						x:		0,
						y:		0,
						//sprite:	'vendorOne',
						//sprite:	'vehicle-1',
						options:	{
							density:		30
						},
					}
				],
				sensors:		[
					//{types: ['sight'], shape: 'rectangle', width: 200, height: 200, x: 0, y: 0},
					//{types: ['menu'], shape: 'rectangle', width: 200, height: 200, x: 0, y: 0},
				],
				ornaments:	[
					{
						name:	'sprite-box-1',
						shape:	'rectangle',
						width: 	105,
						height:	105,
						x:		0,
						y:		0,
						sprite:	'vehicle-1',
						//sprite:	'vehicle-2',
						options:	{
							//density:	20
						},
					}
				]
			},
			options:		{
				frictionAir:		0.2
			},
			custom:		{
				isOrdinal:		true
			},
			zindex:		'vehicle',
		}
	};

	_self.enemyChassis = {
		actor:	{
			classification:	'Unclassified Vehicle',
			deathTimer:		180,
			type:			'vehicle',
			battlecries:		[],
			behaviors:		[
				{name: 'follow-course', distance: 50, force: 10},
				{name: 'wander', interval: 1000, distance: 4},
				{name: 'alert-allies', interval: 250, distance: 3}
			],
			deathrattles:		[
				{name: 'show-vfx', interval: 8, number: 1, type: 'expl1', part: 'structure-1', sound: false},
				{name: 'shake-screen', interval: 90, pattern: 'violent', id: 'shake-1'},
				{name: 'spawn-items', interval: 180, part: 'structure-1'}
				// 'scare-neutrals' attach to enemies
			],
		},
		body:	{
			parts:	{
				structures:	[
					{
						name:	'structure-1',
						shape:	'rectangle',
						width:	90,
						height:	50,
						x:		0,
						y:		0,
						sprite:	'enemyOne',
						options:	{
							density:		20
						},
					}
				],
				sensors:		[
					{types: ['sight'], shape: 'rectangle', width: 200, height: 200, x: 0, y: 0},
				],
			},
			options:		{
				frictionAir:		0.07
			},
			custom:		{isLevel: true},
			zindex:		'vehicle'
		}
	};

	_self.enemyChassisTwo = {
		actor:	{
			classification:	'Unclassified Vehicle',
			deathTimer:		180,
			type:			'vehicle',
			battlecries:		[],
			behaviors:		[
				{name: 'follow-course', distance: 50, force: 10},
				{name: 'wander', interval: 1000, distance: 4},
			],
			deathrattles:		[
				{name: 'show-vfx', interval: 8, number: 1, type: 'expl1', part: 'structure-1', sound: false},
				{name: 'shake-screen', interval: 90, pattern: 'violent', id: 'shake-1'},
				{name: 'spawn-items', interval: 180, part: 'structure-1'},
			],
		},
		body:	{
			parts:	{
				structures:	[
					{
						name:	'structure-1',
						shape:	'rectangle',
						width:	74,
						height:	40,
						x:		0,
						y:		0,
						sprite:	'enemyTwo',
						options:	{
							density:		20
						},
					}
				],
				sensors:		[
					{types: ['sight'], shape: 'rectangle', width: 200, height: 200, x: 0, y: 0},
				],
			},
			options:		{
				frictionAir:		0.07,
			},
			custom:		{isLevel: true},
			zindex:		'vehicle',
		}
	};

	_self.enemyChassisThree = {
		actor:	{
			classification:	'Unclassified Vehicle',
			deathTimer:		180,
			type:			'vehicle',
			battlecries:		[],
			behaviors:		[
				{name: 'follow-course', distance: 50, force: 10},
				{name: 'wander', interval: 1000, distance: 4},
			],
			deathrattles:		[
				{name: 'show-vfx', interval: 8, number: 1, type: 'expl1', part: 'structure-1', sound: false},
				{name: 'shake-screen', interval: 90, pattern: 'violent', id: 'shake-1'},
				{name: 'spawn-items', interval: 180, part: 'structure-1'},
			],
		},
		body:	{
			parts:	{
				structures:	[
					{
						name:	'structure-1',
						shape:	'rectangle',
						width:	77,
						height:	40,
						x:		0,
						y:		0,
						sprite:	'enemyThree',
						options:	{
							density:		20
						},
					}
				],
				sensors:		[
					{types: ['sight'], shape: 'rectangle', width: 200, height: 200, x: 0, y: 0},
				],
			},
			options:		{
				frictionAir:		0.07,
			},
			custom:		{isLevel: true},
			zindex:		'vehicle',
		}
	};

	_self.waveGunOne = {
		actor:	{
			classification:	'Test Repeater',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 4, updateTroupeDirection: true},
				{name: 'shoot', interval: 7, ammo: 'electronic', shot: 'waveOne', style: 'straight', pattern: 'wave', number: 1, width: 2}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	61,
						height:	15,
						x:		0,
						y:		0,
						//sprite:	'turretOne',
						sprite:	'weapon-kinetic-2',
						options:	{
							density:		0.5 // was 3
						}
					}
				],
				sensors:		[],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'blast',
						width:	60,
						height:	30,
						x:		30,
						y:		0
						//sprite:	'turretOne',
					}
				]
			},
			options:	{},
			custom:	{},
			zindex:	'turret'
		},
	};

	_self.enemyOneTwinCannon = {
		actor:	{
			classification:	'Test Repeater',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 5},
				{name: 'shoot', style: 'straight', pattern: 'wipe', number: 2, width: 26, shot: 'twinCannonSlug', ammo: 'kinetic', interval: 6},
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	50,
						height:	20,
						x:		0,
						y:		0,
						sprite:	'enemyOneTwinCannon',
						options:	{
							density:		0.5 // was 3
						},
					}
				],
				sensors:	[]
			},
			options:	{},
			custom:	{},
			zindex:	'turret',
		},
	};

	_self.twinCannon = {
		actor:	{
			classification:	'Test Repeater',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 5},
				{name: 'shoot', style: 'straight', pattern: 'wipe', number: 2, width: 26, shot: 'twinCannonSlug', ammo: 'kinetic', interval: 6},
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	20,
						height:	20,
						x:		0,
						y:		0,
						//sprite:	'turretOne',
						options:	{
							density:		0.5 // was 3
						},
					}
				],
				sensors:	[],
			},
			options:	{},
			custom:	{},
			zindex:	'turret',
		},
	};

	_self.repeaterTest = {
		actor:	{
			classification:	'Test Repeater',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 5},
				{name: 'shoot', style: 'straight', pattern: 'full', shot: 'kineticSlugTest', ammo: 'kinetic', number: 1, interval: 4},
			],
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	20,
						height:	20,
						x:		0,
						y:		0,
						//sprite:	'turretOne',
						options:	{
							density:		0.5 // was 3
						},
					}
				],
				sensors:	[],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'muzzle-flash',
						width:	20,
						height:	20,
						x:		20,
						y:		0,
						sprite:	'muzzleFlashTest'
					}
				]
			},
			options:	{},
			custom:	{},
			zindex:	'turret',
		}
	};

	_self.rocketLauncherTest = {
		actor:	{
			classification:	'Test Rocket Launcher',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 5},
				//{name: 'shoot', style: 'straight', pattern: 'random', shot: 'missile', ammo: 'explosive', number: 4, width: 18, interval: 6}
				{name: 'shoot', style: 'straight', pattern: 'random', shot: 'rpg', ammo: 'explosive', number: 4, width: 18, interval: 15}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	20,
						height:	20,
						x:		0,
						y:		0,
						//sprite:	'turretOne',
						options:	{
							density:		0.5 // was 3
						}
					}
				],
				sensors:	[]
			},
			options:	{},
			custom:	{},
			zindex:	'turret'
		}
	};

	_self.laserTurretTest = {
		actor:	{
			classification:	'Test Laser Cannon',
			type:			'turret',
			behaviors:		[
				// Example of periodic rotation:
				//{name: 'pivot', id: '1', about: 'part1', angle: 0.01, interval: 300, duration: 150, delay: 0},
				//{name: 'pivot', id: '2', about: 'part1', angle: -0.01, interval: 300, duration: 150, delay: 150},
				{name: 'aim', interval: 10, updateTroupeDirection: true},
				//{name: 'shoot-beam', beam: 'nanoscale-laser'},
				{name: 'shoot-beam', beam: 'jade'},
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						//width:	32,
						//height:	14,
						width:	60,
						height:	12,
						x:		0,
						y:		0,
						//sprite:	'weapon-rifle-1',
						sprite:	'weapon-rifle-2',
						options:	{
							density:		0.5 // was 3
						},
					}
				],
				sensors:		[],
			},
			options:	{},
			custom:	{},
			zindex:	'turret',
		}
	};

	return _self;
}();
