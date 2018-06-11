var Body = Matter.Body;

// Set property that allows a body to ignore world's gravitational force
Body.setIgnoreGravity = function(body, ignore) {
	body.ignoreGravity = ignore;
};

// Flags an object as self balancing to the x-axis
Body.setBalancer = function(body, balancer) {
	body.balancer = true;
};

Body.setLevel = function(body) {
	body.level = true;
};

Body.setZIndex = function(body, index) {
	body.zindex = index;
};

Body.getPart = function(body, partName) {
	for(var part of body.parts) {
		if( part.partName == partName ) {
			return part;
		}
	}

	return false;
};

Body.setFrames = function(body, config = false) {
	if( !config ) {
		body.frames = false;

		return;
	}

	var modeTypes	= ['moving', 'damaged', 'normal', 'attacking'];
	var loop		= ( typeof(config.loop) == 'undefined' || config.loop ) ? true : false;

	body.frames = {
		frameIndex:		config.frameIndex || 0,
		tickCount:		config.tickCount || 0,
		loop:			loop,
		tile:			config.tile || false
	};

	for(var mode of modeTypes) {
		var modeData = config[mode] || {spriteFrames: [], ticksPerFrame: 50};

		body.frames[mode] = {
			spriteFrames:		modeData.spriteFrames || [],
			numFrames:		modeData.spriteFrames.length || 1,
			ticksPerFrame:		modeData.ticksPerFrame || 50,
			light:			modeData.light || false
		};
	}
};

Body.tickFrame = function(body) {
	var frames	= body.frames;
	var spriteMode	= (body.actor) ? body.actor.spriteMode : 'normal';
	var direction	= (body.actor) ? body.actor.facing : 'right';

	// Catch any bodies that have fallen out of normal mode but don't have frame data
	if( frames[spriteMode].spriteFrames.length == 0 ) {
		// Fallback to normal mode
		spriteMode = 'normal';
	}

	frames.tickCount++;

	if( frames.tickCount >= frames[spriteMode].ticksPerFrame ) {
		frames.tickCount = 1;
		body.frames.frameIndex++;

		// Have sprite frames loop back to first frame
		if( frames.frameIndex >= frames[spriteMode].numFrames ) {
			// If looping is disabled, leave sprite at its final frame
			if( !frames.loop ) {
				return;
			}

			frames.frameIndex = 0;
		}

		 var currentSprite = frames[spriteMode].spriteFrames[direction][frames.frameIndex];

		 body.render.sprite.texture = currentSprite;
	}
};

Body.orientToAngle = function(body, targetAngle) {
	var bodyAngle	= body.angle;
	var difference	= bodyAngle - targetAngle;

	if( Math.abs(difference) > 0.0035 ) {
		var velocity = body.angularVelocity + (-1 * Math.sin(difference) * 0.01);

		Body.setAngularVelocity(body, velocity);
	}
};

Body.orientToPoint = function(body, targetPoint) {
	// Measure line connecting two bodies and get its angle
	var diffX = targetPoint.x - body.position.x;
	var diffY = targetPoint.y - body.position.y;

	// Normalize angles to between -2PI and 2PI
	while( body.angle > Math.PI ) {
		Matter.Body.rotate(body, -2 * Math.PI);
	}
	while( body.angle < -Math.PI ) {
		Matter.Body.rotate(body, 2 * Math.PI);
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

		Body.setAngularVelocity(body, velocity);
	}
};

Body.orientToPointAbout = function(body, targetPoint, part) {

};

// apply force along line between body and targetBody
Body.moveTowards = function(body, force, targetBody) {
	/*
	var diffX = targetBody.position.x - body.position.x;
	var diffY = targetBody.position.y - body.position.y;

	var radians = Math.atan2(diffY, diffX);
	*/
	var radians = Game.utilities.getLineAngle(body.position, targetBody.position);

	var Fx = force * Math.cos(radians);
	var Fy = force * Math.sin(radians);

	Body.applyForce(body, body.position, {x: Fx, y: Fy});
};

Body.rotateAbout = function(body, radians, point, toPoint = false) {
	if( toPoint ) {
		var lineAngle	= Game.utilities.getLineAngle(point, toPoint);
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

	Body.setPosition(body, {
		x: point.x + (dx * cos - dy * sin),
		y: point.y + (dx * sin + dy * cos)
	});

	Body.rotate(body, radians);
};

// Applies force to a body along its primary axis
Body.thrust = function(body, force) {
	var radians = body.angle;

	if( force ) {
		var Fx = force * Math.cos(radians);
		var Fy = force * Math.sin(radians);

		Body.applyForce(body, body.position, {x: Fx, y: Fy});
	}
};

// Applies force and speed to a body at provided angle
Body.launch = function(body, force, speed, direction, rotate) {
	// Convert force magnitude and direction into a vector
	var radians = Game.utilities.degreesToRadians( Game.utilities.normalizeAngle(direction) );

	if( speed ) {
		var Vx = speed * Math.cos(radians);
		var Vy = -1 * speed * Math.sin(radians);

		Body.setVelocity(body, {x: Vx, y: Vy});
	}
	if( force ) {
		var Fx = force * Math.cos(radians);
		var Fy = -1 * force * Math.sin(radians);

		Body.applyForce(body, body.position, {x: Fx, y: Fy});
	}

	// Align body to that angle
	if( rotate ) {
		Body.setAngle(body, -1 * radians);
	}
};
