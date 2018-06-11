var obstacles = {};

obstacles = require('./obstacles-buildings-1')(obstacles);
obstacles = require('./obstacles-guard-rails')(obstacles);
obstacles = require('./obstacles-parked')(obstacles);
obstacles = require('./obstacles-traffic')(obstacles);

/*
obstacles['traffic-light-1'] = {
	actor:		{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain',
	},
	body:		{
		parts:	{
			structures:	[
				{
					shape:	'rectangle',
					name:	'light-base',
					width:	30,
					height:	13,
					x:		0,
					y:		0,
					sprite:	'empty-temp',
					options:	{
						density:		0.05,
					},
				},
			],
			sensors:		[],
			ornaments:	[
				{
					shape:	'rectangle',
					name:	'light-extension',
					width:	274,
					height:	133,
					x:		-122,
					y:		-60,
					sprite:	'traffic-light-1',
					options:	{
						density:		0.05,
						zindex:		'doodad-fg-2'
					},
				},
			],
		},
		options:	{
			isStatic:		true
		},
		zindex:	'doodad-fg-2',
		custom:	{noActor: true},
	}
};
*/

/*
obstacles['street-sign-test'] = {
	actor:		{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain',
	},
	body:		{
		parts:	{
			structures:	[
				{
					shape:	'rectangle',
					name:	'light-base',
					width:	10,
					height:	14,
					x:		0,
					y:		0,
					//sprite:	'',
					options:	{
						density:		0.05,
					},
				},
			],
			sensors:		[],
			ornaments:	[
				{
					shape:	'rectangle',
					name:	'light-extension',
					width:	8,
					height:	40,
					x:		0,
					y:		-27,
					//sprite:	'',
					options:	{
						density:		0.05,
						zindex:		'doodad-fg-2'
					},
				},
				{
					shape:	'rectangle',
					name:	'light-shadow',
					width:	8,
					height:	40,
					x:		0,
					y:		27,
					//sprite:	'',
					options:	{
						density:		0.05,
						zindex:		'doodad-bg-1'
					},
				},
			],
		},
		options:	{
			isStatic:		true
		},
		zindex:	'doodad-fg-2',
		custom:	{noActor: true},
	}
};
*/

// left
obstacles['streetlight-0'] = {
	actor:	{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain',
	},
	body:	{
		parts:	{
			structures:	[
				{
					shape:	'rectangle',
					name:	'base',
					width:	14,
					height:	11,
					x:		0,
					y:		0,
					sprite:	'streetlight-0-v0-p1',
				}
			],
			sensors:		[],
			ornaments:	[
				{
					shape:	'rectangle',
					name:	'pole',
					width:	56,
					height:	82,
					x:		-21,
					y:		-46,
					sprite:	'streetlight-0-v0-p0',
				},
				{
					shape:	'rectangle',
					name:	'light-ray',
					width:	61,
					height:	90,
					x:		-28,
					y:		-31,
					sprite:	'streetlight-0-v0-p2',
				},
				{
					shape:	'rectangle',
					name:	'light-floor',
					width:	61,
					height:	36,
					x:		-28,
					y:		-4,
					sprite:	'streetlight-0-v0-p3',
					options:	{
						zindex:		'doodad-bg-1'
					},
				},
			]
		},
		options:	{
			isStatic:		true
		},
		zindex:	'doodad-fg-2',
		custom:	{noActor: true},
	}
};

// up
obstacles['streetlight-1'] = {
	actor:	{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain',
	},
	body:	{
		parts:	{
			structures:	[
				{
					shape:	'rectangle',
					name:	'base',
					width:	14,
					height:	11,
					x:		0,
					y:		0,
					sprite:	'streetlight-3-v0-p1'
				},
			],
			sensors:		[],
			ornaments:	[
				{
					shape:	'rectangle',
					name:	'pole',
					width:	14,
					height:	82,
					x:		0,
					y:		-62,
					sprite:	'streetlight-3-v0-p0',
					options:	{
						//zindex:		'doodad-fg-2'
					},
				},
				{
					shape:	'rectangle',
					name:	'light-ray',
					width:	40,
					height:	96,
					x:		0,
					y:		-42,
					sprite:	'streetlight-3-v0-p2',
					options:	{
						//zindex:		'doodad-fg-2'
					},
				},
				{
					shape:	'rectangle',
					name:	'light-floor',
					width:	40,
					height:	50,
					x:		0,
					y:		-19,
					sprite:	'streetlight-3-v0-p3',
				},
			]
		},
		options:	{
			isStatic:		true
		},
		zindex:	'doodad-fg-2',
		custom:	{noActor: true},
	}
};

