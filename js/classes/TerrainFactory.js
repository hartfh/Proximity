module.exports = new function() {
	var _self = this;

	_self.create = function(name, tile, rotations, variation, xPos, yPos) {
		var body = ActorFactory.create('neutral', ['terrain', tile, rotations], xPos, yPos);

		// Add sprite data according to name, rotations and variation
		var spriteLookup	= name + '-' + tile + '-' + rotations + '-v' + variation;
		var spriteData		= Data.sprites[spriteLookup];

		if( spriteData ) {
			for(var part of body.parts) {
				if( !part.parent ) {
					continue;
				}

				part.hasFrames		= true;
				part.staticFrames	= true;
				part.render.sprite.texture = spriteData.normal.spriteFrames.e.frames[0];

				Matter.Body.setFrames(part, spriteData);
			}
		}

		return body;
	};
};
