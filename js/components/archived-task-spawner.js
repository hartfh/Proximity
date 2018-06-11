module.exports = new function() {
	var _self		= this;
	var _counter	= 0;

	_self.createTask = function(name, data = false, callback = function(){}) {
		var taskID = 'task-' + _counter;

		// Send request to ipcMain
		ipc.send('create-task', {
			name:			name,
			fulfillmentID:		taskID,
			data:			data
		});

		ipc.once('fulfill-' + taskID, function(event, fulfilled) {
			callback(fulfilled);
		});

		_counter++;
	};
};
