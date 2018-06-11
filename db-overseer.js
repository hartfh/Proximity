var electron		= require('electron');
var ipc			= electron.ipcRenderer;
var app			= electron.app;
var Datastore		= require('nedb');
var Constants		= require('./js/constants');
var Utilities		= require('./js/utilities/utilities');
var Data			= require('./js/data/data');
var TilesetFilters	= require('./js/data/tileset-filters');
var Tilesets		= require('./js/data/tilesets');
var Tasks			= require('./js/tasks/tasks');

var List			= require('./js/classes/List');
var Grid			= require('./js/classes/Grid');
var Compass		= require('./js/classes/Compass');
var MapFactory		= require('./js/classes/MapFactory');
var MapManager		= require('./js/components/db-managers/map-manager');
var ProfileManager	= require('./js/components/db-managers/profile-manager');
var SettingsManager	= require('./js/components/db-managers/settings-manager');

const DB_PATH		= 'database/';

var log = function(data) {
	ipc.send('display', data);
};

var _terminate = function() {
	app.quit();
};

var _receiveRequest = function(event, data) {
	switch(data.request) {
		case 'create-map': // Non-blocking
			MapManager.accessMap(data.slotID).createMap(_returnRequest, {taskID: data.taskID});
			break;
		case 'load-map': // Non-blocking
			MapManager.accessMap(data.slotID).loadMap(_returnRequest, {taskID: data.taskID});
			break;
		case 'get-tiles':
			let tiles = MapManager.getTiles(data.tiles);
			_returnRequest({tiles: tiles, taskID: data.taskID});
			break;
		case 'get-profiles': // Blocking
			var profiles = MapManager.getProfiles(data.tiles, data.layer);
			_returnRequest({profiles: profiles, taskID: data.taskID});
			break;
		case 'set-profiles':
			MapManager.setProfiles(data.profiles);
			_returnRequest({taskID: data.taskID});
			break;
		case 'load-settings':
			SettingsManager.accessSettings().loadSettings(_returnRequest, {taskID: data.taskID});
			break;
		case 'save-settings':
			SettingsManager.setSettings(data.settings, _returnRequest, {taskID: data.taskID});
			break;
		case 'create-profile':
			ProfileManager.accessProfile(data.slotID).saveProfile(_returnRequest, {taskID: data.taskID});
			break;
		case 'load-profile':
			ProfileManager.accessProfile(data.slotID).loadProfile(_returnRequest, {taskID: data.taskID});
			break;
		case 'save-profile':
			ProfileManager.setProfile(data.profile, _returnRequest, {taskID: data.taskID});
			break;
		default:
			break;
	}
};

var _returnRequest = function(data) {
	ipc.send('from-db-overseer', data);
};


ipc.on('terminate', _terminate);
ipc.on('to-db-overseer', _receiveRequest);
