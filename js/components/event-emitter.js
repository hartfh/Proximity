module.exports = function() {
	var _self		= {};
	var _events	= {};

	_self.dispatch = function(event, data) {
		if ( !_events[event] ) {
			return;
    		}

		for (var i = 0; i < _events[event].length; i++) {
			var actions = _events[event][i];

			for(var prop in actions) {
				actions[prop](data);
			}
		}
	};

	_self.subscribe = function(event, callback, handle) {
		if ( !_events[event] ) {
			_events[event] = []; // new event
		}

		var action = {};
		action[handle] = callback;

		for (var i = 0; i < _events[event].length; i++) {
			if( _events[event][i].hasOwnProperty(handle) ) {
				return;
			}
		}

		_events[event].push(action);
	};

	_self.unsubscribe = function(event, handle) {
		for (var i = 0; i < _events[event].length; i++) {
			if( _events[event][i].hasOwnProperty(handle) ) {
				delete _events[event][i][handle];

				_events[event].splice(i, 1);

				break;
			}
		}
	};

	return _self;
}();
