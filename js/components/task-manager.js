module.exports = function() {
	var _self		= {};
	var _tasks	= new List();

	_self.createTask = function(taskName = '', args = {}, callback) {
		var taskID = _tasks.addItem(callback);

		args.request	= taskName;
		args.taskID	= taskID;

		ipc.send('to-db-overseer', args);
	};

	function _resolveTask(event, data) {
		var taskCallback = _tasks.getItem(data.taskID);

		if( taskCallback ) {
			taskCallback(data);
		}

		_tasks.removeItem(data.taskID);
	};

	ipc.on('from-db-overseer', _resolveTask);

	return _self;
}();
