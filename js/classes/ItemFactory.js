module.exports = new function() {
	var _self = this;

	// check arguments function. ensure that item name has data

	_self.createCommon = function(name, xPos, yPos) {
		var body = ActorFactory.create('neutral', ['items', 'common', name], xPos, yPos);

		return body;
	};

	_self.createModifier = function(name, xPos, yPos) {
		var body = ActorFactory.create('neutral', ['items', 'modifier', name], xPos, yPos);

		return body;
	};

	_self.createUnique = function(name, xPos, yPos) {
		var body = ActorFactory.create('neutral', ['items', 'unique', name], xPos, yPos);

		return body;
		// differs any from common? Perhaps create a List within ItemFactory that tracks if an item has spawned already and prevent it from being spawned


		// return body
	};
};
