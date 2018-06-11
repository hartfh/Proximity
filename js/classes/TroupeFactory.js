module.exports = new function() {
	var _self		= this;

	// Remove a body from a troupe and the world
	_self.remove = function(troupe, actorKey) {
		return troupe.removeActor(actorKey);
	};

	// Add a new body to a troupe
	_self.add = function(troupe, xPos, yPos, config = {}, key, add = false) {
		var lead, leadbody, position;
		var name		= config.name;
		var role		= config.role;
		var angle		= config.angle || 0;

		if( !name || !role || !key ) {
			return;
		}

		if( role == 'lead' ) {
			position = {
				x:	config.position.x + xPos,
				y:	config.position.y + yPos
			};
		} else {
			var offset = {
				x:	config.position.x,
				y:	config.position.y
			};
			position = {
				x:	config.position.x + xPos,
				y:	config.position.y + yPos
			};
			lead = troupe.getLead();
			leadBody = lead.body;
		}

		var subBody	= ActorFactory.create(troupe.allegiance, name, position.x, position.y);
		var actor		= subBody.actor;

		actor.troupeKey = key;

		Matter.Composite.addBody(troupe.composite, subBody);

		switch(role) {
			case 'lead':
				leadBody = subBody;
				troupe.setLead(actor);
				break;
			/*
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
			*/
			case 'turret':
				var constraint	= Matter.Constraint.create({
					bodyA:		leadBody,
					pointA:		offset,
					bodyB:		subBody,
					stiffness:	0.95
				});
				constraint.troupeKey = key;

				Matter.Composite.addConstraint(troupe.composite, constraint);
				break;
			default:
				break;
		}

		troupe.addActor(actor, key);

		Matter.Body.setAngle(subBody, angle);

		if( add ) {
			Game.World.add(subBody);
		}

	};

	_self.create = function(group, name, xPos, yPos, options = {}) {
		var composite	= Matter.Composite.create({position: {x: xPos, y: yPos}});
		var troupeData = Data.troupes[group][name];
		var config	= troupeData.config || {};
		var dimensions	= ( troupeData.dimensions ) ? {width: troupeData.dimensions.width, height: troupeData.dimensions.height} : {width: 1, height: 1};
		var troupe	= new Troupe(composite, config);
		var subBodies	= {};
		var allegiance;
		var leadBody;

		switch(group) {
			case 'friendly':
			case 'player':
				allegiance = 'friendly';
				break;
			case 'enemy':
				allegiance = 'enemy';
				break;
			case 'vendor':
			default:
				allegiance = 'neutral';
				break;
		}

		composite.troupe = troupe;

		troupe.name		= troupeData.name;
		troupe.saveProfile	= {
			x:			false,
			y:			false,
			type:		'tp',
			name:		name,
			group:		group,
			despawnable:	(config.despawnable == false) ? false : true
		};
		troupe.composite	= composite;
		troupe.allegiance	= allegiance;
		troupe.dimensions	= dimensions;

		for(var key in troupeData.actors) {
			var actorData = troupeData.actors[key];

			// "Lead" takes on supplied troupe position values
			/*
			if( actorData.role == 'lead' ) {
				actorData.position.x += xPos;
				actorData.position.y += yPos;
			}
			*/

			_self.add(troupe, xPos, yPos, actorData, key);
		}

		// TODO: apply modifications based on "options" argument

		return composite;
	};
};
