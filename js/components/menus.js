/**
 * An interface class for interacting with Interface module. Allows for easier modification of menus.
 */
module.exports = new function() {
	var _self		= this;
	var _menus	= new List();

	function _hasMenu(menuName) {
		return Boolean( _menus.getItem(menuName) );
	};

	_self.each = function(callback = function() {}) {
		_menus.eachItem(function(active, menuName) {
			callback(active, menuName);
		});
	};

	_self.empty = function() {
		var toRemove = [];

		_self.each(function(active, name) {
			toRemove.push(name);
		});

		for(var menu of toRemove) {
			_self.remove(menu);
		}

		_menus.reset();
	};

	/**
	 * Creates a specified menu.
	 */
	_self.add = function(menuName, hidden = false, args = false) {
		var menu;

		if( _hasMenu(menuName) || !Data.menus[menuName] ) {
			return _self;
		}

		menu = Game.Interface.create(menuName, Data.menus[menuName], args);

		if( menu ) {
			_menus.addItem(true, menuName);

			if( hidden ) {
				_self.hide(menuName);
			}
		}

		return _self;
	};

	/**
	 * Destroys a specified menu.
	 */
	_self.remove = function(menuName) {
		if( !_hasMenu(menuName) ) {
			return _self;
		}

		Game.Interface.remove(menuName);

		_menus.removeItem(menuName);

		return _self;
	};

	/**
	 * Enables an existing menu. Does not show it if hidden.
	 */
	_self.enable = function(menuName) {
		if( !_hasMenu(menuName) ) {
			return _self;
		}

		Game.Interface.enable(menuName, false);

		return _self;
	};

	/**
	 * Disables an existing menu. Does not hide it if visible.
	 */
	_self.disable = function(menuName) {
		if( !_hasMenu(menuName) ) {
			return _self;
		}

		Game.Interface.disable(menuName, false);

		return _self;
	};

	/**
	 * Enables and shows an existing menu.
	 */
	_self.show = function(menuName) {
		if( !_hasMenu(menuName) ) {
			return _self;
		}

		Game.Interface.enable(menuName);

		return _self;
	};

	/**
	 * Disables and hides an existing menu.
	 */
	_self.hide = function(menuName) {
		if( !_hasMenu(menuName) ) {
			return _self;
		}

		Game.Interface.disable(menuName);

		return _self;
	};

	return
};
