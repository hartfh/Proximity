var Game = Game || {};

/**
 * Creates a new ActorFactory. Implements singleton and factory patterns.
 *
 * @class
 */
Game.ActorFactory = new function() {
	var _self		= this;
	var _position	= {x: 0, y: 0};
	var _hasFrames	= false;

	/**
	 * Creates a Matter.js Body object.
	 *
	 * @method	_createBody
	 * @private
	 * @param		{object}		parts			Object with parts data
	 * @param		{array}		parts.structures	Array of structure configuration objects
	 * @param		{array}		parts.sensors		Array of sensor configuration objects
	 * @param		{object}		config			Matter.js Body configuration object
	 * @param		{array}		customProps		Defines what custom properties to set on Body object
	 * @return	{object}
	 */
	var _createBody = function(parts, config, customProps = {}, allegiance) {
		var structureData	= parts.structures || [];
		var sensorData		= parts.sensors || [];
		var ornamentData	= parts.ornaments || [];

		var structureParts	= structureData.map( _createStructurePart );
		var sensorParts	= sensorData.map( _createSensorPart );
		var ornamentParts	= ornamentData.map( _createOrnamentPart );

		// Attach sensor event handlers
		for(var part of sensorParts) {
			_attachSensorEventHandler(part, allegiance);
		}

		// Configure a new options object for the composite body
		var options = {};

		for(var p in config) {
			options[p] = config[p];
		}

		options.parts = [...structureParts, ...sensorParts, ...ornamentParts];

		var compositeBody = Matter.Body.create(options);

		// Apply custom body properties
		for(var prop in customProps) {
			switch(prop) {
				case 'balancer':
					Matter.Body.setBalancer(compositeBody, true);
					break;
				case 'isLevel':
					Matter.Body.setLevel(compositeBody);
					break;
				case 'ignoresGravity':
					Matter.Body.setIgnoreGravity(compositeBody, true);
					break;
				case 'options':
					var customOptions = customProps[prop];

					for(var option in customOptions) {
						compositeBody[option] = customOptions[option];
					}
					break;
				default:
					break;
			}
		}

		return compositeBody;
	};

	/**
	 * Creates a Matter.js Body part to act as a sensor component of the Actor composite body.
	 *
	 * @method	_createSensorPart
	 * @private
	 * @param		{object}			config			Configuration object
	 * @param		{string}			config.type		Used for labeling
	 * @param		{string}			config.shape		Shape of sensor to create ('circle' or 'rectangle')
	 * @param		{integer}			config.radius		Radius of circular sensor
	 * @param		{integer}			config.width		Width of rectangular sensor
	 * @param		{integer}			config.height		Height of rectangular sensor
	 * @param		{integer}			config.x			Rectangular sensor center point x-offset
	 * @param		{integer}			config.y			Rectangular sensor center point y-offset
	 * @return	{object}
	 */
	var _createSensorPart = function(config) {
		var label	= config.type + ' sensor';
		var part;

		switch(config.shape) {
			case 'circle':
				part	= Matter.Bodies.circle(_position.x, _position.y, config.radius, {isSensor: true, label: label, density: 0});
				break;
			case 'rectangle':
				//config.x = config.x || 0;
				//config.y = config.y || 0;
				part	= Matter.Bodies.rectangle(config.x + _position.x, config.y + _position.y, config.width, config.height, {isSensor: true, label: label, density: 0});
				break;
			default:
				break;
		}

		_addSpriteData(part, config.sprites);
		_addPartName(part, config.name);

		part.disabled = (config.disabled) ? config.disabled : false;
		//part.render.visible = false;
		part.render.opacity = 0.15;

		return part;
	};

	var _enemyEventHandler = function(label, ownActor, otherActor) {
		var otherType	= otherActor.getType();
		var allegiance	= otherActor.allegiance;

		switch(allegiance) {
			case 'enemy':
				// change course if sight sensor?
				// share target??
				break;
			case 'friendly':
				/*
				if( label == 'sound sensor' ) {
					if( ownActor.getThreatLevel() < 2 ) {
						ownActor.setThreatLevel(1);
					}
				}
				*/
				if( label == 'sight sensor' ) {
					if( otherType == 'vehicle' ) {
						ownActor.target(otherActor);
						ownActor.heading(otherActor.body.position);
						ownActor.applyThreatLevel(1);
					}
				}
				if( label == 'explosive sensor' ) {
					ownActor.applyPayload(otherActor);
				}
				if( label == 'laser sensor' ) {
					ownActor.applyPayload(otherActor);

					// collision between enemy laser and friendly object
					// apply damage to obstacle
				}
				break;
			case 'neutral':
				//ownActor.clearCourse();
				// TODO: change course to avoid collision? or just pick a new random course
				break;
			default:
				break;
		}
	};

	var _friendlyEventHandler = function(label, ownActor, otherActor) {
		var otherType	= otherActor.getType();
		var allegiance	= otherActor.allegiance;

		//console.log( otherActor.getBody().isSensor );

		switch(allegiance) {
			case 'enemy':
				if( label == 'explosive sensor' ) {
					ownActor.applyPayload(otherActor);
				}
				if( label == 'ecm sensor' ) {
					// do something to missiles
				}
				if( label == 'enemy-scanner sensor' ) {

				}
				if( label == 'laser-shield sensor' ) {

				}
				if( label == 'sight sensor' ) {
					ownActor.target(otherActor);
				}
				break;
			case 'friendly':

				break;
			case 'neutral':
				if( label == 'explosive sensor' ) {
					ownActor.applyPayload(otherActor);
				}
				if( label == 'terrain-scanner sensor' ) {
					// NOTE: rework this??
					var terrainX = Math.floor( otherActor.body.position.x / Game.constants.config.TERRAIN_TILE_SIZE );
					var terrainY = Math.floor( otherActor.body.position.y / Game.constants.config.TERRAIN_TILE_SIZE );

					Game.UI.HUD.updateInfo(terrainX, terrainY, 'terrain');
				}
				if( label == 'item-scanner sensor' ) {

				}
				if( label == 'sight sensor' ) {
					// add into HUD if item
				}
				break;
			default:
				break;
		}
	};

	var _neutralEventHandler = function(label, ownActor, otherActor) {
		var otherType	= otherActor.getType();
		var allegiance	= otherActor.allegiance;

		switch(allegiance) {
			case 'enemy':
				// TODO: possibly have hazardous conditions affect enemies as well. Enemies should try to avoid them.
				break;
			case 'friendly':
				if( label == 'hazardous sensor' ) {
					/*
					// TODO: look into how often this triggers
					// look at payload and apply damage and stat ailments
					*/
				}
				if( label == 'sight sensor' ) {
					ownActor.setTarget(otherActor);
				}
				if( label == 'powerup sensor' ) {
					console.log('item collision');

					ownActor.applyPayload(otherActor);
				}

				// camoflauge or beneficial sensor?
				break;
			case 'neutral':
				break;
			default:
				break;
		}
	};

	/**
	 * Attaches events to sensor parts based on allegiance.
	 *
	 * @method	_attachSensorEventHandler
	 * @private
	 * @param		{object}	part			Body object
	 * @param		{string}	allegiance	Possible values: enemy, friendly, neutral
	 */
	var _attachSensorEventHandler = function(part, allegiance) {
		var actionCallback;

		switch(allegiance) {
			case 'enemy':
				actionCallback = _enemyEventHandler;
				break;
			case 'friendly':
				actionCallback = _friendlyEventHandler;
				break;
			case 'neutral':
				actionCallback = _neutralEventHandler;
				break;
			default:
				break;
		}

		Game.EventEmitter.subscribe('sensor-collision-' + part.id, function(obstacle) {
			var label		= part.label;
			var otherActor	= obstacle.parent.actor;
			var ownActor	= part.parent.actor;

			if( otherActor ) {
				actionCallback(label, ownActor, otherActor);
			}
		}, 'actor-sensor-collision-' + part.id);
	};

	/**
	 * Creates a Matter.js Body part to act as a physical component of the actor Body.
	 *
	 * @method	_createStructurePart
	 * @private
	 * @param		{object}			config			Configuration object
	 * @param		{integer}			config.width		Width of Body
	 * @param		{integer}			config.height		Height of Body
	 * @param		{object}			config.options		Matter.js Body configuration object
	 * @return	{object}
	 */
	var _createStructurePart = function(config) {
		var part;
		var partX = config.x || 0;
		var partY = config.y || 0;

		var centerX = _position.x + partX;
		var centerY = _position.y + partY;

		switch(config.shape) {
			case 'circle':
				part = Matter.Bodies.circle(centerX, centerY, config.radius, config.options);
				break;
			case 'rectangle':
			default:
				part = Matter.Bodies.rectangle(centerX, centerY, config.width, config.height, config.options);
				break;
		}

		_addSpriteData(part, config.sprites);
		_addPartName(part, config.name);

		return part;
	};

	/**
	 * Serves as a wrapper function for _createStructurePart. Modifies and pass along part configuration object.
	 *
	 * @method	_createOrnamentPart
	 * @private
	 * @param		{object}		config	Configuration object
	 * @return	{object}
	 */
	var _createOrnamentPart = function(config) {
		// Reduce mass
		config.density = 0;

		// Set body to ignore all collisions
		config.collisionFilter = {
			category:		Game.data.bitmasks['neutral']['effect'].category,
			mask:		Game.data.bitmasks['neutral']['effect'].mask
		}

		return _createStructurePart(config);
	};

	/**
	 * Adds "partName" property to a part.
	 *
	 * @method	_addPartData
	 * @private
	 * @param		{object}		part		A Body object
	 * @param		{string}		name
	 */
	var _addPartName = function(part, name = false) {
		// If no name is provided, create a random ID
		if( !name ) {
			name = 'part' + Math.floor( Math.random() * 1000 );
		}

		part.partName = name;
	};

	/**
	 * Adds sprite data to a part.
	 *
	 * @method	_addSpriteData
	 * @private
	 * @param		{object}	body			A Body object
	 * @param		{object}	spriteData
	 */
	var _addSpriteData = function(body, spriteData = false) {
		Matter.Body.setFrames(body, spriteData);

		if( spriteData ) {
			body.render.sprite.texture = spriteData.normal.spriteFrames[0];

			_hasFrames = true;
		}
	};

	/**
	 * Creates sub-characters of the primary Actor.
	 *
	 * @method	_createSubCharacters
	 * @private
	 *
	 * @param		{object}	body					A Matter.js Body
	 * @param		{array}	subCharacters			An array of sub-character data
	 * @param		{string}	subCharacters.name		The actor's name in the character data tables
	 * @param		{object}	subCharacters.offset	The position of the sub-character's body relative to the primary one
	 * @param		{string}	allegiance			The category of actor that governs which other actors this one cares about
	 * @param		{object}	position				The position of the primary body
	 */
	var _createSubCharacters = function(body, subCharacters = [], allegiance, position, config = {}) {
		if( subCharacters.length == 0 ) {
			return;
		}

		var composite	= Matter.Composite.create();
		var troupe	= new Game.Troupe(composite);

		Matter.Composite.addBody(composite, body);

		troupe.addActor(body.actor);

		for(var subCharacter of subCharacters ) {
			var subPos	= {x: position.x + subCharacter.offset.x, y: position.y + subCharacter.offset.y};
			var subConfig	= {};

			if( subCharacter.rotate ) {
				subConfig.rotate = subCharacter.rotate;
			}

			var subBody	= _self.create(allegiance, subCharacter.name, subPos.x, subPos.y, subConfig);
			var subActor	= subBody.actor;
			var constraint	= Matter.Constraint.create({
				bodyA:		body,
				pointA:		subCharacter.offset,
				bodyB:		subBody,
				stiffness:	0.95
			});

			troupe.addActor(subActor);

			Matter.Composite.addBody(composite, subBody);
			Matter.Composite.addConstraint(composite, constraint);
		}

		// Add the composite to the world
		Matter.World.add(Game.engine.world, composite);
	};

	/**
	 * Creates an actor and returns a reference to its body.
	 *
	 * @method	create
	 * @public
	 * @param		{string}		allegiance	The category of actor that governs which other actors this one cares about
	 * @param		{string}		name			The actor's name in the character data tables
	 * @param		{integer}		xPos			X-coordinate of the composite body's center point
	 * @param		{integer}		yPos			Y-coordinate of the composite body's center point
	 * @return	{object}
	 */
	_self.create = function(allegiance, name, xPos = 0, yPos = 0, config = {}) {
		// Reset static properties
		_hasFrames	= false;
		_position		= {x: xPos, y: yPos};

		var data = Game.data.actors;

		for(var subName of name) {
			data = data[subName];
		}

		var bodyOptions = ( data.body.options ) ? Game.utilities.clone(data.body.options) : {};

		bodyOptions.collisionFilter = {
			category:		Game.data.bitmasks[allegiance][data.actor.type].category,
			mask:		Game.data.bitmasks[allegiance][data.actor.type].mask
		};

		var body	= _createBody(data.body.parts, bodyOptions, data.body.custom, allegiance);
		var actor	= new Game.Actor(allegiance, data.actor, body);

		// Apply custom body properties
		body.actor	= actor;
		body.label	= name.join();
		body.hasFrames = _hasFrames;
		body.zindex	= Game.data.zindices[data.actor.zindex];
		body.actorType	= data.actor.type;

		// Apply additonal optional configuration settings to body
		if( config.rotate ) {
			Matter.Body.rotate(body, config.rotate);
		}

		// Add the body to the world
		Matter.World.add(Game.engine.world, body);

		return body;
	};
}();
