var Game = Game || {};

Game.data = Game.data || {};

Game.data.sprites = (function() {
	var _self		= {};
	var rootDir	= Game.constants.IMG_DIR;

	_self.powerupOne = {
		normal:		{
			spriteFrames:		{
				left:		[rootDir + 'powerup-test-1.png', rootDir + 'powerup-test-2.png'],
				right:		[rootDir + 'powerup-test-1.png', rootDir + 'powerup-test-2.png']
			},
			ticksPerFrame:		40,
			light:			[{color: 'yellow', intensity: 10}, {color: 'yellow', intensity: 15}]
		},
		active:		{
			spriteFrames:		[],
			ticksPerFrame:		20
		}
	};

	_self.explosionSmall = {
		normal:		{
			spriteFrames:		{
				left:		[rootDir + 'explosion-test-1.png', rootDir + 'explosion-test-2.png', rootDir + 'explosion-test-3.png'],
				right:		[rootDir + 'explosion-test-1.png', rootDir + 'explosion-test-2.png', rootDir + 'explosion-test-3.png']
			},
			ticksPerFrame:		25,
			light:			[{color: 'red', intensity: 17}, {color: 'red', intensity: 15}, {color: 'red', intensity: 12}]
		},
		loop:			false
	};

	_self.player = {
		normal:		{
			spriteFrames:		{
				left:		[rootDir + 'purple-test-ship-1.png'],
				right:		[rootDir + 'purple-test-ship-1.png']
			},
			ticksPerFrame:		50,
			light:			[{color: 'red', intensity: 10}]
		}
	};

	_self.freighterChasis = {
		normal:		{
			spriteFrames:		{
				left:		[rootDir + 'freighter-test-1.png'],
				right:		[rootDir + 'freighter-test-1.png']
			},
			ticksPerFrame:		50
		}
	};

	_self.freighterTurret = {
		normal:		{
			spriteFrames:		{
				left:		[rootDir + 'freighter-turret-test-1.png'],
				right:		[rootDir + 'freighter-turret-test-1.png']
			},
			ticksPerFrame:		50
		}
	};

	// TODO: adjust some of these to have 44-piece set but only line up with 9 unique tiles

	for(var tile of Game.data.tilepieces) {
		_self['lt-' + tile] = {
			normal:	{
				spriteFrames:		{
					left:		[rootDir + 'lattice-tiles/lt-' + tile + '.png'],
					right:		[]
				},
				ticksPerFrame:		25
			}
		};
	}

	for(var tile of Game.data.tilepieces) {
		_self['rock-' + tile] = {
			normal:	{
				spriteFrames:		{
					left:		[rootDir + 'rock-tiles/rock-' + tile + '.png'],
					right:		[]
				},
				ticksPerFrame:		25
			}
		};
	}

	return _self;
}());