// right
obstacles['streetlight-2'] = {
	actor:	{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain',
	},
	body:	{
		parts:	{
			structures:	[
				{
					shape:	'rectangle',
					name:	'base',
					width:	14,
					height:	11,
					x:		0,
					y:		0,
					sprite:	'streetlight-1-v0-p1',
				},
			],
			sensors:		[],
			ornaments:	[
				{
					shape:	'rectangle',
					name:	'pole',
					width:	56,
					height:	82,
					x:		21,
					y:		-46,
					sprite:	'streetlight-1-v0-p0',
				},
				{
					shape:	'rectangle',
					name:	'light-ray',
					width:	61,
					height:	90,
					x:		27,
					y:		-31,
					sprite:	'streetlight-1-v0-p2',
				},
				{
					shape:	'rectangle',
					name:	'light-floor',
					width:	61,
					height:	36,
					x:		27,
					y:		-4,
					sprite:	'streetlight-1-v0-p3',
					options:	{
						zindex:		'doodad-bg-1'
					},
				},
			]
		},
		options:	{
			isStatic:		true
		},
		zindex:	'doodad-fg-2',
		custom:	{noActor: true},
	}
};

// down
obstacles['streetlight-3'] = {
	actor:	{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain',
	},
	body:	{
		parts:	{
			structures:	[
				{
					shape:	'rectangle',
					name:	'base',
					width:	14,
					height:	11,
					x:		0,
					y:		0,
					sprite:	'streetlight-2-v0-p1',
				}
			],
			sensors:		[],
			ornaments:	[
				{
					shape:	'rectangle',
					name:	'pole',
					width:	14,
					height:	82,
					x:		0,
					y:		-46,
					sprite:	'streetlight-2-v0-p0',
					options:	{
						zindex:		'doodad-fg-2'
					},
				},
				{
					shape:	'rectangle',
					name:	'light-ray',
					width:	40,
					height:	96,
					x:		0,
					y:		-3,
					sprite:	'streetlight-2-v0-p2',
					options:	{
						zindex:		'doodad-fg-2'
					},
				},
				{
					shape:	'rectangle',
					name:	'light-floor',
					width:	40,
					height:	50,
					x:		0,
					y:		20,
					sprite:	'streetlight-2-v0-p3',
					options:	{
						zindex:		'doodad-bg-1'
					},
				}
			]
		},
		options:	{
			isStatic:		true
		},
		zindex:	'doodad-fg-2',
		custom:	{noActor: true},
	}
};

obstacles['concrete-barricade-corner-0'] = {
	actor:		{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain',
	},
	body:		{
		parts:	{
			structures:	[
				{
					shape:	'rectangle',
					name:	'piece-2',
					width:	21,
					height:	19,
					x:		10,
					y:		-18,
					sprite:	'concrete-barricade-corner-0-v0-p2',
				},
				{
					shape:	'rectangle',
					name:	'piece-3',
					width:	42,
					height:	16,
					x:		0,
					y:		0,
					sprite:	'concrete-barricade-corner-0-v0-p3',
				}
			],
			sensors:		[],
			ornaments:	[
				{
					shape:	'rectangle',
					name:	'piece-1',
					width:	21,
					height:	18,
					x:		-11,
					y:		-17,
					sprite:	'concrete-barricade-corner-0-v0-p1',
				},
				{
					shape:	'rectangle',
					name:	'piece-0',
					width:	21,
					height:	16,
					x:		10,
					y:		-35,
					sprite:	'concrete-barricade-corner-0-v0-p0',
				}
			]
		},
		options:	{
			isStatic:		true
		},
		zindex:	'doodad-fg-2',
		custom:	{noActor: true},
	}
};

