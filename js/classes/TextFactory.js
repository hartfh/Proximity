var Display = require('../components/display');

module.exports = new function() {
	var _self		= this;
	var _rotation	= Math.PI * -0.5;

	_self.create = function(color = 'white', name = 'static', textContent = [''], xPos = 0, yPos = 0, widthOverride = 0, heightOverride = 0) {
		if( typeof(textContent) == 'string' ) {
			textContent = [textContent];
		}

		var width		= widthOverride || 70;
		var height	= heightOverride || 40;

		var body		= ActorFactory.create('neutral', ['special', 'text', name], xPos, yPos, {rotate: _rotation});

		var args = {
			position:		{x: body.position.x, y: body.position.y},
			width:		width,
			height:		height,
			//layer:		'battlefield-text'
			layer:		'cursor'
		};

		var created = Game.Interface.addUIBox('actor-text-' + body.id, args);

		var displayArgs = {
			width:	width,
			height:	height,
			config:	{
				//inside:	{image: 'blue'},
				text:	{
					content:		textContent,
					color:		color,
					alignment:	'center'
				}
			}
		};

		created.box.addDisplay(displayArgs);

		body.actor.connectUIBox('body-' + body.id + '-ui', created.box);

		return body;
	};
};
