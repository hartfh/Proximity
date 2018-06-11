
function applyRenderPatch(Render) {
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
	    Resolver = Matter.Resolver,
	    Vector = Matter.Vector,
	    Bounds = Matter.Bounds;

	(function() {

		// NEW METHODS

		var _renderQueue = [];

		// Intended for special effects that go under UI overlay.
		// Might need to break these up into a few different categories (shots, explosions, etc.) to get correct layering
		var _outputQueueToContext = function(context) {
			for(var action of _renderQueue) {
				action.callback(context, action.args);
			}

			_renderQueue = [];
		};

		Render.addQueueAction = function(callback, args) {
			_renderQueue.push({callback: callback, args: args});
		};

		var _sortBodiesByZIndex = function(bodies) {
			var orderedBodies	= [];
			var zGroups		= {};
			var len			= bodies.length;

			// Break bodies up into groups according to z-index
			for(i = 0; i < len; i++) {
				var body		= bodies[i];
				var zIndex	= bodies[i].zindex || 50;

				if( !zGroups[zIndex] ) {
					zGroups[zIndex] = [];
				}

				zGroups[zIndex].push(body);
			}

			// Add bodies into an array in order
			for(var g in zGroups) {
				var group = zGroups[g];

				for(var body of group) {
					orderedBodies.push(body);
				}
			}

			return orderedBodies;
		}

		var _renderCourse = function(body, ctx) {
			var actor		= body.actor;
			var course	= actor.getCourse();
			var movePoint	= actor.getMovePoint();
			var target	= actor.getTarget();
			var firePoint	= actor.getFirePoint();

			if( course ) {
				// draw line along course to edge of screen

				// Determine course end point
				var courseDestX = body.position.x + Math.cos(course) * 1500;
				var courseDestY = body.position.y + Math.sin(course) * 1500;

				ctx.strokeStyle = '#e9ff88';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(body.position.x, body.position.y);
				ctx.lineTo(courseDestX, courseDestY);
				ctx.stroke();
				ctx.closePath();
			}
			if( movePoint ) {
				// draw dot on movePoint
				ctx.fillStyle = '#88dd00';
				ctx.fillRect(movePoint.x - 4, movePoint.y - 4, 8, 8);
			}
			if( target ) {
				// draw dot on target
				ctx.fillStyle = '#ff4400';
				ctx.fillRect(target.x - 4, target.y - 4, 8, 8);
			}
			if( firePoint ) {
				ctx.fillStyle = '#ff8800';
				ctx.fillRect(firePoint.x - 4, firePoint.y - 4, 8, 8);
			}
		};

		var _renderCallout = function(body, ctx) {
			var info = body.actor.getCalloutInfo();

			if( info ) {

			}
			// Name
			// Type of ship?
			// Affiliation
			// Stats: health
			// Weapons
		};

		// END NEW METHODS

		/**
		* Description
		* @method _createCanvas
		* @private
		* @param {} width
		* @param {} height
		* @return canvas
		*/
		var _createCanvas = function(width, height) {
			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			canvas.oncontextmenu = function() { return false; };
			canvas.onselectstart = function() { return false; };
			return canvas;
		};

		/**
		* Gets the pixel ratio of the canvas.
		* @method _getPixelRatio
		* @private
		* @param {HTMLElement} canvas
		* @return {Number} pixel ratio
		*/
		var _getPixelRatio = function(canvas) {
		  var context = canvas.getContext('2d'),
		      devicePixelRatio = window.devicePixelRatio || 1,
		      backingStorePixelRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio
		                                || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio
		                                || context.backingStorePixelRatio || 1;

		  context.imageSmoothingEnabled = false;

		  return devicePixelRatio / backingStorePixelRatio;
		};

		/**
		* Gets the requested texture (an Image) via its path
		* @method _getTexture
		* @private
		* @param {render} render
		* @param {string} imagePath
		* @return {Image} texture
		*/
		var _getTexture = function(render, imagePath) {
		  var image = render.textures[imagePath];

		  if (image)
		      return image;

		  image = render.textures[imagePath] = new Image();
		  image.src = imagePath;

		  return image;
		};

		/**
		* Applies the background to the canvas using CSS.
		* @method applyBackground
		* @private
		* @param {render} render
		* @param {string} background
		*/
		var _applyBackground = function(render, background) {
		  var cssBackground = background;

		  if (/(jpg|gif|png)$/.test(background))
		      cssBackground = 'url(' + background + ')';

		  render.canvas.style.background = cssBackground;
		  render.canvas.style.backgroundSize = "contain";
		  render.currentBackground = background;
		};

		/**
		* Description
		* @private
		* @method bodies
		* @param {render} render
		* @param {body[]} bodies
		* @param {RenderingContext} context
		*/
		Render.bodies = function(render, bodies, context) {
			Events.trigger(render, 'beforeRenderBodies');

		  var c = context,
		      engine = render.engine,
		      options = render.options,
		      showInternalEdges = options.showInternalEdges || !options.wireframes,
		      body,
		      part,
		      i,
		      k;

			bodies = _sortBodiesByZIndex(bodies);

			for (i = 0; i < bodies.length; i++) {
				body = bodies[i];

			 	if (!body.render.visible) {
					continue;
				}

			 	// handle compound parts
				for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
			     	part = body.parts[k];

				     if (!part.render.visible) {
						continue;
					}

				     if (options.showSleeping && body.isSleeping) {
				         c.globalAlpha = 0.5 * part.render.opacity;
				     } else if (part.render.opacity !== 1) {
				         c.globalAlpha = part.render.opacity;
				     }

				     if (part.render.sprite && part.render.sprite.texture && !options.wireframes) {
				         // part sprite
				         var sprite = part.render.sprite,
				             texture = _getTexture(render, sprite.texture);

						   //var pixelX = part.position.x - (part.position.x % 2);
						   //var pixelY = part.position.y - (part.position.y % 2);
				         c.translate(part.position.x, part.position.y);
					    c.rotate(body.angle); // NEW
				         //c.rotate(part.angle); // OLD

					    c.drawImage(
						   texture,
						   //texture.sheetX
						   //texture.sheetY
						   //texture.sheetWidth,
						   //texture.sheetHeight,
						   texture.width * -sprite.xOffset * sprite.xScale,
						   texture.height * -sprite.yOffset * sprite.yScale,
						   texture.width * sprite.xScale,
						   texture.height * sprite.yScale
					    );

				         // revert translation, hopefully faster than save / restore
				         //c.rotate(-part.angle); // OLD
					    c.rotate(-body.angle); // NEW
				         c.translate(-part.position.x, -part.position.y);
				     } else {
				         // part polygon
				         if (part.circleRadius) {
				             c.beginPath();
				             c.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
				         } else {
				             c.beginPath();
				             c.moveTo(part.vertices[0].x, part.vertices[0].y);

				             for (var j = 1; j < part.vertices.length; j++) {
				                 if (!part.vertices[j - 1].isInternal || showInternalEdges) {
				                     c.lineTo(part.vertices[j].x, part.vertices[j].y);
				                 } else {
				                     c.moveTo(part.vertices[j].x, part.vertices[j].y);
				                 }

				                 if (part.vertices[j].isInternal && !showInternalEdges) {
				                     c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
				                 }
				             }

				             c.lineTo(part.vertices[0].x, part.vertices[0].y);
				             c.closePath();
				         }

				         if (!options.wireframes) {
				             c.fillStyle = part.render.fillStyle;
				             c.lineWidth = part.render.lineWidth;
				             c.strokeStyle = part.render.strokeStyle;
				             c.fill();
				         } else {
				             c.lineWidth = 1;
				             c.strokeStyle = '#bbb';
				         }

					    c.stroke();
			     	}

			     	c.globalAlpha = 1;
			 		}

					// Render body courses and movement points
					//_renderCourse(body, c);

					// Render body descriptions
					//_renderCallout(body, c);
				}

				_outputQueueToContext(c);
			};

		Render.world = function(render) {
		  var engine = render.engine,
		      world = engine.world,
		      canvas = render.canvas,
		      context = render.context,
		      options = render.options,
		      allBodies = Composite.allBodies(world),
		      allConstraints = Composite.allConstraints(world),
		      background = options.wireframes ? options.wireframeBackground : options.background,
		      bodies = [],
		      constraints = [],
		      i;

		  var event = {
		      timestamp: engine.timing.timestamp
		  };

		  Game.Viewport.screenShakeWarmup(context);

		  Events.trigger(render, 'beforeRender', event);

		  // apply background if it has changed
		  if (render.currentBackground !== background)
		      _applyBackground(render, background);

		  // clear the canvas with a transparent fill, to allow the canvas background to show
		  context.globalCompositeOperation = 'source-in';
		  context.fillStyle = "transparent";
		  context.fillRect(0, 0, canvas.width, canvas.height);
		  context.globalCompositeOperation = 'source-over';

		  // handle bounds
		  if (options.hasBounds) {
		      var boundsWidth = render.bounds.max.x - render.bounds.min.x,
		          boundsHeight = render.bounds.max.y - render.bounds.min.y,
		          boundsScaleX = boundsWidth / options.width,
		          boundsScaleY = boundsHeight / options.height;

		      // filter out bodies that are not in view
		      for (i = 0; i < allBodies.length; i++) {
		          var body = allBodies[i];
		          if (Bounds.overlaps(body.bounds, render.bounds))
		              bodies.push(body);
		      }

		      // filter out constraints that are not in view
		      for (i = 0; i < allConstraints.length; i++) {
		          var constraint = allConstraints[i],
		              bodyA = constraint.bodyA,
		              bodyB = constraint.bodyB,
		              pointAWorld = constraint.pointA,
		              pointBWorld = constraint.pointB;

		          if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
		          if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);

		          if (!pointAWorld || !pointBWorld)
		              continue;

		          if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
		              constraints.push(constraint);
		      }

		      // transform the view
		      context.scale(1 / boundsScaleX, 1 / boundsScaleY);
		      context.translate(-render.bounds.min.x, -render.bounds.min.y);
		  } else {
		      constraints = allConstraints;
		      bodies = allBodies;
		  }

		  if (!options.wireframes || (engine.enableSleeping && options.showSleeping)) {
		      // fully featured rendering of bodies
		      Render.bodies(render, bodies, context);
		  } else {
		      if (options.showConvexHulls)
		          Render.bodyConvexHulls(render, bodies, context);

		      // optimised method for wireframes only
		      Render.bodyWireframes(render, bodies, context);
		  }

		  if (options.showBounds)
		      Render.bodyBounds(render, bodies, context);

		  if (options.showAxes || options.showAngleIndicator)
		      Render.bodyAxes(render, bodies, context);

		  if (options.showPositions)
		      Render.bodyPositions(render, bodies, context);

		  if (options.showVelocity)
		      Render.bodyVelocity(render, bodies, context);

		  if (options.showIds)
		      Render.bodyIds(render, bodies, context);

		  if (options.showSeparations)
		      Render.separations(render, engine.pairs.list, context);

		  if (options.showCollisions)
		      Render.collisions(render, engine.pairs.list, context);

		  if (options.showVertexNumbers)
		      Render.vertexNumbers(render, bodies, context);

		  if (options.showMousePosition)
		      Render.mousePosition(render, render.mouse, context);

		  Render.constraints(constraints, context);

		  if (options.showBroadphase && engine.broadphase.controller === Grid)
		      Render.grid(render, engine.broadphase, context);

		  if (options.showDebug)
		      Render.debug(render, context);

			// Custom layers
			context.translate(render.bounds.min.x, render.bounds.min.y);

			Game.SpecialEffectsLayer.render(context);
			Game.LightLayer.render(context, 'lighter'); // luminosity, soft-light, hard-light, lighten, lighter
			Game.DataEffectsLayer.render(context); // give some compositing type. semi transparent.
			Game.UILayer.render(context);



		  if (options.hasBounds) {
		      // revert view transforms
			 //options.pixelRatio = Game.constants.config.PIXEL_RATIO;
		      context.setTransform(options.pixelRatio, 0, 0, options.pixelRatio, 0, 0);
		  }

		  Events.trigger(render, 'afterRender', event);

		  Game.Viewport.screenShakeCooldown(context);
		};
	}());

	return Render;
}
