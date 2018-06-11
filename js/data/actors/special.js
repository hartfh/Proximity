var special = {};

special['text'] = {};

var textExemplar = {
	actor:		{
		indestructible:	true,
		type:			'effect',
		battlecries:		[],
		behaviors:		[],
		deathrattles:		[]
	},
	body:		{
		parts:	{
			structures:	[
				{shape: 'rectangle', x: 0, y: 0, width: 10, height: 10, options: {density: 1}}
			],
			sensors:		[],
			ornaments:	[]
		},
		options:	{
		},
		zindex:	'text',
		custom:	{
			ignoresVicinity:	true
		}
	}
};

var riserText = Utilities.clone(textExemplar);
riserText.actor.battlecries.push({name: 'thrust', force: 0.1});
riserText.actor.behaviors.push({name: 'thrust', force: 0.0025});
riserText.actor.behaviors.push({name: 'expire', delay: 80});
special['text']['riser'] = riserText;

special['text']['sinker'] = {};
special['text']['static'] = {};

// this actor somehow follows actor that created it. Create a temporary tracking event that sync positions
var pinnedText = Utilities.clone(textExemplar);
special['text']['pinned'] = pinnedText;


special['cursor'] = {
	actor:		{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'detector'
	},
	body:	{
		parts:	{
			structures:	[
				{
					x:		0,
					y:		0,
					width:	26,
					height:	26,
					shape:	'rectangle',
					//sprite:	'vendorOne'
				}
			],
			sensors:		[
				/*
				{
					x:		0,
					y:		0,
					width:	56,
					height:	56,
					shape:	'rectangle',
					types:	['detector'],
					reset:	50
				}
				*/
			],
			ornaments:	[]
		},
		options:	{
			isStatic:		true
		},
		zindex:	'super-ui-1',
		custom:	{
			ignoresVicinity:	true,
			noActor:			true
		}
	}
};

special.filler = {
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
					x:		0,
					y:		0,
					width:	Constants.TERRAIN_TILE_SIZE,
					height:	Constants.TERRAIN_TILE_SIZE,
					shape:	'rectangle'
				}
			],
			sensors:		[],
			ornaments:	[]
		},
		options:	{
			isStatic:		true
		},
		zindex:	'terrain',
		custom:	{}
	}
};

special['horz-viewport-sensor'] = {
	actor:		{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain'
	},
	body:		{
		parts:	{
			structures:	[
				{shape: 'rectangle', x: 0, y: 0, width: (3 * Constants.AREA_TILE_SIZE_X * Constants.TERRAIN_TILE_SIZE), height: 10}
			],
			sensors:		[
				//{types: ['annihilating']}
				//{types: ['freezing'], shape: 'rectangle', x: 0, y: 0, width: (3 * Constants.AREA_TILE_SIZE * Constants.TERRAIN_TILE_SIZE), height: 10, reset: 400}
			],
			ornaments:	[
				//{shape: 'rectangle', x: 0, y: 0, width: 2, height: 2}
			]
		},
		options:	{
			isStatic:		true
		},
		zindex:	'effect',
		custom:	{
			ignoresVicinity:	true,
			noActor:			true
		}
	}
};

special['vert-viewport-sensor'] = {
	actor:		{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain'
	},
	body:		{
		parts:	{
			structures:	[
				{shape: 'rectangle', x: 0, y: 0, width: 10, height: (3 * Constants.AREA_TILE_SIZE_Y * Constants.TERRAIN_TILE_SIZE)}
			],
			sensors:		[
				//{types: ['annihilating']}
				//{types: ['freezing'], shape: 'rectangle', x: 0, y: 0, width: 10, height: (3 * Constants.AREA_TILE_SIZE * Constants.TERRAIN_TILE_SIZE), reset: 400}
			],
			ornaments:	[
				//{shape: 'rectangle', x: 0, y: 0, width: 2, height: 2}
			]
		},
		options:	{
			isStatic:		true
		},
		zindex:	'effect',
		custom:	{
			ignoresVicinity:	true,
			noActor:			true
		}
	}
};

module.exports = special;
