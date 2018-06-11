module.exports = function(type = false, effect = false, value = 0) {
	var _self = this;

	function _init(stats) {
		// Zero all values
		for(var weaponType of Constants.WEAPON_TYPES) {
			_self[weaponType] = {
				attack:	0,
				defense:	0,
				max:		0,
				usage:	0
			};
		}

		_self.health = {
			max:	0
		};

		// Set any values declared during instantiation
		_self.setStat(type, effect, value);
	}

	function _isValidType(type) {
		if( Constants.COMMON_ITEM_TYPES.indexOf(type) != -1 ) {
			return true;
		}

		return false;
	}

	function _isValidEffect(effect) {
		if( effect == 'attack' || effect == 'defense' || effect == 'max' || effect == 'usage' ) {
			return true;
		}

		return false;
	}

	function _isValidValue(value) {
		if( typeof(value) == 'number' ) {
			if( value % 1 === 0 ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Sets one modifier value.
	 *
	 * @method	setStat
	 * @public
	 * @param		{string}		type		A common item type
	 * @param		{string}		effect	Way in which to modify the item type ("attack", "defense", "max" or "usage")
	 * @param		{integer}		value	Modifier amount
	 */
	_self.setStat = function(type = false, effect = false, value = 0) {
		// Validate arguments
		if( !_isValidType(type) || !_isValidEffect(effect) || !_isValidValue(value) ) {
			return _self;
		}

		_self[type][effect] = value;

		return _self;
	}

	_init(type, effect, value);
};
