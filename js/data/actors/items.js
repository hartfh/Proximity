module.exports = function() {
	var _self = {
		common:		{},
		modifier:		{}, // armor, simple upgrades
		unique:		{}, // weapons? other unique misc. effects
	};

	/*
	_self.common =	{
		powerupOne:	{
			actor:	{
				indestructible:	true,
				payload:			{
					health:		3,
					commonItems:	[
						{type: 'chemical', amount: 20}
					],
					modifierItems:	['laserMaxModifer'],
					uniqueItems:	[],
					fixes:		[], // ailment fixes
					selfDestruct:	true
				},
				deathTimer:		0, // matches length of item "active" sprite animation
				type:			'item',
				battlecries:		[],
				behaviors:		[
					{name: 'nudge', force: 0.0018, angle: -Math.PI * 0.5, delay: 0, duration: 33, interval: 100, id: 'nudge-1'},
					{name: 'nudge', force: 0.0018, angle: Math.PI * 0.5, delay: 50, duration: 33, interval: 100, id: 'nudge-2'},
					{name: 'follow-course', force: 0.005}
				],
				deathrattles:		[]
			},
			body:	{
				parts:	{
					structures:	[
						{
							shape:	'rectangle',
							name:	'item-part-1',
							width:	1,
							height:	1,
							x:		0,
							y:		0,
							options:	{
								density:		12
							}
						}
					],
					sensors:		[
						{types: ['payload'], shape: 'rectangle', x: 0, y: 0, width: 20, height: 20, sprite: false}, // sprite: Data.sprites.powerupOne
					]
				},
				options:		{
					frictionAir:		0.05,
					density:			1
				},
				custom:		{ignoresGravity: true, isLevel: true},
				zindex:		'item'
			}
		}
	};
	*/

	var itemExemplar = {
			actor:	{
				indestructible:	true,
				payload:			{
					health:		false,
					commonItems:	[],
					modifierItems:	[],
					uniqueItems:	[],
					fixes:		[], // remove ailments
					selfDestruct:	true,
				},
				deathTimer:		30, // matches length of item "active" sprite animation
				type:			'item',
				battlecries:		[
					//{name: 'modify-body', property: 'ballistic', value: false, delay: 80},
					{name: 'nudge', force: 1, angle: 'random'},
				],
				behaviors:		[
					//{name: 'nudge', force: 0.0018, angle: -Math.PI * 0.5, delay: 0, duration: 40, interval: 100, id: 'nudge-1'},
					//{name: 'nudge', force: 0.0018, angle: Math.PI * 0.5, delay: 50, duration: 40, interval: 100, id: 'nudge-2'},
				],
				deathrattles:		[],
			},
			body:	{
				parts:	{
					structures:	[],
					sensors:		[
						{types: ['payload'], shape: 'rectangle', x: 0, y: 0, width: 22, height: 22, sprite: false},
					],
					ornaments:	[
						{
							shape:	'rectangle',
							name:	'item-part-1',
							width:	1,
							height:	1,
							x:		0,
							y:		0,
							options:	{
								density:		12
							},
						},
						{
							shape:	'rectangle',
							name:	'item-sprite',
							width:	22,
							height:	22,
							x:		0,
							y:		0,
							options:	{
								density:		0.01
							},
						}
					]
				},
				options:		{
					frictionAir:		0.3,
					density:			1,
				},
				custom:		{isLevel: true, isBallistic: false},
				zindex:		'item',
			}
	};

	// Money
	var monies = [5, 10, 25, 50];
	for(var i = 0; i < monies.length; i++) {
		var index = i + 1;
		_self.common['money-' + index] = Utilities.clone(itemExemplar);
		_self.common['money-' + index].actor.payload.commonItems.push({type: 'money', amount: monies[i]});
		//_self.common['money-' + index].actor.deathrattles.push({name: 'play-sfx', interval: 30, sound: 'expl1sound'});
		_self.common['money-' + index].body.parts.ornaments[1].sprite = 'money-' + index;
	}

	// Health
	var healths = [5, 10, 25, 50];
	for(var i = 0; i < healths.length; i++) {
		var index = i + 1;
		_self.common['health-' + index] = Utilities.clone(itemExemplar);
		_self.common['health-' + index].actor.payload.health = healths[i];
		//_self.common['health-' + index].actor.deathrattles.push({name: 'play-sfx', interval: 30, sound: 'expl1sound'});
		_self.common['health-' + index].body.parts.ornaments[1].sprite = 'health-' + index;
	}

	var ammoAmounts = [20, 50, 100, 500];
	var ammoTypes = ['energy', 'chemical', 'kinetic', 'explosive'];
	for(var i = 0; i < ammoAmounts.length; i++) {
		var index = i + 1;
		var amount = ammoAmounts[i];

		ammoTypes.forEach(function(type, j) {
			//var type = ammoTypes[i];
			var name = `${type}-${index}`;

			_self.common[name] = Utilities.clone(itemExemplar);
			_self.common[name].actor.payload.commonItems.push({type: type, amount: amount});
			//_self.common[name].actor.deathrattles.push({name: 'play-sfx', interval: 30, sound: 'expl1sound'});
			_self.common[name].body.parts.ornaments[1].sprite = name;
		});
	}

	//_self.modifier.laserMaxModItem = Utilities.clone(itemExemplar);
	//_self.modifier.laserMaxModItem.actor.payload.modifierItems.push('laserMaxModifer');


	return _self;
}();
