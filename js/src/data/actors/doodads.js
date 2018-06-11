var Game = Game || {};

Game.data = Game.data || {};

Game.data.actors = Game.data.actors || {};

Game.data.actors.doodads = (function() {
	var _self = {};

	_self.liquidExemplar = {
		actor:		{
			inert:			true,
			indestructible:	true,
			behaviors:		[
				{name: 'afflict', interval: 20}
			],
			type:			'doodad'
		},
		body:		{
			parts:	{
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'terrain1',
						width:	Game.constants.config.TERRAIN_TILE_SIZE,
						height:	Game.constants.config.TERRAIN_TILE_SIZE,
						sprites:	{},
						options:	{}
					}
				]
			},
			options:	{
				isStatic:		true
			},
			zindex:			'doodad-fg-1',
			custom:	{}
		}
	};

	_self.hazardLiquidExemplar = {
		actor:		{
			inert:			true,
			indestructible:	true,
			payload:			{
				damage:		1
			},
			behaviors:		[
				{name: 'afflict', interval: 20}
			],
			type:			'doodad'
		},
		body:		{
			parts:	{
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'terrain1',
						width:	Game.constants.config.TERRAIN_TILE_SIZE,
						height:	Game.constants.config.TERRAIN_TILE_SIZE,
						sprites:	{},
						options:	{}
					}
				]
			},
			options:	{
				isStatic:		true
			},
			zindex:			'doodad-fg-1',
			custom:	{}
		}
	};

	_self.spikesExemplar = {
		actor:		{
			inert:			true,
			indestructible:	true,
			payload:			{
				damage:		10,
				force:		10
			},
			type:			'doodad'
		},
		body:		{
			parts:	{
				structures:	[
					/*
					// smaller solid component that is not visible
					{
						shape:	'rectangle',
						name:	'spikes1',
						width:	Game.constants.config.TERRAIN_TILE_SIZE - 8,
						height:	Game.constants.config.TERRAIN_TILE_SIZE - 8,
						x:		0,
						y:		0,
						sprites:	{}
					}
					*/
				],
				sensors:	[
					{
						shape:	'rectangle',
						name:	'spikes2',
						width:	Game.constants.config.TERRAIN_TILE_SIZE,
						height:	Game.constants.config.TERRAIN_TILE_SIZE,
						x:		0,
						y:		0,
						sprites:	{}
					}
				]
			},
			options:	{
				isStatic:		true
			},
			zindex:			'doodad-fg-1',
			custom:	{}
		}
	};

	_self.latticeExemplar = {
		actor:		{
			inert:			true,
			indestructible:	true,
			payload:			{},
			type:			'doodad'
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'terrain1',
						width:	Game.constants.config.TERRAIN_TILE_SIZE,
						height:	Game.constants.config.TERRAIN_TILE_SIZE,
						sprites:	{},
						options:	{}
					}
				],
				sensors:		[]
			},
			options:	{
				isStatic:		true
			},
			zindex:			'doodad-bg-1',
			custom:	{}
		}
	};

	for(var tile of Game.data.tilepieces) {
		_self['lt-' + tile] = Game.utilities.clone(_self.latticeExemplar);
		_self['lt-' + tile].body.parts.structures[0].sprites = Game.data.sprites['lt-' + tile];
	}

	return _self;
}());
