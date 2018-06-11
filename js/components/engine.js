module.exports = new function() {
	var _self = this;
	//const _CUSTOM_GRAVITY = (0.5) * 0.001;
	const _CUSTOM_GRAVITY = (1) * 0.001;

	var tickCounter = 0;

	_self.init = function() {
		_self.engine = Matter.Engine.create();
		_self.runner = Matter.Runner.create();
		_self.render = _createRenderer();

		_self.render.context.imageSmoothingEnabled = false;

		_adjustGravity();

		Game.Viewport.init();

		_hookGameEvents();
		_startMatterEngine();
	};

	_self.stop = function() {
		Matter.Runner.stop(_self.runner);
	};

	_self.start = function() {
		Matter.Runner.run(_self.runner, _self.engine);
	};

	// Disable Matter.js gravity calculation and apply custom gravity function
	function _adjustGravity() {
		_self.engine.world.gravity.y = 0;

		var bodiesApplyGravity = function() {
			var bodies = Game.World.all();

			if( Game.State.sleeping ) {
				return;
			}

			for (var i = 0; i < bodies.length; i++) {
				var body = bodies[i];

				/*
				if (body.isStatic || body.isSleeping || body.ignoresGravity) {
					continue;
				}
				*/

				// Only apply gravity to "ballistic" actors
				if( !body.ballistic ) {
					continue;
				}

				body.force.y += body.mass * _CUSTOM_GRAVITY;

				Matter.Body.correctTrajectoryOrientation(body);
			}
		};

		Matter.Events.on(_self.engine, 'beforeUpdate', bodiesApplyGravity);
	};

	function _startMatterEngine() {
		// run the engine
		Matter.Runner.run(_self.runner, _self.engine);

		// run the renderer
		Matter.Render.run(_self.render);
	};

	function _createRenderer() {
		return Matter.Render.create({
		    element:	document.body,
		    canvas:	document.getElementById('main-viewport'),
		    engine:	_self.engine,
		    options:	{
			    width:		Constants.VPORT_WIDTH,
			    height:		Constants.VPORT_HEIGHT,
			    wireframes: 	false,
			    pixelRatio:	1,
			    background:	'#322e2c',
		    },
		    bounds: {
			    min:	{
				    x:	0,
				    y:	0
			    },
			    max: {
				    x:	Constants.VPORT_WIDTH,
				    y:	Constants.VPORT_HEIGHT,
			    }
		    },
		    hasBounds: true
		});
	};

	function _hookGameEvents() {
		// Animate non-sleeping body sprites
		Matter.Events.on(_self.engine, 'afterUpdate', function() {
			var allBodies = Game.World.all();
			var d1Delta = {
				x:	Game.State.playerDelta.x * Constants.PARALLAX_1,
				y:	Game.State.playerDelta.y * Constants.PARALLAX_1,
			};

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
						if( part.frames ) {
							if( !part.staticFrames ) { // skip bodies with no animated sprites.
								Matter.Body.tickFrame(part);
							}
						}
					}

					if( body.actor ) {
						body.actor.refreshSpriteFrame = false;
					}
				}
				if( body.balancer ) {
					var velocity = body.angularVelocity + (-1 * Math.sin(body.angle) * 0.0007);

					Matter.Body.setAngularVelocity(body, velocity);
				}
				if( body.level ) {
					Matter.Body.setAngularVelocity(body, 0);
					Matter.Body.setAngle(body, 0);
				}
				if( body.ordinal ) {
					Matter.Body.setAngularVelocity(body, 0);
					Matter.Body.setAngle( body, Utilities.ordinalizeRadians(body.angle) );
				}
				/*
				if( body.parallax ) {
					var delta = false;

					switch(body.parallax) {
						case 1:
							delta = d1Delta;
							break;
						default:
							break;
					}

					if( delta ) {
						Matter.Body.translate(body, delta);
					}
				}
				*/
				if( body.tracker ) {
					Matter.Body.trackObject(body);
				}
			}
		});

		Matter.Events.on(_self.engine, 'collisionStart', function(e) {
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

					Game.Events.dispatch(type + '-collision-' + selfBody.id, {obstacle: otherBody, pair: pair});
				}
			}
		});

		Matter.Events.on(_self.engine, 'tick', function() {
			Game.Events.dispatch('tick');

			if( tickCounter % 10 == 0 ) {
				Game.Events.dispatch('10-ticks');
			}
			if( tickCounter % 25 == 0 ) {
				Game.Events.dispatch('25-ticks');
			}
			if( tickCounter % 50 == 0 ) {
				Game.Events.dispatch('50-ticks');
			}
			if( tickCounter % 100 == 0 ) {
				Game.Events.dispatch('100-ticks');
			}
			if( tickCounter % 300 == 0 ) {
				Game.Events.dispatch('500-ticks');
			}

			tickCounter++;

			if( tickCounter >= 10000 ) {
				tickCounter = 0;
			}
		});

		Matter.Events.on(_self.engine, 'afterUpdate', function(e) {
			Game.Events.dispatch('afterUpdate', e);
		});

		Matter.Events.on(_self.render, 'afterRender', function() {
			Game.Events.dispatch('afterRender');
		});
	};
};
