/**
 * Creates a new Actor.
 *
 * @class
 * @param		{string}		allegiance			Possible values are: 'friendly', 'enemy' or 'neutral'
 * @param		{object}		config				Configuration object
 * @param		{array}		config.battlecries
 * @param		{array}		config.behaviors
 * @param		{array}		config.deathrattles
 * @param		{object}		config.payload
 * @param		{string}		config.type
 * @param		{object}		body					Matter.js Body object
 */
var Actor = function(allegiance, config, body, trackableBody = false) {
	var _self				= this;
	var _aimPoint			= false;
	var _battlecries		= [];									// one time actions after creation
	var _behaviors			= [];									// actions done within loop
	var _braking			= false;
	var _cooldownTimers		= {};
	var _course			= false;
	var _damageTimer		= 0;
	var _deathrattles		= [];									// actions done during death sequence before destruction
	var _durationTimers		= {};
	var _firePoint			= false;									// position object
	var _movePoint			= false;									// position object
	var _moveWaypoints		= [];
	var _target			= false;									// an Actor
	var _targetSight		= false;
	var _threatLevel		= 0;
	var _threatCooldown		= 0;
	var _trackableBody		= trackableBody;
	var _type				= config.type || '';
	var _uiBoxes			= new List();

	_self.allegiance		= allegiance;								// enemy, friendly or neutral
	_self.body			= body;									// Matter.js Body
	_self.deathReady		= false;
	_self.deathTimer		= config.deathTimer || 1;					// duration of death sequence
	_self.facing			= 'e';
	_self.fireTimer		= 0;										// governs how long to show an actor's "damaged" sprite
	_self.hitTimer			= 0;										// governs whether a not an actor is capable of having a payload applied to it
	_self.ignoreCollisions	= false;
	_self.ignoreSight		= true;
	_self.inert			= config.inert || false;
	_self.isSleeping		= true;									// governs if loop should be run
	_self.menu			= config.menu || false;
	_self.parallax			= 0;
	_self.payload			= config.payload || false;
	_self.refreshSpriteFrame	= false;
	_self.role			= config.role || '';						// role within a Troupe
	_self.saveProfile		= {};
	_self.spawnCounter		= 0;
	_self.spriteAnimReversed	= false;
	_self.spriteMode		= 'normal';
	_self.spriteOrientTimer1	= false;
	_self.spriteOrientTimer2	= false;
	_self.troupe			= false;									// reference to parent Troupe

	// Primary mode states
	_self.attacking		= false;
	_self.damaged			= false;
	_self.moving			= false;
	_self.reacting			= false;
	_self.rotating			= false;
	// Secondary mode states
	_self.attackingAlt		= false;
	_self.damagedAlt		= false;
	_self.movingAlt		= false;
	_self.reactingAlt		= false;
	_self.rotatingAlt		= false;


	/**
	 * Initializes events and properties after instantiation.
	 *
	 * @method	_init
	 * @private
	 * @param		{object}	config		Determines starting stats
	 */
	var _init = function(config) {
		// Copy behaviors
		if( _type != 'terrain' && _type != 'doodad' ) {
			_battlecries	= Utilities.clone(config.battlecries || []);
			_behaviors	= Utilities.clone(config.behaviors || []);
			_deathrattles	= Utilities.clone(config.deathrattles || []);
		}

		var addCourseRecalibration = false;
		var squareWandering = false;
		// Add conditional behaviors
		for(var behavior of _behaviors) {
			if( behavior.name == 'follow-course' ) {
				addCourseRecalibration = true;
				//_behaviors.push({name: 'recalibrate-course', interval: 150});
			}
			if( behavior.name == 'wander' && behavior.square ) {
				squareWandering = true;
			}
			if( behavior.name == 'shoot' || behavior.name == 'shoot-beam' ) {
				_behaviors.push({name: 'check-target-sight', interval: 40});
			}
		}

		if( addCourseRecalibration ) {
			_behaviors.push({name: 'recalibrate-course', interval: 150, square: squareWandering});
		}

		if( _type != 'terrain' && _type != 'doodad' ) {
			//_setupCommonItems(config.commonItems || {});
			_resetCooldownTimers();
			_resetDurationTimers();
		}
	};

	function _spreadSignal(action, data) {
		if( _self.troupe ) {
			_self.troupe.sendSignal(action, data);
		}
	};

	/*
	_self.getPosition = function() {
		return {
			x:	_self.body.position.x,
			y:	_self.body.position.y
		};
	};
	*/

	_self.connectUIBox = function(boxName, box) {
		if( !_uiBoxes.getItem(boxName) ) {
			_uiBoxes.addItem(box);

			// Create position sync event
			Game.Events.subscribe('tick', function() {
				box.updatePosition( _self.getPosition() );
			}, 'actor-box-' + boxName + '-sync');
		}
	};

	_self.disconnectUIBox = function(boxName) {
		var item	= _uiBoxes.getItem(boxName);
		var box	= item.box;

		// Remove position sync event
		Game.Events.unsubscribe('tick', 'actor-box-' + boxName + '-sync');

		_uiBoxes.removeItem(boxName);
	};

	_self.destroyAllUIBoxes = function() {
		_uiBoxes.eachItem(function(box, order, boxName) {
			box.destruct();
		});
	};

	/**
	 * Checks if an actor is saveable.
	 *
	 * @method	hasSaveProfile
	 * @public
	 *
	 * @return	{boolean}
	 */
	_self.hasSaveProfile = function() {
		var validTypes = ['person', 'vehicle', 'flyer'];

		return ( validTypes.indexOf(_type) != -1 );
	};

	/**
	 *
	 *
	 *
	 * @return	{object}
	 */
	/*
	_self.getSaveProfile = function() {
		if( _self.troupe ) {
			return _self.troupe.getSaveProfile();
		} else {
			_self.saveProfile.x = _self.body.position.x;
			_self.saveProfile.y = _self.body.position.y;

			return _self.saveProfile;
		}
	};
	*/

	/**
	 * Removes all traces of this actor from the game.
	 *
	 * @method	beginDestructing
	 * @private
	 */
	_self.beginDestructing = function() {
		_self.deathReady = true;

		_self.destroyAllUIBoxes();

		_self.body.display	= null;

		_self.reacting		= false;
		_self.attacking	= false;
		_self.moving		= false;
		_self.damaged		= false;
		_self.updateSpriteMode();

		_becomeInert();
	};

	/**
	 * Cleans up this Actor and associated Body after deathrattle actions have taken place.
	 *
	 * @method	finishDestructing
	 * @private
	 * @param		{boolean}	skipTroupe	Allows for destructing of just this actor within its troupe
	 */
	_self.finishDestructing = function(skipTroupe = false) {
		_trackableBody = null; // unsure if this is necessary, but better safe than sorry

		// Remove the body
		if( !skipTroupe ) {
			if( _self.troupe ) {
				_self.troupe.killCommand();
			}
		}

		if( _self.body.mapgrid ) {
			Game.MapGrid.remove(_self.body, true);
		}

		Game.World.remove(_self.body);
	};

	/*
	_self.die = function() {
		if( _self.troupe ) {
			_self.troupe.destruct();
		} else {
			_self.beginDestructing();
		}
	};
	*/

	/**
	 *
	 *
	 *
	 */
	function _becomeInert() {
		_behaviors = [];

		_self.inert = true;

		_self.phaseOut();
	};

	/**
	 * Binds event handlers related to loop actions occuring during a game tick.
	 *
	 * @method	setupLoop
	 * @public
	 */
	_self.setupLoop = function() {
		// Skip creating a loop for things without behaviors (e.g. terrain)
		if( !_self.inert ) {
			Game.Events.subscribe('tick', _loop, 'body-' + _self.body.id);

			// If game is in sleeping state, flag these actors as also needing to be woken up, but leave them sleeping
			if( Game.State.sleeping ) {
				Game.State.sleepers.push(_self.body.id);
			} else {
				_self.isSleeping = false;
			}
		}
	};

	/**
	 *
	 *
	 * @return	{boolean}		Whether or not the Actor was previously awake when set to sleeping.
	 */
	/*
	_self.sleep = function() {
		if( !_self.isSleeping ) {
			Game.Events.unsubscribe('tick', 'body-' + _self.body.id);

			_self.isSleeping = true;
			Matter.Body.setVelocity(_self.body, {x: 0, y: 0});

			return true;
		}

		return false;
	};
	*/

	_self.wake = function() {
		if( _self.isSleeping ) {
			Game.Events.subscribe('tick', _loop, 'body-' + _self.body.id);

			_self.isSleeping = false;
		}
	}

	/**
	 * Wrapper function for everything done by an actor during a game tick.
	 *
	 * @method	_loop
	 * @private
	 */
	function _loop() {
		_doBehaviors();
		_checkDeathrattles();
		_decrementThreatTimer();
		_decrementCooldownTimers();
		_decreaseDamageTimer();
		_self.decreaseHitTimer();
		_checkTarget();
		_trackBody();
		//_checkCourse();
	};

	function _checkCourse() {
		if( _movePoint ) {

		}
	}

	/**
	 * Unsets _target if the target actor has become inert or too distant.
	 */
	function _checkTarget() {
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

			if( distance > 500 ) {
				_target = false;
				return;
			}
		}
	};

	/*
	function _decreaseHitTimer() {
		if( _self.hitTimer > 0 ) {
			_self.hitTimer--;
		}
	};

	_self.increaseHitTimer = function() {
		_self.hitTimer = 10;
	};
	*/

	/**
	 * Increases and maxes out the _damageTimer.
	 *
	 * @method	increaseDamageTimer
	 * @public
	 */
	_self.increaseDamageTimer = function() {
		_damageTimer = 3;

		_self.damaged = true;
		_self.updateSpriteMode();
		_alertEnemy();
	};

	/**
	 * Decreases the _damageTimer.
	 *
	 * @method	_decreaseDamageTimer
	 * @private
	 */
	function _decreaseDamageTimer() {
		_damageTimer--;

		if( _damageTimer < 0 ) {
			_damageTimer = 0;

			_self.damaged = false;
			_self.updateSpriteMode();
		}
	};

	/**
	 * Resets all cooldown timer to initial values.
	 *
	 * @method	_resetCooldownTimers
	 * @access	private
	 */
	function _resetCooldownTimers() {
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
	function _resetDurationTimers() {
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

	function _resetDurationTimer(behaviorKey) {
		_durationTimers[behaviorKey].current = 0;
	};

	/**
	 * Resets one cooldown timer to initial value.
	 *
	 * @method	_resetCooldownTimer
	 * @private
	 * @param		{string}			behaviorKey	A behavior name
	 */
	function _resetCooldownTimer(behaviorKey) {
		var resetTime = _cooldownTimers[behaviorKey].start;

		_cooldownTimers[behaviorKey].current = resetTime;

		_resetDurationTimer(behaviorKey);
	};

	function _incrementDurationTimer(behaviorKey) {
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
	function _decrementCooldownTimers() {
		for(var t in _cooldownTimers) {
			var timer = _cooldownTimers[t];

			timer.current--;

			if( timer.current < 0 ) {
				timer.current = 0;
			}
		}
	};

	function _trackBody() {
		if( _trackableBody ) {
			Matter.Body.setPosition(_self.body, _trackableBody.position);
		}
	}

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
	 * @param		{float}	action.force		Force magnitude
	 */
	function _doAction(action, skipChecks = false) {
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
			case 'aim':
				var hardTurn = action.hard || false;
				_aim(action.about, action.updateTroupeDirection, hardTurn);
				break;
			case 'alert-allies':
				_alertAllies(action.distance || 1);
				break;
			case 'check-target-sight':
				_checkTargetSight();
				break;
			case 'dash':
				_dash(action.pattern);
				break;
			case 'expire':
				_expire(action.detonate || false);
				return false;
				break;
			/*
			case 'fade':
				_fade(_durationTimers[key]);
				break;
			*/
			/*
			case 'flutter':
				_flutter(action.force);
				break;
			*/
			/*
			case 'fade-nearby':
				var query = Matter.Query.point(Game.World.all(), _self.body.position);
				//log(query.length);
				break;
			*/
			case 'follow-course':
				_followCourse(action.force, action.distance, action.updateDirection, action.straight);
				break;
			case 'modify-body':
				_modifyBody(action.property, action.value);
				break;
			case 'nudge':
				_nudge(action.force, action.angle);
				break;
			case 'orient':
				var hardTurn = action.hard || false;
				var animate = action.animate || false
				_orient(action.about, action.updateTroupeDirection, animate, hardTurn);
				break;
			case 'play-sfx':
				_playSFX(action.sound, action.mode);
				break;
			case 'pivot':
				_pivot(action.angle, action.about);
				break;
			/*
			case 'randomize-course':
				_randomizeCourse();
				break;
			*/
			case 'recalibrate-course':
				_recalibrateCourse(action.square);
				break;
			case 'scare-neutrals':
				_scareNeutrals(action.distance || 2);
				break;
			case 'shake-screen':
				_shakeScreen(action.pattern);
				break;
			case 'shoot':
				var args = {
					ammo:	action.ammo || false,
					arc:		action.arc || 0.8,
					number:	action.shots || 1,
					part:	action.part || false,
					pattern:	action.pattern || 'full',
					point:	action.point || false,
					number:	action.number || 1,
					recoil:	action.recoil || false,
					shot:	action.shot,
					style:	action.style || 'straight',
					width:	action.width || 0
				};
				_shoot(args);
				break;
			case 'shoot-beam':
				_shootBeam(action.beam);
				break;
			case 'show-vfx':
				var args = {
					part:	action.part || false,
					type:	action.type || false,
					number:	action.number || 1,
					radius:	action.radius || 0,
					sound:	action.sound
				};
				_showVFX(args);
				break;
			case 'spawn-items':
				_spawnItems();
				break;
			case 'spawn-troupe':
				_spawnTroupe(action.troupe, action.offset, action.limit);
				break;
			case 'thrust':
				_thrust(action.force);
				break;
			case 'wander':
				_wander(action.distance || 2, action.square);
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
	function _shouldExitAction(key) {
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
	function _adjustActionTimers(key) {
		_incrementDurationTimer(key);

		if( _cooldownTimers[key].current == 0 ) {
			_resetCooldownTimer(key);
		}
	};

	/**
	 * Attaches event that will fire _doBattlecries during next game tick.
	 *
	 * @method	setupBattlecries
	 * @public
	 */
	_self.setupBattlecries = function() {
		if( _battlecries.length > 0 ) {
			Game.Events.subscribe('tick', _doBattlecries, 'battlecries-' + _self.body.id);
		}
	};

	/**
	 * Loops through and acts out all battlecries.
	 *
	 * @method	_doBattlecries
	 * @private
	 */
	function _doBattlecries() {
		for(var battlecry of _battlecries ) {
			_doAction(battlecry, true);
		}

		_self.updateSpriteMode();

		Game.Events.unsubscribe('tick', 'battlecries-' + _self.body.id);
	};

	/**
	 * Loops through all behaviors and acts out those which are ready.
	 *
	 * @method	_doBehaviors
	 * @private
	 */
	function _doBehaviors() {
		if( !_self.deathReady ) {
			for(var behavior of _behaviors ) {
				_doAction(behavior);
			}

			_self.updateSpriteMode();
		}
	};

	function _checkDeathrattles() {
		if( _self.deathReady ) {
			_doDeathrattles();

			_self.deathTimer--;

			if( _self.deathTimer <= 0 ) {
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
	function _doDeathrattles() {
		for(var deathrattle of _deathrattles) {
			_doAction(deathrattle);
		}

		_self.updateSpriteMode();
	};

	_self.updateFacing = function(facing) {
		if( facing != _self.facing ) {
			_self.refreshSpriteFrame = true;
		}

		_self.facing		= facing;
		_self.body.facing	= facing;
	}

	function _updateFacingFromRotation(spreadToTroupe = false) {
		var facing	= '';
		var oldFacing	= _self.facing;

		facing = Utilities.getFacingFromAngle(_self.body.angle);

		if( spreadToTroupe ) {
			_spreadSignal('updateFacing', facing);
		} else {
			if( facing != oldFacing ) {
				_self.refreshSpriteFrame = true;
			}

			_self.facing		= facing;
			_self.body.facing	= facing;
		}
	}

	/**
	 * Updates facing based on a force value.
	 *
	 * @method	_updateFacingFromForce
	 * @private
	 * @param		{object}		forceV	A Matter.js force vector
	 */
	function _updateFacingFromForce(forceV) {
		// Find the angle of the force vector and use that to determine direction
		var facing	= '';
		var oldFacing	= _self.facing;
		var angle		= Math.atan2(-forceV.y, forceV.x);

		facing = Utilities.getFacingFromAngle(angle);

		if( facing != oldFacing ) {
			_self.refreshSpriteFrame = true;
		}

		_self.facing		= facing;
		_self.body.facing	= facing;
	};

	function _tempFadeOut(timer) {

	}

	function _fadeOut(timers) {
		var current	= timers.current;
		var start		= timers.start || 1;
		var reduced	= 1 - (current / start);

		_self.body.render.opacity = reduced;
	}

	function _fadeIn(timers) {
		var current	= timers.current;
		var start		= timers.start || 1;
		var reduced	= current / start;

		_self.body.render.opacity = reduced;
	}

	/**
	 * Gets a body sub-part. Returns false if no matching part is found.
	 *
	 * @method	_getActingPart
	 * @private
	 * @param		{string}	name		Value to match part's "partName" property against
	 * @return	{object}
	 */
	function _getActingPart(name) {
		for(var part of _self.body.parts) {
			if( part.partName == name ) {
				return part;
			}
		}

		return false;
	}

	/**
	 * Creates a new randomized angle for _course direction.
	 *
	 * @method	_randomizeCourse
	 * @private
	 */
	/*
	function _randomizeCourse() {
		_course = Math.random() * 2 * Math.PI;
	};
	*/

	// Query this actor's bounded area and apply payload to anything within it
	function _afflict() {
		var query = Matter.Query.region(Game.World.all(), _self.body.bounds);

		for(var body of query) {
			if( body.actor ) {
				_self.applyPayload(body.actor);
			}
		}
	}

	/**
	 * Pushes a body at a random angle.
	 *
	 * @method	_flutter
	 * @private
	 * @param		{number}	force	A scalar force value
	 */
	function _flutter(force) {
		var angle	= Math.random() * Math.PI * 2;

		var forceV = {
			x: force * Math.cos(angle),
			y: force * Math.sin(angle)
		};

		Matter.Body.applyForce(_self.body, _self.body.position, forceV);

		_updateFacingFromForce(forceV);
	}

	/**
	 * Pushes a body at a given angle if it has no set course.
	 *
	 * @method	_nudge
	 * @private
	 * @param		{number}	force	A scalar force value
	 * @param		{number}	angle	Angle in radians
	 */
	function _nudge(force, angle) {
		if( _movePoint ) {
			return;
		}

		if( angle == 'random' ) {
			angle = Math.PI * Math.random();
			angle = (Math.random() > 0.5) ? angle : -angle;
		}

		var forceV = {
			x: force * Math.cos(angle),
			y: force * Math.sin(angle)
		};

		Matter.Body.applyForce(_self.body, _self.body.position, forceV);

		_updateFacingFromForce(forceV);
	};

	function _alertEnemy() {
		if( _threatLevel == 0 && _self.allegiance == 'enemy' ) {
			if( Game.Player.exists() ) {
				// Tell enemy of player location
				var points = Game.MapGrid.pathfindPositions(_self.body.position, Game.Profile.player.position);

				_self.heading(points);
				_self.applyThreatLevel(1);
			}
		}
	};

	function _alertAllies(gridDistance) {
		if( _threatLevel >= 1 ) {
			// Ensure the radius here isn't too big, otherwise will start a chain reaction that will alert everything
			var gridPosition = Game.MapGrid.convertPosition(_self.body.position);

			var bounds = {
				min:	{x: gridPosition.x - gridDistance, y: gridPosition.y - gridDistance},
				max:	{x: gridPosition.x + gridDistance, y: gridPosition.y + gridDistance}
			};



			// alert within N map grid tiles radius
			// get all troupes of same allegiance
			// to troupes: set threat level, share fire point, share move point
		}
	}

	/**
	 * Picks a new, random movement position to move to.
	 *
	 * @method	_wander
	 * @private
	 * @param		{integer}		gridDistance		Maximum allowable wander range on MapGrid
	 * @param		{boolean}		square			Whether to only move along four directions rather than eight
	 */
	function _wander(gridDistance, square = false) {
		if( _threatLevel == 0 ) {
			var gridPosition = Game.MapGrid.convertPosition(_self.body.position);

			var bounds = {
				min:	{x: gridPosition.x - gridDistance, y: gridPosition.y - gridDistance},
				max:	{x: gridPosition.x + gridDistance, y: gridPosition.y + gridDistance}
			};

			// Get a free map grid point within a certain distance
			var freePoints = Game.MapGrid.getFreePoints(bounds);

			// Determine a random point amongst the free grid points
			var randFreeGridPoint = freePoints[ Math.floor( Math.random() * freePoints.length ) ];


			// Convert grid point back into a world position
			var targetFreePoint = Game.MapGrid.convertGridCoordinates(randFreeGridPoint);

			// Pathfind and set heading
			var points = Game.MapGrid.pathfindPositions(_self.body.position, targetFreePoint, square);

			_self.heading(points);
		}
	}

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

	function _shakeScreen(pattern) {
		Game.Viewport.shake(pattern);
	};

	function _checkTargetSight() {
		if( !_target && !_firePoint ) {
			_targetSight = false;
			return;
		}
		if( _firePoint ) {
			_targetSight = Game.MapGrid.hasLineOfSight(_self.body.position, _firePoint);
			return;
		}
		if( _target ) {
			_targetSight = Game.MapGrid.hasLineOfSight(_self.body.position, _target.body.position);
			return;
		}
	}

	function _hasShotAmmo(shot) {
		// Enemies can shoot regardless of ammo levels
		if( !_self.isPlayer() ) {
			return true;
		}

		// Check that troupe's common item current quantity is above 0
		if( _self.troupe ) {
			var balance = _self.troupe.getCommonItemCurrent(shot) - _self.troupe.getUsageModifier(shot);

			if( balance >= 0 ) {
				return true;
			}
		}

		return false;
	};

	function _hasShotTarget() {
		if( _target || _firePoint ) {
			return true;
		}

		return false;
	};

	// Prevent body from firing if its angle is too far off target
	function _hasShotAngle() {
		if( !_hasShotTarget() ) {
			return false;
		}

		var diff = _self.body.angle - _getAngleToTarget();

		return ( diff < -2 * Math.PI + 0.8 || diff > 2 * Math.PI - 0.8 || (diff < 0.8 && diff > -0.8) );
	};

	function _hasNoWarmup(warmup) {
		if( warmup >= _self.fireTimer ) {
			return false;
		}

		return true;
	}

	function _hasShotSight() {
		if( _self.ignoreSight ) {
			return true;
		}

		return _targetSight;
	}

	/**
	 * Checks if an actor should be capable of performing a shoot action. Also sets spriteMode based on outcome.
	 *
	 * @method	_canShoot
	 * @private
	 * @return	{boolean}
	 */
	function _canShoot(shot, warmup = 0) {
		if( _hasShotTarget() && _hasShotAngle() && _hasShotAmmo(shot) && _hasShotSight() ) {
			_self.fireTimer++;
			_self.attacking = true;

			if( _hasNoWarmup(warmup) ) {
				var shotCost = _self.troupe.getUsageModifier(shot);

				_self.troupe.adjustCommonItemCurrent(shot, -shotCost);

				return true;
			}

			return false;
		}

		_self.attacking = false;
		_self.fireTimer = 0;

		return false;
	};

	/**
	 * Returns the angle of the line made by the Actor's body position and the position of its target.
	 *
	 * @method	_getAngleToTarget
	 * @private
	 * @return	{number}
	 */
	function _getAngleToTarget() {
		var targetPoint;
		var startPoint = {x: _self.body.position.x, y: _self.body.position.y};

		if( _target ) {
			targetPoint = {x: _target.body.position.x, y: _target.body.position.y};
		}
		if( _firePoint ) {
			targetPoint = {x: _firePoint.x, y: _firePoint.y};
		}

		return Utilities.getLineAngle(startPoint, targetPoint);
	};

	function _recoil(recoil) {
		if( recoil ) {
			// Get angle from firer to target point
			var angle = Utilities.getLineAngle(_self.body.position, _firePoint);

			// Calculate force vector
			var forceV = {
				x:	Math.cos(angle) * -recoil,
				y:	Math.sin(angle) * -recoil
			};

			Matter.Body.applyForce(_self.body, _self.body.position, forceV);
		}
	}

	function _addPayloadModifiers(body) {
		if( _self.troupe && body.actor ) {
			if( body.actor.payload ) {
				for(var weaponType of Constants.WEAPON_TYPES) {
					if( weaponType == body.actor.payload.damageType ) {
						body.actor.payload.damage += _self.troupe.getAttackModifier(weaponType);
					}
				}
			}
		}
	}

	function _playSFX(soundName, mode = false) {
		if( mode ) {
			// attacking, moving, reacting
			if( !_self[mode] ) {
				return;
			}
		}

		Game.Audio.MenuEffects.playTrack(soundName);
	}

	/**
	 * Reduces _threatCooldown and updates _threatLevel accordingly.
	 *
	 * @method	_decrementThreatTimer
	 * @private
	 */
	function _decrementThreatTimer() {
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
	}

	function _applyPayloadToTroupe(troupe) {
		if( _self.payload.health ) {
			troupe.heal(_self.payload.health);
		}
		if( _self.payload.damage ) {
			troupe.damage(_self.payload.damage, _self.payload.damageType);
		}
		if( _self.payload.afflictions ) {
			troupe.addAfflictions(_self.payload.afflictions);
		}
		if( _self.payload.fixes ) {
			troupe.removeAfflictions(_self.payload.fixes);
		}
		if( _self.payload.commonItems ) {
			for(var commonItem of _self.payload.commonItems) {
				if( commonItem.current != 0 ) {
					troupe.adjustCommonItemCurrent(commonItem.type, commonItem.amount);
				}
			}
		}
		if( _self.payload.modifierItems ) {
			for(var name in _self.payload.modifierItems) {
				var modifierName	= _self.payload.modifierItems[name];
				var modifier		= Data.modifierItems[modifierName];

				if( modifier ) {
					troupe.addModifier(modifier, modifierName);
				}
			}
		}
		if( _self.payload.uniqueItems ) {
			troupe.addUniqueItems(_self.payload.uniqueItems);
		}
		/*
		// if _self.payload.setWeapon???

		if( actor.isPlayer() ) {
			Game.Player.setWeaponType();
		}
		*/
		if( _self.payload.knockback ) {
			// Get angle from payload source to target
			var angle = Utilities.getLineAngle(_self.body.position, actor.body.position);

			// Calculate force vector
			var forceV = {
				x:	Math.cos(angle) * _self.payload.knockback,
				y:	Math.sin(angle) * _self.payload.knockback
			};

			Matter.Body.applyForce(actor.body, actor.body.position, forceV);
		}
	}

	/**
	 * Applies an actor's payload to another actor.
	 *
	 * @method	applyPayload
	 * @public
	 * @param		{object}		actor	Actor object to apply stat modifications to
	 */
	_self.applyPayload = function(actor = false) {
		// Cancel if no payload detected
		if( !_self.payload ) {
			return;
		}

		if( _self.payload.radius ) {
			var halfWidth	= _self.payload.radius;
			var halfHeight	= _self.payload.radius;

			var bounds = {
				min:	{
					x:	_self.body.position.x - halfWidth,
					y:	_self.body.position.y - halfHeight
				},
				max:	{
					x:	_self.body.position.x + halfWidth,
					y:	_self.body.position.y + halfHeight
				}
			};

			if( !bounds ) {
				return;
			}

			var renderFunc = function(ctx) {
				ctx.strokeStyle = '#ff0077';
				ctx.translate(bounds.min.x - Game.State.viewport.x, bounds.min.y - Game.State.viewport.y);
				ctx.strokeRect(0, 0, _self.payload.radius*2, _self.payload.radius*2);
				ctx.translate(-(bounds.min.x - Game.State.viewport.x), -(bounds.min.y - Game.State.viewport.y));
			};

			Game.VisualFX.addTemporaryElement('xx', renderFunc, _self.body.id);

			var query = Matter.Query.region(Game.World.all(), bounds);

			bodiesLoop:
			for(var body of query) {
				partsLoop:
				for(var part of body.parts) {
					if( part.isSensor || part.id == body.id || part.characterType == 'item' ) {
						continue partsLoop;
					}

					// Recheck bounds for specifically this body part
					var partQuery = Matter.Query.region([part], bounds);

					if( partQuery.length > 0 ) {
						var aoeBody = partQuery[0];

						if( aoeBody.actor ) {
							if( aoeBody.actor.allegiance != _self.allegiance ) {
								if( aoeBody.actor.troupe ) {
									_applyPayloadToTroupe(aoeBody.actor.troupe);
								}
							}
						}
					}
				}
			}
		} else {
			// Cancel if actor has already taken damage recently
			if( actor.hitTimer == 0 ) {
				// Apply effects and items
				if( actor.troupe ) {
					_applyPayloadToTroupe(actor.troupe);
				}
			}
		}

		// Remove the actor/body and cause graphical effects
		if( _self.payload.selfDestruct ) {
			_self.reacting = true;
			_self.updateSpriteMode();
			_self.die();
		}
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

	function _randomInteriorPoint(part = false, radius = 0) {
		var body = _self.body;

		if( part ) {
			body = Matter.Body.getPart(_self.body, part);
		}

		if( radius ) {
			var randX = Math.random() * radius;
			var randY = Math.random() * radius;

			if( Math.random() > 0.5 ) {
				randX = -randX;
			}
			if( Math.random() > 0.5 ) {
				randY = -randY;
			}

			var point = {
				x:	_self.body.position.x + randX,
				y:	_self.body.position.y + randY
			};
		} else {
			var width		= body.bounds.max.x - body.bounds.min.x;
			var height	= body.bounds.max.y - body.bounds.min.y;

			var point = {
				x: Math.random() * width + body.bounds.min.x,
				y: Math.random() * height + body.bounds.min.y
			};
		}

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

	function _modifyBody(property, value) {
		switch(property) {
			case 'ballistic':
				Matter.Body.setBallistic(_self.body, new Boolean(value) );
				break;
			default:
				break;
		}
	}

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
	function _setActionAllowance(actionName, allowance) {
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

	_self.heading = function(points) {
		if( _self.troupe ) {
			_spreadSignal('setMovePoint', points);
		} else {
			_self.setMovePoint(points);
		}
	};

	_self.direction = function(angle) {
		if( _self.troupe ) {
			_spreadSignal('setDirection', angle);
		} else {
			_self.setDirection(angle);
		}
	}

	_self.target = function(targetActor) {
		if( _self.troupe ) {
			_spreadSignal('setTarget', targetActor);
		} else {
			_self.setTarget(targetActor);
		}
	};

	_self.setDirection = function(angle) {
		Matter.Body.setAngle(_self.body, angle);
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

	_self.aimPoint = function(aimPoint) {
		if( _self.troupe ) {
			_spreadSignal('setAimPoint', aimPoint);
		} else {
			_self.setAimPoint(aimPoint);
		}
	};

	_self.targetPoint = function(firePoint) {
		if( _self.troupe ) {
			_spreadSignal('setFirePoint', firePoint);
		} else {
			_self.setFirePoint(firePoint);
		}
	};

	_self.setAimPoint = function(aimPoint) {
		_aimPoint = aimPoint;
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

	_self.getMoveWaypoints = function() {
		return _moveWaypoints;
	};

	_self.setMovePoint = function(movePoints) {
		if( movePoints ) {
			_moveWaypoints	= movePoints;
			_movePoint	= false;

			if( movePoints.length > 0 ) {
				var lastPoint	= movePoints[movePoints.length - 1];
				var angle		= Utilities.getLineAngle(_self.body.position, lastPoint);

				_self.setCourse(angle);
			}
		} else {
			_self.clearCourse();
		}
	};

	_self.clearCourse = function() {
		_movePoint	= undefined;
		_course		= undefined;
		_moveWaypoints	= [];

		_self.moving = false;
	};

	/*
	_self.brake = function() {
		// reduce speed and clear course?
	};
	*/

	_self.toggleVisible = function(visible = true) {
		_self.body.render.visible = visible;
	};

	/**
	 * Toggles the actor's flag that prevents its body's sensor collision events from firing.
	 */
	_self.toggleSensorCollisons = function(collidable = true) {
		_self.ignoreCollisions = collidable;
	};

	/**
	 * Replaces all of the actor's parts' collision filters with that of the non-colliding "effect" type. Cannot be undone.
	 *
	 * @method	phaseOut
	 * @public
	 */
	_self.phaseOut = function() {
		for( var part of _self.body.parts ) {
			part.collisionFilter = {
				category:		Data.bitmasks['neutral']['effect'].category,
				mask:		Data.bitmasks['neutral']['effect'].mask
			};
		}
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
	};

	_self.getBasicStat = function(stat) {
		if( _self.troupe ) {
			var stat = {
				current:	_self.troupe.getCommonItemCurrent(stat),
				max:		_self.troupe.getCommonItemMax(stat)
			};

			return stat;
		}

		return false;
	};

	_self.getPayload = function() {
		return _self.payload;
	};

	/* ---- Actions ---- */

	/**
	 * Rotates body slightly towards _target
	 *
	 * @method	_aim
	 * @private
	 */
	function _aim(partName = false, updateTroupeDirection = false, hardTurn = false) {
		if( _aimPoint || _target || _firePoint ) {
			var targetPoint;

			if( _aimPoint ) {
				targetPoint = _aimPoint;
			}
			// Target and fire points take priority over aimPoint
			if( _target || _firePoint ) {
				if( _firePoint ) {
					targetPoint = _firePoint;
				} else {
					targetPoint = _target.body.position;
				}
			}

			_self.rotating = true;

			if( partName ) {
				// TODO: bugged. Need to adjust how orientation works when a sub-part is specified
				// finish writing: Body.orientToPointAbout()
				var aboutPart = _getActingPart(partName);

				if( aboutPart ) {
					Matter.Body.orientToPoint(aboutPart, targetPoint, hardTurn);
				}
			} else {
				Matter.Body.orientToPoint(_self.body, targetPoint, hardTurn);
			}

			_updateFacingFromRotation(updateTroupeDirection);

			// Add a delayed sprite facing check to account for rotation due to angular momentum
			if( _self.spriteOrientTimer1 ) {
				clearTimeout(_self.spriteOrientTimer1);
				clearTimeout(_self.spriteOrientTimer2);
			}

			_self.spriteOrientTimer1 = setTimeout(_updateFacingFromRotation, 1000);
			_self.spriteOrientTimer2 = setTimeout(_updateFacingFromRotation, 2000);
		} else {
			_self.rotating = false;
		}
	}

	function _brake() {
		// Prevent overlapping "brake" actions
		if( !_braking ) {
			_braking = true;

			var origFriction = body.frictionAir;

			body.frictionAir = 0.8;

			setTimeout(function() {
				body.frictionAir = origFriction;
				_braking = false;
			}, 200);
		}
	}

	function _dash(pattern = '|') {
		// check if target is within intermediate points, and end point is not filled
		switch(pattern) {
			case '|': // straight
				break;
			case 'C': // curve forward and left or right
				break;
			case 'L': // rook movement
				break;
			case 'S': // like Tetris S or Z
				break;
			case 'Z': // forward, back + diagonal, forward
				break;
			default:
				break;
		}

		// Move actor to end point and create shadows along intermediate points
		// Also possibly do screen flash
		// Will need to update actor facing based on end point
	}

	/**
	 * An alias for die that allows it to be used as an action.
	 *
	 * @method	_expire
	 * @private
	 */
	function _expire(detonate = false) {
		if( detonate ) {
			_self.applyPayload();
		} else {
			_self.die();
		}
	}

	function _followCourse(force, distance = 0, updateDirection = true, straightMovement = false) {
		if( !_movePoint && _moveWaypoints.length == 0 ) {
			// add check for when _course === 0.00
			_self.moving = false;

			return;
		}
		if( !_course && _course !== 0 ) {
			return;
		}

		function setNextWaypoint() {
			_movePoint = _moveWaypoints.pop();

			// Re-calculate course
			var angle	= Utilities.getLineAngle(_self.body.position, _movePoint);
			_self.setCourse(angle);
		}

		// See if the body should stop at a _movePoint
		if( _movePoint ) {
			// Check if body is within a certain distance of _movePoint
			var boundA = {x: _movePoint.x - distance, y: _movePoint.y - distance};
			var boundB = {x: _movePoint.x + distance, y: _movePoint.y + distance};

			if( Utilities.pointIntersectsRegion(_self.body.position, boundA, boundB) ) {
				if( _moveWaypoints.length == 0 ) {
					_self.clearCourse();

					_brake();

					return;
				} else {
					setNextWaypoint();
				}
			}
		} else {
			setNextWaypoint();
		}

		if( straightMovement ) {
			var Fx	= force * Math.cos(_self.body.angle);
			var Fy	= force * Math.sin(_self.body.angle);
		} else {
			var Fx	= force * Math.cos(_course);
			var Fy	= force * Math.sin(_course);
		}

		var forceV	= {x: Fx, y: Fy};

		Matter.Body.applyForce(_self.body, _self.body.position, forceV);

		_self.moving = true;

		if( updateDirection ) {
			_updateFacingFromForce(forceV);
		}
	}

	/**
	 * Rotates body slightly towards _course
	 *
	 * @method	_orient
	 * @private
	 */
	function _orient(partName = false, updateTroupeDirection = false, animate = false, hardTurn = false) {
		if( _course ) {
			// Orient towards _course
			Matter.Body.orientToAngle(_self.body, _course, hardTurn);

			/*
			if( animate ) {
				_self.rotating = true;

				_updateFacingFromRotation(updateTroupeDirection);
			}
			*/
			//_updateFacingFromRotation(updateTroupeDirection);
			_self.rotating = true;

			_updateFacingFromRotation(updateTroupeDirection);
		} else {
			_self.rotating = false;
		}
	}

	/**
	 * Rotates body about its center or the center of one of its parts. Does not impart angular momentum.
	 *
	 * @method	_pivot
	 * @private
	 * @param		{float}	radians		Amount to rotate
	 * @param		{string}	partName		Name of part to rotate about. Defaults to composited body's center
	 */
	function _pivot(radians, partName = false) {
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

		_self.rotating = true;
	}

	function _recalibrateCourse(square = false) {
		if( _moveWaypoints && _moveWaypoints.length > 0 && (_type == 'vehicle' || _type == 'person' || _type == 'flyer' ) ) {
			// Pathfind a course to target
			//var points = [_movePoint];
			var points = Game.MapGrid.pathfindPositions(_self.body.position, _moveWaypoints[0], square);
		} else if( _movePoint ) {
			// Set a direct course for target
			var points = [_movePoint];
		}

		if( points ) {
			_self.heading(points);
			//_self.setMovePoint(points);
		}
	}

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
	 * @param		{number}		args.recoil		Applies force on firer opposite the target point
	 * @param		{string}		args.shot			Name of Actor shot to be created
	 * @param		{integer}		args.width		Pixel distance between shots
	 */
	function _shoot(args) {
		if( _canShoot(args.ammo) ) {
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

			_recoil(args.recoil);
		}
	}

	function _shootBeam(beamName) {
		var beamData = Data.beams[beamName];

		if( !beamData ) {
			return;
		}

		if( _canShoot(beamData.ammo, beamData.warmup) ) {
			/*
			if( _self.fireTimer == 1 && beamData.startEffect ) {
				EffectsFactory.create(beamData.startEffect, _self.body.position.x, _self.body.position.y, {sound: false});
			}
			*/

			if( _self.fireTimer % 3 == 0 ) {
				return;
			}
			var startPoint		= _self.body.position;
			var targetAngle	= _self.body.angle;

			var damage		= beamData.damage || 0;
			var frequency		= beamData.frequency || 5;
			var knockback		= beamData.knockback || false;
			var maxLength		= beamData.maxLength || 700;
			var beamLength		= 1;
			var beamIncr		= 4;
			var hitBody		= false;
			var renderPattern	= (Data.renderPatterns[beamData.pattern]) ? Data.renderPatterns[beamData.pattern] : function(){};

			_recoil(beamData.recoil); log('beam recoiling');

			// Narrow down potential struck bodies to just those within the ray's full potential path
			var rayEndPoint = {
				x: startPoint.x + maxLength * Math.cos(targetAngle),
				y: startPoint.y + maxLength * Math.sin(targetAngle)
			};
			var potentialBodies = [];
			var potentialRay	= Matter.Query.ray(Game.World.all(), startPoint, rayEndPoint, 1);

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
						if( part.isSensor || part.id == body.id || part.characterType == 'item' || part.characterType == 'doodad' ) {
							continue partsLoop;
						}

						var pinpointQuery = Matter.Query.point([part], targetPoint);

						if( pinpointQuery.length > 0 ) {
							var pinpointBody = pinpointQuery[0];

							if( !pinpointBody.actor ) {
								pinpointBody = pinpointBody.parent;
							}

							// Check once more for an actor
							if( !pinpointBody.actor ) {
								continue partsLoop;
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

			if( beamData.drawThrough ) {
				var hitPoint = {
					x:	targetPoint.x,
					y:	targetPoint.y
				};

				targetPoint = {
					x: startPoint.x + maxLength * Math.cos(targetAngle),
					y: startPoint.y + maxLength * Math.sin(targetAngle)
				};
			}

			// Set laser points as fixed local variables for use in render callback
			var laserStart = {x: startPoint.x, y: startPoint.y};
			var laserEnd	= {x: targetPoint.x, y: targetPoint.y};

			// Calculate render points based on position of viewport
			var renderStart = {
				x:	laserStart.x - Game.State.viewport.x,
				y:	laserStart.y - Game.State.viewport.y
			};
			var renderEnd = {
				x:	laserEnd.x - Game.State.viewport.x,
				y:	laserEnd.y - Game.State.viewport.y
			};

			var renderingFunction = function(ctx) {
				renderPattern(ctx, renderStart, renderEnd, _self.fireTimer);
			};

			Game.VisualFX.addTemporaryElement('lasers', renderingFunction, 'laser-shot-' + _self.body.id);
			Game.VisualFX.addDelayedTemporaryElement('lasers', renderingFunction, _self.fireTimer + '-delayed1-laser-shot-' + _self.body.id, 1);
			Game.VisualFX.addDelayedTemporaryElement('lasers', renderingFunction, _self.fireTimer + '-delayed2-laser-shot-' + _self.body.id, 2);

			if( beamData.ghost ) {
				Game.VisualFX.addDelayedTemporaryElement('lasers', renderingFunction, _self.fireTimer + '-delayed6-laser-shot-' + _self.body.id, 6);
				Game.VisualFX.addDelayedTemporaryElement('lasers', renderingFunction, _self.fireTimer + '-delayed9-laser-shot-' + _self.body.id, 9);
			}


			// Reduce the frequency of hits
			if( _self.fireTimer % frequency == 0 ) {
				if( beamData.sourceEffect ) {
					EffectsFactory.create(beamData.sourceEffect, 0, 0);
				}
				if( hitBody ) {
					// If the beam's accuracy value is less than 1, roll a chance to hit and disregard the hit body if the roll fails
					var successfulHit	= true;
					var chanceToHit	= beamData.accuracy || 1;

					if( chanceToHit < 1 ) {
						successfulHit = ( Math.random() < chanceToHit ) ? true : false;
					}

					if( successfulHit ) {
						// Apply damage to target
						if( hitBody.actor.troupe ) {
							if( _self.troupe ) {
								damage += _self.troupe.getAttackModifier(beamData.ammo);
							}

							hitBody.actor.troupe.damage(damage, 'energy');

							if( knockback ) {
								// Calculate force vector
								var forceV = {
									x:	Math.cos(targetAngle) * knockback,
									y:	Math.sin(targetAngle) * knockback
								};

								var leadBody = hitBody.actor.troupe.getLead().body;

								Matter.Body.applyForce(leadBody, leadBody.position, forceV);
							}
						}

						// Create hit effect
						if( beamData.hitEffect ) {
							var effectPoint = {
								x:	targetPoint.x,
								y:	targetPoint.y
							};

							if( beamData.drawThrough ) {
								effectPoint.x = hitPoint.x;
								effectPoint.y = hitPoint.y;
							}

							EffectsFactory.create(beamData.hitEffect, effectPoint.x, effectPoint.y, {sound: false});
						}
					}
				}
			}
		}
	}

	/**
	 * Creates "shot" Actors with orientations arrayed out over a specified arc.
	 *
	 * @method	_shootSpreadStyle
	 * @private
	 */
	function _shootSpreadStyle(args) {
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

			ActorFactory.create(_self.allegiance, ['shots', args.shot], basePoint.x, basePoint.y, {rotate: body.angle + a});
		}
	}

	/**
	 * Creates "shot" Actors oriented parallel with the firing Actor.
	 *
	 * @method	_shootStraightStyle
	 * @private
	 */
	function _shootStraightStyle(args) {
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

			var body = ActorFactory.create(_self.allegiance, ['shots', args.shot], shotPoint.x, shotPoint.y, {rotate: angle});

			_addPayloadModifiers(body);

			Game.World.add(body);
		}
	}

	function _showVFX(options) {
		for(var n = 0; n < options.number; n++) {
			var basePoint	= {x: _self.body.position.x, y: _self.body.position.y};
			var sound		= options.sound;

			if( options.radius || options.part ) {
				basePoint = _randomInteriorPoint(options.part, options.radius);
			} else {
				basePoint.x += options.offset.x;
				basePoint.y += options.offset.y;
			}

			// Prevent redundant simultaneous sound effects
			if( n > 0 ) {
				sound = false;
			}

			EffectsFactory.create(options.type, basePoint.x, basePoint.y, {sound: sound});
		}
	}

	function _spawnActor(actorName = [], offset = {x: 0, y: 0}) {
		if( actorName.length == 0 ) {
			return;
		}

		var position = {
			x: _self.body.position.x + offset.x,
			y: _self.body.position.y + offset.y
		};

		// TODO: get actor data
		// TODO: get dimensions from structure part specs?

		// check if area is spawnable
		// var spawnedBody = Game.ActorFactory.create(_self.allegiance, actorName, position.x, position.y);
		// Game.World.add(spawnedBody);
	}

	/**
	 *
	 *
	 *
	 *
	 */
	function _spawnItems(aboutPart = false) {
		// From 0 - 5 items possible
		var number = Math.floor( Math.random() * 6 );

		if( number == 0 ) {
			return;
		}
		var validSpawnables = {'common': [], 'modifier': [], 'unique': []};

		// Assemble list of items which can spawn at this level and which the player does not already possess
		for(var l = 1; l <= Game.Profile.player.level; l++) {
			var level = Data.Levels[String(l)];

			for(var itemType in validSpawnables) {
				if( level[`${itemType}Items`] && itemType != 'common' ) {
					var nonDuplicates = level[`${itemType}Items`].filter( function(itemName) { return !Game.Player.hasItem(itemName); } );

					validSpawnables[itemType] = validSpawnables[itemType].concat(nonDuplicates);
				}
			}
		}

		for(var i = 0; i < number; i++) {
			// TODO: set common chance to .98 (1 in 99) during testing?
			// Determine if item is common or unique, then get a random item name of that type
			var type = ( Math.random() > 0.85 ) ? 'modifier' : 'common';

			type = 'common';

			// TODO: if "modifier", have chance to be either "modifier" or "unqiue" (weapon)

			if( validSpawnables[type].length > 0 ) {
				var itemName	= validSpawnables[type].random();
				var itemBody	= ItemFactory.createCommon(itemName, _self.body.position.x, _self.body.position.y);

				if( itemBody ) {
					Game.World.add(itemBody);
				}

				// If an uncommon item spawned, remove it from the list of possibilitie this spawn sequence
				if( type != 'common' ) {
					validSpawnables[type].remove(itemName);
				}
			}
		}
	}

	function _spawnTroupe(troupeName, offset = {x: 0, y: 0}, limit) {
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

		if( Utilities.isSpawnableMapZone(_self.allegiance, troupeData.type, position, troupeData.dimensions.x, troupeData.dimensions.y) ) {
			var body = TroupeFactory.create(_self.allegiance, troupeName, position.x, position.y);

			Game.World.add(body);

			_self.spawnCounter++;
		}
	}

	/**
	 * Pushes a body along at its present heading.
	 *
	 * @method	_thrust
	 * @private
	 * @param		{number}	force	Force to be applied to body
	 */
	function _thrust(force) {
		if( typeof(force) != 'number' ) {
			return;
		}

		Matter.Body.thrust(_self.body, force);


		_updateFacingFromForce(force);
	}

	_init(config);
};

Actor.prototype.getPosition = function() {
	return {
		x:	this.body.position.x,
		y:	this.body.position.y
	};
};

/**
 *
 *
 *
 * @return	{object}
 */
Actor.prototype.getSaveProfile = function() {
	if( this.troupe ) {
		return this.troupe.getSaveProfile();
	} else {
		this.saveProfile.x = this.body.position.x;
		this.saveProfile.y = this.body.position.y;

		return this.saveProfile;
	}
};

Actor.prototype.die = function() {
	if( this.troupe ) {
		this.troupe.destruct();
	} else {
		this.beginDestructing();
	}
};

/**
 *
 *
 * @return	{boolean}		Whether or not the Actor was previously awake when set to sleeping.
 */
Actor.prototype.sleep = function() {
	if( !this.isSleeping ) {
		Game.Events.unsubscribe('tick', 'body-' + this.body.id);

		this.isSleeping = true;
		Matter.Body.setVelocity(this.body, {x: 0, y: 0});

		return true;
	}

	return false;
};

Actor.prototype.updateSpriteMode = function(informTroupe = true) {
	var newMode = '';
	var oldMode = this.spriteMode;

	if( this.attacking || this.moving || this.rotating || this.reacting || this.damaged || this.attackingAlt || this.movingAlt || this.reactingAlt || this.damagedAlt ) {
		var modes = [];

		if( this.attacking || this.attackingAlt ) {
			modes.push('attacking');
		}
		if( this.moving || this.rotating || this.movingAlt ) {
			modes.push('moving');
		}
		if( this.reacting || this.reactingAlt ) {
			modes.push('reacting');
		}
		if( this.damaged || this.damagedAlt ) {
			modes.push('damaged');
		}

		newMode = modes.join('-');
	} else {
		newMode = 'normal';
	}

	this.spriteMode = newMode;

	// Check if sprite frame index should be refreshed
	if( oldMode != newMode ) {
		this.refreshSpriteFrame = true;
	}

	if( this.troupe && informTroupe ) {
		this.troupe.updateSpriteMode();
	}
};

Actor.prototype.receiveTroupeSpriteMode = function(modeData) {
	this.attackingAlt	= modeData.attacking;
	this.damagedAlt	= modeData.damaged;
	this.movingAlt		= modeData.moving;
	this.reactingAlt	= modeData.reacting;

	this.updateSpriteMode(false);
};

Actor.prototype.decreaseHitTimer = function() {
	if( this.hitTimer > 0 ) {
		this.hitTimer--;
	}
};

Actor.prototype.increaseHitTimer = function() {
	this.hitTimer = 10;
};


module.exports = Actor;
