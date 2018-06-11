module.exports = function(bodyModule) {
	bodyModule.modeTypes = [
		'normal',
		'attacking',
		'attacking-moving',
		'attacking-moving-reacting',
		'attacking-moving-reacting-damaged',
		'attacking-moving-damaged',
		'attacking-reacting',
		'attacking-reacting-damaged',
		'attacking-damaged',
		'moving',
		'moving-reacting',
		'moving-reacting-damaged',
		'moving-damaged',
		'reacting',
		'reacting-damaged',
		'damaged',
	];

	bodyModule.modeFallbacks = {
		'attacking':	['attacking-damaged', 'attacking-reacting-damaged', 'attacking-reacting', 'attacking-moving-damaged', 'attacking-moving-reacting-damaged', 'attacking-moving-reacting', 'attacking-moving', 'moving'],
		'moving':		['moving-damaged', 'moving-reacting-damaged', 'moving-reacting'],
		'reacting':	['reacting-damaged'],
		'damaged':	[],
	};

	// Set property that allows a body to ignore world's gravitational force
	bodyModule.setIgnoreGravity = function(body, ignore) {
		body.ignoresGravity = ignore;
	};

	bodyModule.setIgnoresVicinity = function(body, ignore) {
		body.ignoresVicinity = ignore;
	};

	bodyModule.setBallistic = function(body, isBallistic = false) {
		body.ballistic = isBallistic;
	};

	bodyModule.setParallax = function(body, parallaxLevel = false) {
		body.parallax = parallaxLevel;
	};

	// Flags an object as self balancing to the x-axis
	bodyModule.setBalancer = function(body, balancer) {
		body.balancer = true;
	};

	bodyModule.setOrdinal = function(body) {
		body.ordinal = true;
	};

	bodyModule.setLevel = function(body) {
		body.level = true;
	};

	bodyModule.setZIndex = function(body, index) {
		body.zindex = index;
	};

	bodyModule.getPart = function(body, partName) {
		for(var part of body.parts) {
			if( part.partName == partName ) {
				return part;
			}
		}

		return false;
	};

	bodyModule.trackObject = function(body) {
		if( !Game.Tracker.hasObject() ) {
			return;
		}

		var trackPosition = Game.Tracker.getPosition();

		var minY = (body.tracker.min.y / 100) * Game.State.map.height;
		var maxY = (body.tracker.max.y / 100) * Game.State.map.height;
		var yRange = maxY - minY;

		var trackerYIntrusion = trackPosition.y - minY;

		if( trackerYIntrusion < 0 ) {
			trackerYIntrusion = 0;
		}
		if( trackerYIntrusion > yRange ) {
			trackerYIntrusion = yRange;
		}

		var percentYIntrusion = trackerYIntrusion / yRange;


		body.position.y = Game.State.viewport.position.y - (Constants.VPORT_HEIGHT * percentYIntrusion);
		body.position.x = Game.State.viewport.position.x;
	};

	/**
	 *
	 * @param		{object}		config
	 * @param		{boolean}		config.loop			Whether or not to reset frame index to 0 after all frames have been shown fully
	 * @param		{integer}		config.paddingFrames	Number of frame jumps to skip before frame loop can occur (e.g. 3 means three extra frames)
	 *
	 */
	bodyModule.setFrames = function(body, config = false) {
		if( !config ) {
			body.frames = false;

			return;
		}

		//var modeTypes	= ['normal', 'attacking', 'moving', 'reacting', 'damaged'];
		/*
		var modeTypes = [
			'normal',
			'attacking',
			'attacking-moving',
			'attacking-moving-reacting',
			'attacking-moving-reacting-damaged',
			'attacking-moving-damaged',
			'attacking-reacting',
			'attacking-reacting-damaged',
			'attacking-damaged',
			'moving',
			'moving-reacting',
			'moving-reacting-damaged',
			'moving-damaged',
			'reacting',
			'reacting-damaged',
			'damaged',
		];
		*/

		body.frames = {
			frameIndex:		config.frameIndex || 0,
			tickCount:		config.tickCount || 0,
			loop:			loop,
			tile:			config.tile || false,
		};

		for(var mode of bodyModule.modeTypes) {
			if( !config[mode] ) {
				continue;
			}

			var modeData		= config[mode] || {spriteFrames: [], ticksPerFrame: 100};
			var leftFacing		= (modeData.spriteFrames.w) ? modeData.spriteFrames.w.frames : [];
			var rightFacing	= (modeData.spriteFrames.e) ? modeData.spriteFrames.e.frames : []; // modeData.spriteFrames.e || []
			var numFrames		= (leftFacing.length > rightFacing.length) ? leftFacing.length : rightFacing.length;
			var loop			= ( typeof(modeData.loop) == 'undefined' || modeData.loop ) ? true : false;

			body.frames[mode] = {
				spriteFrames:		modeData.spriteFrames || [],
				numFrames:		numFrames || 1,
				ticksPerFrame:		modeData.ticksPerFrame || 100,
				loop:			loop,
				paddingFrames:		modeData.paddingFrames || 0,
				delayCount:		0,
				opacity:			modeData.opacity || 1,
				mode:			modeData.mode || 'source-over',
				effects:			modeData.effects || {},
				silhouette:		modeData.silhouette || false,
			};
		}
	};

	bodyModule.tickFrame = function(body) {
		var frames	= body.frames;
		var spriteMode	= (body.actor) ? body.actor.spriteMode : 'normal';
		var direction	= (body.actor) ? body.actor.facing : 'e';
		var refresh	= (body.actor) ? body.actor.refreshSpriteFrame : false;
		var reversed	= (body.actor) ? body.actor.spriteAnimReversed : false;

		// Catch any bodies that have fallen out of normal mode but don't have frame data
		if( !frames[spriteMode] ) {
			// Experimental
			var fallbackMode	= false;
			var attemptedModes	= spriteMode.split('-');
			var primaryMode	= attemptedModes[0];

			fallbackLoop:
			for(var i in bodyModule.modeFallbacks[primaryMode]) {
				var testMode = bodyModule.modeFallbacks[primaryMode][i];

				if( frames[testMode] ) {
					fallbackMode = frames[testMode];
					break fallbackLoop;
				}
			}

			// Attempt the primary mode as the fallback
			if( frames[primaryMode] ) {
				fallbackMode = primaryMode;
			}

			spriteMode = (fallbackMode) ? fallbackMode : 'normal';

			// Original
			//spriteMode = 'normal';
		}

		function createEffect(body, effectData = false) {
			if( !effectData ) {
				return;
			}

			var position	= {x: body.position.x + (effectData.x || 0), y: body.position.y + (effectData.y || 0)};
			var sound		= (effectData.muted) ? {sound: false} : false;

			EffectsFactory.create(effectData.effect, position.x, position.y, sound);
		}

		frames.tickCount++;

		if( frames.tickCount >= frames[spriteMode].ticksPerFrame || refresh ) {
			frames.tickCount = 1;

			// Move frames forward or backward by one
			if( reversed ) {
				body.frames.frameIndex--;
			} else {
				body.frames.frameIndex++;
			}

			// Have sprite frames loop back to first frame
			if( frames.frameIndex >= frames[spriteMode].numFrames || refresh ) {
				// If looping is disabled, leave sprite at its final frame
				if( !frames[spriteMode].loop && !refresh ) {
					return;
				}

				// Add extra ticks onto the resetting of the frame index
				if( frames[spriteMode].paddingFrames ) {
					frames[spriteMode].delayCount++;

					if( frames[spriteMode].delayCount > frames[spriteMode].paddingFrames ) {
						frames[spriteMode].delayCount = 1;
					} else {
						return;
					}
				}

				// Reset to first frame
				frames.frameIndex = 0;
			} else if( frames.frameIndex < 0 ) {
				// Advance to last frame
				frames.frameIndex = frames[spriteMode].numFrames;
			}

			body.render.sprite.opacity	= frames[spriteMode].opacity;
			body.render.sprite.mode		= frames[spriteMode].mode;

			if( frames[spriteMode].spriteFrames[direction] ) {
				var currentSprite = frames[spriteMode].spriteFrames[direction].frames[frames.frameIndex];

				if( !currentSprite ) {
					return;
				}

				body.render.sprite.texture = currentSprite;

				// If the facing has a zindex override, set it
				if( frames[spriteMode].spriteFrames[direction].zindex ) {
					body.zindexOverride = frames[spriteMode].spriteFrames[direction].zindex ;
				} else if( body.zindexOverride ) {
					body.zindexOverride = false;
				}

				var effectData = frames[spriteMode].effects[currentSprite];

				createEffect(body, effectData);
			} else {
				// Check other facings for fallbacks
				for(var facing of Constants.SPRITE_FACINGS) {
					if( frames[spriteMode].spriteFrames[facing] ) {
						var currentSprite = frames[spriteMode].spriteFrames[facing].frames[frames.frameIndex];

						body.render.sprite.texture = currentSprite;

						// If the facing has a zindex override, set it
						if( frames[spriteMode].spriteFrames[facing].zindex ) {
							body.zindexOverride = frames[spriteMode].spriteFrames[facing].zindex;
						} else if( body.zindexOverride ) {
							body.zindexOverride = false;
						}

						var effectData = frames[spriteMode].effects[currentSprite];

						createEffect(body, effectData);

						break;
					}
				}
			}
		}
	};

	bodyModule.resetFrames = function(body) {
		if( body.frames ) {
			var spriteMode	= (body.actor) ? body.actor.spriteMode : 'normal';
			var direction	= (body.actor) ? body.actor.facing : 'e';

			if( frames[spriteMode].spriteFrames.length == 0 ) {
				// Fallback to normal mode
				spriteMode = 'normal';
			}

			var currentSprite = frames[spriteMode].spriteFrames[direction].frames[0];
			body.render.sprite.texture	= currentSprite;
			body.render.sprite.opacity	= frames[spriteMode].opacity;
			body.render.sprite.mode		= frames[spriteMode].mode;
		}
	};

	bodyModule.orientToAngle = function(body, targetAngle) {
		var bodyAngle	= body.angle;
		var difference	= bodyAngle - targetAngle;

		if( Math.abs(difference) > 0.0035 ) {
			var velocity = body.angularVelocity + (-1 * Math.sin(difference) * 0.01);

			bodyModule.setAngularVelocity(body, velocity);
		}
	};

	bodyModule.orientToPoint = function(body, targetPoint) {
		// Measure line connecting two bodies and get its angle
		var diffX = targetPoint.x - body.position.x;
		var diffY = targetPoint.y - body.position.y;

		// Normalize angles to between -2PI and 2PI
		while( body.angle > Math.PI ) {
			this.rotate(body, -2 * Math.PI);
		}
		while( body.angle < -Math.PI ) {
			this.rotate(body, 2 * Math.PI);
		}

		var lineAngle	= Math.atan2(diffY, diffX);
		var angleDiff	= body.angle - lineAngle;

		if( angleDiff > Math.PI ) {
			angleDiff = -(2 * Math.PI - angleDiff);
		}
		if( angleDiff < -Math.PI ) {
			angleDiff = (2 * Math.PI + angleDiff);
		}

		// If the angle difference isn't 0, apply slight correction
		if( angleDiff != 0 ) {
			var absDiffAngle	= Math.abs(angleDiff);
			var velocity		= body.angularVelocity + ( angleDiff / -300 );

			// Reduce the velocity as the angle difference becomes small, so as to hone in on the target
			if( absDiffAngle < 0.3 ) {
				velocity *= 0.7;

				if( absDiffAngle < 0.1 ) {
					velocity *= 0.6;
				}
			}

			// Impose an angular speed limit on the body being oriented
			var speedLimit = 0.07;

			if( velocity > speedLimit ) {
				velocity = speedLimit;
			} else if( velocity < -speedLimit ) {
				velocity = -speedLimit;
			}

			bodyModule.setAngularVelocity(body, velocity);
		}
	};

	bodyModule.orientToPointAbout = function(body, targetPoint, part) {

	};

	// apply force along line between body and targetBody
	bodyModule.moveTowards = function(body, force, targetBody) {
		var radians = Utilities.getLineAngle(body.position, targetBody.position);

		var Fx = force * Math.cos(radians);
		var Fy = force * Math.sin(radians);

		bodyModule.applyForce(body, body.position, {x: Fx, y: Fy});
	};

	bodyModule.rotateAbout = function(body, radians, point, toPoint = false) {
		if( toPoint ) {
			var lineAngle	= Utilities.getLineAngle(point, toPoint);
			var angleDiff	= body.angle - lineAngle;

			if( angleDiff > 0.01 ) {
				radians = -0.0035;
			}
			if( angleDiff < -0.01 ) {
				radians = 0.0035;
			}
		}

		var cos = Math.cos(radians);
		var sin = Math.sin(radians);

		var dx = body.position.x - point.x;
		var dy = body.position.y - point.y;

		this.setPosition(body, {
			x: point.x + (dx * cos - dy * sin),
			y: point.y + (dx * sin + dy * cos)
		});

		this.rotate(body, radians);
	};

	// Applies force to a body along its primary axis
	bodyModule.thrust = function(body, force) {
		var radians = body.angle;

		if( force ) {
			var Fx = force * Math.cos(radians);
			var Fy = force * Math.sin(radians);

			this.applyForce(body, body.position, {x: Fx, y: Fy});
		}
	};

	// Applies force and speed to a body at provided angle
	bodyModule.launch = function(body, force, speed, direction, rotate) {
		// Convert force magnitude and direction into a vector
		var radians = Utilities.degreesToRadians( Game.utilities.normalizeAngle(direction) );

		if( speed ) {
			var Vx = speed * Math.cos(radians);
			var Vy = -1 * speed * Math.sin(radians);

			this.setVelocity(body, {x: Vx, y: Vy});
		}
		if( force ) {
			var Fx = force * Math.cos(radians);
			var Fy = -1 * force * Math.sin(radians);

			this.applyForce(body, body.position, {x: Fx, y: Fy});
		}

		// Align body to that angle
		if( rotate ) {
			this.setAngle(body, -1 * radians);
		}
	};

	bodyModule.correctTrajectoryOrientation = function(body) {
		var angle	= Math.atan2(body.velocity.y, body.velocity.x);

		Matter.Body.setAngle(body, angle);
	}
}
