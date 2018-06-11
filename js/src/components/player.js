var Game = Game || {};

Game.Player = (function() {
	var _self = {};
	var _actor;
	var _body;
	var _troupe;
	//var _weapon;
	var _weapon = 'repeater';

	/**
	 * Returns if _actor has been set, and if not throws an error.
	 *
	 * @method _hasActor
	 * @private
	 * @return	{boolean}
	 */
	var _hasActor = function() {
		if( !_actor ) {
			throw new Error('No player actor currently set');

			return false;
		}

		return true;
	};

	_self.getWeapon = function() {
		return _weapon;
	}

	_self.setWeapon = function(weapon) {
		// check for allowable weapon types

		_weapon = weapon;
	}

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.moveTo = function(destPoint) {
		var ownPoint	= _self.getPosition();
		var angle		= Game.utilities.getLineAngle(ownPoint, destPoint);

		_actor.setCourse(angle);
		_actor.setMovePoint(destPoint);
	};

	_self.moveCancel = function() {
		_actor.setCourse(false);
		_actor.setMovePoint(false);
	};

	var _getActionFromWeapon = function(type) {
		var action;

		switch(type) {
			case 'repeater':
				action = 'shootRepeater';
				break;
			case 'torpedo':
				action = 'shootTorpedo';
				break;
			default:
				action = false;
				break;
		}

		return action;
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.startFireWeapon = function(point) {
		var action = _getActionFromWeapon(_weapon);

		_actor.targetPoint(point);
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.endFireWeapon = function() {
		var action = _getActionFromWeapon(_weapon);

		_actor.targetPoint(false);
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.setTroupe = function(troupe) {
		_troupe	= troupe;
		_actor	= troupe.getLead();
		_body	= _actor.body;
	};

	_self.getBody = function() {
		return _body;
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.getActor = function() {
		return _actor;
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.getPosition = function() {
		if( !_hasActor() ) {
			return false;
		}

		return _actor.body.position;
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.getCurrentStat = function(stat) {
		if( !_hasActor() ) {
			return false;
		}

		return _troupe.getCommonItemCurrent(stat);
	};

	/**
	 *
	 *
	 *
	 *
	 *
	 */
	_self.getMaxStat = function(stat) {
		if( !_hasActor() ) {
			return false;
		}

		return _troupe.getCommonItemMax(stat);
	};

	return _self;
}());
