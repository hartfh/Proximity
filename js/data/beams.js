module.exports = {
	/*
	------Properties Exemplar------
	accuracy:				1,
	ammo:				''
	drawThrough:			false,
	damage:				1,
	frequency:			1,
	hitEffect:			false,
	ghost:				false,
	maxLength:			700,
	pattern:				function(){},
	sourceEffect:			false,
	startEffect:			false,
	unstoppable:			false,
	warmup:				0
	*/
	'repeater-1':			{
		accuracy:			0.8,
		ammo:			'kinetic',
		damage:			1,
		frequency:		2,
		hitEffect:		'expl1',
		pattern:			'invisible',
		recoil:			0.4,
		sourceEffect:		'thump_echo_1'
	},
	'gatling-1':			{
		accuracy:			0.5,
		ammo:			'kinetic',
		frequency:		1,
		knockback:		1,
		maxLength:		100,
		sourceEffect:		'thump_echo_1',
		warmup:			50
	},
	'nanoscale-laser':		{
		ammo:			'energy',
		frequency:		3,
		hitEffect:		false,
		damage:			2,
		pattern:			'thin-red-line'
	},
	'jade':				{
		ammo:			'energy',
		drawThrough:		true,
		frequency:		5,
		hitEffect:		'expl1',
		damage:			2,
		pattern:			'thick-green-line',
		warmup:			45
	}
};
