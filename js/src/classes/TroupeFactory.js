var Game = Game || {};

Game.TroupeFactory = (function() {
	var _self		= this;
	var _position	= {x: 0, y: 0};

	_self.create = function(allegiance, troupeName, xPos, yPos, options = {}) {
		_position.x = xPos;
		_position.y = yPos;

		var composite	= Matter.Composite.create();
		var troupeData = Game.data.troupes[troupeName];
		var config	= troupeData.config || {};
		var troupe	= new Game.Troupe(composite, config);
		var subBodies	= {};
		var leadBody;

		troupe.name = troupeData.name;

		for(var key in troupeData.actors) {
			var actorData		= troupeData.actors[key];
			var actorPos		= {x: _position.x + actorData.position.x, y: _position.y + actorData.position.y};
			var actorConfig	= {};

			if( actorData.rotate ) {
				actorConfig.rotate = actorData.rotate;
			}

			var subBody	= Game.ActorFactory.create(allegiance, actorData.data, actorPos.x, actorPos.y, actorConfig);
			var actor		= subBody.actor;

			subBodies[key] = subBody;

			Matter.Composite.addBody(composite, subBody);

			switch( actorData.role ) {
				case 'lead':
					leadBody = subBody;
					troupe.setLead(actor);
					break;
				case 'link':
					var constraint	= Matter.Constraint.create({
						bodyA:		subBodies[actorData.link],
						pointA:		{x: 0, y: -5},
						bodyB:		subBody,
						pointB:		{x: 0, y: -5},
						stiffness:	0.5
					});

					Matter.Composite.addConstraint(composite, constraint);

					var constraint	= Matter.Constraint.create({
						bodyA:		subBodies[actorData.link],
						pointA:		{x: 0, y: 5},
						bodyB:		subBody,
						pointB:		{x: 0, y: 5},
						stiffness:	0.5
					});

					Matter.Composite.addConstraint(composite, constraint);

					break;
				case 'turret':
					var constraint	= Matter.Constraint.create({
						bodyA:		leadBody,
						pointA:		actorData.position, // TODO: should be able to remove bodyA or pointA. But needs testing to confirm
						bodyB:		subBody,
						stiffness:	0.95
					});

					Matter.Composite.addConstraint(composite, constraint);
					break;
				default:
					break;
			}

			troupe.addActor(actor);
		}

		// TODO: apply modifications based on "options" argument

		// Add the composite to the world
		Matter.World.add(Game.engine.world, composite);

		return troupe;
	};

	return _self;
}());
