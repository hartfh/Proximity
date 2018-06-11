var Matter		= require('matter-js');
var electron		= require('electron');
var ipc			= electron.ipcRenderer;
var fs			= require('fs');
var Datastore		= require('nedb');
var MaxRectsPacker	= require('maxrects-packer');

// NOTE: Temp, but don't move
var log = function(data) {
	ipc.send('display', data);
};

var Constants		= require('./js/constants');
var Utilities		= require('./js/utilities/utilities');
var Data			= require('./js/data/data');
var List			= require('./js/classes/List');
var Grid			= require('./js/classes/Grid');
var Compass		= require('./js/classes/Compass');
var AsynchChecker	= require('./js/classes/AsynchTasksChecker');

var RenderLayer	= require('./js/classes/RenderLayer');

var Game			= require('./js/components/game');

var ItemFactory	= require('./js/classes/ItemFactory');
var TerrainFactory	= require('./js/classes/TerrainFactory');
var DoodadFactory	= require('./js/classes/DoodadFactory');
var Troupe		= require('./js/classes/Troupe');
var TroupeFactory	= require('./js/classes/TroupeFactory');
var Actor			= require('./js/classes/Actor');
var ActorFactory	= require('./js/classes/ActorFactory');
var EffectsFactory	= require('./js/classes/EffectsFactory');
var TextFactory	= require('./js/classes/TextFactory');

/////// TEMPORARY for map testing ///////
var MapFactory	= require('./js/classes/MapFactory');
var TilesetFilters = require('./js/data/tileset-filters');
var Tilesets = require('./js/data/tilesets');
/////// TEMPORARY ///////


setInterval(function() {
	log('-tick-');
}, 1000);
setTimeout(function() {
	setInterval(function() {
		log('-tock-');
		if( Game.Player.getTroupe() ) {
			log('---------------');
			log( Game.Player.getTroupe().eachActor(function(actor) {
				log(actor.body.actorType + ': ' + actor.spriteMode);
				//log(actor.attackingAlt);
				//log(actor.movingAlt);
				log('--');
			}) );
		}
	}, 1000);
}, 500);


//var map = MapFactory.createV4();

//Game.ImageConverter.encode();
Game.start();


/*
if( !fs.existsSync('error_log.txt') ) {
	fs.createWriteStream('error_log.txt');
}

var error_log = fs.openSync('error_log.txt', 'w');

fs.writeSync(error_log, err);

fs.closeSync(error_log);
*/


/*
var packer = new MaxRectsPacker(1024, 1024, 2); // 1024x2048

var contents = [];

for(var i = 0; i < 4; i++) {
	var shape = {width: 8, height: 8, data: 'shape-' + i};

	contents.push(shape);
}

packer.addArray(contents);

console.log(packer.bins)

packer.bins.forEach(bin => {
	log(bin.rects);
});
*/