obstacles['concrete-barricade-corner-1'] = {
	actor:		{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain',
	},
	body:		{
		parts:	{
			structures:	[
				{
					shape:	'rectangle',
					name:	'piece-1',
					width:	21,
					height:	19,
					x:		-11,
					y:		-18,
					sprite:	'concrete-barricade-corner-1-v0-p1',
				},
				{
					shape:	'rectangle',
					name:	'piece-3',
					width:	42,
					height:	16,
					x:		0,
					y:		0,
					sprite:	'concrete-barricade-corner-1-v0-p3',
				},
			],
			sensors:		[],
			ornaments:	[
				{
					shape:	'rectangle',
					name:	'piece-2',
					width:	21,
					height:	18,
					x:		10,
					y:		-17,
					sprite:	'concrete-barricade-corner-1-v0-p2',
				},
				{
					shape:	'rectangle',
					name:	'piece-0',
					width:	21,
					height:	16,
					x:		-11,
					y:		-35,
					sprite:	'concrete-barricade-corner-1-v0-p0',
				},
			]
		},
		options:	{
			isStatic:		true,
		},
		zindex:	'doodad-fg-2',
		custom:	{noActor: true},
	}
};

obstacles['concrete-barricade-corner-2'] = {
	actor:		{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain',
	},
	body:		{
		parts:	{
			structures:	[
				{
					shape:	'rectangle',
					name:	'piece-1',
					width:	21,
					height:	29,
					x:		-10,
					y:		6,
					sprite:	'concrete-barricade-corner-2-v0-p1',
				},
				{
					shape:	'rectangle',
					name:	'piece-2',
					width:	21,
					height:	16,
					x:		11,
					y:		0,
					sprite:	'concrete-barricade-corner-2-v0-p2',
				},
			],
			sensors:		[],
			ornaments:	[
				{
					shape:	'rectangle',
					name:	'piece-0',
					width:	42,
					height:	18,
					x:		1,
					y:		-17,
					sprite:	'concrete-barricade-corner-2-v0-p0',
				},
			]
		},
		options:	{
			isStatic:		true,
		},
		zindex:	'doodad-fg-2',
		custom:	{noActor: true},
	}
};

obstacles['concrete-barricade-corner-3'] = {
	actor:		{
		inert:			true,
		indestructible:	true,
		payload:			{},
		type:			'terrain',
	},
	body:		{
		parts:	{
			structures:	[
				{
					shape:	'rectangle',
					name:	'piece-2',
					width:	21,
					height:	29,
					x:		10,
					y:		6,
					sprite:	'concrete-barricade-corner-3-v0-p2',
				},
				{
					shape:	'rectangle',
					name:	'piece-1',
					width:	21,
					height:	16,
					x:		-11,
					y:		0,
					sprite:	'concrete-barricade-corner-3-v0-p1',
				}
			],
			sensors:		[],
			ornaments:	[
				{
					shape:	'rectangle',
					name:	'piece-0',
					width:	42,
					height:	18,
					x:		0,
					y:		-17,
					sprite:	'concrete-barricade-corner-3-v0-p0',
				}
			],
		},
		options:	{
			isStatic:		true,
		},
		zindex:	'doodad-fg-2',
		custom:	{noActor: true},
	}
};

for(var v = 0; v < 3; v++) {
	obstacles['concrete-barricade-pipe-0-v' + v] = {
		actor:		{
			inert:			true,
			indestructible:	true,
			payload:			{},
			type:			'terrain',
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'piece-1',
						width:	21,
						height:	45,
						x:		0,
						y:		0,
						sprite:	'concrete-barricade-pipe-0-v' + v + '-p1',
					},
				],
				sensors:		[],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'piece-0',
						width:	21,
						height:	13,
						x:		0,
						y:		-29,
						sprite:	'concrete-barricade-pipe-0-v' + v + '-p0',
					},
				],
			},
			options:	{
				isStatic:		true,
			},
			zindex:	'doodad-fg-2',
			custom:	{noActor: true},
		}
	};
}

for(var v = 0; v < 3; v++) {
	obstacles['concrete-barricade-pipe-1-v' + v] = {
		actor:		{
			inert:			true,
			indestructible:	true,
			payload:			{},
			type:			'terrain',
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'piece-1',
						width:	49,
						height:	16,
						x:		0,
						y:		0,
						sprite:	'concrete-barricade-pipe-1-v' + v + '-p1',
					},
				],
				sensors:		[],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'piece-0',
						width:	49,
						height:	19,
						x:		0,
						y:		-17.5,
						sprite:	'concrete-barricade-pipe-1-v' + v + '-p0',
					},
				]
			},
			options:	{
				isStatic:		true,
			},
			zindex:	'doodad-fg-2',
			custom:	{noActor: true},
		}
	};
}

module.exports = obstacles;
