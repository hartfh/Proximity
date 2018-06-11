module.exports = function(group) {
     var parkedCarHorz = {
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
						name:	'car-solid',
						width:	90,
						height:	40,
						types:	[],
						options:	{}
					}
                    ],
				sensors:		[],
				ornaments:	[
                         {
						shape:	'rectangle',
						name:	'car-visual',
						width:	110,
						height:	56,
						types:	[],
						//sprite:	'',
						options:	{}
					}
				],
			},
			options:	{
				isStatic:		true
			},
			zindex:	'doodad-fg-2',
			custom:	{noActor: true},
		}
     };

     var parkedCarVert = {
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
						name:	'car-solid',
						width:	40,
						height:	80,
						types:	[],
						options:	{}
					}
                    ],
				sensors:		[],
				ornaments:	[
                         {
						shape:	'rectangle',
						name:	'car-visual',
						width:	50,
						height:	90,
						types:	[],
						//sprite:	'',
						options:	{}
					}
				],
			},
			options:	{
				isStatic:		true
			},
			zindex:	'doodad-fg-2',
			custom:	{noActor: true},
		}
     };

     function createCarObstacle(name) {
          group[name + '-n'] = Utilities.clone(parkedCarVert);
          group[name + '-e'] = Utilities.clone(parkedCarHorz);
          group[name + '-s'] = Utilities.clone(parkedCarVert);
          group[name + '-w'] = Utilities.clone(parkedCarHorz);

          group[name + '-n'].body.parts.ornaments[0].sprite = name + '-n';
          group[name + '-e'].body.parts.ornaments[0].sprite = name + '-e';
          group[name + '-s'].body.parts.ornaments[0].sprite = name + '-s';
          group[name + '-w'].body.parts.ornaments[0].sprite = name + '-w';
     }

     createCarObstacle('parked-car-0');

	return group;
};
