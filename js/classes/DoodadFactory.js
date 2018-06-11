module.exports = new function() {
	var _self = this;

	_self.create = function(name, parallax = 0, tile = false, rotations = false, variation = false, xPos, yPos) {
		var body = ActorFactory.create('neutral', ['doodads', name], xPos, yPos);

		Matter.Sleeping.set(body, true);

		// Modify sprite data, according to name, rotations and variation
		//var spriteLookup	= name + '-' + tile + '-' + rotations + '-v' + variation;
		var spriteLookup = name;

		if( tile !== false ) {
			spriteLookup += ('-' + tile);
		}
		if( rotations !== false ) {
			spriteLookup += ('-' + rotations);
		}
		if( variation !== false ) {
			spriteLookup += ('-v' + variation);
		}

		var spriteData = Data.sprites[spriteLookup];

		if( spriteData ) {
			body.phantom = true; // TESTING
			for(var part of body.parts) {
				if( !part.parent ) {
					continue;
				}
				part.phantom = true; // TESTING

				part.hasFrames = true;
				part.render.sprite.texture = spriteData.normal.spriteFrames.e.frames[0];

				Matter.Body.setFrames(part, spriteData);
			}
		}

		/*
		if( parallax > 0 ) {
			Matter.Body.setParallax(body, parallax);

			body.actor.parallax = parallax;

			if( parallax == 1 && Game.Tracker.hasObject() ) {
				var position = Game.Tracker.getPosition();
				var shift = {
					x:	position.x * Constants.PARALLAX_1,
					y:	position.y * Constants.PARALLAX_1
				};

				Matter.Body.translate(body, shift);
			}
		}
		*/

		return body;
	};
};
