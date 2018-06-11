module.exports = new function() {
	var _self		= this;
	var _trackable	= false;

	_self.hasObject = function() {
		return Boolean(_trackable);
	};

	_self.track = function(trackable) {
		if( trackable.hasOwnProperty('position') ) {
			_trackable = trackable;
		}
	};

	_self.stop = function() {
		_trackable = null;
	};

	_self.getPosition = function() {
		var position = {
			x:	_trackable.position.x,
			y:	_trackable.position.y
		};

		return position;
	};
};
