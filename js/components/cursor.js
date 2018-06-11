module.exports = new function() {
	var _self		= this;
	var _position	= {x: 0, y: 0};
	var _body		= false;

	_self.create = function(createdCallback = function(){}) {
		if( !_body ) {
			_body = ActorFactory.create('neutral', ['special', 'cursor'], _position.x, _position.y);

			if( _body ) {
				Game.World.add(_body);

				createdCallback();
			}
		}
	};

	_self.updatePosition = function(position = {}) {
		_position.x = position.x;
		_position.y = position.y;

		// Move the body to the latest position
		if( _body ) {
			Matter.Body.setPosition(_body, _position);

			/*
			var query = Matter.Query.point(Game.World.all(), _position);

			for(var body of query) {
				for(var part of body.parts) {
					part.render.opacity = 0.2;
				}
			}
			*/
		}
	};

	_self.nudgePosition = function(offset = {}) {
		if( _body ) {
			var updatedPosition = {
				x:	_position.x + (offset.x || 0),
				y:	_position.y + (offset.y || 0)
			};

			Matter.Body.setPosition(_body, updatedPosition);

			_position = updatedPosition;
		}
	};
};
