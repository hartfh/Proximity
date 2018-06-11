module.exports = {
	// NOTE: unsure what this is below:
	//Game.EventEmitter.subscribe('collision', function() {}, 'handle');
	_events:		{},
	dispatch:		function (event, data) {
		log('dispatching ' + event);
		if ( !this._events[event] ) {
			return;
    		}

		for (var i = 0; i < this._events[event].length; i++) {
			var actions = this._events[event][i];

			for(var prop in actions) {
				actions[prop](data);
			}
		}
	},
	subscribe:	function (event, callback, handle) {
		log('2222');
		if ( !this._events[event] ) {
			this._events[event] = []; // new event
		}

		var action = {};
		action[handle] = callback;

		for (var i = 0; i < this._events[event].length; i++) {
			var actions = this._events[event][i];

			if( actions.hasOwnProperty(handle) ) {
				return;
			}
		}

		this._events[event].push(action);
	},
	unsubscribe:	function(event, handle) {
		for (var i = 0; i < this._events[event].length; i++) {
			var actions = this._events[event][i];

			if( actions.hasOwnProperty(handle) ) {
				delete actions[handle];
			}
		}
	}
};
