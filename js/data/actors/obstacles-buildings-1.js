module.exports = function(group) {
     for(let i = 1; i < 5; i++) {
          group[`placeholder-shanty-${i}`] = {
               actor:		{
                    inert:			true,
                    indestructible:	true,
                    type:			'groundcover',
               },
               body:		{
                    parts:	{
                         structures:	[
                              {
                                   shape:	'rectangle',
                                   name:	'building-solid',
                                   width:	72,
                                   height:	72,
                                   y:        36,
                                   types:	[],
                                   options:	{},
                              },
                         ],
                         sensors:		[],
                         ornaments:	[
                              {
                                   shape:	'rectangle',
                                   name:	'building-visual',
                                   width:	72,
                                   height:	144,
                                   types:	[],
                                   sprite:	`building-placeholder-shanty-${i}`,
                                   options:	{},
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

	group['building-set-1-purple-0'] = {
		actor:		{
			inert:			true,
			indestructible:	true,
			type:			'groundcover',
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'building-solid',
						width:	211,
						height:	96,
						y:		19,
						types:	[],
						options:	{},
					},
				],
				sensors:		[],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'building-visual',
						width:	215,
						height:	157,
						y:		-8,
						types:	[],
						sprite:	'building-set-1-purple-0',
						options:	{},
					},
					{
						shape:	'rectangle',
						name:	'building-ground',
						width:	217,
						height:	69,
						x:		-4,
						y:		43,
						types:	[],
						sprite:	'building-set-1-purple-0-shadow',
						options:	{zindex: 'doodad-bg-2'},
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

	group['building-set-1-purple-1'] = {
		actor:		{
			inert:			true,
			indestructible:	true,
			type:			'groundcover',
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'building-solid',
						width:	134,
						height:	107,
						x:		15,
						y:		49,
						types:	[],
						options:	{},
					},
					{
						shape:	'rectangle',
						name:	'building-solid-2',
						width:	114,
						height:	79,
						x:		-14,
						y:		-54,
						types:	[],
						options:	{},
					},
				],
				sensors:		[],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'building-visual',
						width:	136,
						height:	229,
						//x:		0,
						y:		-7,
						types:	[],
						sprite:	'building-set-1-purple-1',
						options:	{},
					},
					{
						shape:	'rectangle',
						name:	'building-ground',
						width:	140,
						height:	48,
						x:		-5,
						y:		89,
						types:	[],
						sprite:	'building-set-1-purple-1-shadow',
						options:	{zindex: 'doodad-bg-2'},
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

	group['building-set-1-purple-2'] = {
		actor:		{
			inert:			true,
			indestructible:	true,
			type:			'groundcover',
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'building-solid',
						width:	108,
						height:	130,
						x:		-54,
						y:		9,
						types:	[],
						options:	{},
					},
					{
						shape:	'rectangle',
						name:	'building-solid-2',
						width:	96,
						height:	115,
						x:		55,
						y:		5,
						types:	[],
						options:	{},
					},
				],
				sensors:		[],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'building-visual',
						width:	210,
						height:	188,
						y:		-52,
						types:	[],
						sprite:	'building-set-1-purple-2',
						options:	{},
					},
					{
						shape:	'rectangle',
						name:	'building-ground',
						width:	212,
						height:	81,
						x:		-4,
						y:		36,
						types:	[],
						sprite:	'building-set-1-purple-2-shadow',
						options:	{zindex: 'doodad-bg-2'},
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

	group['building-set-1-purple-3'] = {
		actor:		{
			inert:			true,
			indestructible:	true,
			type:			'groundcover',
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'building-solid',
						width:	182,
						height:	119,
						x:		8,
						y:		-7,
						types:	[],
						options:	{},
					},
					{
						shape:	'rectangle',
						name:	'building-solid-2',
						width:	27,
						height:	98,
						x:		-93,
						y:		-15,
						types:	[],
						options:	{},
					},
				],
				sensors:		[],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'building-visual',
						width:	214,
						height:	162,
						y:		-15,
						types:	[],
						sprite:	'building-set-1-purple-3',
						options:	{},
					},
					{
						shape:	'rectangle',
						name:	'building-ground',
						width:	213,
						height:	95,
						x:		-3,
						y:		23,
						types:	[],
						sprite:	'building-set-1-purple-3-shadow',
						options:	{zindex: 'doodad-bg-2'},
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

	group['building-set-1-purple-4'] = {
		actor:		{
			inert:			true,
			indestructible:	true,
			type:			'groundcover',
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'building-solid',
						width:	138,
						height:	116,
						y:		46,
						types:	[],
						options:	{},
					},
					{
						shape:	'rectangle',
						name:	'building-solid-2',
						width:	100,
						height:	56,
						x:		19,
						y:		-36,
						types:	[],
						options:	{},
					},
				],
				sensors:		[],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'building-visual',
						width:	141,
						height:	206,
						y:		-2,
						types:	[],
						sprite:	'building-set-1-purple-4',
						options:	{},
					},
					{
						shape:	'rectangle',
						name:	'building-ground',
						width:	132,
						height:	77,
						x:		-5,
						y:		67,
						types:	[],
						sprite:	'building-set-1-purple-4-shadow',
						options:	{zindex: 'doodad-bg-2'},
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


	group['building-set-1-purple-5'] = {
		actor:		{
			inert:			true,
			indestructible:	true,
			type:			'groundcover',
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'building-solid',
						width:	277,
						height:	145,
						y:		37,
						types:	[],
						options:	{},
					},
				],
				sensors:		[],
				ornaments:	[
					{
						shape:	'rectangle',
						name:	'building-visual',
						width:	280,
						height:	212,
						y:		-1,
						types:	[],
						sprite:	'building-set-1-purple-5',
						options:	{},
					},
					{
						shape:	'rectangle',
						name:	'building-ground',
						width:	283,
						height:	124,
						x:		-5,
						y:		50,
						types:	[],
						sprite:	'building-set-1-purple-5-shadow',
						options:	{zindex: 'doodad-bg-2'},
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

     return group;
};
