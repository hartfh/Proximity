var weather = {};

weather['rain'] = {
	actor:		{
		payload:		{},
		type:		'effect',
		battlecries:	[
			{name: 'thrust', force: 0.73}
		],
		behaviors:	[
			{name: 'expire', delay: 50}
		],
		deathrattles:	[] // splash effect
	},
	body:		{
		parts:	{
			structures:	[
				{
					shape: 'rectangle',
					width:	13,
					height:	1,
					x:		0,
					y:		0,
					options:	{
						density:	2
					},
					sprite:	'rain-drop',
				}
			],
			sensors:		[],
			ornaments:	[]
		},
		options:	{
			frictionAir:		0.0,
			frictionStatic:	0.0
		},
		custom:	{},
		//zindex:	'weather',
		zindex:	'super-ui-1',
	}
};

weather['snow-light'] = {
	// drifts down and to the left
	// high air friction

	// behavior: nudge left
	actor:		{
		payload:		{},
		type:		'effect',
		battlecries:	[
			{name: 'thrust', force: 0.1}
		],
		behaviors:	[
			{name: 'expire', delay: 50},
			{name: 'thrust', force: 0.005},
			{name: 'nudge', force: 0.01, angle: Math.PI, interval: 35, duration: 14},
		],
		deathrattles:	[]
	},
	body:		{
		parts:	{
			structures:	[
				{
					shape: 'rectangle',
					width: 1,
					height: 1,
					x: 0,
					y: 0,
					options:	{
						density:		6
					},
					sprite:	'snow-flake',
				}
			],
			sensors:		[],
			ornaments:	[]
		},
		options:	{
			frictionAir:		0.33,
			frictionStatic:	0.01
		},
		custom:	{},
		//zindex:	'weather',
		zindex:	'super-ui-1',
	}
};

weather['haze-test-1'] = {
	actor:		{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'effect',
		behaviors:		[],
	},
	body:		{
		parts:	{
			structures:	[
				{
					shape: 'rectangle',
					width: 322,
					height: 72,
					x: 0,
					y: 0,
					sprite:	'haze-test-1',
				}
			],
			sensors:		[],
			ornaments:	[],
		},
		custom:	{},
		//custom:	{noActor: true},
		zindex:	'super-ui-1',
	}
};

weather['snow-medium'] = {

};

weather['snow-heavy'] = {
	// similar to light snow but periodically/randomly blown to the left
	// behavior: nudge even more left but less often
};

module.exports = weather;
