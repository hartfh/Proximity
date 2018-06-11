function applyEngineGravityPatch(Engine) {
	var Engine = Matter.Engine,
	    Render = Matter.Render,
	    World = Matter.World,
	    Bodies = Matter.Bodies,
	    Composites = Matter.Composites,
	    Body = Matter.Body,
	    Events = Matter.Events,
	    Composite = Matter.Composite,
	    Metrics = Matter.Metrics,
	    Constraint = Matter.Constraint,
	    Pairs = Matter.Pairs,
	    Resolver = Matter.Resolver;

	(function() {
		var _bodiesUpdate = function(bodies, deltaTime, timeScale, correction, worldBounds) {
		  for (var i = 0; i < bodies.length; i++) {
		      var body = bodies[i];

		      if (body.isStatic || body.isSleeping)
		          continue;

		      Body.update(body, deltaTime, timeScale, correction);
		  }
		};

		var _bodiesApplyGravity = function(bodies, gravity) {
		  var gravityScale = typeof gravity.scale !== 'undefined' ? gravity.scale : 0.001;

		  if ((gravity.x === 0 && gravity.y === 0) || gravityScale === 0) {
		      return;
		  }

		  for (var i = 0; i < bodies.length; i++) {
		      var body = bodies[i];

		      if (body.isStatic || body.isSleeping || body.ignoreGravity)
		          continue;

		      // apply gravity
		      body.force.y += body.mass * gravity.y * gravityScale;
		      body.force.x += body.mass * gravity.x * gravityScale;
		  }
		};

		var _bodiesClearForces = function(bodies) {
		  for (var i = 0; i < bodies.length; i++) {
		      var body = bodies[i];

		      // reset force buffers
		      body.force.x = 0;
		      body.force.y = 0;
		      body.torque = 0;
		  }
		};

		Engine.update = function(engine, delta, correction) {
			delta = delta || 1000 / 60;
			correction = correction || 1;

			var world = engine.world,
			 timing = engine.timing,
			 broadphase = engine.broadphase,
			 broadphasePairs = [],
			 i;

			// increment timestamp
			timing.timestamp += delta * timing.timeScale;

			// create an event object
			var event = {
			 timestamp: timing.timestamp
			};

			Events.trigger(engine, 'beforeUpdate', event);

			// get lists of all bodies and constraints, no matter what composites they are in
			var allBodies = Composite.allBodies(world),
			 allConstraints = Composite.allConstraints(world);

			// if sleeping enabled, call the sleeping controller
			if (engine.enableSleeping)
			 Sleeping.update(allBodies, timing.timeScale);

			// applies gravity to all bodies
			_bodiesApplyGravity(allBodies, world.gravity);

			// update all body position and rotation by integration
			_bodiesUpdate(allBodies, delta, timing.timeScale, correction, world.bounds);

			// update all constraints
			for (i = 0; i < engine.constraintIterations; i++) {
			 Constraint.solveAll(allConstraints, timing.timeScale);
			}
			Constraint.postSolveAll(allBodies);

			// broadphase pass: find potential collision pairs
			if (broadphase.controller) {

			 // if world is dirty, we must flush the whole grid
			 if (world.isModified)
				broadphase.controller.clear(broadphase);

			 // update the grid buckets based on current bodies
			 broadphase.controller.update(broadphase, allBodies, engine, world.isModified);
			 broadphasePairs = broadphase.pairsList;
			} else {

			 // if no broadphase set, we just pass all bodies
			 broadphasePairs = allBodies;
			}

			// clear all composite modified flags
			if (world.isModified) {
			 Composite.setModified(world, false, false, true);
			}

			// narrowphase pass: find actual collisions, then create or update collision pairs
			var collisions = broadphase.detector(broadphasePairs, engine);

			// update collision pairs
			var pairs = engine.pairs,
			 timestamp = timing.timestamp;
			Pairs.update(pairs, collisions, timestamp);
			Pairs.removeOld(pairs, timestamp);

			// wake up bodies involved in collisions
			if (engine.enableSleeping)
			 Sleeping.afterCollisions(pairs.list, timing.timeScale);

			// trigger collision events
			if (pairs.collisionStart.length > 0)
			 Events.trigger(engine, 'collisionStart', { pairs: pairs.collisionStart });

			// iteratively resolve position between collisions
			Resolver.preSolvePosition(pairs.list);
			for (i = 0; i < engine.positionIterations; i++) {
			 Resolver.solvePosition(pairs.list, timing.timeScale);
			}
			Resolver.postSolvePosition(allBodies);

			// iteratively resolve velocity between collisions
			Resolver.preSolveVelocity(pairs.list);
			for (i = 0; i < engine.velocityIterations; i++) {
			 Resolver.solveVelocity(pairs.list, timing.timeScale);
			}

			// trigger collision events
			if (pairs.collisionActive.length > 0)
			 Events.trigger(engine, 'collisionActive', { pairs: pairs.collisionActive });

			if (pairs.collisionEnd.length > 0)
			 Events.trigger(engine, 'collisionEnd', { pairs: pairs.collisionEnd });

			// clear force buffers
			_bodiesClearForces(allBodies);

			Events.trigger(engine, 'afterUpdate', event);

			return engine;
		};
	}());

	return Engine;
}
