module.exports = function() {
	(function() {
		// BEGIN CUSTOM FUNCTIONALITY

		function _sortBodiesByZIndex(bodies) {
			var orderedBodies	= {};
			var foreBodies		= [];
			var subBodies		= [];
			var superBodies	= [];
			var zGroups		= {};
			var len			= bodies.length;

			// Break bodies up into groups according to z-index
			for(i = 0; i < len; i++) {
				var body = bodies[i];

				if( !body.render.visible ) {
					continue;
				}

				for(k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
			     	var part		= body.parts[k];
					var zName		= body.zindex || 'vehicle';

					if( part.zindexOverride ) {
						zName = part.zindexOverride;
					} else if( part.zindex ) {
						zName = part.zindex;
					}

					var zIndex	= Data.zindices[zName];

					if( !zGroups[zIndex] ) {
						zGroups[zIndex] = [];
					}

					zGroups[zIndex].push(part);
				}
			}


			// Add bodies into an array in order
			for(var g in zGroups) {
				var group = zGroups[g];

				// Sort bodies according to their y- or virtual-y values
				group = Utilities.mergeSort(group, function(bodyA, bodyB) {
					var aVal = bodyA.yv || bodyA.position.y;
					var bVal = bodyB.yv || bodyB.position.y;

					if( aVal > bVal ) {
						return 1;
					} else if( bVal > aVal ) {
						return -1;
					} else {
						return 0;
					}
				});

				for(var body of group) {
					if( g >= 1000 ) {
						superBodies.push(body);
					} else {
						if( g >= 200 ) {
							foreBodies.push(body);
						} else {
							subBodies.push(body);
						}
					}
				}
			}

			orderedBodies.sub	= subBodies;
			orderedBodies.fore	= foreBodies;
			orderedBodies.super	= superBodies;

			return orderedBodies;
		}

		function _renderWaypoints(body, ctx) {
			var actor		= body.actor;
			if(!actor) {
				return;
			}

			var waypoints	= actor.getMoveWaypoints();

			ctx.fillStyle = '#ff9955';

			for(var waypoint of waypoints) {
				ctx.fillRect(waypoint.x, waypoint.y, 5, 5);
			}

			var movePoint = actor.getMovePoint();

			if( movePoint ) {
				ctx.fillStyle = '#ff6622';

				ctx.fillRect(movePoint.x, movePoint.y, 5, 5);

				ctx.strokeStyle = '#ccff77';
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(body.position.x, body.position.y);
				ctx.lineTo(movePoint.x, movePoint.y);
				ctx.stroke();
				ctx.closePath();
			}

			ctx.strokeStyle = '#ffee44';
			ctx.lineWidth = 1;

			ctx.beginPath();
			for(var w in waypoints) {
				var waypoint = waypoints[w];

				if( w == 0 ) {
					ctx.moveTo(waypoint.x, waypoint.y);
				} else {
					ctx.lineTo(waypoint.x, waypoint.y);
					ctx.stroke();
				}
			}

			if( movePoint ) {
				ctx.lineTo(movePoint.x, movePoint.y);
				ctx.stroke();
			}

			ctx.closePath();
		}

		// END CUSTOM FUNCTIONALITY


		/**
		* Description
		*
		* @method		_createCanvas
		* @private
		* @param		{integer}		width
		* @param		{integer}		height
		* @return							canvas
		*/
		var _createCanvas = function(width, height) {
			var canvas = document.createElement('canvas');

			canvas.width	= width;
			canvas.height	= height;

			canvas.oncontextmenu = function() { return false; };
			canvas.onselectstart = function() { return false; };

			return canvas;
		};

		/**
		* Gets the pixel ratio of the canvas.
		*
		* @method		_getPixelRatio
		* @private
		* @param		{HTMLElement}	canvas
		* @return		{Number}				pixel ratio
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
		* @param		{render}	render
		* @param		{string}	imagePath
		* @return		{Image}				An image element
		*/

		var _getTexture = function(render, imageName) {
			var image = render.textures[imageName];

			if( image ) {
				return image;
			}

			image = render.textures[imageName] = new Image();

			image.src = Data.sheets[ Data.images[imageName].sheet ];

			return image;
		};

		/**
		* Applies the background to the canvas using CSS.
		* @method applyBackground
		* @private
		* @param	{render}	render
		* @param	{string}	background
		*/
		var _applyBackground = function(render, background) {
			var cssBackground = background;

			if(/(jpg|gif|png)$/.test(background)) {
				cssBackground = 'url(' + background + ')';
			}

			render.canvas.style.background	= cssBackground;
			render.canvas.style.backgroundSize	= "contain";
			render.currentBackground			= background;
		};

		var clipped = false;

		/**
		* Description
		* @private
		* @method bodies
		* @param {render} render
		* @param {body[]} bodies
		* @param {RenderingContext} context
		*/
		Matter.Render.bodies = function(render, bodies, context, fireEvents = false, checkSilhouette = false) {
			if( fireEvents ) {
				Matter.Events.trigger(render, 'beforeRenderBodies');
			}

			var body, part, i, k;
		  	var c				= context;
			var engine			= render.engine;
			var options			= render.options
			var showInternalEdges	= options.showInternalEdges || !options.wireframes;

			//c.imageSmoothingEnabled = false;

			for(var i = 0; i < bodies.length; i++) {
				var part = bodies[i];

				c.globalAlpha = part.render.opacity;

				if(part.render.sprite && part.render.sprite.texture && !options.wireframes) {
					// part sprite
					var sprite	= part.render.sprite;
					var imageData	= Data.images[sprite.texture];
					var texture	= _getTexture(render, sprite.texture);

					if( sprite.opacity != 1 ) {
						c.globalAlpha = sprite.opacity;
					}
					if( sprite.mode != 'source-over' ) {
						c.globalCompositeOperation = sprite.mode;
					}

					if( part.frames.tile ) {
						// Skip translation and rotation of canvas for bodies with tiled sprite
						var drawWidth	= part.bounds.max.x - part.bounds.min.x;
						var drawHeight	= part.bounds.max.y - part.bounds.min.y;

						for(var drawX = 0; drawX < drawWidth; drawX += imageData.w) {
							for(var drawY = 0; drawY < drawHeight; drawY += imageData.h) {
								var xOverflow	= drawX + imageData.w;
								var yOverflow	= drawY + imageData.h;
								var xSlice	= (xOverflow > drawWidth) ? (xOverflow - drawWidth) : 0;
								var ySlice	= (yOverflow > drawHeight) ? (yOverflow - drawHeight) : 0;

								c.drawImage(
									texture,
									0,
									0,
									imageData.w - xSlice,
									imageData.h - ySlice,
									part.bounds.min.x + drawX,
									part.bounds.min.y + drawY,
									imageData.w - xSlice,
									imageData.h - ySlice
								);
							}
						}
					} else {
						if( checkSilhouette && !sprite.silhouette ) {
							continue;
						}
						//c.save();
							//c.translate( Math.floor(part.position.x), Math.floor(part.position.y) );
						c.translate(part.position.x, part.position.y);

						if( part.parent.angle != 0 ) {
							c.rotate(part.parent.angle);
						}

						c.drawImage(
							texture,
							imageData.x,
							imageData.y,
							imageData.w,
							imageData.h,
							imageData.w * -sprite.xOffset * sprite.xScale,
							imageData.h * -sprite.yOffset * sprite.yScale,
							imageData.w * sprite.xScale,
							imageData.h * sprite.yScale
						);

						//c.restore();
						if( part.parent.angle != 0 ) {
							c.rotate(-part.parent.angle);
						}
						c.translate(-part.position.x, -part.position.y);
					}
			    } else {
					// part polygon
					if (part.circleRadius) {
					   c.beginPath();
					   c.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
					} else {
						c.globalAlpha = 0.3;

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

					if(!options.wireframes) {
						c.fillStyle	= part.render.fillStyle;
						c.lineWidth	= part.render.lineWidth;
						c.strokeStyle	= part.render.strokeStyle;
						c.fill();
					} else {
						c.lineWidth = 1;
						c.strokeStyle = '#bbb';
					}

					c.stroke();

					//c.globalAlpha = 1;
				}

				// Text rendering
				if( part.display ) {
					part.display.render(c);
				}

				c.globalAlpha = 1;
				c.globalCompositeOperation = 'source-over';
			}
		};

		Matter.Render.world = function(render) {
			var engine		= render.engine;
			var world			= engine.world;
			var canvas		= Game.VisualFX.getLayerCanvas();
			var context		= Game.VisualFX.getLayerContext();
			var options		= render.options;
			var allBodies		= Matter.Composite.allBodies(world);
			var allConstraints	= Matter.Composite.allConstraints(world);
			var background		= options.wireframes ? options.wireframeBackground : options.background;
			var bodies		= [];
			var constraints	= [];
			var i;

			var event = {
				timestamp: engine.timing.timestamp
			};

			Game.Viewport.screenShakeWarmup(context);

			Matter.Events.trigger(render, 'beforeRender', event);

			// apply background if it has changed
			if(render.currentBackground !== background) {
				_applyBackground(render, background);
			}

			// Clear the canvas with a transparent fill, to allow the canvas background to show
			context.globalCompositeOperation = 'source-in';
			context.fillStyle = 'transparent';
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.globalCompositeOperation = 'source-over';


			// handle bounds
			if(options.hasBounds) {
				var boundsWidth	= render.bounds.max.x - render.bounds.min.x;
				var boundsHeight	= render.bounds.max.y - render.bounds.min.y;
				var boundsScaleX	= boundsWidth / options.width;
				var boundsScaleY	= boundsHeight / options.height;

				// filter out bodies that are not in view
				for(i = 0; i < allBodies.length; i++) {
					var body = allBodies[i];

					/*
					if( Matter.Bounds.overlaps(body.bounds, render.bounds) ) {
						bodies.push(body);
					}
					*/
					if( Matter.Bounds.overlaps(body.bounds, {min: {x: render.bounds.min.x - 0, y: render.bounds.min.y - 0}, max: {x: render.bounds.max.x + 0, y: render.bounds.max.y + 0}}) ) {
						bodies.push(body);
					}
					// TODO: do a check if body overlaps small reigon around player, and if so add into separate array
						// Those bodies will then get redrawn with an inverted clipping mask in place, at half normal opacity
				}

				bodies = _sortBodiesByZIndex(bodies);

				// filter out constraints that are not in view
				for(i = 0; i < allConstraints.length; i++) {
					var constraint		= allConstraints[i];
					var bodyA			= constraint.bodyA;
					var bodyB			= constraint.bodyB;
					var pointAWorld	= constraint.pointA;
					var pointBWorld	= constraint.pointB;

					if(bodyA) pointAWorld = Matter.Vector.add(bodyA.position, constraint.pointA);
					if(bodyB) pointBWorld = Matter.Vector.add(bodyB.position, constraint.pointB);

					if(!pointAWorld || !pointBWorld) {
						continue;
					}

					if( Matter.Bounds.contains(render.bounds, pointAWorld) || Matter.Bounds.contains(render.bounds, pointBWorld) ) {
						constraints.push(constraint);
					}
				}

				// transform the view
				context.scale(1 / boundsScaleX, 1 / boundsScaleY);
				//context.translate(-render.bounds.min.x, -render.bounds.min.y);
				context.translate(-Math.round(render.bounds.min.x), -Math.round(render.bounds.min.y));
			} else {
				constraints	= allConstraints;
				//bodies		= allBodies;
				bodies.sub	= allBodies;
			}

			if( !options.wireframes || (engine.enableSleeping && options.showSleeping) ) {
				Matter.Render.bodies(render, bodies.sub, context, true);
				Game.SilhouetteLayer.setMode('background');
				Matter.Render.bodies(render, bodies.sub, Game.SilhouetteLayer.getContext(), false, true);

				/*
				// Begin Clipping
				if( Game.Profile.player ) {
					var relativePos = {
						x:	Game.Profile.player.position.x - Game.State.viewport.corner.x,
						y:	Game.Profile.player.position.y - Game.State.viewport.corner.y,
					};
					context.save();
					context.beginPath();
					context.rect(Game.State.viewport.corner.x, Game.State.viewport.corner.y, relativePos.x - 40, Game.State.viewport.height);
					context.rect(Game.Profile.player.position.x + 40, Game.State.viewport.corner.y, Game.State.viewport.width - relativePos.x - 40, Game.State.viewport.height);
					context.rect(Game.Profile.player.position.x - 40, Game.State.viewport.corner.y, 40 * 2, relativePos.y - 40);
					context.rect(Game.Profile.player.position.x - 40, Game.Profile.player.position.y + 40, 40 * 2, Game.State.viewport.height - relativePos.y);
					context.clip();
				}
				*/

				Matter.Render.bodies(render, bodies.fore, context, true);
				Game.SilhouetteLayer.setMode('foreground');
				Matter.Render.bodies(render, bodies.fore, Game.SilhouetteLayer.getContext());

				Game.SilhouetteLayer.print(Game.Engine.render.context);

				/*
				// End Clipping
				if( Game.Profile.player ) {
					context.restore();
				}
				*/

				for(var body of bodies.sub) {
					_renderWaypoints(body, context);
				}
			} else {
				if(options.showConvexHulls) {
					Matter.Render.bodyConvexHulls(render, bodies.sub, context);
				}

				// optimised method for wireframes only
				Matter.Render.bodyWireframes(render, bodies.sub, context);
			}

			Matter.Render.constraints(constraints, context);

			// Custom layers
			//context.translate(render.bounds.min.x, render.bounds.min.y); // OLD
			context.translate( Math.round(render.bounds.min.x), Math.round(render.bounds.min.y) );

			Game.VisualFX.render(Game.Engine.render.context);

			// <--- Move screenshake cooldown to here???

			context.translate(-Math.round(render.bounds.min.x), -Math.round(render.bounds.min.y));
			Matter.Render.bodies(render, bodies.super, context);
			context.translate( Math.round(render.bounds.min.x), Math.round(render.bounds.min.y) );

			Game.VisualFX.printCanvas(Game.Engine.render.context);

			Game.Viewport.screenShakeCooldown(context); // causing pixel rounding errors. also, as is, possibly going to shake UI and cursor

			/*
			if(options.hasBounds) {
				// revert view transforms
				options.pixelRatio = Game.State.pixelRatio;
				context.setTransform(options.pixelRatio, 0, 0, options.pixelRatio, 0, 0);
		 	}
			*/

			Matter.Events.trigger(render, 'afterRender', event);
		};
	}());

	return {};
}();
