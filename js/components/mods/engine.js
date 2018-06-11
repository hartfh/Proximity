module.exports = function() {
	(function() {
	    /**
	     * Moves the simulation forward in time by `delta` ms.
	     * The `correction` argument is an optional `Number` that specifies the time correction factor to apply to the update.
	     * This can help improve the accuracy of the simulation in cases where `delta` is changing between updates.
	     * The value of `correction` is defined as `delta / lastDelta`, i.e. the percentage change of `delta` over the last step.
	     * Therefore the value is always `1` (no correction) when `delta` constant (or when no correction is desired, which is the default).
	     * See the paper on <a href="http://lonesock.net/article/verlet.html">Time Corrected Verlet</a> for more information.
	     *
	     * Triggers `beforeUpdate` and `afterUpdate` events.
	     * Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
	     * @method update
	     * @param {engine} engine
	     * @param {number} [delta=16.666]
	     * @param {number} [correction=1]
	     */
	    Matter.Engine.update = function(engine, delta, correction) {
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

	        Matter.Events.trigger(engine, 'beforeUpdate', event);

	        // get lists of all bodies and constraints, no matter what composites they are in
		/*
	        var allBodies = Matter.Composite.allBodies(world),
	            allConstraints = Matter.Composite.allConstraints(world);
		*/

		var allUnfilteredBodies = Matter.Composite.allBodies(world),
		    allConstraints = Matter.Composite.allConstraints(world);

			  var allBodies = [];
			  // Remove "phantom" bodies from updating (doodads)
			  for(var body of allUnfilteredBodies) {
				  if( !body.phantom ) {
					  allBodies.push(body);
				  }
			  }

	        // if sleeping enabled, call the sleeping controller
	        if (engine.enableSleeping)
	            Matter.Sleeping.update(allBodies, timing.timeScale);

	        // applies gravity to all bodies
	        _bodiesApplyGravity(allBodies, world.gravity);

	        // update all body position and rotation by integration
	        _bodiesUpdate(allBodies, delta, timing.timeScale, correction, world.bounds);

	        // update all constraints
	        for (i = 0; i < engine.constraintIterations; i++) {
	            Matter.Constraint.solveAll(allConstraints, timing.timeScale);
	        }
	        Matter.Constraint.postSolveAll(allBodies);

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
	            Matter.Composite.setModified(world, false, false, true);
	        }

	        // narrowphase pass: find actual collisions, then create or update collision pairs
	        var collisions = broadphase.detector(broadphasePairs, engine);

	        // update collision pairs
	        var pairs = engine.pairs,
	            timestamp = timing.timestamp;
	        Matter.Pairs.update(pairs, collisions, timestamp);
	        Matter.Pairs.removeOld(pairs, timestamp);

	        // wake up bodies involved in collisions
	        if (engine.enableSleeping)
	            Matter.Sleeping.afterCollisions(pairs.list, timing.timeScale);

	        // trigger collision events
	        if (pairs.collisionStart.length > 0)
	            Matter.Events.trigger(engine, 'collisionStart', { pairs: pairs.collisionStart });

	        // iteratively resolve position between collisions
	        Matter.Resolver.preSolvePosition(pairs.list);
	        for (i = 0; i < engine.positionIterations; i++) {
	            Matter.Resolver.solvePosition(pairs.list, timing.timeScale);
	        }
	        Matter.Resolver.postSolvePosition(allBodies);

	        // iteratively resolve velocity between collisions
	        Matter.Resolver.preSolveVelocity(pairs.list);
	        for (i = 0; i < engine.velocityIterations; i++) {
	            Matter.Resolver.solveVelocity(pairs.list, timing.timeScale);
	        }

	        // trigger collision events
	        if (pairs.collisionActive.length > 0)
	            Matter.Events.trigger(engine, 'collisionActive', { pairs: pairs.collisionActive });

	        if (pairs.collisionEnd.length > 0)
	            Matter.Events.trigger(engine, 'collisionEnd', { pairs: pairs.collisionEnd });

	        // clear force buffers
	        _bodiesClearForces(allBodies);

	        Matter.Events.trigger(engine, 'afterUpdate', event);

	        return engine;
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

	    var _bodiesApplyGravity = function(bodies, gravity) {
	        var gravityScale = typeof gravity.scale !== 'undefined' ? gravity.scale : 0.001;

	        if ((gravity.x === 0 && gravity.y === 0) || gravityScale === 0) {
	            return;
	        }

	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];

	            if (body.isStatic || body.isSleeping)
	                continue;

	            // apply gravity
	            body.force.y += body.mass * gravity.y * gravityScale;
	            body.force.x += body.mass * gravity.x * gravityScale;
	        }
	    };

	    var _bodiesUpdate = function(bodies, deltaTime, timeScale, correction, worldBounds) {
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];

	            if (body.isStatic || body.isSleeping)
	                continue;

	            Matter.Body.update(body, deltaTime, timeScale, correction);
	        }
	    };

	})();
}();
