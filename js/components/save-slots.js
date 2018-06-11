var Slot = require('./slot');

module.exports = new function() {
	const _NUM_SLOTS = 3;

	var _self			= this;
	var _slots		= new List();
	var _summaries		= [];

	function _init() {
		for(var s = 1; s <= _NUM_SLOTS; s++) {
			var slot = new Slot(s);

			_slots.addItem( slot, slot.getID() );
		}
	}

	_self.save = function(callback) {
		var saveSlot = _slots.getItem(Game.State.slotID);

		saveSlot.saveGame(callback);
	};

	_self.delete = function(slotID, callback = function() {}) {
		var slot = _slots.getItem(slotID);

		slot.deleteGame(callback)
	};

	_self.load = function(slotID) {
		var slot		= _slots.getItem(slotID);
		var summary	= slot.utilize().getSummary();
		
		Game.State.summary	= summary;

		if( summary.gameStarted ) {
			slot.loadGame();
		} else {
			slot.createGame(function() {
				Game.State.summary.gameStarted = true;
				_self.updateActiveSummary();

				slot.loadGame();
			});
		}
	};

	_self.updateActiveSummary = function() {
		var activeSlot = _slots.getItem(Game.State.slotID);

		activeSlot.updateSummary(Game.State.summary);
	};

	function _sortSummaryData(unsorted) {
		var summaries = [];

		// Inefficient sorting
		outerLoop:
		for(var n = 0; n < _NUM_SLOTS; n++) {
			innerLoop:
			for(var summary of unsorted) {
				if( summary.ID == '00' + (n+1) ) {
					summaries.push(summary);
					break innerLoop;
				}
			}
		}

		return summaries;
	};

	_self.getSummaries = function(mainCallback = function(){}) {
		_summaries = [];

		var checker = new AsynchChecker(_NUM_SLOTS, function(summaries) {
			Game.State.summaries = _sortSummaryData(summaries);
			mainCallback();
		});

		_slots.eachItem(function(slot, slotID) {
			slot.loadSummary(function(summary) {
				_summaries.push(summary);
				checker.check(_summaries);
			});
		});
	};

	_init();
};
