var Game = Game || {};

Game.settings = {
	tileset:		'rock'
};

Game.Audio = function() {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	var _bufferLoader, _effectBufferList, _musicBufferList;
	var _self		= {};
	var _context	= new AudioContext();
	var _paused	= false; // TODO: connect this up to Game.State.paused
	// NOTE: paused means battlefield-paused. There will still need to be audio during pause screen (effects) as well as effects/music in menu

	/*
	_self.Battlefield = {
		Effects:	new _self.Effects(),
		Music:	new _self.Music()
	};

	_self.Menu = {
		Effects:	new _self.Effects(),
		Music:	new _self.Music()
	};
	*/


	_self.Music = function() {
		var _self = {};
		// start/stop/playTrack
	};

	// rename to TrackManager and try to generalize between effects and music
	// supply bufferList to use, as well as max. number of tracks?
	_self.Effects = function() {
		var _self			= {};
		var _activeTracks	= new List();
		var _pausedTracks	= new List();

		_self.stop = function() {
			if( !_paused ) {
				_self.pauseTracks();
			}
		}

		_self.start = function() {
			if( _paused ) {
				_self.resumeTracks();
			}
		};

		_self.playTrack = function(soundName, position = 0) {
			var source = context.createBufferSource();
			var handle = _activeTracks.addItem({
				name:		soundName,
				source:		source,
				timestamp:	_context.currentTime
			});

			source.buffer = _effectBufferList[soundName];
			source.connect(_context.destination);
			source.start(0, position);
			source.on('complete, ended', function() {
				_activeTracks.removeItem(handle);
			});
		};

		_self.pauseTracks = function() {
			var timestamp = _context.currentTime;

			_activeTracks.popEachItem(function(item, handle, order) {
				var elapsedTime = timestamp - item.timestamp;

				item.source.stop();

				_pausedTracks.addItem({
					name:		item.soundName,
					position:		elapsedTime
				});
			});
		};

		_self.resumeTracks = function() {
			_pausedTracks.popEachItem(function(item, handle, order) {
				_self.playTrack(item.name, item.position);
			});
		};
	};

	_self.Interface = {
		// play()
		// pause()
		// stop()
		// volume(level)
	};

	_self.init = function() {
		_bufferLoader = new BufferLoader(_context, ['example-1.wav', 'example-2.wav'], callback);

		// NOTE: _musicBufferList leave empty?

		var callback = function(bufferList) {
			_effectBufferList = bufferList;
			// Fire event: sound effects loaded

			// TODO: replace "bufferList" with an object
				// e.g. bufferList.laserShot
		};
	};

	return _self;
}();

Game.State = (function() {
	var _self = {};
	var _screen; // what player is looking at
	var _paused = false;
	var _level = 0; // measure's the level the player is on. factors into overall difficulty (enemy generation)
	//var _score;

	_self.setScreen = function(newScreen) {
		var validScreens = ['loading', 'main-menu', 'settings', 'battlefield', 'pause', 'encyclopedia', 'death', 'new-level'];

		if( validScreens.indexOf(newScreen) != -1 ) {
			_screen = newScreen;
		}
	};

	_self.getScreen = function() {
		return _screen;
	};

	//temp
	_self.setScreen('battlefield');

	_self.pause = function() {
		Game.runner.enabled = !(Game.runner.enabled);
	};

	return _self;
}());

