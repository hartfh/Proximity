module.exports = function() {
	var _self = {};

	_self['blood-stain-ground'] = {
		// zindex: 'doodad-bg-3'
	};

	_self['blood-stain-wall'] = {
		// zindex: 'doodad-fg-2'
	};

	_self['blood-explosion'] = {
		actor:		{
			payload:		{},
			type:		'effect',
			battlecries:	[],
			behaviors:	[
				{name: 'expire', delay: 200},
			],
			deathrattles:	[]
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape: 'rectangle',
						width: 5,
						height: 5,
						x: 0,
						y: 0
					}
				],
				sensors:		[],
				ornaments:	[]
			},
			options:	{
				isStatic:		true
			},
			custom:	{},
			zindex:	'effect'
		}
	};

	_self['flame-hazard-1'] = {
		actor:		{
			payload:		{
				damage:		10,
				damageType:	'chemical'
			},
			type:		'effect',
			battlecries:	[],
			behaviors:	[
				{name: 'expire', delay: 200},
			],
			deathrattles:	[]
		},
		body:		{
			parts:	{
				structures:	[],
				sensors:		[
					{
						types: ['payload'],
						shape: 'rectangle',
						sensorOptions: {
							reset:	700
						},
						width: 32,
						height: 32,
						x: 0,
						y: 0
					}
				],
				ornaments:	[
					/*
					{
						shape: 'rectangle',
						width: 5,
						height: 5,
						x: 0,
						y: 0
					}
					*/
				]
			},
			options:	{
				isStatic:		true
			},
			custom:	{},
			zindex:	'effect'
		}
	};

	_self.parallaxThing1 = {
		actor:		{
			indestructible:	true,
			classification:	'tracking Actor',
			type:			'effect',
			battlecries:		[],
			behaviors:		[],
			deathrattles:		[]
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						x:		0,
						y: 		0,
						width:	100,
						height:	Constants.VPORT_HEIGHT,
						options:	{
							density:	2
						},
						sprite:	'tilingTest'
					}
				],
				sensors:		[]
			},
			options:		{},
			custom:		{
					isLevel:			true,
					ignoresGravity:	true,
					ignoresVicinity:	true,
					noActor:			true,
					tracker:			{
						min: {y: 0},
						max:	{y: 3}
					}
			},
			zindex:		'doodad-bg-4'
		}
	};

	_self.explLarge = {
		actor:		{
			battlecries:	[],
			behaviors:	[{name: 'expire', delay: 40}],
			deathrattles:	[],
			type:		'effect'
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						x:		0,
						y:		0,
						width:	80,
						height:	80,
						options:	{},
						sprite:	'explLarge'
					}
				],
				sensors:		[]
			},
			options:	{
				isStatic:		true
			},
			custom:	{},
			zindex:	'effect'
		}
	};

	_self.expl1 = {
		actor:		{
			battlecries:	[],
			behaviors:	[{name: 'expire', delay: 40}],
			deathrattles:	[],
			type:		'effect'
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						x:		0,
						y:		0,
						width:	26,
						height:	26,
						options:	{},
						sprite:	'expl1'
					}
				],
				sensors:		[]
			},
			options:	{
				isStatic:		true
			},
			custom:	{},
			zindex:	'effect'
		}
	};

	_self.explosionSmall = {
		actor:		{
			battlecries:	[],
			behaviors:	[{name: 'expire', delay: 75}],
			deathrattles:	[],
			type:		'effect'
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						x:		0,
						y:		0,
						width:	100,
						height:	100,
						options:	{},
						sprite:	'explosionSmall'
					}
				],
				sensors:		[]
			},
			options:	{
				isStatic:		true
			},
			custom:	{},
			zindex:	'effect'
		}
	};

	return _self;
}();
