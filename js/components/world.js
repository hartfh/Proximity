module.exports = new function() {
	var _self = this;

	function _splitBodies(testBody) {
		var bodies = [];

		switch(testBody.type) {
			case 'body':
				bodies.push(testBody);
				break;
			case 'composite':
				bodies = testBody.bodies;
				break;
			default:
				break;
		}

		return bodies;
	}

	function _attachEventHandlers(body) {
		var bodies = _splitBodies(body);

		for(var subBody of bodies) {
			for(var evt of subBody.events) {
				Game.Events.subscribe(evt.name, evt.callback, evt.handle);
			}

			if( subBody.actor ) {
				subBody.actor.setupLoop();
				subBody.actor.setupBattlecries();
				ActorFactory.addActor(subBody.id);
			}
		}
	};

	function _removeEventHandlers(body) {
		var bodies = _splitBodies(body);

		for(var subBody of bodies) {
			for(var evt of subBody.events) {
				Game.Events.unsubscribe(evt.name, evt.handle);
			}

			Game.Events.unsubscribe('tick', 'body-' + subBody.id);
			ActorFactory.removeActor(subBody.id);
		}
	};

	_self.add = function(body) {
		Matter.World.add(Game.Engine.engine.world, body);

		_attachEventHandlers(body);
	};

	_self.remove = function(body) {
		_removeEventHandlers(body);

		Matter.World.remove(Game.Engine.engine.world, body);
	};

	_self.get = function(bodyID, type = 'body') {
		return Matter.Composite.get(Game.Engine.engine.world, bodyID, type);
	};

	_self.all = function() {
		return Matter.Composite.allBodies(Game.Engine.engine.world);
	};

	_self.rebase = function() {
		Matter.Composite.rebase(Game.Engine.engine.world);
	};
};