Game.init = function() {
	var _self		= this;
	var _utilities	= Game.utilities;
	var _constants	= Game.constants;
	var _data		= Game.data;
	var _config	= _constants.config;

	//var _assetGenerator = new ComponentGenerator(Asset, this);
	//var _parallaxLayerGen = new ComponentGenerator(Game.ParallaxLayer, _self);
	var _postCollisionEvents = [];

	_utilities.deepFreeze(_constants);
	_utilities.deepFreeze(_data);

	// http://blog.scottlogic.com/2016/07/05/audio-api-electron.html
	// https://www.html5rocks.com/en/tutorials/webaudio/intro/
	// http://www.justgoscha.com/programming/2014/04/08/creating-dynamic-audiobuffers-with-webaudio.html
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();

	// will need to list all sound assets
	bufferLoader = new BufferLoader(context, ['example-1.wav', 'example-2.wav'], finishedLoading);
	// NOTE: unsure how quick or stable this method will be
		// Possibly too much data to store in memory
	//bufferLoader.load();

	// "decodeAudioData" within BufferLoader class creates and returns buffers. Manually create one:
	//var buffer = context.createBuffer(2, length, 22000);

	var finishedLoading = function(bufferList) {
		/*
		for(var item of bufferList) {
			// create a source and set source.buffer = item;

			// connect source to something
		}
		*/
		// Gain node for adjusting master volume

		// Will need a BufferManager, where we can say get data associated with 'laser-shot-1'. Buffer data can then be connected to whereever.
		// May need a Source for each Actor (possibly multiple depending on number of sound types it can make, e.g. turret firing + rotating).
		// A turret firing will have its buffer adjusted according to shot sound, then set to start/stop and repeat.
		// Turret fire sounds probably actually rolled into shot actors, and played upon creation
			// As part of actor creation:
				// Create a source (one for each playSFX action. check somehow during factory creation)
				// Load correct sound into source buffer
				// Connect source to context
				// Setup events to start/stop source playback based on actions
				// Actors may need some sort of sound profile that specifies sounds for various actions
					// Create Game.data.sounds and allow sound as its own action, similar to showVFX, playSFX: Deathrattles: [{name: 'sound', sound: 'explosion1'}]
			// Need some way to halt or pause all active sounds during pausing.
				// May need to store position of actively playing sounds and resume them during pause/unpause
			// Music: will need to load track data into buffer on-demand, since memory can't hold all tracks simultaneously
				// Possibly load tracks in pairs so next one can be ready to go when current one finishes

		/*
		// Create two sources and play them both together.
		var source1 = context.createBufferSource();
		var source2 = context.createBufferSource();
		source1.buffer = bufferList[0];
		source2.buffer = bufferList[1];

		source1.loop = true/false;
		source1.connect(context.destination);
		source1.start(0);

		source2.connect(context.destination);
		source2.start(0);
		*/
	};


	var _createRenderer = function() {
		return Render.create({
		    element:	document.body,
		    canvas:	document.getElementById('main-viewport'),
		    engine:	Game.engine,
		    options:	{
			    width:		_config.VPORT_WIDTH * _config.PIXEL_RATIO,
			    height:		_config.VPORT_HEIGHT * _config.PIXEL_RATIO,
			    wireframes: 	false,
			    pixelRatio:	1,
			    background: 	'#000000'
		    },
		    bounds: {
			    min:	{
				    x:	0,
				    y:	0
			    },
			    max: {
				    x:	_config.VPORT_WIDTH,
				    y:	_config.VPORT_HEIGHT
			    }
		    },
		    hasBounds: true
		});
	};


	// module aliases
	var Engine	= applyEngineGravityPatch(Matter.Engine),
	    Render	= applyRenderPatch(Matter.Render),
	    World		= Matter.World,
	    Bodies	= Matter.Bodies,
	    Composites	= Matter.Composites,
	    Composite	= Matter.Composite,
	    Body		= Matter.Body,
	    Events	= Matter.Events;

	Game.engine = Engine.create();
	Game.runner = Matter.Runner.create();
	Game.render = _createRenderer();

	Game.removeBody = function(body) {
		Matter.World.remove(Game.engine.world, body);
	};
	Game.addBody = function(body) {
		Matter.World.add(Game.engine.world, body);
	};

	// Experimental
	Game.render.context.mozImageSmoothingEnabled = false;
	Game.render.context.webkitImageSmoothingEnabled = false;
	Game.render.context.msImageSmoothingEnabled = false;
	Game.render.context.imageSmoothingEnabled = false;

	var testPlayer = Game.TroupeFactory.create('friendly', 'playerShip', 5000, 5000);

	Game.Player.setTroupe(testPlayer);
	Game.Player.setWeapon('torpedo'); // temporary

	Game.TroupeFactory.create('enemy', 'testHydra', 5250, 4900);
	//Game.TroupeFactory.create('enemy', 'sphereTestEnemy', 4650, 4900);

	var testPowerup = Game.ActorFactory.create('neutral', ['items', 'common', 'powerupOne'], 300, 600);

	// TEST UI WORK

	// Basic setup
	Game.LightLayer = new Game.RenderLayer();
	Game.SpecialEffectsLayer = new Game.RenderLayer();
	Game.DataEffectsLayer = new Game.RenderLayer();
	Game.UILayer = new Game.RenderLayer();

	// Adding elements
	//Game.LightLayer.addElement(Game.UI.LightMap.render, 'lightmap');
	Game.UILayer.addElement(Game.map.tempRenderMap, 'tempMap');
	//Game.UILayer.addElement(Game.UI.stats.render, 'stats');
	//Game.UILayer.addElement(Game.UI.HUD.render, 'hud');

	// Toggling elements
	Game.UILayer.enableElement('hud').enableElement('stats').enableElement('tempMap');
	Game.LightLayer.enableElement('lightmap');


	/*
	var _enableCustomCursors = function() {
		Events.on(Game.render, 'afterRender', Game.Controls.renderCursor);
	};

	var _disableCustomCursors = function() {
		Events.off(Game.render, 'afterRender', Game.Controls.renderCursor);
	};

	_enableCustomCursors();
	*/


	var _setupParallaxing = function(generator) {
		// Create two parallax layers
		generator.addComponent({multiplier: 0.1, density: 55, opacity: 0.6, handle: 'parallax'});
		generator.addComponent({multiplier: 0.2, density: 55, opacity: 0.2, handle: 'parallax'});
	};

	var _disableParallaxing = function(generator) {
		generator.eachComponent(function(layer) {
			layer.destroy();

			generator.removeComponent(layer);
		});
	};

	//_setupParallaxing(_parallaxLayerGen);
	//_disableParallaxing(_parallaxLayerGen);


	/*
	var _updateRenderBackground = function() {
		Game.render.options.background = 'hex_code';
	}
	*/

	Game.Viewport.init();


	// Game events(?): collision, tick, pause, playerDeath

	var _hookGameEvents = function() {
		Matter.Events.on(Game.engine, 'collisionStart', function(e) {
			var pairs = e.pairs;

			for(var pair of pairs) {
				var bodies = [
					{self: 'bodyA', other: 'bodyB'},
					{self: 'bodyB', other: 'bodyA'}
				];

				for(var b in bodies) {
					var key		= bodies[b];
					var selfBody	= pair[key.self];
					var otherBody	= pair[key.other];
					var type		= '';

					if( selfBody.isSensor && otherBody.isSensor ) {
						return;
					}

					if( selfBody.isSensor ) {
						type = 'sensor';

						if( selfBody.ignoreCollisions ) {
							return;
						}
					}

					Game.EventEmitter.dispatch(type + '-collision-' + selfBody.id, otherBody);
				}
			}
		});

		Matter.Events.on(Game.engine, 'tick', function() {
			Game.EventEmitter.dispatch('tick');
		});

		Matter.Events.on(Game.engine, 'afterUpdate', function(e) {
			Game.EventEmitter.dispatch('afterUpdate', e);
		});
	};

	// Run postCollisionEvents
	// Need to integrate this with EventEmitter somehow
	Events.on(Game.engine, 'afterUpdate', function() {
		for(var i in _postCollisionEvents) {
			var ev = _postCollisionEvents[i];

			var callback	= ev.func;
			var args		= ev.args;

			callback(...args);
		}

		_postCollisionEvents = [];
	});

	Game.EventEmitter.subscribe('afterUpdate', function(e) {
		var allBodies = Matter.Composite.allBodies(e.source.world);

		for(var i in allBodies) {
			var body = allBodies[i];

			if( body.balancer ) {
				var velocity = body.angularVelocity + (-1 * Math.sin(body.angle) * 0.0007);

				Matter.Body.setAngularVelocity(body, velocity);
			}
			if( body.level ) {
				Matter.Body.setAngularVelocity(body, 0);
				Matter.Body.setAngle(body, 0);
			}
		}
	}, 'selfBalanceBodies');

	_hookGameEvents();


	//Game.map.generate();
	Game.map.generate2();


	// run the engine
	Matter.Runner.run(Game.runner, Game.engine);


	// run the renderer
	Render.run(Game.render);

	Game.engine.world.gravity.y = 0.1;

	// Animate non-sleeping body sprites
	Events.on(Game.engine, 'afterUpdate', function() {
		var allBodies = Composite.allBodies(Game.engine.world);

		bodyLoop:
		for(var body of allBodies) {
			if( body.hasFrames ) {
				if( body.actor ) {
					if( body.actor.isSleeping ) {
						continue bodyLoop;
					}
				}

				// Check each body part for frame data
				partLoop:
				for(var part of body.parts) {
					if(part.frames) {
						Body.tickFrame(part);
					}
				}
			}
		}
	});

	//var testWorker = new Worker('js/src/worker-test.js');
	// testWorker.postMessage('something');

	//console.log( Game.utilities.blendColors('#ff0000', '#ffff00') ); // #ff8000

	//console.log(Matter.Composite.allBodies(engine.world));
};
