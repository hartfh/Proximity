module.exports = new function() {
	var _self = this;

	function _checkArguments(name, x, y) {
		if( name != '' ) {
			if( typeof(x) == 'number' ) {
				if( typeof(y) == 'number' ) {
					return true;
				}
			}
		}

		return false;
	}

	_self.create = function(effectName = '', xPos = false, yPos = false, options = {}) {
		if( _checkArguments(effectName, xPos, yPos) ) {
			var effectsData	= Data.effects[effectName];
			var sound			= effectsData.sound;
			var actor			= effectsData.actor;
			var actors		= effectsData.actors || [];
			var randActor		= effectsData.randActor || [];
			var allActors;

			if( randActor.length > 0 ) {
				allActors = [randActor.random()];
			} else {
				allActors = [actor, ...actors];
			}

			for(var actorName of allActors) {
				var composite = ActorFactory.create('neutral', ['effects', actor], xPos, yPos);

				if( composite ) {
					Game.World.add(composite);
				}
			}

			if( typeof(options.sound) != 'undefined' ) {
				sound = options.sound;
			}

			if( sound ) {
				Game.Audio.MenuEffects.playTrack(sound);
			}
			/*
			if( shake ) {
				// do shake of provided name
			}
			*/
		}
	};
};
