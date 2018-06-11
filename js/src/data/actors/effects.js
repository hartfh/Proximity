var Game = Game || {};

Game.data = Game.data || {};

Game.data.actors = Game.data.actors || {};

Game.data.actors.effects = (function() {
	var _self = {};

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
						sprites:	Game.data.sprites.explosionSmall
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
}());
