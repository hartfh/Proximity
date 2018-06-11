var destructibles = {};

// Destructibles
var destructibleExemplar = {
	actor:		{
		type:			'vehicle',
		behaviors:		[],
		deathrattles:		[], // explode when dead?
	},
	body:		{
		parts:	{
			structures:	[
				{
					shape:	'rectangle',
					name:	'solid',
					x:		0,
					y:		-10,
					width:	25,
					height:	25,
					options:	{
						density:		5
					}
				}
			],
			sensors:		[],
			ornaments:	[
				{
					shape:	'rectangle',
					name:	'extension',
					width:	50,
					height:	50,
					options:	{
						zindex:		'doodad-fg-2'
					}
				}
			]
		},
		options:	{
			frictionAir:		0.4,
			frictionStatic:	0.4,
			isStatic:			true
		},
		zindex:	'doodad-bg-1',
		custom:	{},
	}
};

var data = [
	{
		name:			'barrel-1',
		ornamentWidth:		24,
		ornamentHeight:	42,
	},
	{
		name:			'boxes-1',
		ornamentWidth:		23,
		ornamentHeight:	37,
	},
	{
		name:			'boxes-2',
		ornamentWidth:		33,
		ornamentHeight:	42,
	},
	{
		name:			'boxes-3',
		ornamentWidth:		27,
		ornamentHeight:	46,
	},
	{
		name:			'crate-1',
		ornamentWidth:		40,
		ornamentHeight:	53,
	},
	{
		name:			'crate-2',
		ornamentWidth:		44,
		ornamentHeight:	54,
	},
	{
		name:			'crate-3',
		ornamentWidth:		33,
		ornamentHeight:	41,
	},
	{
		name:			'junk-1',
		ornamentWidth:		42,
		ornamentHeight:	34,
	},
	{
		name:			'tank-1',
		ornamentWidth:		15,
		ornamentHeight:	37,
	},
	{
		name:			'tank-2',
		ornamentWidth:		15,
		ornamentHeight:	37,
	},
	{
		name:			'trashcan-1',
		ornamentWidth:		25,
		ornamentHeight:	38,
	},
	{
		name:			'cardboard-box-2',
		ornamentWidth:		25,
		ornamentHeight:	33,
	},
	{
		name:			'cardboard-box-3',
		ornamentWidth:		30,
		ornamentHeight:	40,
	},
	{
		name:			'cardboard-box-4',
		ornamentWidth:		30,
		ornamentHeight:	35,
	},
];

data.forEach(function(datum) {
	destructibles[datum.name] = Utilities.clone(destructibleExemplar);
	destructibles[datum.name].body.parts.ornaments[0].width = datum.ornamentWidth;
	destructibles[datum.name].body.parts.ornaments[0].height = datum.ornamentHeight;
	destructibles[datum.name].body.parts.ornaments[0].sprite = datum.name;
});


module.exports = destructibles;
