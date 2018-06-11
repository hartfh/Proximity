var Tilesets	= require('./tilesets');
var Tilepieces	= require('./tilepieces');

module.exports = function() {
	var _self		= {};


	_self.waveOne = {
		'normal':	{
			spriteFrames:	{
				e:	{frames: ['purple-wave-1', 'purple-wave-2', 'purple-wave-3', 'purple-wave-4', 'purple-wave-5', 'purple-wave-6', 'purple-wave-7', 'purple-wave-8', 'purple-wave-9', 'purple-wave-10', 'purple-wave-11']}
			},
			ticksPerFrame:	7,
			loop:		false
		}
	};

	_self.genericItem = {
		'normal':	{
			spriteFrames:	{
				e:	{frames: []},
			}
		},
	};

	// Placeholder items
	for(var i = 1; i < 5; i++) {
		['money', 'health', 'chemical', 'explosive', 'kinetic', 'energy'].forEach(function(type) {
			var name = type + '-' + i;
			_self[name] = Utilities.clone(_self.genericItem);
			_self[name].normal.spriteFrames.e.frames[0] = name;
		});
	}

	_self.energySmall = {
		'normal':	{
			spriteFrames:	{
				e:	{frames: ['energy-small']}
			}
		},
		'reacting':	{
			spriteFrames:	{
				e:	{frames: ['ammo-item-get-1', 'ammo-item-get-2', 'ammo-item-get-3', 'ammo-item-get-4', 'ammo-item-get-5', 'ammo-item-get-6']}
			},
			ticksPerFrame:	6,
			loop:		false
		}
	};

	_self.kineticSmall = {
		'normal':	{
			spriteFrames:	{
				e:	{frames: ['kinetic-small']}
			}
		},
		'reacting':	{
			spriteFrames:	{
				e:	{frames: ['ammo-item-get-1', 'ammo-item-get-2', 'ammo-item-get-3', 'ammo-item-get-4', 'ammo-item-get-5', 'ammo-item-get-6']}
			},
			ticksPerFrame:	6,
			loop:		false
		}
	};

	_self.explosiveSmall = {
		'normal':	{
			spriteFrames:	{
				e:	{frames: ['explosive-small']}
			}
		},
		'reacting':	{
			spriteFrames:	{
				e:	{frames: ['ammo-item-get-1', 'ammo-item-get-2', 'ammo-item-get-3', 'ammo-item-get-4', 'ammo-item-get-5', 'ammo-item-get-6']}
			},
			ticksPerFrame:	6,
			loop:		false
		}
	};

	_self.electronicSmall = {
		'normal':	{
			spriteFrames:	{
				e:	{frames: ['electronic-small']}
			}
		},
		'reacting':	{
			spriteFrames:	{
				e:	{frames: ['ammo-item-get-1', 'ammo-item-get-2', 'ammo-item-get-3', 'ammo-item-get-4', 'ammo-item-get-5', 'ammo-item-get-6']}
			},
			ticksPerFrame:	6,
			loop:		false
		}
	};

	_self.healthSmall = {
		'normal':	{
			spriteFrames:	{
				e:	{frames: ['health-small']}
			}
		},
		'reacting':	{
			spriteFrames:	{
				e:	{frames: ['health-disappear-1', 'health-disappear-2', 'health-disappear-3', 'health-disappear-4', 'health-disappear-5']}
			},
			ticksPerFrame:	6,
			loop:		false
		}
	};

	_self.healthMedium = {
		'normal':	{
			spriteFrames:	{
				e:	{frames: ['health-medium']}
			}
		},
		'reacting':	{
			spriteFrames:	{
				e:	{frames: ['health-disappear-1', 'health-disappear-2', 'health-disappear-3', 'health-disappear-4', 'health-disappear-5']}
			},
			ticksPerFrame:	6,
			loop:		false
		}
	};

	_self.healthLarge = {
		'normal':	{
			spriteFrames:	{
				e:	{frames: ['health-large']}
			}
		},
		'reacting':	{
			spriteFrames:	{
				e:	{frames: ['health-disappear-1', 'health-disappear-2', 'health-disappear-3', 'health-disappear-4', 'health-disappear-5']}
			},
			ticksPerFrame:	6,
			loop:		false
		}
	};

	_self.muzzleFlashTest = {
		'normal':	{
			spriteFrames:	{
				e:	[]
			}
		},
		'reacting':	{
			spriteFrames:	{
				e:	{frames: ['muzzle-flash-test-1', 'muzzle-flash-test-2']}
			},
			ticksPerFrame:	4
		},
		'damaged':	{
			spriteFrames:	{
				e:	[]
			}
		},
		'reacting-damaged':	{
			spriteFrames:	{
				e:	{frames: ['muzzle-flash-test-1', 'muzzle-flash-test-2']}
			},
			ticksPerFrame:	4
		}
	};

	_self.turretOne = {
		'normal':	{
			spriteFrames:	{
				e:	{frames: ['turret-one-normal']}
			}
		},
		'attacking':	{
			spriteFrames:	{
				e:	{frames: ['turret-one-attacking-1', 'turret-one-attacking-2', 'turret-one-attacking-3']}
			},
			ticksPerFrame:	10
		},
		'damaged':	{
			spriteFrames:	{
				e:	{frames: ['turret-one-damaged']}
			}
		},
		'attacking-damaged':	{
			spriteFrames:	{
				e:	{frames: ['turret-one-attacking-damaged']}
			}
		}
	};

	// Destructibles
	var destructibles = [
		'barrel-1',
		'boxes-1',
		'boxes-2',
		'boxes-3',
		'cardboard-box-2',
		'cardboard-box-3',
		'cardboard-box-4',
		'crate-1',
		'crate-2',
		'crate-3',
		'junk-1',
		'tank-1',
		'tank-2',
		'trashcan-1',
	];
	destructibles.forEach(function(destructible) {
		_self[destructible] = {
			'normal':	{
				spriteFrames:	{
					e:	{frames: [`${destructible}-normal`]},
				}
			},
			'damaged': {
				spriteFrames:	{
					e:	{frames: [`${destructible}-damaged`]},
				}
			}
		};
	});

	function setVehicleSprites(name, spriteProps = {'normal': false, 'moving': false, 'damaged': false, 'moving-damaged': false}) {
		var defaultSpriteProps = {frames: 1, time: 10};

		var modes = ['normal', 'moving', 'damaged', 'moving-damaged'];
		var directions = [
			{dir: 'n', backfacing: false},
			{dir: 's', backfacing: false},
			{dir: 'w', backfacing: false},
			{dir: 'e', backfacing: false}
		];

		_self[name] = {};

		for(var mode of modes) {
			if( spriteProps[mode] ) {
				_self[name][mode] = {spriteFrames: {}};

				var numFrames = spriteProps[mode].frames || defaultSpriteProps.frames;

				// Apply user-defined ticks per frame
				if( spriteProps[mode].time ) {
					_self[name][mode].ticksPerFrame = spriteProps[mode].time;
				}

				for(var direction of directions) {
					_self[name][mode].spriteFrames[direction.dir] = {frames: []};

					if(direction.backfacing) {
						_self[name][mode].spriteFrames[direction.dir].zindex = 'backfacing';
					}

					// Add frames
					for(var f = 0; f < numFrames; f++) {
						_self[name][mode].spriteFrames[direction.dir].frames.push( `${name}-${mode}-${direction.dir}-${f}` );
					}
				}
			}
		}
	}

	function setWeaponSprites(name, spriteProps = {'normal': false, 'attacking': false, 'moving': false, 'damaged': false, 'attacking-damaged': false}) {
		var defaultSpriteProps = {frames: 1, time: 10};

		var modes = ['normal', 'attacking', 'moving', 'damaged', 'attacking-damaged'];
		var directions = [
			{dir: 'n', backfacing: true},
			{dir: 's', backfacing: false},
			{dir: 'w', backfacing: true},
			{dir: 'e', backfacing: false},
			{dir: 'nw', backfacing: true},
			{dir: 'sw', backfacing: false},
			{dir: 'ne', backfacing: true},
			{dir: 'se', backfacing: false}
		];

		_self[name] = {};

		for(var mode of modes) {
			if( spriteProps[mode] ) {
				_self[name][mode] = {spriteFrames: {}};

				var numFrames = spriteProps[mode].frames || defaultSpriteProps.frames;

				// Apply user-defined ticks per frame
				if( spriteProps[mode].time ) {
					_self[name][mode].ticksPerFrame = spriteProps[mode].time;
				}

				for(var direction of directions) {
					_self[name][mode].spriteFrames[direction.dir] = {frames: []};

					if(direction.backfacing) {
						_self[name][mode].spriteFrames[direction.dir].zindex = 'backfacing';
					}

					// Add frames
					for(var f = 0; f < numFrames; f++) {
						var sprite = `${name}-${mode}-${direction.dir}-${f}`;

						if( mode == 'normal' ) {
							sprite = 'empty';
						}

						_self[name][mode].spriteFrames[direction.dir].frames.push(sprite);
					}
				}
			}
		}
	}

	setWeaponSprites('weapon-chemical-1', {'normal': {frames: 1}});
	setWeaponSprites('weapon-chemical-2', {'normal': {frames: 1}});

	setWeaponSprites('weapon-energy-1', {'normal': {frames: 1}});
	setWeaponSprites('weapon-energy-6', {'normal': {frames: 1}});
	setWeaponSprites('weapon-energy-7', {'normal': {frames: 1}});
	setWeaponSprites('weapon-energy-8', {'normal': {frames: 1}});

	setWeaponSprites('weapon-explosive-1', {'normal': {frames: 1}});
	setWeaponSprites('weapon-explosive-2', {'normal': {frames: 1}});
	setWeaponSprites('weapon-explosive-6', {'normal': {frames: 1}});

	setWeaponSprites('weapon-kinetic-1', {'normal': {frames: 1}});
	setWeaponSprites('weapon-kinetic-2', {'normal': {frames: 1}, 'moving': {frames: 1}, 'attacking': {frames: 2, time: 3}});
	setWeaponSprites('weapon-kinetic-4', {'normal': {frames: 1}});
	setWeaponSprites('weapon-kinetic-5', {'normal': {frames: 1}});
	setWeaponSprites('weapon-kinetic-7', {'normal': {frames: 1}});
	setWeaponSprites('weapon-kinetic-9', {'normal': {frames: 1}});
	setWeaponSprites('weapon-kinetic-10', {'normal': {frames: 1}});
	setWeaponSprites('weapon-armored-trooper-1', {'normal': {frames: 1}});

	//setVehicleSprites('vehicle-1', {'normal': {frames: 1}, 'moving': {frames: 1}});
	//setVehicleSprites('vehicle-1', {'normal': {frames: 1}});
	//setVehicleSprites('vehicle-2', {'normal': {frames: 1}});

	// Parked Cars
	_self['parked-car-0-n'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['vehicle-1-n-0']},
			},
		},
	};
	_self['parked-car-0-e'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['vehicle-1-e-0']},
			},
		},
	};
	_self['parked-car-0-s'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['vehicle-1-s-0']},
			},
		},
	};
	_self['parked-car-0-w'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['vehicle-1-w-0']},
			},
		},
	};


	_self.playerPerson = {
		'normal':	{
			spriteFrames:		{
				n:		{frames: ['person-1-north-normal', 'person-1-north-normal', 'person-1-north-normal', 'person-1-north-normal']},
				s:		{frames: ['person-0-normal-s-0', 'person-0-normal-s-1', 'person-0-normal-s-2', 'person-0-normal-s-1']},
				w:		{frames: ['person-1-west-normal', 'person-1-west-normal', 'person-1-west-normal', 'person-1-west-normal']},
				e:		{frames: ['person-1-east-normal', 'person-1-east-normal', 'person-1-east-normal', 'person-1-east-normal']},
				nw:		{frames: ['person-1-northwest-normal', 'person-1-northwest-normal', 'person-1-northwest-normal', 'person-1-northwest-normal']},
				sw:		{frames: ['person-1-southwest-normal', 'person-1-southwest-normal', 'person-1-southwest-normal', 'person-1-southwest-normal']},
				ne:		{frames: ['person-1-northeast-normal', 'person-1-northeast-normal', 'person-1-northeast-normal', 'person-1-northeast-normal']},
				se:		{frames: ['person-1-southeast-normal', 'person-1-southeast-normal', 'person-1-southeast-normal', 'person-1-southeast-normal']},
			},
			ticksPerFrame:	25,
			silhouette:	true,
			//opacity:	1,
			//mode:		'overlay',
			effects:		{
				/*
				'person-0-normal-s-2':	{
					effect:	'explLarge',
					//muted:	true,
					//x:		0,
					//y:		0
				}
				*/
			}
		},
		'damaged':	{
			spriteFrames:		{
				//w:		{frames: ['']},
				//e:		{frames: ['']},
			},
			silhouette:	true,
		},
		'moving':	{
			spriteFrames:		{
				n:		{frames: ['person-0-moving-n-0', 'person-0-moving-n-1', 'person-0-moving-n-2', 'person-0-moving-n-3', 'person-0-moving-n-4', 'person-0-moving-n-5']},
				s:		{frames: ['person-0-moving-s-0', 'person-0-moving-s-1', 'person-0-moving-s-2', 'person-0-moving-s-3', 'person-0-moving-s-4', 'person-0-moving-s-5']},
				w:		{frames: ['person-0-moving-w-0', 'person-0-moving-w-1', 'person-0-moving-w-2', 'person-0-moving-w-3', 'person-0-moving-w-4', 'person-0-moving-w-5']},
				e:		{frames: ['person-0-moving-e-0', 'person-0-moving-e-1', 'person-0-moving-e-2', 'person-0-moving-e-3', 'person-0-moving-e-4', 'person-0-moving-e-5']},
				nw:		{frames: ['person-0-moving-nw-0', 'person-0-moving-nw-1', 'person-0-moving-nw-2', 'person-0-moving-nw-3', 'person-0-moving-nw-4', 'person-0-moving-nw-5']},
				ne:		{frames: ['person-0-moving-ne-0', 'person-0-moving-ne-1', 'person-0-moving-ne-2', 'person-0-moving-ne-3', 'person-0-moving-ne-4', 'person-0-moving-ne-5']},
				se:		{frames: ['person-0-moving-se-0', 'person-0-moving-se-1', 'person-0-moving-se-2', 'person-0-moving-se-3', 'person-0-moving-se-4', 'person-0-moving-se-5']},
				sw:		{frames: ['person-0-moving-sw-0', 'person-0-moving-sw-1', 'person-0-moving-sw-2', 'person-0-moving-sw-3', 'person-0-moving-sw-4', 'person-0-moving-sw-5']},
			},
			ticksPerFrame:	11,
			silhouette:	true,
		}
	};

	function animatePerson(name, mode, sprite, numFrames = 1, ticksPerFrame) {
		if( !_self[name] ) {
			_self[name] = {};
		}

		_self[name][mode] = {};

		if( ticksPerFrame ) {
			_self[name][mode].ticksPerFrame = ticksPerFrame;
		}

		_self[name][mode].spriteFrames = {};

		var sourceMode = sprite || mode;

		for(var facing of Constants.SPRITE_FACINGS) {
			_self[name][mode].spriteFrames[facing] = {'frames': []};

			for(var n = 0; n < numFrames; n++) {
				_self[name][mode].spriteFrames[facing].frames.push(`${name}-${sourceMode}-${facing}-${n}`);
			}
		}
	}

	animatePerson('armored-trooper-1', 'normal');
	animatePerson('armored-trooper-1', 'attacking');
	animatePerson('armored-trooper-1', 'moving', 'moving', 6, 12);
	animatePerson('armored-trooper-1', 'attacking-moving', 'moving', 6, 12);

	_self['test-enemy-1'] = {
		'normal':	{
			spriteFrames:	{
				e:		{frames: ['test-enemy-1']},
			}
		},
	};
	_self['test-enemy-2'] = {
		'normal':	{
			spriteFrames:	{
				e:		{frames: ['test-enemy-2']},
			}
		},
	};
	_self['test-enemy-3'] = {
		'normal':	{
			spriteFrames:	{
				e:		{frames: ['test-enemy-3']},
			}
		},
	};
	_self['test-enemy-4'] = {
		'normal':	{
			spriteFrames:	{
				e:		{frames: ['test-enemy-4']},
			}
		},
	};
	_self['test-enemy-5'] = {
		'normal':	{
			spriteFrames:	{
				e:		{frames: ['test-enemy-5']},
			}
		},
	};
	_self['test-enemy-6'] = {
		'normal':	{
			spriteFrames:	{
				e:		{frames: ['test-enemy-6']},
			}
		},
	};

	_self.enemyOne = {
		'normal':	{
			spriteFrames:	{
				w:		{frames: ['enemy-ship-1-left']},
				e:		{frames: ['enemy-ship-1-right']}
			}
		},
		'damaged':	{
			spriteFrames:	{
				w:		{frames: ['enemy-ship-1-left-damage']},
				e:		{frames: ['enemy-ship-1-right-damage']}
			}
		},
		'moving-damaged':	{
			spriteFrames:	{
				w:		{frames: ['enemy-ship-1-left-damage']},
				e:		{frames: ['enemy-ship-1-right-damage']}
			}
		}
	};

	_self.enemyTwo = {
		'normal':	{
			spriteFrames:	{
				w:		{frames: ['enemy-ship-2-left-normal']},
				e:		{frames: ['enemy-ship-2-right-normal']}
			},
		},
		'damaged':	{
			spriteFrames:	{
				w:		{frames: ['enemy-ship-2-left-damaged']},
				e:		{frames: ['enemy-ship-2-right-damaged']}
			}
		},
		'moving-damaged':	{
			spriteFrames:	{
				w:		{frames: ['enemy-ship-2-left-damaged']},
				e:		{frames: ['enemy-ship-2-right-damaged']}
			}
		}
	};

	_self.enemyThree = {
		'normal':	{
			spriteFrames:	{
				w:		{frames: ['enemy-ship-3-left-normal']},
				e:		{frames: ['enemy-ship-3-right-normal']}
			},
		},
		'damaged':	{
			spriteFrames:	{
				w:		{frames: ['enemy-ship-3-left-damaged']},
				e:		{frames: ['enemy-ship-3-right-damaged']}
			}
		},
		'moving-damaged':	{
			spriteFrames:	{
				w:		{frames: ['enemy-ship-3-left-damaged']},
				e:		{frames: ['enemy-ship-3-right-damaged']}
			}
		}
	};

	_self.vendorOne = {
		'normal':	{
			spriteFrames:	{
				w:		{frames: ['vendor-1-left-normal']},
				e:		{frames: ['vendor-1-right-normal']}
			}
		}
	};

	_self.vendorTwo = {
		'normal':	{
			spriteFrames:	{
				w:		{frames: ['vendor-1-left-normal']},
				e:		{frames: ['vendor-1-right-normal']}
			}
		}
	};

	_self.enemyOneTwinCannon = {
		'normal':	{
			spriteFrames:	{
				e:		{frames: ['enemy-turret-1-normal']}
			}
		},
		'attacking':	{
			spriteFrames:	{
				e:		{frames: ['enemy-turret-1-attacking-1', 'enemy-turret-1-normal', 'enemy-turret-1-attacking-2', 'enemy-turret-1-normal']}
			},
			ticksPerFrame:	3,
			loop:		true
		},
		'damaged':	{
			spriteFrames:	{
				e:		{frames: ['enemy-turret-1-damaged']}
			}
		},
		'attacking-damaged':	{
			spriteFrames:	{
				e:		{frames: ['enemy-turret-1-attacking-damaged-1', 'enemy-turret-1-damaged', 'enemy-turret-1-attacking-damaged-2', 'enemy-turret-1-damaged']}
			},
			ticksPerFrame:	3,
			loop:		true
		}
	};

	_self.explLarge = {
		normal:		{
			spriteFrames:		{
				e:		{frames: ['expl-large-1', 'expl-large-2', 'expl-large-3', 'expl-large-4', 'expl-large-5', 'expl-large-6', 'expl-large-7', 'expl-large-8', 'expl-large-8', 'empty']}
			},
			ticksPerFrame:		4,
			loop:			false
		}
	};

	_self.expl1 = {
		normal:		{
			spriteFrames:		{
				e:		{frames: ['expl1-1', 'expl1-2', 'expl1-3', 'expl1-4', 'expl1-5', 'expl1-6', 'expl1-7', 'expl1-8', 'expl1-9', 'expl1-10', 'expl1-11']}
			},
			ticksPerFrame:		4,
			loop:			false
		}
	};

	_self['empty-temp'] = {
		normal:		{
			spriteFrames:		{
				e:		{frames: ['empty']}
			},
			loop:			false
		}
	};

	_self['traffic-light-1'] = {
		normal:		{
			spriteFrames:		{
				e:		{frames: ['traffic-light-1']}
			},
			loop:			false
		}
	};

	// Streetlights
	for(var n = 0; n < 4; n++) {
		_self[`streetlight-${n}-v0-p0`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`streetlight-${n}-v0-p0`]}
				},
				ticksPerFrame:		500
			}
		};
		_self[`streetlight-${n}-v0-p1`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`streetlight-${n}-v0-p1`]}
				},
				ticksPerFrame:		500
			}
		};
		_self[`streetlight-${n}-v0-p2`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`streetlight-${n}-v0-p2`]}
				},
				ticksPerFrame:		500,
				mode:			'lighten',
				opacity:			0.25
			}
		};
		_self[`streetlight-${n}-v0-p3`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`streetlight-${n}-v0-p3`]}
				},
				ticksPerFrame:		500,
				//mode:			'lighten',
				mode:			'soft-light',
				opacity:			0.3
			}
		};
	}

	// Concrete Barricade corners
	for(var r = 0; r < 4; r++) {
		_self[`concrete-barricade-corner-${r}-v0-p0`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`concrete-barricade-corner-${r}-v0-p0`]}
				},
				ticksPerFrame:		500
			}
		};
		_self[`concrete-barricade-corner-${r}-v0-p1`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`concrete-barricade-corner-${r}-v0-p1`]}
				},
				ticksPerFrame:		500
			}
		};
		_self[`concrete-barricade-corner-${r}-v0-p2`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`concrete-barricade-corner-${r}-v0-p2`]}
				},
				ticksPerFrame:		500
			}
		};
		_self[`concrete-barricade-corner-${r}-v0-p3`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`concrete-barricade-corner-${r}-v0-p3`]}
				},
				ticksPerFrame:		500
			}
		};
	}

	// Concrete Barricade pipes
	for(var v = 0; v < 3; v++) {
		_self[`concrete-barricade-pipe-0-v${v}-p0`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`concrete-barricade-pipe-0-v${v}-p0`]}
				},
				ticksPerFrame:		500
			}
		};
		_self[`concrete-barricade-pipe-0-v${v}-p1`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`concrete-barricade-pipe-0-v${v}-p1`]}
				},
				ticksPerFrame:		500
			}
		};
	}

	for(var v = 0; v < 3; v++) {
		_self[`concrete-barricade-pipe-1-v${v}-p0`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`concrete-barricade-pipe-1-v${v}-p0`]}
				},
				ticksPerFrame:		500
			}
		};
		_self[`concrete-barricade-pipe-1-v${v}-p1`] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [`concrete-barricade-pipe-1-v${v}-p1`]}
				},
				ticksPerFrame:		500
			}
		};
	}


	// Weather
	_self['rain-drop'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['rain-drop']}
			}
		}
	};
	_self['snow-flake'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['snow-flake']}
			}
		}
	};
	_self['haze-test-1'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['haze-test-1']}
			}
		}
	};


	// temporary guard rails
	_self[`guard-rail-horz-0`] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: [`guard-rail-horz-0`]}
			},
			ticksPerFrame:		500
		}
	};
	_self[`guard-rail-horz-1`] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: [`guard-rail-horz-1`]}
			},
			ticksPerFrame:		500
		}
	};
	_self[`guard-rail-horz-2`] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: [`guard-rail-horz-2`]}
			},
			ticksPerFrame:		500
		}
	};
	_self[`guard-rail-vert-0`] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: [`guard-rail-vert-0`]}
			},
			ticksPerFrame:		500
		}
	};
	_self[`guard-rail-vert-1`] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: [`guard-rail-vert-1`]}
			},
			ticksPerFrame:		500
		}
	};
	_self[`guard-rail-vert-2`] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: [`guard-rail-vert-2`]}
			},
			ticksPerFrame:		500
		}
	};

	// Building Obstacles
	var buildingSprites = [
		'building-set-1-purple-0',
		'building-set-1-purple-0-shadow',
		'building-set-1-purple-1',
		'building-set-1-purple-1-shadow',
		'building-set-1-purple-2',
		'building-set-1-purple-2-shadow',
		'building-set-1-purple-3',
		'building-set-1-purple-3-shadow',
		'building-set-1-purple-4',
		'building-set-1-purple-4-shadow',
		'building-set-1-purple-5',
		'building-set-1-purple-5-shadow',
	];

	buildingSprites.forEach(function(building) {
		_self[building] = {
			'normal':	{
				spriteFrames:		{
					e:		{frames: [building]}
				},
				ticksPerFrame:		500
			}
		};
	});

	_self[`building-placeholder-shanty-1`] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: [`building-placeholder-shanty-1`]}
			},
			ticksPerFrame:		500
		}
	};
	_self[`building-placeholder-shanty-2`] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: [`building-placeholder-shanty-2`]}
			},
			ticksPerFrame:		500
		}
	};
	_self[`building-placeholder-shanty-3`] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: [`building-placeholder-shanty-3`]}
			},
			ticksPerFrame:		500
		}
	};
	_self[`building-placeholder-shanty-4`] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: [`building-placeholder-shanty-4`]}
			},
			ticksPerFrame:		500
		}
	};



	// Shadows
	_self['building-shadow-inside-0-v0'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['building-shadow-inside-0-v0-f0']}
			}
		}
	};
	_self['building-shadow-inside-1-v0'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['building-shadow-inside-1-v0-f0']}
			}
		}
	};
	_self['building-shadow-inside-2-v0'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['building-shadow-inside-2-v0-f0']}
			}
		}
	};
	_self['building-shadow-inside-3-v0'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['building-shadow-inside-3-v0-f0']}
			}
		}
	};
	_self['building-shadow-inside-4-v0'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['building-shadow-inside-4-v0-f0']}
			}
		}
	};
	_self['building-shadow-inside-5-v0'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['building-shadow-inside-5-v0-f0']}
			}
		}
	};
	_self['building-shadow-inside-6-v0'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['building-shadow-inside-6-v0-f0']}
			}
		}
	};
	_self['building-shadow-inside-7-v0'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['building-shadow-inside-7-v0-f0']}
			}
		}
	};

	// Railyard
	_self['railyard-0'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['railyard-0']},
			}
		}
	};
	_self['tanker-car-example'] = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: ['tanker-car-example']},
			}
		}
	};


	_self.tileExemplar = {
		'normal':	{
			spriteFrames:		{
				e:		{frames: []}
			},
			ticksPerFrame:		70
		}
	};

	// Copy an exemplar into distinct instances of sprite data based on a tileset
	var _expandTileset = function(setName, exemplar) {
		var tileset = Tilesets[setName];

			// Expand each rotation and variation into its own sprite data
			for(var type in tileset) {
				var rotations = tileset[type];

				for(var rotationIndex in rotations) {
					var variations = rotations[rotationIndex];

					if( typeof(variations) == 'number' ) {
						for(var v = 0; v < variations; v++) {
							if( typeof(variations) == 'number' ) {
								var name = setName + '-' + type + '-' + rotationIndex + '-v' + v;

								_self[name] = Utilities.clone(exemplar);

								// Overwrite the exemplar's sprite frame data
								_self[name].normal.spriteFrames.e = {frames: [name + '-f0']};
							}
						}
					} else {
						for(var vIndex in variations) {
							var frameData	= variations[vIndex];
							var name		= setName + '-' + type + '-' + rotationIndex + '-v' + vIndex;

							_self[name] = Utilities.clone(exemplar);

							for(var f = 0, frames = frameData.frames; f < frames; f++) {
								_self[name].normal.spriteFrames.e.frames.push( name + '-f' + f );
							}

							if( frameData.speed ) {
								_self[name].normal.ticksPerFrame = frameData.speed;
							}
							if( frameData.padding ) {
								_self[name].normal.paddingFrames = frameData.padding;
							}
						}
					}
				}
			}
	};

	_expandTileset('test-building-1', _self.tileExemplar);
	_expandTileset('test-building-2', _self.tileExemplar);
	_expandTileset('test-building-3', _self.tileExemplar);
	_expandTileset('test-building-4', _self.tileExemplar);
	_expandTileset('test-building-5', _self.tileExemplar);
	_expandTileset('test-rooftop-1', _self.tileExemplar);
	_expandTileset('test-rooftop-2', _self.tileExemplar);
	_expandTileset('test-rooftop-3', _self.tileExemplar);
	_expandTileset('test-rooftop-4', _self.tileExemplar);
	_expandTileset('test-rooftop-5', _self.tileExemplar);
	_expandTileset('building-1-pagoda', _self.tileExemplar);
	_expandTileset('rooftop-1-pagoda', _self.tileExemplar);
	_expandTileset('building-2-rentapod', _self.tileExemplar);
	_expandTileset('rooftop-2-rentapod', _self.tileExemplar);
	_expandTileset('building-3-tiled', _self.tileExemplar);
	_expandTileset('rooftop-3-tiled', _self.tileExemplar);
	_expandTileset('building-4-redshops', _self.tileExemplar);
	_expandTileset('rooftop-4-redshops', _self.tileExemplar);
	_expandTileset('building-1', _self.tileExemplar);
	_expandTileset('building-2', _self.tileExemplar);
	_expandTileset('building-3', _self.tileExemplar);
	_expandTileset('building-4', _self.tileExemplar);
	_expandTileset('building-6', _self.tileExemplar);
	_expandTileset('crosswalk', _self.tileExemplar);
	_expandTileset('sidewalk-0', _self.tileExemplar);
	_expandTileset('sidewalk-1', _self.tileExemplar);
	_expandTileset('sidewalk-2', _self.tileExemplar);
	_expandTileset('sidewalk-3', _self.tileExemplar);
	_expandTileset('sidewalk-4', _self.tileExemplar);
	_expandTileset('sidewalk-5', _self.tileExemplar);
	_expandTileset('sidewalk-6', _self.tileExemplar);
	_expandTileset('street-markings', _self.tileExemplar);
	_expandTileset('street-markings-yield', _self.tileExemplar);
	_expandTileset('street-median', _self.tileExemplar);
	_expandTileset('rooftop-1', _self.tileExemplar);
	_expandTileset('rooftop-3', _self.tileExemplar);
	_expandTileset('rooftop-4', _self.tileExemplar);
	_expandTileset('rooftop-6', _self.tileExemplar);
	_expandTileset('filler', _self.tileExemplar);


	return _self;
}();
