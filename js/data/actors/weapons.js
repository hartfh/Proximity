module.exports = function() {
	var _self = {};


	_self['chemical-1'] = {
		actor:	{
			classification:	'Chemical Weapon',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 7, updateTroupeDirection: true},
				{name: 'shoot', style: 'spread', pattern: 'random', shot: 'flame-1', ammo: 'chemical', number: 4, arc: 1, interval: 15}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	58,
						height:	19,
						x:		0,
						y:		0,
						sprite:	'weapon-chemical-1',
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[],
				ornaments:	[]
			},
			options:	{},
			custom:	{},
			zindex:	'turret'
		}
	};

	_self['explosive-1'] = {
		actor:	{
			classification:	'Explosive Weapon',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 4, updateTroupeDirection: true},
				{name: 'shoot', interval: 20, ammo: 'explosive', shot: 'grenade-1', style: 'straight'}
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
						sprite:	'weapon-kinetic-2',
						options:	{
							density:		0.5 // was 3
						}
					}
				],
				sensors:		[],
				ornaments:	[
					/*
					{
						shape:	'rectangle',
						name:	'blast',
						width:	60,
						height:	30,
						x:		30,
						y:		0
						//sprite:	'turretOne',
					}
					*/
				]
			},
			options:	{},
			custom:	{},
			zindex:	'turret'
		}
	};

	// Multi-rocket launcher
	_self['explosive-2'] = {
		actor:	{
			classification:	'Explosive Weapon',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 5, updateTroupeDirection: true},
				{name: 'shoot', style: 'straight', pattern: 'random', shot: 'rpg', ammo: 'explosive', number: 4, width: 18, interval: 15}
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
						sprite:	'weapon-kinetic-2',
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[],
				ornaments:	[
					/*
					{
						shape:	'rectangle',
						name:	'blast',
						width:	60,
						height:	30,
						x:		30,
						y:		0
						//sprite:	'turretOne',
					}
					*/
				]
			},
			options:	{},
			custom:	{},
			zindex:	'turret'
		}
	};

	// Shotgun
	_self['kinetic-1'] = {
		actor:	{
			classification:	'Kinetic Weapon',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 8, updateTroupeDirection: true},
				//{name: 'shootBeam', beam: 'repeater-1'}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	60,
						height:	14,
						x:		0,
						y:		0,
						sprite:	'weapon-kinetic-1',
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'blast',
						width:	60,
						height:	38,
						x:		30,
						y:		0
					}
				]
			},
			options:	{},
			custom:	{},
			zindex:	'turret'
		}
	};

	// Repeater
	_self['kinetic-2'] = {
		actor:	{
			classification:	'Kinetic Weapon',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 8, updateTroupeDirection: true},
				{name: 'shootBeam', beam: 'repeater-1'}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	60,
						height:	19,
						x:		0,
						y:		0,
						sprite:	'weapon-kinetic-2',
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[]
			},
			options:	{},
			custom:	{},
			zindex:	'turret'
		}
	};

	_self['weapon-armored-trooper-1'] = {
		actor:	{
			classification:	'Kinetic Weapon',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 8, updateTroupeDirection: true},
				{name: 'shootBeam', beam: 'repeater-1'}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	62,
						height:	16,
						x:		0,
						y:		0,
						sprite:	'weapon-armored-trooper-1',
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[]
			},
			options:	{},
			custom:	{},
			zindex:	'turret'
		}
	};

	// Jade Beam
	_self['energy-1'] = {
		actor:	{
			classification:	'Energy Weapon',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 10, updateTroupeDirection: true},
				{name: 'shoot-beam', beam: 'jade'}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	66,
						height:	13,
						x:		0,
						y:		0,
						sprite:	'weapon-energy-1',
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[]
			},
			options:	{},
			custom:	{},
			zindex:	'turret'
		}
	};

	// Nanoscale Laser
	_self['energy-2'] = {
		actor:	{
			classification:	'Energy Weapon',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 10, updateTroupeDirection: true},
				{name: 'shoot-beam', beam: 'nanoscale-laser'}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	60,
						height:	14,
						x:		0,
						y:		0,
						sprite:	'weapon-kinetic-2',
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[]
			},
			options:	{},
			custom:	{},
			zindex:	'turret'
		}
	};

	// Tri-Laser
	_self['energy-6'] = {
		actor:	{
			classification:	'Energy Weapon',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 10, updateTroupeDirection: true},
				{name: 'shoot-beam', beam: 'nanoscale-laser'}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	68,
						height:	21,
						x:		0,
						y:		0,
						sprite:	'weapon-energy-6',
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[]
			},
			options:	{},
			custom:	{},
			zindex:	'turret',
		}
	};

	// Fork
	_self['energy-7'] = {
		actor:	{
			classification:	'Energy Weapon',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 10, updateTroupeDirection: true},
				{name: 'shoot-beam', beam: 'nanoscale-laser'}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	58,
						height:	17,
						x:		0,
						y:		0,
						sprite:	'weapon-energy-7',
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[]
			},
			options:	{},
			custom:	{},
			zindex:	'turret',
		}
	};

	_self['energy-8'] = {
		actor:	{
			classification:	'Energy Weapon',
			type:			'turret',
			behaviors:		[
				{name: 'aim', interval: 10, updateTroupeDirection: true},
				{name: 'shoot-beam', beam: 'nanoscale-laser'}
			]
		},
		body:	{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'turretPart',
						width:	58,
						height:	24,
						x:		0,
						y:		0,
						sprite:	'weapon-energy-8',
						options:	{
							density:		0.5
						}
					}
				],
				sensors:		[]
			},
			options:	{},
			custom:	{},
			zindex:	'turret',
		},
	};

	return _self;
}();
