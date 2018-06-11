var Game = Game || {};

Game.data = Game.data || {};

Game.data.actors = Game.data.actors || {};

Game.data.actors.terrain = (function() {
	var _self = {};


	_self.terrainExemplar = {
		actor:		{
			inert:			true,
			indestructible:	true,
			payload:			{},
			type:			'terrain'
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'terrain1',
						width:	Game.constants.config.TERRAIN_TILE_SIZE,
						height:	Game.constants.config.TERRAIN_TILE_SIZE,
						//sprites:	{},
						options:	{}
					}
				],
				sensors:		[]
			},
			options:	{
				isStatic:		true
			},
			zindex:	'terrain',
			custom:	{}
		}
	};

	// TEMPORARY..?
	var samples = [
		'rock-bend-0',
		'rock-bend-1',
		'rock-bend-2',
		'rock-bend-3',
		'rock-corner-0',
		'rock-corner-1',
		'rock-corner-2',
		'rock-corner-3',
		'rock-cross-0',
		'rock-edge-0',
		'rock-edge-1',
		'rock-edge-2',
		'rock-edge-3',
		'rock-edgetee-0',
		'rock-edgetee-1',
		'rock-edgetee-2',
		'rock-edgetee-3',
		'rock-elbow-0',
		'rock-elbow-1',
		'rock-elbow-2',
		'rock-elbow-3',
		'rock-eight-0',
		'rock-eight-1',
		'rock-end-0',
		'rock-end-1',
		'rock-end-2',
		'rock-end-3',
		'rock-kayleft-0',
		'rock-kayleft-1',
		'rock-kayleft-2',
		'rock-kayleft-3',
		'rock-kayright-0',
		'rock-kayright-1',
		'rock-kayright-2',
		'rock-kayright-3',
		'rock-inside-0',
		'rock-island-0',
		'rock-pipe-0',
		'rock-pipe-1',
		'rock-tee-0',
		'rock-tee-1',
		'rock-tee-2',
		'rock-tee-3',
		'rock-wye-0',
		'rock-wye-1',
		'rock-wye-2',
		'rock-wye-3'
	];

	for(var i in samples) {
		var sample = samples[i];

		_self[sample] = Game.utilities.clone( _self.terrainExemplar );
		//_self[sample].body.parts.structures[0].sprites = Game.data.sprites[sample];

	}

	return _self;
}());
