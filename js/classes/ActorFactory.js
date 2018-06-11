/**
 * Creates a new ActorFactory. Implements singleton and factory patterns.
 *
 * @class
 */
module.exports = new function() {
	var _self		= this;
	var _position	= {x: 0, y: 0};
	var _hasFrames	= false;
	var _hasLight	= false;
	var _events	= [];
	var _composite	= false;
	var _actors	= new List();	// List of Matter.js composite Body IDs

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
	 */
	function _createBody(parts, config, customProps = {}, allegiance) {
		var structureData	= parts.structures || [];
		var sensorData		= parts.sensors || [];
		var ornamentData	= parts.ornaments || [];

		// Configure a new options object for the composite body
		var options = {};

		for(var p in config) {
			options[p] = config[p];
		}

		_composite = Matter.Body.create(options);

		var structureParts	= structureData.map( _createStructurePart );
		var sensorParts	= sensorData.map( _createSensorPart );
		var ornamentParts	= ornamentData.map( _createOrnamentPart );

		// Attach sensor event handlers
		for(var part of sensorParts) {
			_attachSensorEventHandler(part, allegiance);
		}

		var parts = [...structureParts, ...sensorParts, ...ornamentParts];

		Matter.Body.setParts(_composite, parts);

		// Apply custom body properties
		for(var prop in customProps) {
			switch(prop) {
				case 'balancer':
					Matter.Body.setBalancer(_composite, true);
					break;
				case 'ballistic':
					Matter.Body.setBallistic(_composite, true);
					break;
				case 'isLevel':
					Matter.Body.setLevel(_composite);
					break;
				case 'isOrdinal':
					Matter.Body.setOrdinal(_composite);
					break;
				/*
				case 'ignoresGravity':
					Matter.Body.setIgnoreGravity( _composite, Boolean(customProps[prop]) );
					break;
				*/
				case 'ignoresVicinity':
					Matter.Body.setIgnoresVicinity( _composite, Boolean(customProps[prop]) );
					break;
				case 'options':
					var customOptions = customProps[prop];

					for(var option in customOptions) {
						_composite[option] = customOptions[option];
					}
					break;
				default:
					break;
			}
		}
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
	 * @param		{array}			config.points		Array of vector points from which to create a set of vertices
	 * @return	{object}
	 */
	function _createSensorPart(config) {
		var label = config.types.join('-');
		var part;
		var partX = config.x || 0;
		var partY = config.y || 0;

		var centerX = _position.x + partX;
		var centerY = _position.y + partY;

		switch(config.shape) {
			case 'circle':
				part	= Matter.Bodies.circle(centerX, centerY, config.radius, {isSensor: true, label: label, density: 0});
				break;
			case 'polygon':
				var vertices = Matter.Vertices.create(config.points, _composite);
				part = Matter.Bodies.fromVertices(centerX, centerY, vertices, {isSensor: true, label: label, density: 0}, true);
				break;
			case 'rectangle':
				part	= Matter.Bodies.rectangle(centerX, centerY, config.width, config.height, {isSensor: true, label: label, density: 0});
				break;
			default:
				break;
		}

		_addSpriteData(part, config.sprite);
		_addPartName(part, config.name);

		part.partType = 'sensor';
		part.effect = config.effect || false;
		part.disabled = (config.disabled) ? config.disabled : false;

		// FOR TESTING //
		part.render.visible = true;
		part.render.opacity = 0.15;
		// FOR TESTING //

		return part;
	};

	function _performSensorEffect(pair, effect) {
		for(var i in pair.contacts) {
			var contact = pair.contacts[i];

			var options	= {};
			var offset	= {x: 0, y: 0};

			var point = {
				x:	contact.vertex.x,
				y:	contact.vertex.y
			};

			if( effect.offset ) {
				if( effect.offset == 'random' ) {
					var randX = Math.random() * 10;
					var randY = Math.random() * 10;

					if( Math.random() > 0.5 ) {
						randX = -randX;
					}
					if( Math.random() > 0.5 ) {
						randY = -randY;
					}

					offset.x += randX;
					offset.y += randY;
				} else {
					offset.x += (effect.offset.x || 0);
					offset.y += (effect.offset.y || 0);
				}
			}
			if( effect.sound === false ) {
				options.sound = false;
			}

			EffectsFactory.create(effect.name, point.x + offset.x, point.y + offset.y, options);
		}
	}

	function _enemyEventHandler(labels = [], ownActor, otherActor, pair, sensorOptions = {}) {
		var otherType	= (otherActor) ? otherActor.getType() : '';
		var allegiance	= (otherActor) ? otherActor.allegiance : 'neutral';

		var doSensorExtras = function() {
			if( sensorOptions.reset ) {
				_clearSensorCollision(pair, sensorOptions.reset);
			}
			if( sensorOptions.effect ) {
				_performSensorEffect(pair, sensorOptions.effect);
			}
		};

		labelsLoop:
		for(var label of labels) {
			switch(allegiance) {
				case 'enemy':
					// change course if sight sensor?
					// share target??
					break;
				case 'friendly':
					if( label == 'payload' ) {
						ownActor.applyPayload(otherActor);

						doSensorExtras();
					}
					if( label == 'sight' ) {
						if( otherType == 'vehicle' || otherType == 'flyer' || otherType == 'person' ) {
							var ownType = ownActor.getType();

							if( ownType == 'vehicle' || ownType == 'person' ) {
								// Pathfind a course to target
								//var points = Game.MapGrid.pathfindPositions(ownActor.body.position, otherActor.body.position);
								var points = [otherActor.body.position]; // TEMP
								log(points);
							} else {
								// Set a direct course for target
								var points = [otherActor.body.position];
							}

							ownActor.heading(points);
							ownActor.target(otherActor);
							ownActor.applyThreatLevel(1);
						}

						doSensorExtras();
					}
					if( label == 'menu' ) {
						// open dialogue?
						doSensorExtras();
					}
					break;
				case 'neutral':
					if( label == 'payload' ) {
						ownActor.applyPayload(otherActor);

						doSensorExtras();
					}
					//ownActor.clearCourse();
					// TODO: change course to avoid collision? or just pick a new random course
					break;
				default:
					break;
			}
		}
	};

	function _friendlyEventHandler(labels = [], ownActor, otherActor, pair, sensorOptions = {}) {
		var otherType	= (otherActor) ? otherActor.getType() : '';
		var allegiance	= (otherActor) ? otherActor.allegiance : 'neutral';

		var doSensorExtras = function() {
			if( sensorOptions.reset ) {
				_clearSensorCollision(pair, sensorOptions.reset);
			}
			if( sensorOptions.effect ) {
				_performSensorEffect(pair, sensorOptions.effect);
			}
		};

		labelsLoop:
		for(var label of labels) {
			switch(allegiance) {
				case 'enemy':
					if( label == 'payload' ) {
						ownActor.applyPayload(otherActor);

						doSensorExtras();
					}

					if( label == 'sight' ) {
						ownActor.target(otherActor);

						doSensorExtras();
					}
					/*
					if( label == 'menu' ) {
						ownActor.openMenu(otherActor);
					}
					*/
					break;
				case 'friendly':
					break;
				case 'neutral':
					if( label == 'payload' ) {
						ownActor.applyPayload(otherActor);

						doSensorExtras();
					}
					if( label == 'sight' ) {

						// add into HUD if item
					}
					break;
				default:
					break;
			}
		}
	};

	function _neutralEventHandler(labels = [], ownActor, otherActor, pair, sensorOptions = {}) {
		var otherType	= (otherActor) ? otherActor.getType() : '';
		var allegiance	= (otherActor) ? otherActor.allegiance : 'neutral';

		var doSensorExtras = function() {
			if( sensorOptions.reset ) {
				_clearSensorCollision(pair, sensorOptions.reset);
			}
			if( sensorOptions.effect ) {
				_performSensorEffect(pair, sensorOptions.effect);
			}
		};

		labelsLoop:
		for(var label of labels) {
			if( label == 'detector' ) {
				// special case for detectors?

				continue labelsLoop;
			}

			switch(allegiance) {
				case 'enemy':
					if( label == 'door' ) {
						doSensorExtras();
						continue labelsLoop;
					}
					if( label == 'freezing' ) {
						otherActor.clearCourse();
						Matter.Body.setVelocity(otherActor.body, {x: 0, y: 0});

						doSensorExtras();
						continue labelsLoop;
					}
					break;
				case 'friendly':
					if( label == 'sight' ) {
						ownActor.setTarget(otherActor);
						doSensorExtras();
						continue labelsLoop;
					}
					if( label == 'payload' ) {
						ownActor.applyPayload(otherActor);
						doSensorExtras();
						continue labelsLoop;
					}
					if( label == 'door' ) {
						doSensorExtras();
						continue labelsLoop;
					}
					if( label == 'menu' ) {
						// open dialogue/store/other options (save point?)
						doSensorExtras();
						continue labelsLoop;
					}
					break;
				case 'neutral':
					if( label == 'orienting' ) {
						if( otherType == 'vehicle' ) {
							var directionKey = {
								'e':		[0],
								'n':		[0.5],
								'w':		[1],
								's':		[-0.5],
								'nw':	[0.5,1],
								'ne':	[0.5, 0],
								'sw':	[-0.5, 1],
								'se':	[-0.5, 0]
							};

							// Select a random direction
							var possible	= directionKey[sensorOptions.direction];
							var index		= Math.floor( Math.random() * possible.length );
							var direction	= possible[index];
							var angle		= direction * Math.PI;

							otherActor.direction(angle);

							doSensorExtras();

							continue labelsLoop;
						}
					}
					if( label == 'gravitating-x' ) {
						var forceX	= otherActor.body.mass * sensorOptions.strength;
						var radius	= 35 || sensorOptions.radius;
						var distance	= ownActor.body.position.x - otherActor.body.position.x;
						var modifier	= (distance || 1) / radius;

						if( distance < 0.5 ) {
							modifier = 0;
						}

						var force = {x: forceX * modifier, y: 0};

						Matter.Body.applyForce(otherActor.body, otherActor.body.position, force);

						doSensorExtras();
						continue labelsLoop;
					}
					if( label == 'gravitating-y' ) {
						var forceY	= otherActor.body.mass * sensorOptions.strength;
						var radius	= 35 || sensorOptions.radius;
						var distance	= ownActor.body.position.y - otherActor.body.position.y;
						var modifier	= (distance || 1) / radius;

						if( distance < 0.5 ) {
							modifier = 0;
						}

						var force = {x: 0, y: forceY * modifier};

						Matter.Body.applyForce(otherActor.body, otherActor.body.position, force);

						doSensorExtras();
						continue labelsLoop;
					}
					if( label == 'door' ) {
						doSensorExtras();
						continue labelsLoop;
					}
					if( label == 'freezing' ) {
						// halt anything that wanders in here
						doSensorExtras();
						continue labelsLoop;
					}
					break;
				default:
					break;
			}
		}
	};

	function _clearSensorCollision(pair, timeout = 3500) {
		setTimeout(function() {
			Matter.Pair.setActive(pair, false);
		}, timeout);
	}

	/**
	 * Attaches events to sensor parts based on allegiance.
	 *
	 * @method	_attachSensorEventHandler
	 * @private
	 * @param		{object}	part			Body object
	 * @param		{string}	allegiance	Possible values: enemy, friendly, neutral
	 */
	function _attachSensorEventHandler(part, allegiance) {
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

		_events.push({
			name:		'sensor-collision-' + part.id,
			callback:		function(eventData) {
				var types		= part.label.split('-');
				var otherActor	= eventData.obstacle.parent.actor;
				var ownActor	= part.parent.actor;
				var options	= part.sensorOptions || {};

				/*
				// Allows for sensors to ignore actorless bodies
				if( !otherActor && !options.actorless ) {
					return;
				}
				*/

				actionCallback(types, ownActor, otherActor, eventData.pair, options);
			},
			handle:		'actor-sensor-collision-' + part.id
		});
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
	 * @param		{array}			config.points		Array of vector points from which to create a set of vertices
	 * @return	{object}
	 */
	function _createStructurePart(config) {
		var part;
		var partX = config.x || 0;
		var partY = config.y || 0;

		var centerX = _position.x + partX;
		var centerY = _position.y + partY;

		var options = config.options || {};

		switch(config.shape) {
			case 'circle':
				part = Matter.Bodies.circle(centerX, centerY, config.radius, options);
				break;
			case 'polygon':
				var vertices = Matter.Vertices.create(config.points, _composite);
				part = Matter.Bodies.fromVertices(centerX, centerY, vertices, options);
				break;
			case 'rectangle':
			default:
				part = Matter.Bodies.rectangle(centerX, centerY, config.width, config.height, options);
				break;
		}

		_addSpriteData(part, config.sprite);
		_addPartName(part, config.name);

		part.partType = 'structure';

		part.render.opacity = 0.20;
		part.render.opacity = 1.0;

		if( options.zindex ) {
			part.zindex = options.zindex;
			part.zindexOverride = false;
		}

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
	function _createOrnamentPart(config) {
		var part = _createStructurePart(config);

		part.isSensor = true;
		part.partType = 'ornament';

		return part;
	};

	/**
	 * Adds "partName" property to a part.
	 *
	 * @method	_addPartData
	 * @private
	 * @param		{object}		part		A Body object
	 * @param		{string}		name
	 */
	function _addPartName(part, name = false) {
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
	 * @param		{string}	spriteName
	 */
	function _addSpriteData(body, spriteName = false) {
		if( !spriteName ) {
			return;
		}

		var spriteData = Data.sprites[spriteName];

		Matter.Body.setFrames(body, spriteData);

		if( spriteData ) {
			// Set initial frame
			body.render.sprite.texture = spriteData.normal.spriteFrames.e.frames[0];

			// Set initial composite mode and opacity
			if( spriteData.normal.mode ) {
				body.render.sprite.mode = spriteData.normal.mode;
			}
			if( spriteData.normal.opacity ) {
				body.render.sprite.opacity = spriteData.normal.opacity;
			}

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
	function _createSubCharacters(body, subCharacters = [], allegiance, position, config = {}) {
		if( subCharacters.length == 0 ) {
			return;
		}

		var composite	= Matter.Composite.create();
		var troupe	= new Troupe(composite);

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

		Game.World.add(composite);
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
	 * @param		{object}		config		Configuration object that specifies adjustments to the composite body after instantiation
	 * @param		{function}	dataFilter	Gets passed character data before actor or body creation. Acts as a filter for data and must return it
	 * @return	{object}
	 */
	_self.create = function(allegiance, name, xPos = 0, yPos = 0, config = {}, dataFilter = false) {
		// Reset static properties
		_events		= [];
		_hasFrames	= false;
		_hasLight		= false;
		_position		= {x: xPos, y: yPos};
		_composite	= false;

		var data = Data.actors;

		for(var subName of name) {
			data = data[subName];
		}

		if( dataFilter ) {
			data = dataFilter(data);
		}

		if( !data ) {
			console.log(name);
			console.log(subName);
		}
		var bodyOptions = ( data.body.options ) ? Utilities.clone(data.body.options) : {};

		bodyOptions.collisionFilter = {
			category:		Data.bitmasks[allegiance][data.actor.type].category,
			mask:		Data.bitmasks[allegiance][data.actor.type].mask
		};

		_createBody(data.body.parts, bodyOptions, data.body.custom, allegiance);

		if( !data.body.custom.noActor ) {
			var actor	= new Actor(allegiance, data.actor, _composite, (data.body.custom.trackBody || false));

			actor.saveProfile = {
				x:		false,
				y:		false,
				type:	'ac',
				name:	name,
				allg:	allegiance
			};
		} else {
			// Flag body as having been specifically created with no actor where it normally would have one
			_composite.actorless = true;
		}

		// Apply custom body properties
		if( actor ) {
			for(var part of _composite.parts) {
				part.actor = actor;
				part.characterType = data.actor.type;
			}
		}

		_composite.label		= name.join();
		_composite.hasFrames	= _hasFrames;
		_composite.hasLight		= _hasLight;
		_composite.zindex		= data.body.zindex;
		_composite.actorType	= data.actor.type;
		_composite.events		= _events;
		_composite.tracker		= data.body.custom.tracker || false;


		// Apply additonal optional configuration settings to body
		var rotate	= data.body.custom.rotate || config.rotate;
		var translate	= data.body.custom.translate || config.translate;

		if( rotate ) {
			Matter.Body.rotate(_composite, rotate);
		}
		if( translate) {
			Matter.Body.translate(_composite, translate);
		}

		return _composite;
	};

	_self.countActors = function() {
		return _actors.countItems();
	};

	_self.eachActor = function(callback) {
		_actors.eachItem(function(bodyID, handle) {
			callback( _self.getActor(bodyID), bodyID );
		});
	};

	_self.getActor = function(bodyID) {
		var body = Game.World.get(bodyID);

		if( body ) {
			return body.actor;
		} else {
			return false;
		}
	};

	_self.addActor = function(bodyID) {
		_actors.addItem(bodyID, 'actor-' + bodyID);
	};

	_self.removeActor = function(bodyID) {
		return _actors.removeItem('actor-' + bodyID);
	};
};
