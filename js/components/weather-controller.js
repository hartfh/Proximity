module.exports = new function() {
	var _self		= this;
	var _enabled	= false;
	var _settings	= {};

	const STRAIGHT_DROP_ROTATION	= Math.PI * 0.505;
	const ANGLED_DROP_ROTATION	= Math.PI * 0.60;
	const VERTICAL_OFFSET		= 20;

	function _resetSettings() {
		_settings	= {
			actorName:	false,
			density:		0,
			bodyConfig:	{},
			filter:		false
		};
	}

	_self.disable = function() {
		if( _enabled ) {
			Game.Events.unsubscribe('tick', 'weather-pattern');

			_resetSettings();

			_enabled = false;
		}
	};

	_self.enable = function(pattern = '') {
		var maxExpire = 50;

		if( !_enabled ) {
			switch(pattern) {
				case 'light-rain':
					_settings.actorName = 'rain';
					_settings.bodyConfig = {rotate: STRAIGHT_DROP_ROTATION};
					_settings.density = 2;
					_enabled = true;
					maxExpire = 55;
					break;
				case 'heavy-rain':
					_settings.actorName = 'rain';
					_settings.bodyConfig = {rotate: ANGLED_DROP_ROTATION};
					_settings.density = 3;
					_enabled = true;
					maxExpire = 55;
					break;
				case 'light-snow':
					_settings.actorName = 'snow-light';
					_settings.bodyConfig = {rotate: STRAIGHT_DROP_ROTATION};
					_settings.density = 2;
					_enabled = true;
					maxExpire = 350;
					break;
				case 'moderate-snow':
					_settings.actorName = 'snow-medium';
					_settings.bodyConfig = {rotate: STRAIGHT_DROP_ROTATION};
					_settings.density = 3;
					_enabled = true;
					maxExpire = 140;
					break;
				case 'heavy-snow':
					_settings.actorName = 'snow-heavy';
					_settings.bodyConfig = {rotate: STRAIGHT_DROP_ROTATION};
					_settings.density = 4;
					_enabled = true;
					maxExpire = 100;
					break;
				case 'default':
					_resetSettings();
					_enabled = false;
					break;
			}

			if( _enabled ) {
				Game.Events.subscribe('tick', _self.createActors, 'weather-pattern');

				_settings.filter = function(data) {
					data.actor.behaviors[0].delay = Math.random() * maxExpire;

					return data;
				};
			}
		}
	};

	_self.createActors = function() {
		var numObjects = _settings.density;

		// Density ranges from 0 - infinite. 0: 0% chance to create an actor, 1: 100% chance. +1: Multiple actors
		if( numObjects < 1 ) {
			if( Math.random() > numObjects ) {
				return;
			}
		}

		for(var i = 0; i < numObjects; i++) {
			var xOffset	= 0;
			var position	= {x: Game.State.viewport.position.x, y: Game.State.viewport.corner.y};

			// Vertical offset
			position.y -= VERTICAL_OFFSET;

			// Horizontal offset (+/-100% viewport width from center)
			xOffset = Math.random() * Constants.VPORT_WIDTH * 0.6;
			xOffset = (Math.random() > 0.5) ? xOffset : -xOffset;

			position.x += xOffset;

			var body = ActorFactory.create('neutral', ['weather', _settings.actorName], position.x, position.y, _settings.bodyConfig, _settings.filter);

			Game.World.add(body);
		}
	};

	_resetSettings();
};
