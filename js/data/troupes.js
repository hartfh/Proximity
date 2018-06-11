module.exports = function() {
	var _self = {
		'destructible':	{},
		'enemy':			{},
		//'friendly':		{},
		'npc':			{},
		'player':			{},
		'vendor':			{},
		//'other':		{},
		'unused':			{},
	};

	var destructibleExemplar = {
		actors:	{
			'Body':	{
				role:	'lead',
				name:	['characters', 'stationary'],
				position: {x: 0, y: 0},
			}
		},
		config:	{
			commonItems:		{
				health:		{current: 9, max: 9},
			},
			name:			'Destructible 1',
		},
		type:	'vehicle' // something other than vehicle?
	};

	_self.destructible['barrel-1'] = Utilities.clone(destructibleExemplar);
	_self.destructible['barrel-1'].actors.Body.name.push('barrel-1');
	_self.destructible['crate-1'] = Utilities.clone(destructibleExemplar);
	_self.destructible['crate-1'].actors.Body.name.push('crate-1');
	_self.destructible['crate-2'] = Utilities.clone(destructibleExemplar);
	_self.destructible['crate-2'].actors.Body.name.push('crate-2');
	_self.destructible['crate-3'] = Utilities.clone(destructibleExemplar);
	_self.destructible['crate-3'].actors.Body.name.push('crate-3');
	_self.destructible['junk-1'] = Utilities.clone(destructibleExemplar);
	_self.destructible['junk-1'].actors.Body.name.push('junk-1');
	_self.destructible['tank-1'] = Utilities.clone(destructibleExemplar);
	_self.destructible['tank-1'].actors.Body.name.push('tank-1');
	_self.destructible['tank-2'] = Utilities.clone(destructibleExemplar);
	_self.destructible['tank-2'].actors.Body.name.push('tank-2');
	_self.destructible['trashcan-1'] = Utilities.clone(destructibleExemplar);
	_self.destructible['trashcan-1'].actors.Body.name.push('trashcan-1');
	_self.destructible['boxes-1'] = Utilities.clone(destructibleExemplar);
	_self.destructible['boxes-1'].actors.Body.name.push('boxes-1');
	_self.destructible['boxes-2'] = Utilities.clone(destructibleExemplar);
	_self.destructible['boxes-2'].actors.Body.name.push('boxes-2');
	_self.destructible['boxes-3'] = Utilities.clone(destructibleExemplar);
	_self.destructible['boxes-3'].actors.Body.name.push('boxes-3');

	_self.destructible['cardboard-box-2'] = Utilities.clone(destructibleExemplar);
	_self.destructible['cardboard-box-2'].actors.Body.name.push('cardboard-box-2');
	_self.destructible['cardboard-box-3'] = Utilities.clone(destructibleExemplar);
	_self.destructible['cardboard-box-3'].actors.Body.name.push('cardboard-box-3');
	_self.destructible['cardboard-box-4'] = Utilities.clone(destructibleExemplar);
	_self.destructible['cardboard-box-4'].actors.Body.name.push('cardboard-box-4');

	_self.player.playerShip = {
		actors:	{
			'Body':	{
				role:	'lead',
				name:	['characters', 'playerPerson'],
				position:	{x: 0, y: 0}
			},
			'Gun':	{
				role:	'turret',
				name:	['weapons', 'explosive-1'],
				position:	{x: 0, y: -3},
			}
		},
		config:	{
			commonItems:	{},
			name:		'Player Ship',
			despawnable:	false
		},
		/*
		dimensions:		{
			width:		1,
			height:		1
		},
		*/
		type:			'person'
	};

	_self.enemy['armored-trooper-1'] = {
		actors:	{
			'Body':		{
				role:	'lead',
				name:	['characters', 'armored-trooper-1'],
				position:	{x: 0, y: 0}
			},
			'Gun':		{
				role:	'turret',
				name:	['characters', 'weapon-armored-trooper-1'],
				position:	{x: 0, y: -15}
			}
		},
		config:	{
			commonItems:	{
				health:	{current: 20, max: 20}
			},
			name:		'Armored Trooper 1',
			xp:			2,
		},
		type:			'person'
	};

	_self.enemy['test-enemy-1'] = {
		actors:	{
			'Body':		{
				role:	'lead',
				name:	['characters', 'test-enemy-1'],
				position:	{x: 0, y: 0}
			},
			/*
			'Gun':		{
				role:	'turret',
				name:	['characters', 'enemyOneTwinCannon'],
				position:	{x: 0, y: -15}
			}
			*/
		},
		config:	{
			commonItems:	{
				health:	{current: 20, max: 20}
			},
			name:		'Test Enemy 1',
			xp:			2,
		},
		type:			'person'
	};

	_self.enemy['test-enemy-2'] = {
		actors:	{
			'Body':		{
				role:	'lead',
				name:	['characters', 'test-enemy-2'],
				position:	{x: 0, y: 0}
			},
			/*
			'Gun':		{
				role:	'turret',
				name:	['characters', 'enemyOneTwinCannon'],
				position:	{x: 0, y: -15}
			}
			*/
		},
		config:	{
			commonItems:	{
				health:	{current: 20, max: 20}
			},
			name:		'Test Enemy 2',
			xp:			2,
		},
		type:			'person'
	};

	_self.enemy['test-enemy-3'] = {
		actors:	{
			'Body':		{
				role:	'lead',
				name:	['characters', 'test-enemy-3'],
				position:	{x: 0, y: 0}
			},
			/*
			'Gun':		{
				role:	'turret',
				name:	['characters', 'enemyOneTwinCannon'],
				position:	{x: 0, y: -15}
			}
			*/
		},
		config:	{
			commonItems:	{
				health:	{current: 20, max: 20}
			},
			name:		'Test Enemy 3',
			xp:			1,
		},
		type:			'person'
	};

	_self.enemy['test-enemy-4'] = {
		actors:	{
			'Body':		{
				role:	'lead',
				name:	['characters', 'test-enemy-4'],
				position:	{x: 0, y: 0}
			},
			/*
			'Gun':		{
				role:	'turret',
				name:	['characters', 'enemyOneTwinCannon'],
				position:	{x: 0, y: -15}
			}
			*/
		},
		config:	{
			commonItems:	{
				health:	{current: 20, max: 20}
			},
			name:		'Test Enemy 4',
			xp:			1,
		},
		type:			'person'
	};

	_self.enemy['test-enemy-5'] = {
		actors:	{
			'Body':		{
				role:	'lead',
				name:	['characters', 'test-enemy-5'],
				position:	{x: 0, y: 0}
			},
			/*
			'Gun':		{
				role:	'turret',
				name:	['characters', 'enemyOneTwinCannon'],
				position:	{x: 0, y: -15}
			}
			*/
		},
		config:	{
			commonItems:	{
				health:	{current: 20, max: 20}
			},
			name:		'Test Enemy 5',
			xp:			3,
		},
		type:			'person'
	};

	_self.vendor.vendorOne = {
		actors:	{
			'Body':	{
				role:	'lead',
				name:	['characters', 'vendorChassis'],
				position:	{x: 0, y: 0}
			}
		},
		config:	{
			commonItems:		{
				health:		{current: 70, max: 200}
			},
			indestructible:	true,
			name:			'Test Vendor'
		},
		/*
		dimensions:		{
			width:		2,
			height:		1
		},
		*/
		type:			'vehicle'
	};

	_self.unused.firstEnemy = {
		actors:	{
			'Body':		{
				role:	'lead',
				name:	['characters', 'enemyChassis'],
				position:	{x: 0, y: 0}
			},
			'Gun':		{
				role:	'turret',
				name:	['characters', 'enemyOneTwinCannon'],
				position:	{x: 0, y: -15}
			}
		},
		config:	{
			commonItems:	{
				health:	{current: 100, max: 200}
			},
			name:		'Enemy Ship'
		},
		/*
		dimensions:		{
			width:		2,
			height:		1
		},
		*/
		type:			'vehicle'
	};

	_self.unused.secondEnemy = {
		actors:	{
			'Body':		{
				role:	'lead',
				name:	['characters', 'enemyChassisTwo'],
				position:	{x: 0, y: 0}
			},
			'Gun':		{
				role:	'turret',
				name:	['characters', 'enemyOneTwinCannon'],
				position:	{x: 0, y: -15}
			}
		},
		config:	{
			commonItems:	{
				health:	{current: 100, max: 200}
			},
			name:		'Enemy Ship'
		},
		/*
		dimensions:		{
			width:		2,
			height:		1
		},
		*/
		type:			'vehicle'
	};

	_self.unused.thirdEnemy = {
		actors:	{
			'Body':		{
				role:	'lead',
				name:	['characters', 'enemyChassisThree'],
				position:	{x: 0, y: 0}
			},
			'Gun':		{
				role:	'turret',
				name:	['characters', 'enemyOneTwinCannon'],
				position:	{x: 0, y: -15}
			}
		},
		config:	{
			commonItems:	{
				health:	{current: 100, max: 200}
			},
			name:		'Enemy Ship'
		},
		/*
		dimensions:		{
			width:		2,
			height:		1
		},
		*/
		type:			'vehicle'
	};

	return _self;
}();
