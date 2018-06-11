var Game = Game || {};

Game.Troupe = function(composite, config = {}) {
	var _self			= this;
	var _actors		= [];
	var _afflictions	= [];
	var _commonItems	= {};
	var _composite		= composite;
	var _killSwitches	= 0;
	var _lead			= false;
	var _uniqueItems	= [];

	_self.armor			= config.armor || 0;
	_self.indestructible	= config.indestructible || false;
	_self.name			= config.name || '';


	var _init = function(config) {
		_setupCommonItems(config.commonItems || {});
	};

	var _setupCommonItems = function(config) {
		var commonItemTypes = ['health', 'torpedo', 'laser', 'smartRounds', 'missile', 'kineticSlug', 'rocket']; // move this into constants..?

		for(var common of commonItemTypes) {
			// Setup basic stat
			_commonItems[common]			= {};
			_commonItems[common]['current']	= 0;
			_commonItems[common]['max']		= 0;

			// Apply provided values
			if( config[common] ) {
				var providedStat = config[common];

				if( providedStat.current ) {
					_commonItems[common]['current'] = providedStat.current;
				}
				if( providedStat.max ) {
					_commonItems[common]['max'] = providedStat.max;
				}
			}
		}
	};

	/**
	 * Adjusts a common item's current value by a provided amount and returns the new current value.
	 *
	 * @method	adjustCommonItemCurrent
	 * @public
	 * @param		{string}		type		Item slug
	 * @param		{integer}		type		Item quantity
	 * @return	{integer}
	 */
	_self.adjustCommonItemCurrent = function(type, adj = 0) {
		var item = _commonItems[type];

		if( typeof(adj) != 'number' ) {
			return cur;
		}

		item['current'] += Math.floor(adj);

		// Current cannot exceed maximum
		if( item['current'] > item['max'] ) {
			item['current'] = item['max'];
		}
		// Current cannot go below zero
		if( item['current'] < 0 ) {
			item['current'] = 0;
		}

		return item['current'];
	};

	/**
	 * Adjusts a common item's maximum value by a provided amount and returns the new maximum value.
	 *
	 * @method	adjustCommonItemMax
	 * @public
	 * @param		{string}		type		Item slug
	 * @param		{integer}		type		Item quantity
	 * @return	{integer}
	 */
	_self.adjustCommonItemMax = function(type, adj = 0) {
		var cur = _commonItems[type]['current'];
		var max = _commonItems[type]['max'];

		// Ensure "adjustment" is an integer
		if( typeof(adj) != 'number' ) {
			return max;
		}

		max += Math.floor(adj);

		// Maximum cannot go below zero
		if( max < 0 ) {
			max = 0;
		}
		// Current cannot exceed maximum
		if( cur > max ) {
			cur = max;
		}

		return max;
	};

	/**
	 * Returns a common item's current value.
	 *
	 * @method	getCommonItemCurrent
	 * @public
	 * @param		{string}		type		Item slug
	 * @return	{integer}
	 */
	_self.getCommonItemCurrent = function(type) {
		return _commonItems[type]['current'];
	};

	/**
	 * Returns a common item's maximum value.
	 *
	 * @method	getCommonItemMax
	 * @public
	 * @param		{string}		type		Item slug
	 * @return	{integer}
	 */
	_self.getCommonItemMax = function(type) {
		return _commonItems[type]['max'];
	};

	/**
	 * Sets a common item's current value to a provided amount.
	 *
	 * @method	setCommonItemCurrent
	 * @public
	 * @param		{string}		type		Item slug
	 * @param		{integer}		qty		Item quantity
	 */
	_self.setCommonItemCurrent = function(type, qty = 0) {
		var cur = _commonItems[type]['current'];
		var max = _commonItems[type]['max'];

		// Ensure "quantity" is an integer
		if( typeof(qty) != 'number' ) {
			return;
		}

		qty = Math.floor(qty);

		// Prevent current from exceeding maximum
		if( qty > max ) {
			qty = max;
		}

		cur = qty;
	};

	/**
	 * Sets a common item's maximum value to a provided amount.
	 *
	 * @method	setCommonItemMax
	 * @public
	 * @param		{string}		type		Item slug
	 * @param		{integer}		qty		Item quantity
	 */
	_self.setCommonItemMax = function(type, qty = 0) {
		// Ensure "quantity" is an integer
		if( typeof(qty) != 'number' ) {
			return;
		}

		qty = Math.floor(qty);

		_commonItems[type]['max'] = qty;
	};

	/**
	 * Reduces health while taking into account damage modifiers. An alias for adjustCommonItemCurrent('health') with some added checks.
	 *
	 * @method	damage
	 * @public
	 * @param		{integer}		damage			Amount of damage to apply before taking damage reduction into account
	 * @param		{integer}		penetration		How much of the damage reduction to ignore
	 * @return	{integer}
	 */
	_self.damage = function(damage, penetration = 0) {
		var curHP = _commonItems.health.current;

		// Prevent any damage if actor is indestructible
		if( _self.indestructible ) {
			return curHP;
		}

		// Calculate damage reduction
		var threshold = _self.armor - penetration;

		if( threshold < 0 ) {
			threshold = 0;
		}

		// Calculate final damage to apply
		var reducedDam = damage - threshold;

		if( reducedDam < 0 ) {
			reducedDam = 0;

			return curHP;
		}

		_self.adjustCommonItemCurrent('health', -reducedDam);

		_self.eachActor(function(actor) {
			actor.increaseDamageTimer();
		});

		if( curHP == 0 ) {
			/*
			if( _type == 'shield' ) {
				// go offline
				_self.toggleShield(false);
			} else {
				_self.die();
			}
			*/
			_self.indestructible = true;
			_self.destruct();
		}

		return curHP;
	};

	/**
	 * Restores health. An alias for adjustCommonItemCurrent('health').
	 *
	 * @method	heal
	 * @public
	 * @param		{integer}		health	Amount of health to restore.
	 * @return	{integer}
	 */
	_self.heal = function(health) {
		_self.adjustCommonItemCurrent('health', health);

		return _commonItems['health']['current'];
	};

	_self.addUniqueItems = function(items) {
		if( typeof(items) == 'string' ) {
			items = [items];
		}

		for(var item of items) {
			if( _uniqueItems.indexOf(item) == -1 ) {
				_uniqueItems.push(item);

				// Get sensor part and enable it
				var sensorPart = Matter.Body.getPart(_self.body, item);

				sensorPart.toggleCollidable(false);
			}
		}
	};

	_self.removeUniqueItems = function(items) {
		if( typeof(items) == 'string' ) {
			items = [items];
		}

		for(var item of items) {
			var index = _uniqueItems.indexOf(item);

			if( index != -1 ) {
				_uniqueItems.splice(index, 1);
			}

			// Get sensor part and disable it
			var sensorPart = Matter.Body.getPart(_self.body, item);

			sensorPart.toggleCollidable(true);
		}
	};

	_self.addAfflictions = function(afflictions) {
		if( typeof(afflictions) == 'string' ) {
			afflictions = [afflictions];
		}

		for(var affliction of afflictions) {
			if( _afflictions.indexOf(afflictiom) == -1 ) {
				_afflictions.push(affliction);
			}
		}
	};

	_self.removeAfflictions = function(afflictions) {
		if( typeof(afflictions) == 'string' ) {
			afflictions = [afflictions];
		}

		for(var affliction of afflictions) {
			var index = _afflictions.indexOf(affliction);

			if( index != -1 ) {
				_afflictions.splice(index, 1);
			}
		}
	};

	/**
	 * Increment killSwitches by one and check if destruction of troupe object should occur.
	 *
	 * @method	killCommand
	 * @public
	 */
	_self.killCommand = function() {
		_killSwitches++;

		// Check if a killSwitch has been set for each actor in the troupe
		if( _killSwitches == _actors.length ) {
			// Unset external references to this Troupe
			_self.eachActor(function(actor) {
				actor.troupe = undefined;
			});

			_actors = undefined;

			// Remove the composite body from the world
			Matter.World.remove(Game.engine.world, _composite);
		}
	}

	/**
	 * Alias for sending beginDestructing signal to all actors.
	 *
	 * @method	destruct
	 * @public
	 */
	_self.destruct = function() {
		_self.sendSignal('beginDestructing');
	};

	/**
	 *
	 *
	 * @method	sendSignal
	 * @public
	 * @param		{string}	action	xxxxxxxxxxxx
	 */
	_self.sendSignal = function(action, data) {
		var validActions = ['beginDestructing', 'setTarget', 'setMovePoint', 'setFirePoint', 'setThreatLevel'];

		if( validActions.indexOf(action) == -1 ) {
			return;
		}

		_self.eachActor(function(actor) {
			actor[action](data);
		});
	};

	/**
	 * Applies a callback function to each actor in this troupe.
	 *
	 * @method	eachActor
	 * @public
	 * @param		{function}	callback		A callback function
	 */
	_self.eachActor = function(callback) {
		for(var i in _actors) {
			var actor = _actors[i];

			callback(actor, i);
		}
	};

	_self.getActors = function() {
		return _actors;
	};

	/**
	 * Adds an actor to the troupe.
	 *
	 * @method	addActor
	 * @public
	 * @param		{object}	actor	An Actor object
	 */
	_self.addActor = function(actor) {
		// Store a reference to the troupe in the actor
		actor.troupe = _self;

		_actors.push(actor);
	};

	_self.getLead = function() {
		return _lead;
	};

	_self.setLead = function(actor) {
		_lead = actor;
	};

	_init(config);

	return _self;
};
