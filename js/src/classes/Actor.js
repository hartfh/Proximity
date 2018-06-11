var Game = Game || {};

/**
 * Creates a new Actor.
 *
 * @class
 * @param		{string}		allegiance			Possible values are: 'friendly', 'enemy' or 'neutral'
 * @param		{object}		config				Configuration object
 * @param		{array}		config.battlecries
 * @param		{array}		config.behaviors
 * @param		{array}		config.deathrattles
 * @param		{boolean}		config.indestructible
 * @param		{object}		config.payload
 * @param		{string}		config.type
 * @param		{object}		body					Matter.js Body object
 */
Game.Actor = function(allegiance, config, body) {
	var _self				= this;
	var _battlecries		= [];									// one time actions after creation
	var _behaviors			= [];									// actions done within loop
	var _cooldownTimers		= {};
	var _course			= false;
	var _damageTimer		= 0;
	var _deathrattles		= [];									// actions done during death sequence before destruction
	var _durationTimers		= {};
	var _firePoint			= false;									// position object
	var _movePoint			= false;									// position object
	var _payload			= config.payload || {};
	var _target			= false;									// an Actor
	var _threatLevel		= 0;
	var _threatCooldown		= 0;
	var _type				= config.type || '';

	//_self.affiliation		= config.affiliation || '';					// NOTE: removable?
	_self.allegiance		= allegiance;								// enemy, friendly or neutral
	_self.body			= body;									// Matter.js Body
	//_self.classification	= config.classification || '';				// NOTE: removable?
	_self.deathReady		= false;
	_self.deathTimer		= config.deathTimer || 1;					// duration of death sequence
	_self.facing			= 'right';								// determines left/right sprite sets
	_self.fireTimer		= 0;										// governs how long to show an actor's "damaged" sprite
	_self.hitTimer			= 0;										// governs whether a not an actor is capable of having a payload applied to it
	_self.ignoreCollisions	= false;
	_self.indestructible	= config.indestructible || false;				// ignores damage
	_self.inert			= config.inert || false;
	_self.isSleeping		= false;									// governs if loop should be run
	_self.light			= config.light || {color: 'white', intensity: 0};
	_self.role			= config.role || '';						// role within a Troupe
	_self.spawnCounter		= 0;
	_self.spawnItems		= config.spawnItems || false;
	_self.spriteMode		= 'normal';
	_self.troupe			= false;									// reference to parent Troupe


	/**
	 * Initializes events and properties after instantiation.
	 *
	 * @method	_init
	 * @private
	 * @param		{object}	config		Determines starting stats
	 */
	var _init = function(config) {
		// Copy behaviors
		_battlecries	= Game.utilities.clone(config.battlecries || []);
		_behaviors	= Game.utilities.clone(config.behaviors || []);
		_deathrattles	= Game.utilities.clone(config.deathrattles || []);

		if( _type == 'vehicle' ) {
			_behaviors.push({name: 'recalibrateCourse', interval: 15});
		}

		//_setupCommonItems(config.commonItems || {});
		_setupLoop();
		_resetCooldownTimers();
		_resetDurationTimers();

		if( _behaviors.seek ) {
			_randomizeCourse();
		}

		Object.seal(_self);

		_setupBattlecries();
		_setName(config.name);
	};

	var _setName = function(name = false) {
		if( _self.role == 'chasis' ) {
			_self.name = (name) ? name : _generateName();
		} else {
			_self.name = '';
		}

	}

	var _generateName = function() {
		// come up with a random name

		// 1.) adjective
		// 2.) noun

		return '';
	};

	var _spreadSignal = function(action, data) {
		_self.troupe.sendSignal(action, data);
	};

	/**
	 * Removes all traces of this actor from the game.
	 *
	 * @method	beginDestructing
	 * @private
	 */
	_self.beginDestructing = function() {
		_self.deathReady = true;

		_becomeInert();
	};

	/**
	 * Cleans up this Actor and associated Body after deathrattle actions have taken place.
	 *
	 * @method	finishDestructing
	 * @private
	 */
	_self.finishDestructing = function() {
		Game.EventEmitter.unsubscribe('tick', 'body-' + _self.body.id);

		// Remove collision event handlers from sensors bodies
		for(var part of _self.body.parts ) {
			if( part.isSensor ) {
				//console.log(part.id);
				Game.EventEmitter.unsubscribe('sensor-collision-' + part.id, 'actor-sensor-collision-' + part.id);
			}
		}

		// Remove the body
		if( _self.troupe ) {
			_self.troupe.killCommand();
		}

		Matter.World.remove(Game.engine.world, _self.body);
	};

	_self.die = function() {
		if( _self.troupe ) {
			_self.troupe.destruct();
		} else {
			_self.beginDestructing();
		}
	};

	/**
	 *
	 *
	 *
	 */
	var _becomeInert = function() {
		_behaviors = [];

		//_self.body.balancer			= false;
		//_self.body.level			= false;
		//_self.body.ignoreGravity		= false;

		_self.indestructible	= true;
		_self.inert			= true;
	};

	/**
	 *
	 *
	 *
	 *
	 */
	var _spawnItems = function() {
		if( !self.spawnItems ) {
			return;
		}

		// From 0 - 5 items possible
		var number = Math.floor( Math.random() * 6 );

		if( number == 0 ) {
			return;
		}

		var itemPoints = _self.randomInteriorPoints(number);

		for(var i = 0; i < number; i++) {
			// TODO: set chance to .99 (1 in 200) during production
			// Determine if item is common or unique, then get a random item name of that type
			var type		= ( Math.random() > 0.95 ) ? 'unique' : 'common';
			var itemName	= Game.utilities.getRandomObjectProperty( Game.data.actors.items[type] );
			var point		= itemPoints[i];

			Game.ActorFactory.create('neutral', ['items', type, itemName], point.x, point.y);
		}
	};

	/**
	 * Binds event handlers related to loop actions occuring during a game tick.
	 *
	 * @method	_setupLoop
	 * @private
	 */
	var _setupLoop = function() {
		// Skip creating a loop for things such as terrain
		if( !_self.inert ) {
			Game.EventEmitter.subscribe('tick', _loop, 'body-' + _self.body.id);

			_self.isSleeping = true;
		}
	};

	_self.sleep = function() {
		if( !_self.isSleeping ) {
			Game.EventEmitter.unsubscribe('tick', 'body-' + _self.body.id);

			_self.isSleeping = true;
		}
	};

	_self.wake = function() {
		if( _self.isSleeping ) {
			Game.EventEmitter.subscribe('tick', _loop, 'body-' + _self.body.id);

			_self.isSleeping = false;
		}
	}

	/**
	 * Wrapper function for everything done by an actor during a game tick.
	 *
	 * @method	_loop
	 * @private
	 */
	var _loop = function() {
		_doBehaviors();
		_checkDeathrattles();
		_decrementThreatTimer();
		_decrementCooldownTimers();
		_decreaseDamageTimer();
		_decreaseHitTimer();
		_checkTarget();
	};

	/**
	 * Unsets _target if the target actor has become inert or too distant.
	 */
	var _checkTarget = function() {
		if( _target ) {
			// Check if flagged as inert
			if( _target.inert ) {
				_target = false;
				return;
			}

			// Check if target exceeds reasonable range
			var xDistance	= Math.abs(_target.body.position.x - _self.body.position.x);
			var yDistance	= Math.abs(_target.body.position.y - _self.body.position.y);
			var distance	= Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2) );

			if( distance > 1000 ) {
				_target = false;
				return;
			}
		}
	};

	var _decreaseHitTimer = function() {
		if( _self.hitTimer > 0 ) {
			_self.hitTimer--;
		}
	};

	_self.increaseHitTimer = function() {
		_self.hitTimer = 10;
	};

	/**
	 * Increases and maxes out the _damageTimer.
	 *
	 * @method	increaseDamageTimer
	 * @public
	 */
	_self.increaseDamageTimer = function() {
		_damageTimer = 6;
		_self.spriteMode = 'damaged';
	};

	/**
	 * Decreases the _damageTimer.
	 *
	 * @method	_decreaseDamageTimer
	 * @private
	 */
	var _decreaseDamageTimer = function() {
		_damageTimer--;

		if( _damageTimer < 0 ) {
			_damageTimer = 0;

			_self.spriteMode = 'normal';
		}
	};

	/**
	 * Resets all cooldown timer to initial values.
	 *
	 * @method	_resetCooldownTimers
	 * @access	private
	 */
	var _resetCooldownTimers = function() {
		var actionSets = [_behaviors, _deathrattles];

		for(var actionSet of actionSets) {
			for(var action of actionSet) {
				var time	= action.interval || 0;
				var delay	= action.delay || 0;
				var id	= action.id || '';
				var key	= action.name + id;

				_cooldownTimers[key] = {
					start:	time,
					current:	delay
				};
			}
		}
	};

	/**
	 * Resets all duration timer to initial values.
	 *
	 * @method	_resetDurationTimers
	 * @access	private
	 */
	var _resetDurationTimers = function() {
		var actionSets = [_behaviors, _deathrattles];

		for(var actionSet of actionSets) {
			for(var action of actionSet) {
				var duration	= action.duration || 0;
				var id		= action.id || '';
				var key		= action.name + id;

				_durationTimers[key] = {
					current:	duration,
					start:	duration
				};
			}
		}
	};

	var _resetDurationTimer = function(behaviorKey) {
		_durationTimers[behaviorKey].current = 0;
	};

	/**
	 * Resets one cooldown timer to initial value.
	 *
	 * @method	_resetCooldownTimer
	 * @private
	 * @param		{string}			behaviorKey	A behavior name
	 */
	var _resetCooldownTimer = function(behaviorKey) {
		var resetTime = _cooldownTimers[behaviorKey].start;

		_cooldownTimers[behaviorKey].current = resetTime;

		_resetDurationTimer(behaviorKey);
	};

	var _incrementDurationTimer = function(behaviorKey) {
		var timer = _durationTimers[behaviorKey];

		if( timer.current < timer.start ) {
			timer.current++;
		}
	};

	/**
	 * Reduces all cooldown timers by one.
	 *
	 * @method	_decrementCooldownTimers
	 * @private
	 */
	var _decrementCooldownTimers = function() {
		for(var t in _cooldownTimers) {
			var timer = _cooldownTimers[t];

			timer.current--;

			if( timer.current < 0 ) {
				timer.current = 0;
			}
		}
	};

	/**
	 * Enacts an action dependant on its properties and timers.
	 *
	 * @method	_doAction
	 * @private
	 * @param		{object}	action			An object describing an action's parameters
	 * @param		{string}	action.name		Alias for the action
	 * @param		{integer}	action.interval	Game ticks between instances of action
	 * @param		{integer}	action.duration	Game ticks to continue implementing action after it first fires
	 * @param		{integer}	action.delay		Game ticks to delay first instance of action
	 * @param		{float}	action.degrees		Rotation
	 * @param		{string}	action.effect		Effect actor name
	 * @param		{float}	action.thrust		Force
	 */
	var _doAction = function(action, skipChecks = false) {
		var name	= action.name;
		var id	= action.id || '';
		var key	= name + id;
		var point	= action.point || {x: 0, y: 0};

		if( action.disallowed ) {
			return;
		}

		if( !skipChecks ) {
			if( _shouldExitAction(key) ) {
				return;
			}
		}

		switch(name) {
			case 'afflict':
				_afflict();
				break;
			case 'showVFX':
				_showVFX(action.effect);
				break;
			case 'expire':
				_expire();
				return false;
				break;
			case 'fade':
				_fade(_durationTimers[key]);
				break;
			case 'flutter':
				_flutter(action.force);
				break;
			case 'followCourse':
				_followCourse(action.thrust, action.distance);
				break;
			case 'nudge':
				_nudge(action.force, action.angle);
				break;
			case 'orient':
				_orient(action.about);
				break;
			case 'playSFX':
				_playSFX(action.sound);
				break;
			case 'pivot':
				_pivot(action.angle, action.about);
				break;
			case 'randomizeCourse':
				_randomizeCourse();
				break;
			case 'recalibrateCourse':
				_recalibrateCourse();
				break;
			case 'shakeScreen':
				_shakeScreen(action.pattern);
				break;
			case 'shoot':
				var args = {
					arc:		action.arc || 0.8,
					number:	action.shots || 1,
					part:	action.part || false,
					pattern:	action.pattern || 'full',
					point:	action.point || false,
					number:	action.number || 1,
					shot:	action.shot,
					style:	action.style || 'straight',
					width:	action.width || 0
				};
				_shoot(args);
				break;
			case 'shootLaser':
				_shootLaser(action.damage, action.width);
				break;
			case 'spawnTroupe':
				_spawnTroupe(action.troupe, action.offset, action.limit);
				break;
			case 'thrust':
				_thrust(action.thrust);
				break;
			default:
				break;
		}

		if( !skipChecks ) {
			_adjustActionTimers(key);
		}
	};

	/**
	 * Checks if an action should be stopped before firing based on timer values.
	 *
	 * @method	_shouldExitAction
	 * @private
	 * @param		{string}		key		Action key
	 * @return	{boolean}
	 */
	var _shouldExitAction = function(key) {
		// Only attempt to enact an action if its cooldown timer is at zero
		if( _cooldownTimers[key].current != 0 ) {
			// Don't enact an action if it has a duration time of 0
			if( _durationTimers[key].start == 0 ) {
				return true;
			}

			// Don't enact an action if its duration timer has maxed out (current == start)
			if( _durationTimers[key].start != 0 ) {
				if( _durationTimers[key].current == _durationTimers[key].start ) {
					return true;
				}
			}
		}
	};

	/**
	 * Adjusts cooldown and duration timers after an action has fired.
	 *
	 * @method	_adjustActionTimers
	 * @private
	 * @param		{string}	name		Action name
	 */
	var _adjustActionTimers = function(key) {
		_incrementDurationTimer(key);

		if( _cooldownTimers[key].current == 0 ) {
			_resetCooldownTimer(key);
		}
	};

	var _setupBattlecries = function() {
		if( _battlecries.length > 0 ) {
			Game.EventEmitter.subscribe('tick', _doBattlecries, 'battlecries-' + _self.body.id);
		}
	};

	/**
	 * Loops through and acts out all battlecries.
	 *
	 * @method	_doBattlecries
	 * @private
	 */
	var _doBattlecries = function() {
		for(var battlecry of _battlecries ) {
			_doAction(battlecry, true);
		}

		Game.EventEmitter.unsubscribe('tick', 'battlecries-' + _self.body.id);
	};

	/**
	 * Loops through all behaviors and acts out those which are ready.
	 *
	 * @method	_doBehaviors
	 * @private
	 */
	var _doBehaviors = function() {
		if( !_self.deathReady ) {
			for(var behavior of _behaviors ) {
				_doAction(behavior);
			}
		}
	};

	var _checkDeathrattles = function() {
		if( _self.deathReady ) {
			_doDeathrattles();

			_self.deathTimer--;

			if( _self.deathTimer <= 0 ) {
				_spawnItems();
				_self.finishDestructing();
			}
		}
	};

	/**
	 * Loops through all deathrattles and acts out those which are ready.
	 *
	 * @method	_doDeathrattles
	 * @private
	 */
	var _doDeathrattles = function() {
		for(var deathrattle of _deathrattles) {
			_doAction(deathrattle);
		}
	};

	/**
	 * An alias for die that allows it to be used as an action.
	 *
	 * @method	_expire
	 * @private
	 */
	var _expire = function() {
		_self.die();
	};

	/**
	 * Updates facing based on a force value.
	 *
	 * @method	_updateFacing
	 * @private
	 * @param		{object}		forceV	A Matter.js force vector
	 */
	var _updateFacing = function(forceV) {
		if( forceV.x < 0 ) {
			_self.facing = 'left';
		} else {
			_self.facing = 'right';
		}
	};

	var _fade = function(timers) {
		var current	= timers.current;
		var start		= timers.start || 1;
		var reduced	= 1 - (current / start);

		_self.body.render.opacity = reduced;
	};

	/**
	 * Rotates body slightly towards _target or _course.
	 *
	 * @method	_orient
	 * @private
	 */
	var _orient = function(partName = false) {
		if( _target || _firePoint ) {
			var targetPoint;

			if( _firePoint ) {
				targetPoint = _firePoint;
			} else {
				targetPoint = _target.body.position;
			}

			if( partName ) {
				// TODO: bugged. Need to adjust how orientation works when a sub-part is specified
				// finish writing: Body.orientToPointAbout()
				var aboutPart = _getActingPart(partName);

				if( aboutPart ) {
					Matter.Body.orientToPoint(aboutPart, targetPoint);
				}
			} else {
				Matter.Body.orientToPoint(_self.body, targetPoint);
			}
		} else if( _course ) {
			// Orient towards _course
			Matter.Body.orientToAngle(_self.body, _course);
		}
	};

	/**
	 * Gets a body sub-part. Returns false if no matching part is found.
	 *
	 * @method	_getActingPart
	 * @private
	 * @param		{string}	name		Value to match part's "partName" property against
	 * @return	{object}
	 */
	var _getActingPart = function(name) {
		for(var part of _self.body.parts) {
			if( part.partName == name ) {
				return part;
			}
		}

		return false;
	};

	/**
	 * Rotates body about its center or the center of one of its parts. Does not impart angular momentum.
	 *
	 * @method	_pivot
	 * @private
	 * @param		{float}	radians		Amount to rtate
	 * @param		{string}	partName		Name of part to rotate about. Defaults to composited body's center
	 */
	var _pivot = function(radians, partName = false) {
		if( _target || _firePoint ) {
			return;
		}
		if( partName ) {
			var aboutPart = _getActingPart(partName);

			if( aboutPart ) {
				Matter.Body.rotateAbout(_self.body, radians, aboutPart.position);
			}
		} else {
			Matter.Body.rotate(_self.body, radians);
		}
	};

	/**
	 * Pushes body upwards with some randomized lateral force.
	 *
	 * @method	_rise
	 * @private
	 */
	/*
	var _rise = function() {
		// Force might have to be relative to mass
		var force	= {x: 0, y: -0.015};
		var rand	= Math.random();

		if( rand > 0.8 ) {
			force.x = 0.03;

			if( rand > 0.9 ) {
				force.x *= -1;
			}
		}

		// apply upward force and possibly some randomized lateral force
		// lateral: occasionally apply strong left or right force
		// if( Math.random() > 0.7 ) { add lateral force. if above 0.85, flip sign }
		Matter.Body.applyForce(_self.body, _self.body.position, force);
	};
	*/

	/**
	 * Creates a new randomized angle for _course direction.
	 *
	 * @method	_randomizeCourse
	 * @private
	 */
	var _randomizeCourse = function() {
		_course = Math.random() * 2 * Math.PI;
	};

	var _recalibrateCourse = function() {
		if( _movePoint ) {
			// Recalculate course
			var angle	= Game.utilities.getLineAngle(_self.body.position, _movePoint);

			_self.setCourse(angle);
		}
	};

	// Query this actor's bounded area and apply payload to anything within it
	var _afflict = function() {
		var query = Matter.Query.region(Matter.Composite.allBodies(Game.engine.world), _self.body.bounds);

		for(var body of query) {
			if( body.actor ) {
				_self.applyPayload(body.actor);
			}
		}
	};

	/**
	 * Pushes a body at a random angle.
	 *
	 * @method	_flutter
	 * @private
	 * @param		{number}	force	A scalar force value
	 */
	var _flutter = function(force) {
		var angle	= Math.random() * Math.PI * 2;

		var forceV = {
			x: force * Math.cos(angle),
			y: force * Math.sin(angle)
		};

		Matter.Body.applyForce(_self.body, _self.body.position, forceV);

		_updateFacing(forceV);
	};

	/**
	 * Pushes a body at a given angle if it has no set course.
	 *
	 * @method	_nudge
	 * @private
	 * @param		{number}	force	A scalar force value
	 * @param		{number}	angle	Angle in radians
	 */
	var _nudge = function(force, angle) {
		if( _movePoint ) {
			return;
		}

		var forceV = {
			x: force * Math.cos(angle),
			y: force * Math.sin(angle)
		};

		Matter.Body.applyForce(_self.body, _self.body.position, forceV);

		_updateFacing(forceV);
	};

	/**
	 * Pushes a body along at its present heading.
	 *
	 * @method	_thrust
	 * @private
	 * @param		{number}	force	Force to be applied to body
	 */
	var _thrust = function(force) {
		if( typeof(force) != 'number' ) {
			return;
		}

		Matter.Body.thrust(_self.body, force);

		_updateFacing(force);
	};

	var _followCourse = function(force, distance = 0) {
		if( !_course && !_movePoint ) {
			return;
		}

		// See if the body should stop at a _movePoint
		if( _movePoint ) {
			// Check if body is within a certain distance of _movePoint
			var boundA = {x: _movePoint.x - distance, y: _movePoint.y - distance};
			var boundB = {x: _movePoint.x + distance, y: _movePoint.y + distance};

			if( Game.utilities.pointIntersectsRegion(_self.body.position, boundA, boundB) ) {
				_movePoint	= false;
				_course		= false;

				// TODO: decelerate somehow??

				return;
			}
		}

		var Fx		= force * Math.cos(_course);
		var Fy		= force * Math.sin(_course);
		var forceV	= {x: Fx, y: Fy};

		Matter.Body.applyForce(_self.body, _self.body.position, forceV);

		_updateFacing(forceV);
	};

	/**
	 * Pushes body towards _target.
	 *
	 * @method	_seek
	 * @private
	 */
	/*
	var _seek = function() {
		//var thrust = _self.getStat('thrust');
		var thrust = 0;

		if( _threatLevel == 1 ) {
			thrust *= 0.65;
		}

		// TODO: course correction if near obstacles

		if( _target ) {
			Matter.Body.moveTowards(_self.body, thrust, _target.getBody());
		} else {
			// TODO: Periodically randomize course?
			if( false ) {
				_randomizeCourse();
			}

			var Fx = thrust * Math.cos(_course);
			var Fy = thrust * Math.sin(_course);

			Matter.Body.applyForce(_self.body, _self.body.position, {x: Fx, y: Fy});
		}
	};
	*/

	var _shakeScreen = function(pattern) {
		Game.Viewport.setShakeMode(pattern);
	};

	var _hasShotAmmo = function(shot) {
		// Enemies can shoot regardless of ammo levels
		if( !_self.isPlayer() ) {
			return true;
		}

		// Check that troupe's common item current quantity is above 0
		if( _self.troupe ) {
			if( _self.troupe.getCommonItemCurrent(shot) > 0 ) {
				return true;
			}
		}

		return false;
	};

	var _hasShotTarget = function() {
		if( _target || _firePoint ) {
			return true;
		}

		return false;
	};

	// Prevent body from firing if its angle is too far off target
	var _hasShotAngle = function() {
		if( !_hasShotTarget() ) {
			return false;
		}

		var diff = _self.body.angle - _getAngleToTarget();

		return ( diff < -2 * Math.PI + 0.8 || diff > 2 * Math.PI - 0.8 || (diff < 0.8 && diff > -0.8) );
	};

	/**
	 * Checks if an actor should be capable of performing a shoot action. Also sets spriteMode based on outcome.
	 *
	 * @method	_canShoot
	 * @private
	 * @return	{boolean}
	 */
	var _canShoot = function(shot) {
		if( _hasShotTarget() && _hasShotAngle() && _hasShotAmmo(shot) ) {
			_self.troupe.adjustCommonItemCurrent(shot, -1);
			_self.spriteMode = 'active';
			_self.fireTimer++;

			return true;
		}

		_self.spriteMode	= 'normal';
		_self.fireTimer	= 0;

		return false;
	};

	/**
	 * Returns the angle of the line made by the Actor's body position and the position of its target.
	 *
	 * @method	_getAngleToTarget
	 * @private
	 * @return	{number}
	 */
	var _getAngleToTarget = function() {
		var targetPoint;
		var startPoint = {x: _self.body.position.x, y: _self.body.position.y};

		if( _target ) {
			targetPoint = {x: _target.body.position.x, y: _target.body.position.y};
		}
		if( _firePoint ) {
			targetPoint = {x: _firePoint.x, y: _firePoint.y};
		}

		return Game.utilities.getLineAngle(startPoint, targetPoint);
	};

	/**
	 * Creates "shot" Actors according to various styles and patterns.
	 *
	 * @method	_shoot
	 * @private
	 * @param		{object}		args				Configuration object
	 * @param		{number}		args.arc			Radians to array shots out over
	 * @param		{integer}		args.number		Number of shots to create
	 * @param		{object}		args.offset		Point object to offset base point by
	 * @param		{string}		args.part			Name of part to use as body
	 * @param		{string}		args.pattern		Limits which shots are created depending on number argument and _self.fireTimer property
	 * @param		{string}		args.shot			Name of Actor shot to be created
	 * @param		{integer}		args.width		Pixel distance between shots
	 */
	var _shoot = function(args) {
		if( _canShoot(args.shot) ) {
			switch(args.style) {
				case 'spread':
					_shootSpreadStyle(args);
					break;
				case 'straight':
					_shootStraightStyle(args);
					break;
				default:
					break;
			}

			// TODO: check if player, and if so do screen shake based on shot type
		}
	};

	/**
	 * Creates "shot" Actors oriented parallel with the firing Actor.
	 *
	 * @method	_shootStraightStyle
	 * @private
	 */
	var _shootStraightStyle = function(args) {
		var body		= (args.part) ? Matter.Body.getPart(_self.body, args.part) : _self.body;
		var angle		= body.angle;
		var basePoint	= {x: body.position.x, y: body.position.y};
		var spacing	= args.width / args.number;
		var position	= (args.number - 1) / 2;
		var i		= -1;

		switch(args.pattern) {
			case 'full':
				break;
			case 'random':
				var randIndex = Math.floor( Math.random() * args.number );
				break;
			case 'wave':
				var sinePos	= Math.sin(_self.fireTimer / 3.3) * (args.number / 2) + (args.number / 2);
				var roundSine	= Math.floor(sinePos);
				// convert into triangle wave
				// m - abs(i % (2*m) - m)
				//var triangleValue = 1 - Math.abs((_self.fireTimer % 2) - 1);
				//y = abs((x++ % 6) - 3); //This gives a triangular wave of period 6, oscillating between 3 and 0.
				break;
			case 'wipe':
				var mod = _self.fireTimer % args.number;
				break;
			default:
				break;
		}

		straightLoop:
		for(var p = -position; p <= position; p++) {
			i++;

			switch(args.pattern) {
				case 'full':
					break;
				case 'random':
					if( i != randIndex ) {
						continue straightLoop;
					}
					break;
				case 'wave':
					if( i != roundSine ) {
						continue straightLoop;
					}
					break;
				case 'wipe':
					if( i != mod ) {
						continue straightLoop;
					}
					break;
				default:
					break;
			}

			var shotPoint = {x: basePoint.x, y: basePoint.y};

			var adjX = 1, adjY = 1;

			if( angle > 0 && angle < Math.PI / 2 ) {
				adjX = -1;
			}
			if( angle < Math.PI / -2 && angle > -2 * Math.PI ) {
				adjY = -1;
			}

			shotPoint.x += Math.abs(Math.sin(angle)) * p * spacing * adjX;
			shotPoint.y += Math.abs(Math.cos(angle)) * p * spacing * adjY;

			if( args.offset ) {
				shotPoint.x += args.offset.x;
				shotPoint.y += args.offset.y;
			}

			Game.ActorFactory.create(_self.allegiance, ['shots', args.shot], shotPoint.x, shotPoint.y, {rotate: angle});

		}
	};

	/**
	 * Creates "shot" Actors with orientations arrayed out over a specified arc.
	 *
	 * @method	_shootSpreadStyle
	 * @private
	 */
	var _shootSpreadStyle = function(args) {
		var body		= (args.part) ? Matter.Body.getPart(_self.body, args.part) : _self.body;
		var basePoint	= {x: body.position.x, y: body.position.y};
		var increment	= args.arc / (args.number - 1);
		var arcEnd	= args.arc / 2;
		var i		= -1;

		switch(args.pattern) {
			case 'full':
				break;
			case 'random':
				var randIndex = Math.floor( Math.random() * args.number );
				break;
			case 'wave':
				var sinePos	= Math.sin(_self.fireTimer / 3.3) * (args.number / 2) + (args.number / 2);
				var roundSine	= Math.floor(sinePos);
				break;
			case 'wipe':
				var mod = _self.fireTimer % args.number;
				break;
			default:
				break;
		}

		angleLoop:
		for(var a = -arcEnd; a <= arcEnd; a+= increment) {
			i++;

			switch(args.pattern) {
				case 'full':
					break;
				case 'random':
					if( i != randIndex ) {
						continue angleLoop;
					}
					break;
				case 'wave':
					if( i != roundSine ) {
						continue angleLoop;
					}
					break;
				case 'wipe':
					if( i != mod ) {
						continue angleLoop;
					}
					break;
				default:
					break;
			}

			if( args.offset ) {
				basePoint.x += args.offset.x;
				basePoint.y += args.offset.y;
			}

			Game.ActorFactory.create(_self.allegiance, ['shots', args.shot], basePoint.x, basePoint.y, {rotate: body.angle + a});
		}
	};

	var _shootLaser = function(beamDamage, beamWidth) {
		if( _canShoot('laser') ) {
			var startPoint		= _self.body.position;
			var targetAngle	= _self.body.angle;

			var maxLength	= 1000;
			var beamLength	= 1;
			var beamIncr	= 2;
			var hitBody	= false;

			// Narrow down potential struck bodies to just those within the ray's full potential path
			var rayEndPoint = {
				x: startPoint.x + maxLength * Math.cos(targetAngle),
				y: startPoint.y + maxLength * Math.sin(targetAngle)
			};
			var potentialBodies = [];
			var potentialRay	= Matter.Query.ray(Matter.Composite.allBodies(Game.engine.world), startPoint, rayEndPoint, 1);

			for(var pair of potentialRay) {
				if( pair.bodyA.actorType == 'effect' ) {
					continue;
				}

				potentialBodies.push(pair.bodyA);
			}

			extendLoop:
			while( !hitBody ) {
				var targetPoint = {
					x: startPoint.x + beamLength * Math.cos(targetAngle),
					y: startPoint.y + beamLength * Math.sin(targetAngle)
				};

				var queryBodies = Matter.Query.point(potentialBodies, targetPoint);

				bodiesLoop:
				for(var body of queryBodies) {
					partsLoop:
					for(var part of body.parts) {
						if( part.isSensor || part.id == body.id ) {
							continue partsLoop;
						}

						var pinpointQuery = Matter.Query.point([part], targetPoint);

						if( pinpointQuery.length > 0 ) {
							var pinpointBody = pinpointQuery[0];

							if( !pinpointBody.actor ) {
								pinpointBody = pinpointBody.parent;
							}

							if( pinpointBody.actor.allegiance != _self.allegiance ) {
								hitBody = pinpointBody;
								break bodiesLoop;
							}
						}
					}
				}

				beamLength += beamIncr;

				if( beamLength > maxLength ) {
					break extendLoop;
				}
			}

			/*
			Matter.Render.addQueueAction(function(ctx, args) {
				var startPoint = args.startPoint;
				var targetPoint = args.targetPoint;

				ctx.strokeStyle = '#00ccff';
				ctx.lineWidth = 3;
				ctx.beginPath();
				ctx.moveTo(startPoint.x, startPoint.y);
				ctx.lineTo(targetPoint.x, targetPoint.y);
				ctx.stroke();
				ctx.closePath();

				// TODO: stack up multiple lines to create a gradient (orange-white-orange)
				// Can also have beam width and damage increase as _self.fireTimer goes up
			}, {startPoint: startPoint, targetPoint, targetPoint});
			*/
			// Set laser points as fixed local variables for use in render callback
			var laserStart = {x: startPoint.x, y: startPoint.y};
			var laserEnd	= {x: targetPoint.x, y: targetPoint.y};

			Game.EffectsLayer.addTemporaryItem(function(ctx) {
				ctx.strokeStyle = '#00ccff';
				ctx.lineWidth = 3;
				ctx.beginPath();
				ctx.moveTo(laserStart.x, laserStart.y);
				ctx.lineTo(laserEnd.x, laserEnd.y);
				ctx.stroke();
				ctx.closePath();
			}, 'laser-shot');

			// TODO: create laser burn animation at final target point?
			// It's possible this triggers one tick too soon. Possibly throw it into Render queue
			if( hitBody ) {
				// TODO: could also apply fireTimer here to reduce damage dealt by laser (only half of hits count) (_self.timer % 2 == 0)
				if( hitBody.actor.troupe ) {
					hitBody.actor.troupe.damage(beamDamage);
				}


				// TODO: possibly vary sound effects and visual effects

				// Create a visual effect 1/5th of the time laser is fired
				if( _self.fireTimer % 5 == 0 ) {
					Game.ActorFactory.create('neutral', ['effects', 'explosionSmall'], targetPoint.x, targetPoint.y);
				}
			}
		}
	};

	var _playSFX = function(soundName) {
		/*
		var source = Game.Audio.context.createBufferSource()
		source.buffer = Game.data.audio[soundName];
		source.start(0);
		*/

		// NOTE: save this timestamp when hooking into pause event?
		// Create a List that stores/retrieves/clears the timestamps
		var timestamp = Game.Audio.context.currentTime;
		// Save the sound effect that was started
		//var soundEffectID = Game.audio.startedList.addItem({sound: soundName, timestamp: timestamp});

		// TODO: hook into Pause event that stops all audio nodes

		// Pausing:
		// all nodes: stop()
		// var savedSoundEffect = Game.audio.startedList.getItem(soundEffectID);
		// var oldTimestamp = savedSoundEffect.timestamp;
		// var timestamp = Game.Audio.context.currentTime;
		// var elapsedTime = timestamp - oldTimestamp;
		// Game.audio.startedList.removeItem(soundEffectID);
		// var pausedEffectID = Game.audio.pausedList.addItem({elapsed: elapsedTime, sound: soundName});

		// Unpausing:
		// Get everything from Game.audio.pausedList
		// recreate sounds baed on elapsedTimes and soundNames

		// NOTE: generalize all this into some audio interface that can be utilized elsewhere
		// AudioInterface.play('name');
		// AudioInterface.pause();
		// AudioInterface.resume();
	};

	var _showVFX = function(type, number = 1, offset = false) {
		// switch statement for "type" argument
		// smallExplosion, mediumExplosion, largeExplosion, laserHit, slugImpact
		for(var n = 0; n < number; n++) {
			var basePoint = {x: _self.body.position.x, y: _self.body.position.y};

			if( offset ) {
				if( offset == 'random' ) {
					basePoint = _randomInteriorPoint();
				} else {
					basePoint.x += offset.x;
					basePoint.y += offset.y;
				}
			}

			Game.ActorFactory.create('neutral', ['effects', 'explosionSmall'], basePoint.x, basePoint.y);
		}
	};

	var _spawnActor = function(actorName = [], offset = {x: 0, y: 0}) {
		if( actorName.length == 0 ) {
			return;
		}

		var position = {
			x: _self.body.position.x + offset.x,
			y: _self.body.position.y + offset.y
		};

		// TODO:  get actor data
		// TODO: get dimensions from structure part specs?

		// check if area is spawnable
		// Game.ActorFactory.create(_self.allegiance, actorName, position.x, position.y);
	};

	var _spawnTroupe = function(troupeName, offset = {x: 0, y: 0}, limit) {
		if( !troupeName ) {
			return;
		}
		if( limit >= _self.spawnCounter ) {
			return;
		}

		var position = {
			x: _self.body.position.x + offset.x,
			y: _self.body.position.y + offset.y
		};

		var troupeData = Game.data.troupes[troupeName];

		if( Game.utilities.isSpawnableMapZone(_self.allegiance, troupeData.type, position, troupeData.dimensions.x, troupeData.dimensions.y) ) {
			Game.TroupeFactory.create(_self.allegiance, troupeName, position.x, position.y);
			_self.spawnCounter++;
		}
	};

	/**
	 * Reduces _threatCooldown and updates _threatLevel accordingly.
	 *
	 * @method	_decrementThreatTimer
	 * @private
	 */
	var _decrementThreatTimer = function() {
		if( _self.isPlayer() ) {
			return;
		}

		if( _threatCooldown > 0 ) {
			_threatCooldown--;
		} else {
			_target = false;
		}

		var level = Math.ceil(_threatCooldown / 500);

		_threatLevel = level;
	};

	/**
	 * Applies an actor's payload to another actor.
	 *
	 * @method	applyPayload
	 * @public
	 * @param		{object}		actor	Actor object to apply stat modifications to
	 */
	_self.applyPayload = function(actor) {
		// Cancel if no payload detected
		if( !_payload ) {
			return;
		}
		// Cancel if actor has already taken damage recently
		if( actor.hitTimer > 0 ) {
			return;
		}

		// Apply effects and items
		if( actor.troupe ) {
			var troupe = actor.troupe;

			if( _payload.health ) {
				actor.troupe.heal(_payload.health);
			}
			if( _payload.damage ) {
				troupe.damage(_payload.damage, _payload.penetration);
			}
			if( _payload.afflictions ) {
				troupe.addAfflictions(_payload.afflictions);
			}
			if( _payload.fixes ) {
				troupe.removeAfflictions(_payload.fixes);
			}
			if( _payload.commonItems ) {
				for(var commonItem of _payload.commonItems) {
					if( commonItem.current != 0 ) {
						troupe.adjustCommonItemCurrent(commonItem.type, commonItem.current);
					}
					if( commonItem.max != 0 ) {
						troupe.adjustCommonItemMax(commonItem.type, commonItem.max);
					}
				}
			}
			if( _payload.uniqueItems ) {
				troupe.addUniqueItems(_payload.uniqueItems);
			}
			if( _payload.force ) {
				// Get angle from payload source to target
				var angle = Game.utilities.getLineAngle(_self.body.position, actor.body.position);

				// Calculate force vector
				var forceV = {
					x:	Math.cos(angle) * _payload.force,
					y:	Math.sin(angle) * _payload.force
				};

				Matter.Body.applyForce(actor.body, actor.body.position, forceV);
			}
		}

		// Remove the actor/body and cause graphical effects
		if( _payload.selfDestruct ) {
			_self.spriteMode = 'active';
			_self.die();
			// BUG: die() will have actor become inert and thus sink, which we don't want
		}
	};

	_self.killShield = function() {
		// toggleShield(false);
		// set its HP to 0
	};

	_self.toggleShield = function(enable = true) {
		_self.body.isSensor = enabled;
	};

	/**
	 * Checks if damage has recently been incurred.
	 *
	 * @method	isDamaged
	 * @public
	 * @return	{boolean}
	 */
	_self.isDamaged = function() {
		if( _damageTimer > 0 ) {
			return true;
		}

		return false;
	};

	var _randomInteriorPoint = function() {
		var width		= _self.body.bounds.max.x - _self.body.bounds.min.x;
		var height	= _self.body.bounds.max.y - _self.body.bounds.min.y;

		var point = {
			x: Math.random() * width + _self.body.bounds.min.x,
			y: Math.random() * height + _self.body.bounds.min.y
		};

		return point;
	};

	/**
	 * Generate random points based on Actor dimensions, separated out into buckets.
	 *
	 * @method	randomInteriorPoints
	 * @public
	 * @param		{integer}		numPoints		Number of random points to generate. Cannot be less than the number of buckets
	 * @param		{integer}		numBuckets	Number of buckets to slot the generated points into. Buckets cannot be empty
	 * @return	{array}
	 */
	_self.randomInteriorPoints = function(numPoints = 1, numBuckets = 1) {
		if( numPoints < numBuckets ) {
			throw new Error('Actor.randomInteriorPoints must have at least as many buckets as generated points.');

			return [];
		}

		var buckets = [];

		// Generates a random point within the Actor's dimensions
		var getPoint = function(body) {
			var width		= body.bounds.max.x - body.bounds.min.x;
			var height	= body.bounds.max.y - body.bounds.min.y;

			var point = {
				x: Math.random() * width + body.bounds.min.x,
				y: Math.random() * height + body.bounds.min.y
			};

			return point;
		};

		// Create buckets and seed each one with a single point
		for(var b = 0; b < numBuckets; b++) {
			buckets.push( [getPoint(_self.body)] );
		}

		// Seed remaining points into random buckets
		for(var p = 0, overflow = numPoints - numBuckets; p < overflow; p++) {
			var randIndex = Math.floor( Math.random() * numBuckets );

			buckets[randIndex].push( getPoint(_self.body) );
		}

		// Return just an array of points if there's only one bucket
		if( buckets.length == 1 ) {
			buckets = buckets[0];
		}

		return buckets;
	};

	/**
	 * Adds one or more behaviors.
	 *
	 * @method	addBehaviors
	 * @public
	 * @param		{array}		behaviors		Array of objecs with properties: name, time
	 */
	_self.addBehaviors = function(behaviors = []) {
		for(var behavior of behaviors) {
			_behaviors.push(behavior);

			_cooldownTimers[behavior.name] = {
				start:	behavior.time,
				current:	behavior.time,
			}
		}
	};

	/**
	 * Removes one or more behaviors.
	 *
	 * @method	removeBehaviors
	 * @public
	 * @param		{array}			behaviors		Array of strings
	 */
	_self.removeBehaviors = function(behaviors = []) {
		loop1:
		for(var behavior of behaviors) {
			loop2:
			for(var i in _behaviors) {
				var possible = _behaviors[i];

				if( behavior == possible.name ) {
					delete _behaviors[i];

					break loop2;
				}
			}
		}
	};

	/**
	 * Sets a boolean value for an action's "disallow" property.
	 *
	 * @method	_setActionAllowance
	 * @private
	 *
	 * @param		{string}	action		An action name
	 * @param		{string}	allowance		Aliases for true/false
	 */
	var _setActionAllowance = function(actionName, allowance) {
		var disallow;

		if( allowance == 'allow' ) {
			disallow = false;
		}
		if( allowance == 'disallow' ) {
			disallow = true;
		}

		var actionContainers = [_battlecries, _behaviors, _deathrattles];

		for(var i in actionContainers) {
			var actionList = actionContainers[i];

			for(var action of actionList) {
				if( action.name == actionName ) {
					action.disallowed = disallow;
				}
			}
		}
	}

	/**
	 * Alias for _setActionAllowance
	 *
	 * @method	allowAction
	 * @public
	 * @param		{string}	action	An action name
	 */
	_self.allowAction = function(action) {
		_setActionAllowance(action, 'allow');
	};

	/**
	 * Alias for _setActionAllowance
	 *
	 * @method	disallowAction
	 * @public
	 * @param		{string}	action	An action name
	 */
	_self.disallowAction = function(action) {
		_setActionAllowance(action, 'disallow');
	};

	/**
	 * Getter method for _target.
	 *
	 * @method	getTarget
	 * @public
	 * @return	{object}
	 */
	_self.getTarget = function() {
		return _target;
	};

	_self.heading = function(point) {
		if( _self.troupe ) {
			_spreadSignal('setMovePoint', point);
		} else {
			_self.setMovePoint(point);
		}
	};

	_self.target = function(targetActor) {
		if( _self.troupe ) {
			_spreadSignal('setTarget', targetActor);
		} else {
			_self.setTarget(targetActor);
		}
	};

	/**
	 * Setter method for _target.
	 *
	 * @method	setTarget
	 * @public
	 * @param		{object}	targetActor	Value to be set
	 */
	_self.setTarget = function(targetActor) {
		_target = targetActor;
	};

	_self.targetPoint = function(firePoint) {
		if( _self.troupe ) {
			_spreadSignal('setFirePoint', firePoint);
		} else {
			_self.setFirePoint(firePoint);
		}
	};

	/**
	 * Setter method for _firePoint.
	 *
	 * @method	setFirePoint
	 * @public
	 * @param		{object}	firePoint		A point object
	 */
	_self.setFirePoint = function(firePoint) {
		_firePoint = firePoint;
	};

	// temporary?
	_self.getFirePoint = function() {
		return _firePoint;
	}

	/**
	 * Gate function for setThreatLevel.
	 *
	 *
	 */
	_self.applyThreatLevel = function(level) {
		if( _self.troupe ) {
			_spreadSignal('setThreatLevel', level);
		} else {
			_self.setThreatLevel(level);
		}
	};

	_self.setThreatLevel = function(level) {
		_threatlevel		= level;
		_threatCooldown	= level * 500;
	};

	/**
	 * Setter method for _course.
	 *
	 * @method	setCourse
	 * @public
	 * @param		{float}	angle		An angle in radians
	 */
	_self.setCourse = function(angle) {
		_course = angle;
	};

	/**
	 * Getter method for _type.
	 *
	 * @method	getType
	 * @public
	 * @return	{string}
	 */
	_self.getType = function() {
		return _type;
	};

	_self.getCourse = function() {
		return _course;
	};

	_self.getMovePoint = function() {
		return _movePoint;
	}

	_self.setMovePoint = function(movePoint) {
		_movePoint = movePoint;
	};

	_self.clearCourse = function() {
		_movePoint	= undefined;
		_course		= undefined;
	};

	_self.toggleVisible = function(visible = true) {
		_self.body.render.visible = visible;
	};

	_self.toggleCollidable = function(collidable = true) {
		_self.ignoreCollisions = collidable;
	};

	_self.getCalloutInfo = function() {
		return {
			affiliation:		_self.affiliation,
			classification:	_self.classification,
			name:			_self.name,
			role:			_self.role
		};
	};

	_self.isPlayer = function() {
		return (_self.allegiance == 'friendly');
	}

	_init(config);
};
