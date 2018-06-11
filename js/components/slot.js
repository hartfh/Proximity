module.exports = function(ID) {
	var _self		= this;
	var _ID		= '00' + ID;
	var _db		= false;
	var _summary	= false;

	_self.utilize = function() {
		Game.State.slotID = _ID;

		return _self;
	};

	_self.getID = function() {
		return _ID;
	};

	_self.getSummary = function() {
		return _summary;
	};

	_self.updateSummary = function(summary, callback = function(){}) {
		_summary = summary;

		_db.update({}, {summary: summary}, {upsert: true}, function(err, numReplaced, upsert) {
			callback();
		});
	};

	_self.accessSummary = function() {
		var name = Constants.DB_DIR + _ID + '/summary';

		_db = new Datastore({filename: name, autoload: true});

		return _self;
	};

	_self.loadSummary = function(callback = function(){}) {
		_self.accessSummary();

		_db.findOne({}, function(err, doc) {
			if( doc ) {
				_summary = doc.summary;

				callback(doc.summary);
			} else {
				// No summary file found. Create a new one and then try once again to load it
				_self.updateSummary({
					ID:				_ID,
					gameCompleted:		false,
					gameStarted:		false
				}, function(){ _self.loadSummary(callback) });
			}
		});
	};

	_self.loadGame = function() {
		Game.TaskManager.createTask('load-map', {slotID: _ID}, function(response) {
			Game.Map.setMapConnection(true);

			Game.Profile.load(function() {
				// Load mapgrid data from file
				Game.MapGrid.start(Game.Profile.map);

				Game.Player.create();

				Game.route('battlefield/active');
			});
		});
	};

	_self.createGame = function(callback = function(){}) {
		// generate map
		// generate player profile and empty map grid
		// generate general slot/city data (city name, population, districts, etc.)

		Game.Profile.create(function() {
			log('profile created');
			Game.TaskManager.createTask('create-map', {slotID: _ID}, function(response) {
				for(var n = 0; n < 4; n++) {
					log('map creation task complete');
				}
				callback();
			});
		});
	};

	_self.deleteGame = function(callback = function(){}) {
		var checker = new AsynchChecker(3, callback);

		_deleteSaveFile('map', checker.check);
		_deleteSaveFile('profile', checker.check);
		_deleteSaveFile('summary', checker.check);
	};

	function _deleteSaveFile(name, callback = function(){}) {
		fs.unlink(Constants.DB_DIR + _ID + '/' + name, function(err) {
			callback();
		});
	};

	_self.saveGame = function(callback = function() {}) {
		// push summary, map and profile?

		callback();
	};

	_self.accessSummary();
};
