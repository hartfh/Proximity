module.exports = new function() {
     //const ENEMY_CHANCE	= 0.5;
     //const ENEMY_TARGET	= 230;
	const ENEMY_CHANCE		= 0.1;
     const ENEMY_TARGET		= 55;
     //const NPC_CHANCE = 0.5;
     //const NPC_TARGET = 10;
     const VENDOR_CHANCE		= 0.2;
     const VENDOR_TARGET		= 230;
	const DESTRUCT_CHANCE	= 0.2;
	const DESTRUCT_TARGET	= 150;

     var _self			= this;
     var _characters	= {};

	_self.reset = function() {
		_init();
	};

     function _init() {
          _characters = {
               'enemy':  {
                    chance:	ENEMY_CHANCE,
                    current:	0,
                    target:	ENEMY_TARGET,
               },
			'destructible':	{
				chance:	DESTRUCT_CHANCE,
                    current:	0,
                    target:	DESTRUCT_TARGET,
			},
			/*
               'npc':    {
                    chance:	NPC_CHANCE,
                    current:	0,
                    target:	NPC_TARGET
               },
			*/
			/*
               'vendor': {
                    chance:	VENDOR_CHANCE,
                    current:	0,
                    target:	VENDOR_TARGET
               }
			*/
          };
     }

	function _checkAmounts(areaCoordinates, profiles) {
		for(var i in areaCoordinates) {
               var area = areaCoordinates[i];

			// Convert area coordinates into a min and max bounds for MapGrid
			var mapGridBounds = {
				min:	{
					x:	area.x * Constants.AREA_TILE_SIZE_X,
					y:	area.y * Constants.AREA_TILE_SIZE_Y
				},
				max:	{
					x:	( (area.x + 1) * Constants.AREA_TILE_SIZE_X) - 1,
					y:	( (area.y + 1) * Constants.AREA_TILE_SIZE_Y) - 1
				}
			};

               for(var group in _characters) {
                    var charData = _characters[group];

                    // Compare target and current values, then check chance to spawn
                    if( charData.current < charData.target ) {
                         if( Math.random() < charData.chance ) {
						for(var n = 0; n < 3; n++) {
							_inject(profiles, group, mapGridBounds);
						}
                         }
                    }
               }
          }
	}

	function _inject(profiles, group, mapGridBounds) {
		// Need to temporarily flag MapGrid coordinates as filled when a character has been placed there, even before it has been spawned

		// Get array of free points then choose one at random
		var freePoints	= Game.MapGrid.getFreePoints(mapGridBounds);

		if( freePoints.length > 0 ) {
			var randIndex	= Math.floor( Math.random() * freePoints.length );
			var randPoint	= freePoints[randIndex];

			// Randomly choose a troupe based on group type
	          var troupeName = Utilities.getRandomObjectProperty( Data.troupes[group] );

			// Construct a save profile and add it to "profiles" data
			var saveProfile = {
				x:		(randPoint.x + 0.5) * Constants.TERRAIN_TILE_SIZE,
				y:		(randPoint.y + 0.5) * Constants.TERRAIN_TILE_SIZE,
				type:	'tp',
				name:	troupeName,
				group:	group
			};
			profiles.push(saveProfile);

			Game.MapGrid.fillPoint(randPoint.x, randPoint.y);

			// This gets done here, rather than in the troupe, so the Spawner can update its values before the troupe has actually been instantiated
			_self.registerSpawn(group);
		}
	}

     function _cull(profiles) {
          // Randomly remove some profiles
          var keepableProfiles = [];

          for(var profile of profiles) {
               if( Math.random() > 0.35 && profile.despawnable ) {
                    keepableProfiles.push(profile);
               } else {
                    _self.registerDespawn(profile.group);
               }
          }

          return keepableProfiles;
     }

     _self.despawn = function(profiles) {
		// Unset profiles from MapGrid
		for(var profile of profiles) {
			var mapGridPos = Game.MapGrid.convertPosition({x: profile.x, y: profile.y});

			Game.MapGrid.freePoint(mapGridPos.x, mapGridPos.y);
		}

          // Select some random profiles to not be saved
          profiles = _cull(profiles);

          Game.TaskManager.createTask('set-tiles', {profiles: profiles});
     };

	function _spawnImmovables(areas, profiles = [], forceFastSpawn = false) {
		var immovableProfiles	= [];
		var movableProfiles		= [];

		// loop and sort
		for(var profile of profiles) {
			if( profile.type == 'tp' ) {
				movableProfiles.push(profile);
			} else {
				immovableProfiles.push(profile);
			}
		}

		Game.Throttler.spawn(immovableProfiles, function() {
			_spawnMovables(areas, movableProfiles);
		}, forceFastSpawn);
	}

	function _spawnMovables(areas, profiles, forceFastSpawn = false) {
		// Possibly inject additional enemies, NPC, etc. into profiles
		_checkAmounts(areas, profiles);

		Game.Throttler.spawn(profiles, function(){}, forceFastSpawn);
	}

     _self.spawn = function(areas, profiles, forceFastSpawn = false) {
		_spawnImmovables(areas, profiles, forceFastSpawn);
     };

     _self.registerSpawn = function(group) {
          _characters[group].current++;

          // Ensure "current" doesn't overflow "target" amount
          if( _characters[group].current > _characters[group].target ) {
               _characters[group].current = _characters[group].target;
          }
     };

     /**
      *
      *
      *
      */
     _self.registerDespawn = function(group) {
          _characters[group].current--;

          // Ensure "current" doesn't drop below zero
          if( _characters[group].current < 0 ) {
               _characters[group].current = 0;
          }
     };

	_init();
}
