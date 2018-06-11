var electron		= require('electron');
var ipc			= electron.ipcRenderer;
var app			= electron.app;
var Datastore		= require('nedb');
var Constants		= require('./js/constants');
var Utilities		= require('./js/utilities/utilities');
var Data			= require('./js/data/data');
var TilesetFilters	= require('./js/data/tileset-filters');
var Tasks			= require('./js/tasks/tasks');

var List			= require('./js/classes/List');
var Grid			= require('./js/classes/Grid');
var Compass		= require('./js/classes/Compass');
var MapFactory		= require('./js/classes/MapFactory');

const DB_PATH		= 'database/';

const _ID = Math.round( Math.random() * 10000000 );

var log = function(data) {
	ipc.send('display', data);
};

var taskResolver = function(name, data, resolve) {
	switch(name) {
		case 'getAreas':
			Tasks.Map.task('getAreas', data.slotID, resolve, data.areas);
			break;
		case 'saveProfiles':
			Tasks.Map.task('saveProfiles', data.slotID, resolve, data.profiles);
			break;
		case 'createMap':
			Tasks.Map.task('createMap', data.slotID, resolve);
			break;
		default:
			break;
	};
};

var _terminate = function() {
	log('task runner terminating...');
	app.quit();
};

ipc.on('terminate', _terminate);

ipc.once('task-request-response', function(event, task) {
	taskResolver(task.name, task.data, function(data) {
		var response = {
			status:	'success',
			data:	data
		};

		ipc.send('task-fulfillment-' + _ID + '', response);
	});
});

ipc.send('task-request', _ID);
