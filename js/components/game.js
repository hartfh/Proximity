var Audio			= require('./audio/audio');
var ColorController	= require('./color-controller');
var Cursor		= require('./cursor');
var EventEmitter	= require('./event-emitter');
var Engine		= require('./engine');
var ImageConverter	= require('./image-converter');
var ImageLoader	= require('./image-loader');
var Interface		= require('./interface');
var Map			= require('./map');
var MapGrid		= require('./map-grid');
var Menus			= require('./menus');
var Mods			= require('./mods/mods');
var Player		= require('./player');
var Profile		= require('./profile');
var Router		= require('./router');
var SaveSlots		= require('./save-slots');
var SilhouetteLayer	= require('./silhouette-canvas');
var Settings		= require('./settings');
var Spawner		= require('./spawner');
var TaskManager	= require('./task-manager');
var Throttler		= require('./throttler');
var Tracker		= require('./tracker');
var Viewport		= require('./viewport');
var Weather		= require('./weather-controller');
var World			= require('./world');

var Game = {
	Audio:			Audio,
	ColorFill:		new ColorController('fill'),
	ColorTint:		new ColorController('tint'),
	Cursor:			Cursor,
	Engine:			Engine,
	Events:			EventEmitter,
	ImageConverter:	ImageConverter,
	ImageLoader:		ImageLoader,
	Interface:		Interface,
	Map:				Map,
	MapGrid:			MapGrid,
	Menus:			Menus,
	Mods:			Mods,
	Player:			Player,
	Profile:			Profile,
	Router:			Router,
	SilhouetteLayer:	SilhouetteLayer,
	Settings:			Settings,
	Slots:			SaveSlots,
	Spawner:			Spawner,
	State:		{
		canvasPosition:	{
			x:	0,
			y:	0,
		},
		actualFPS:		0,
		color:			{
			tint:			{
				color:		'#0e1b3c',
				mode:		'soft-light',
				opacity:		0.55,
				reset:		{color: '#0e1b3c', mode: 'soft-light', opacity: 0.55},
			},
			fill:	{
				color:		'#ffffff',
				mode:		'source-over',
				opacity:		0,
				reset:		{color: '#ffffff', mode: 'source-over', opacity: 0.0},
			}
		},
		fps:				0,
		map:				{
			height:	Constants.TERRAIN_TILE_SIZE * Constants.MAP_BLOCK_HEIGHT * Constants.MAP_BLOCK_SIZE,
			width:	Constants.TERRAIN_TILE_SIZE * Constants.MAP_BLOCK_WIDTH * Constants.MAP_BLOCK_SIZE,
		},
		paused:			false,
		pixelRatio:		1,
		playerDelta:		{
			x:	0,
			y:	0,
		},
		screenHeight:		0,
		screenWidth:		0,
		sleepers:			[],
		sleeping:			false,
		slotID:			false,
		summary:			{},
		summaries:		{},
		viewport:			{
			corner:	{x: 0, y: 0},
			height:	Constants.VPORT_HEIGHT,
			width:	Constants.VPORT_WIDTH,
			position:	{x: 0, y: 0}, // center point
		}
	},
	TaskManager:		TaskManager,
	Textures:			{},
	Throttler:		Throttler,
	Tracker:			Tracker,
	Viewport:			Viewport,
	VisualFX:			new RenderLayer(),
	Weather:			Weather,
	World:			World,
};

// General interface methods
Game.start = function() {
	var loadingTracker = new AsynchChecker(3, function() {
		log('Settings/Audio/Images loaded fully');
		Game.route('mainmenu/title');
		Game.Cursor.create( function(){ log('cursor actor created'); } );


		var textBody = TextFactory.create('green', 'riser', '+100 hp', 100, 70);
		Game.World.add(textBody);

		//Game.Weather.enable('heavy-rain');
		//Game.Weather.enable('light-rain');
		//Game.ColorTint.shift({color: '#003050', opacity: 0.60});
	});

	this.Engine.init(); // initialize after data has loaded?
	this.Settings.load(loadingTracker.check);
	this.Audio.init(loadingTracker.check);
	this.ImageConverter.decode(loadingTracker.check);

	/*
	this.Cursor.load(function() {
		log('cursors loaded');
	});
	*/
};

Game.save = function() {
	this.Slots.saveGame( function() { /* save complete */ } );
};

Game.saveAndExit = function() {
	this.Slots.saveGame( function() { /* exit after save */ } );
	// save before exiting
	// if in battlefield, need to depsawn each area so character data can be saved

	this.exit();
};

Game.exit = function() {
	ipc.send('close-main-window');
};

Game.route = function(route, refresh = false, menuArgs = {}) {
	Game.Router.route(route, refresh, menuArgs);
};

Game.sleep = function() {
	var self = this;

	if( self.State.sleeping ) {
		// Wake
		self.State.sleeping = false;

		for(var bodyID of self.State.sleepers) {
			// get actor from ID and wake
			var body = Game.World.get(bodyID);

			body.actor.wake();
		}

		self.State.sleepers = [];
	} else {
		// Sleep
		self.State.sleeping	= true;
		self.State.sleepers	= [];

		ActorFactory.eachActor(function(actor, bodyID) {
			if( actor.sleep() ) {
				self.State.sleepers.push(bodyID);
			}
		});
	}

	return self.State.sleeping;
};

// Stop the engine. Maybe reduce music level?
Game.pause = function(stopSound = false) {
	if( this.State.paused ) {
		// Unpause
		this.State.paused = false;
		this.Engine.start();

		if( stopSound ) {
			this.Audio.MenuEffects.start();
		}

		Game.route('battlefield/active');
	} else {
		// Pause
		this.State.paused = true;
		this.Engine.stop();

		if( stopSound ) {
			this.Audio.MenuEffects.stop();
		}

		Game.route('battlefield/paused');
	}

	return this.State.paused;
};

module.exports = Game;
