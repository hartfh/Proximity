var Game = Game || {};

Game.data = Game.data || {};

Game.data.troupes = (function() {
	var _self = {};

	_self.playerShip = {
		actors:	{
			'Body':	{
				role:	'lead',
				data:	['characters', 'floating', 'playerChasis'],
				position:	{x: 0, y: 0}
			},
			'Gun':	{
				role:	'turret',
				data:	['characters', 'turret', 'turretOne'],
				position:	{x: 20, y: 0}
			}
		},
		config:	{
			commonItems:	{
				health:		{current: 200, max: 200},
				torpedo:		{current: 10, max: 20},
				smartRounds:	{current: 500, max: 500},
				kineticSlug:	{current: 500, max: 500},
				laser:		{current: 1500, max: 1500},
				missile:		{current: 500, max: 500}
			},
			armor:		1,
			name:		'Player Ship'
		},
		dimensions:		{x: 100, y: 50},
		type:			'vehicle'
	};

	_self.testHydra = {
		actors:	{
			'Body':	{
				role:	'lead',
				data:	['characters', 'floating', 'enemyChasis'],
				position:	{x: 0, y: 0}
			},
			'Link-A':	{
				role:	'link',
				data:	['characters', 'floating', 'hydraLinkTest'],
				position:	{x: -30, y: 0},
				link:	'Body'
			},
			'Link-B':	{
				role:	'link',
				data:	['characters', 'floating', 'hydraLinkTest'],
				position:	{x: -60, y: 0},
				link:	'Link-A'
			},
			'Link-C':	{
				role:	'link',
				data:	['characters', 'floating', 'hydraLinkTest'],
				position:	{x: -90, y: 0},
				link:	'Link-B'
			},
			'Link-D':	{
				role:	'link',
				data:	['characters', 'floating', 'hydraLinkTest'],
				position:	{x: -120, y: 0},
				link:	'Link-C'
			},
			'Head':	{
				role:	'link',
				data:	['characters', 'floating', 'hydraHeadTest'],
				position:	{x: -150, y: 0},
				link:	'Link-D'
			}
		},
		config:	{
			commonItems:	{
				health:	{current: 200, max: 200}
			},
			armor:		0,
			name:		'Hydra Enemy Ship'
		},
		dimensions:		{x: 100, y: 50},
		type:			'vehicle'
	};

	_self.insectTestEnemy = {
		actors:	{
			'Body':	{
				role:	'lead',
				data:	['characters', 'floating', 'insectTestBody'],
				position:	{x: 0, y: 0}
			}
		},
		config:	{
			commonItems:	{
				health:	{current: 30, max: 30}
			},
			armor:		0,
			name:		'Enemy Insect'
		},
		dimensions:		{x: 15, y: 15},
		type:			'vehicle'
	};

	_self.sphereTestEnemy = {
		actors:	{
			'Ball':	{
				role:	'lead',
				data:	['characters', 'floating', 'sphereTestBody'],
				position:	{x: 0, y: 0}
			},
			'Cannon':	{
				role:	'turret',
				data:	['characters', 'floating', 'sphereTestCannon'],
				position:	{x: -30, y: 0}
			}
		},
		config:	{
			commonItems:	{
				health:	{current: 200, max: 200}
			},
			armor:		0,
			name:		'Enemy Sphere'
		},
		dimensions:		{x: 100, y: 100},
		type:			'vehicle'
	};

	_self.firstEnemy = {
		actors:	{
			'A':	{
				role:	'lead',
				data:	['characters', 'floating', 'enemyChasis'],
				position:	{x: 0, y: 0}
			},
			'B':	{
				role:	'turret',
				data:	['characters', 'turret', 'turretOne'],
				position:	{x: 0, y: 3}
			}
		},
		config:	{
			commonItems:	{
				health:	{current: 200, max: 200}
			},
			armor:		0,
			name:		'Enemy Ship'
		},
		dimensions:		{x: 100, y: 50},
		type:			'vehicle'
	};


	return _self;
}());
