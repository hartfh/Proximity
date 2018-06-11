module.exports = function() {
	var _self			= {};
	var _playerExists	= false;
	//var _moveUIBox		= '';
	//var _shootUIBox	= '';
	var _moveDirections = {n: false, s: false, e: false, w: false};
	var _weapon		= '';
	var _weapons		= {};
	var _toldToMove	= false;
	var _body, _composite, _lead, _troupe;


	function isValidWeaponType(type) {
		if( Constants.WEAPON_TYPES.indexOf(type) != -1 ) {
			return true;
		}

		return false;
	}

	/**
	 * Checks if the player has been created.
	 *
	 * @method	exists
	 * @public
	 * @return	{boolean}
	 */
	_self.exists = function() {
		return _playerExists;
	};

	_self.create = function() {
		if( Game.Profile.exists() && !_self.exists() ) {
			for(var type of Constants.WEAPON_TYPES) {
				_weapons[type] = Game.Profile.player.weapons[type];
			}

			_composite	= TroupeFactory.create('player', 'playerShip', Game.Profile.player.position.x, Game.Profile.player.position.y);
			_troupe		= _composite.troupe;
			_lead		= _troupe.getLead();
			_body		= _lead.body;

			// TODO: switch turret/setweapon based on _weapon. also set _weapon based on profile.

			_initStats();

			Game.World.add(_composite);

			Game.Viewport.enableAreaTracking();

			var mapgridPos = Game.MapGrid.convertPosition(Game.Profile.player.position);
			Game.MapGrid.add('player', _body, mapgridPos.x, mapgridPos.y, true);

			Game.Map.enableFreezers();

			_enableProfileUpdating();

			Game.Tracker.track(_body);
			Game.Profile.enableSaving();

			_playerExists = true;
		}
	};

	/**
	 * Removes all traces of the player character from the game, disables character UI boxes
	 * and stops feedback of information about player to other components.
	 */
	_self.remove = function() {
		if( _self.exists() ) {
			Game.Profile.disableSaving();

			_playerExists = false;

			//Game.Interface.remove(_moveUIBox);
			//Game.Interface.remove(_shootUIBox);

			//Game.Viewport.disableFreezing();
			Game.Map.disableFreezing();
			Game.Viewport.disableObjectTracking();
			Game.Viewport.disableAreaTracking();

			_disableProfileUpdating();

			Game.Tracker.stop();

			Game.World.remove(_composite);

			_reset();
		}
	};

	function _reset() {
		_composite	= null;
		_body		= null;
		_lead		= null;
		_troupe		= null;
		//_moveUIBox	= '';
		//_shootUIBox	= '';
	}

	function _initStats() {
		for(var type of Constants.COMMON_ITEM_TYPES) {
			_troupe.setCommonItemMax(type, Game.Profile.player.common[type].max);
			_troupe.setCommonItemCurrent(type, Game.Profile.player.common[type].current);
		}
	}

	function _pushPlayerProfile() {
		Game.Player.moveDirection();

		var deltaX = 0;
		var deltaY = 0;

		if( Game.Profile.player.position.x && Game.Profile.player.position.y ) {
			deltaX = _body.position.x - Game.Profile.player.position.x;
			deltaY = _body.position.y - Game.Profile.player.position.y;
		}

		var newProfile = {
			position:		{},
			common:		{},
			unique:		[],
			weapons:		{}
		};

		newProfile.position = {
			x:	_body.position.x,
			y:	_body.position.y
		};

		for(var type of Constants.COMMON_ITEM_TYPES) {
			newProfile.common[type] = _lead.getBasicStat(type);
		}

		for(var type of Constants.WEAPON_TYPES) {
			newProfile.weapons[type] = _weapons[type];
		}

		Game.Profile.player = newProfile;

		Game.State.playerDelta = {
			x:	deltaX,
			y:	deltaY
		};
	}

	/**
	 * Sets up continous player information feedback to Game.Profile.
	 */
	function _enableProfileUpdating() {
		Game.Events.subscribe('tick', _pushPlayerProfile, 'player-push-profile');
	}

	/**
	 * Disables player profile information feedback to Game.Profile.
	 */
	function _disableProfileUpdating() {
		Game.Events.unsubscribe('tick', 'player-push-profile');
	}

	_self.action = function(action = '', args = []) {
		if( !_self.exists() ) {
			return;
		}
		if( !Array.isArray(args) ) {
			args = [args];
		}

		switch(action) {
			case 'move-to':
				_self.moveTo(args[0]);
				break;
			case 'move-cancel':
				_self.moveCancel();
				break;
			case 'pathfind-to':
				_self.pathfindTo(args[0]);
				break;
			case 'start-fire':
				_self.startFireWeapon(); // TODO: add args?
				break;
			case 'stop-fire':
				_self.stopFireWeapon();
				break;
			default:
				break;
		}
	};

	/**
	 * Sets a course for the player actor.
	 */
	_self.moveTo = function(destPoint) {
		_toldToMove = true;
		_lead.setMovePoint([destPoint]);
	};

	_self.pathfindTo = function(destPoint) {
		//var points = Game.MapGrid.pathfindPositions(_lead.body.position, destPoint);
		//_lead.setMovePoint(points);

		_toldToMove = true;
		_lead.setMovePoint([destPoint]);
	};

	_self.moveDirection = function() {
		const OFFSET = 100;
		var position = {x: Game.Profile.player.position.x, y: Game.Profile.player.position.y};
		var hasDirection = false;

		if( _moveDirections.n ) {
			position.y -= OFFSET;
			hasDirection = true;

			if( _moveDirections.s == 2 ) {
				position.y += OFFSET;
			}
		}
		if( _moveDirections.s ) {
			position.y += OFFSET;
			hasDirection = true;

			if( _moveDirections.n == 2 ) {
				position.y -= OFFSET;
			}
		}
		if( _moveDirections.w ) {
			position.x -= OFFSET;
			hasDirection = true;

			if( _moveDirections.e == 2 ) {
				position.x += OFFSET;
			}
		}
		if( _moveDirections.e ) {
			position.x += OFFSET;
			hasDirection = true;

			if( _moveDirections.w == 2 ) {
				position.x -= OFFSET;
			}
		}

		if( hasDirection ) {
			_self.moveTo(position);
		} else {
			if( !_toldToMove ) {
				_self.moveCancel();
			}
		}
	};

	_self.setAimDirection = function(active = false, specificPoint = false) {
		const OFFSET = 100;

		if( !active ) {
			_lead.aimPoint(false);
			return;
		}

		var position = {x: Game.Profile.player.position.x, y: Game.Profile.player.position.y};

		if( specificPoint ) {
			_lead.aimPoint(specificPoint);
			return;
		}

		if( _moveDirections.n ) {
			position.y -= OFFSET;
		}
		if( _moveDirections.s ) {
			position.y += OFFSET;
		}
		if( _moveDirections.w ) {
			position.x -= OFFSET;
		}
		if( _moveDirections.e ) {
			position.x += OFFSET;
		}

		_lead.aimPoint(position);
	};

	_self.setMoveDirection = function(direction, active = false) {
		if( active ) {
			// If opposite direction is already true, set this direction to "super" true
			if( (direction == 'n' && _moveDirections.s) || (direction == 's' && _moveDirections.n) ) {
				active = 2;
			}
			if( (direction == 'w' && _moveDirections.e) || (direction == 'e' && _moveDirections.w) ) {
				active = 2;
			}
		} else {
			_self.moveCancel();
		}

		_moveDirections[direction] = active;
	};

	/**
	 * Clears player actor course.
	 */
	_self.moveCancel = function() {
		_toldToMove = false;
		_lead.clearCourse(false);
		//_lead.setMovePoint(false);
	};

	/**
	 * Allows player actor to implement "shoot" action.
	 */
	_self.startFireWeapon = function(point) {
		_lead.targetPoint(point);
		_lead.aimPoint(false);
	};

	/**
	 * Stops player actor from implementing "shoot" action.
	 */
	_self.stopFireWeapon = function() {
		_lead.targetPoint(false);
	};

	_self.getWeapon = function() {
		return _weapon;
	};

	_self.setWeaponSubtype = function(type, name) {
		if( isValidWeaponType(type) ) {
			_weapons[type] = name;
		}
	};

	_self.setWeapon = function(type) {
		if( isValidWeaponType(type) ) {
			if( type != _weapon ) {
				_weapon = type;

				// Switch turret body/actor
				var weaponName		= _weapons[_weapon];
				var turret		= Data.weapons[weaponName];
				var oldPartData	= TroupeFactory.remove(_troupe, 'Gun');

				var args = {
					name:		['weapons', turret],
					role:		'turret',
					position: 	{x: 0, y: -3},
					angle:		oldPartData.angle
				};

				TroupeFactory.add(_troupe, _body.position.x, _body.position.y, args, 'Gun', true);
			}
		}
	};

	_self.getTroupe = function() {
		return _troupe;
	};

	_self.getWaypoints = function() {
		return _lead.getMoveWaypoints();
	};

	_self.addXP = function(xp = 0) {
		Game.Profile.player.xp += xp;

		var currentXP	= Game.Profile.player.xp;
		var setLevel	= 1;

		if( currentXP > 5 ) {
			setLevel = 2;
		}
		if( currentXP > 10 ) {
			setLevel = 3;
		}
		if( currentXP > 15 ) {
			setLevel = 4;
		}
		if( currentXP > 25 ) {
			setLevel = 5;
		}

		Game.Profile.player.level = setLevel;
	};

	_self.hasItem = function(itemName) {
		// check inventory

		return false;
	};

	return _self;
}();
