module.exports = new function() {
	var _self	= this;
	var _path	= '';

	_self.getPath = function() {
		return _path;
	};

	_self.parsePath = function(path) {
		return path.split('/');
	};

	_self.route = function(path = '', refresh = false, menuArgs = {}) {
		var screens		= _self.parsePath(path);
		var wantedMenus	= [];

		_path = path;

		function addMenus(data, screens, depth = 0) {
			if( data[screens[depth]] ) {
				// Check for this level's menus
				if( data[screens[depth]].menus ) {
					for(var menu of data[screens[depth]].menus) {
						wantedMenus.push(menu);
					}
				}

				// Check for the existence of sub-menus
				if( data[screens[depth]].subs ) {
					if( data[screens[depth]].subs[screens[depth + 1]] ) {
						addMenus(data[screens[depth]].subs, screens, depth + 1);
					}
				}
			}
		}

		addMenus(Data.screens, screens);

		if( refresh ) {
			// Remove all existing menus
			Game.Menus.empty();

			// Add the list of wanted menus
			for(var menu of wantedMenus) {
				Game.Menus.add(menu, false, menuArgs[menu]);
			}
		} else {
			var menusToRemove = [];

			// Find each duplicate between existing and wanted menus, and remove the duplicates from wanted
			Game.Menus.each(function(active, name) {
				var index = wantedMenus.indexOf(name);

				if( index != -1 ) {
					wantedMenus.splice(index, 0);
				} else {
					menusToRemove.push(name);
				}
			});

			// Remove each menu in "menusToRemove"
			for(var menu of menusToRemove) {
				Game.Menus.remove(menu);
			}

			// Create each menu in "wantedMenus"
			for(var menu of wantedMenus) {
				Game.Menus.add(menu, false, menuArgs[menu]);
			}
		}
	};
};
