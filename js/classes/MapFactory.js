var fs = require('fs');
var Tilesets = require('../data/tilesets');

module.exports = new function() {
	var _self = this;

	const PARALLAX_BLOCKS_X	= Math.ceil( Constants.MAP_BLOCK_WIDTH * (1 + Constants.PARALLAX_1) );
	const PARALLAX_BLOCKS_Y	= Math.ceil( Constants.MAP_BLOCK_HEIGHT * (1 + Constants.PARALLAX_1) );

	_self.createV7 = function(type) {
		log('initiating v7 map');

		if( type == 'blank' ) {
			var map = new Grid(Constants.MAP_BLOCK_WIDTH * Constants.MAP_BLOCK_SIZE, Constants.MAP_BLOCK_HEIGHT * Constants.MAP_BLOCK_SIZE, {scratch: false, meta: false});
			//var map = new Grid(PARALLAX_BLOCKS_X * Constants.MAP_BLOCK_SIZE, PARALLAX_BLOCKS_Y * Constants.MAP_BLOCK_SIZE, {scratch: false, meta: false});

			_setupActorData(map);
			_finalizeActorData(map);

			return map;
		}

		var map = new Grid(Constants.MAP_BLOCK_WIDTH * Constants.MAP_BLOCK_SIZE, Constants.MAP_BLOCK_HEIGHT * Constants.MAP_BLOCK_SIZE);

		var intersectionGrid	= new Grid(Constants.MAP_BLOCK_WIDTH + 2, Constants.MAP_BLOCK_HEIGHT + 2, {scratch: false, meta: false});
		var trussGrid			= new Grid(PARALLAX_BLOCKS_X, PARALLAX_BLOCKS_Y, {scratch: false, meta: false});

		_setupActorData(map);
		_setupIntersectionsV7(intersectionGrid);
		_setupIntersectionsV7(trussGrid, {range: 0.85, zones: false});
		_applyStreetsV7(intersectionGrid, map);
		_applySidewalksV7(map); log('Sidewalks seeded.');
		_applyBuildingsV7(map); log('Buidings seeded.');
		_seedCrosswalksV7(map); log('Crosswalks seeded.');
		_seedStreetsV7(map); log('Streets seeded.');
		_seedStreetInfrastructureV7(map); log('Street infrastructure seeded.');
		_seedFencingV7(map); log('Fencing added.');
		_seedShantytownsV7(map);
		_seedBlockadesV7(map); log('Bockades added.')
		_seedSidewalkInfrastructure(map); log('Sidewalk infrastructure added.');
		// seed sidewalk regions
		//_seedRailNetworkV7(map);

		//map.resize(false, {x: Constants.MAP_BLOCK_SIZE * (PARALLAX_BLOCKS_X - Constants.MAP_BLOCK_WIDTH), y: Constants.MAP_BLOCK_SIZE * (PARALLAX_BLOCKS_Y - Constants.MAP_BLOCK_HEIGHT)}, 0, _getDataPointExemplar);
		//_seedTrussesV7(trussGrid, map); log('-Trusses seeded.');

		//_seedTrafficLightsV7(map);

		let dims = map.getDimensions();
		let colorKey = {
			'crosswalk':		'#57b46b',
			'intersection':	'#593988',
			'street':			'#34386a',
			'default':		'#000000',
		};

		let htmlMap;

		if( !fs.existsSync('z_htmlMap.html') ) {
			fs.createWriteStream('z_htmlMap.html');
		}

		htmlMap = fs.openSync('z_htmlMap.html', 'w');

		fs.writeSync(htmlMap, '<html><header><title>Visual Map</title><style type="text/css">.box { width: 4px; height: 4px; float: left; }</style></header><body>');

		let output = '';

		map.eachPoint(function(point, x, y, thisGrid) {
			let hex = '';
			let dataPoint = thisGrid.getDataPoint(x, y);

			hex = colorKey['default'];

			if( !point ) {
				//log('---map rendering issue---');
			} else {
				if( dataPoint.highbldg ) {
					hex = '#ff4433';
				} else if( dataPoint.medbldg ) {
					hex = '#ff8855';
				} else if( dataPoint.zone && false ) {
					hex = '#ffffbb';
				} else if( dataPoint.marker ) {
					hex = '#44ccaa';
				} else if( dataPoint.type == 'guard-rail' ) {
					hex = '#e272f3';
				} else if( dataPoint.type == 'sidewalk' ) {
					hex = '#66668f';

					if( dataPoint.district == 1 ) {
						hex = '#ff9999';
					}
					if( dataPoint.district == 2 ) {
						hex = '#ffce9f';
					}
					if( dataPoint.district == 3 ) {
						hex = '#e1ff9f';
					}
					if( dataPoint.district == 4 ) {
						hex = '#9fffaf';
					}
					if( dataPoint.district == 5 ) {
						hex = '#9ffff5';
					}
					if( dataPoint.district == 6 ) {
						hex = '#d19fff';
					}

					if( dataPoint.subtype == 'small-traffic-sign' ) {
						hex = '#bd6449';
					} else if( dataPoint.subtype == 'medium-traffic-sign' ) {
						hex = '#ff7e00';
					} else if( dataPoint.subtype == 'large-traffic-sign' ) {
						hex = '#ff3c00';
					} else if( dataPoint.subtype == 'building' ) {
						hex = '#9e867d';
					} else if( dataPoint.subtype == 'building-2' ) {
						hex = '#889aa0';
					} else if( dataPoint.subtype == 'building-3' ) {
						hex = '#85838b';
					} else if( dataPoint.subtype == 'fencing' ) {
						hex = '#d07733';
					}
				} else if( dataPoint.type == 'building' ) {
					hex = '#86a5b0';

					if( dataPoint.subtype == '2' ) {
						hex = '#889aa0';
					}
					if( dataPoint.subtype == '3' ) {
						hex = '#85838b';
					}
					if( dataPoint.subtype == '4' ) {
						hex = '#9e867d';
					}
					if( dataPoint.subtype == '5' ) {
						hex = '#84a499';
					}
				} else if( dataPoint.type == 'street' ) {
					if( dataPoint.subtype == 'intersection' ) {
						hex = colorKey['intersection'];
					} else if( dataPoint.subtype == 'crosswalk' ) {
						hex = colorKey['crosswalk'];
					} else if( dataPoint.subtype == 'yield' ) {
						hex = '#999900';
					} else if( dataPoint.subtype == 'median' ) {
						hex = '#464da2';
					} else if( dataPoint.subtype == 'median-object' ) {
						hex = '#4ae2d9';
					} else {
						hex = colorKey['street'];

						if( dataPoint.width == 1 ) {
							hex = '#615083';
						}
						if( dataPoint.width == 3 ) {
							hex = '#2c2f51';
						}
					}
				}
				if( dataPoint.truss ) {
					hex = '#282624'
				}
			}

			output += '<div class="box" style="background: ' + hex + ';"></div>';

			if( x == dims.width - 1 ) {
				fs.writeSync(htmlMap, output + '<div style="float:left;clear:both;height:0;width:0;"></div>');
				output = '';
			}
		});

		fs.writeSync(htmlMap, '</body></html>');
		fs.closeSync(htmlMap);
		log('HTML Visual Map written.');

		_finalizeActorData(map); log('Actor data finalized.');

		return map;
	};

	function _setupIntersectionsV7(intersectionGrid, config = {}) {
		let widthTable = {
			x:	[],
			y:	[],
		};

		for(let i = 0; i < Constants.MAP_BLOCK_HEIGHT; i++) {
			let width		= 2;
			let randVal	= Math.random();

			if( randVal > 0.33 ) {
				width = 1;

				if( randVal > 0.66 ) {
					width = 3;
				}
			}

			widthTable.x.push(width);
		}

		for(let i = 0; i < Constants.MAP_BLOCK_WIDTH; i++) {
			let width		= 2;
			let randVal	= Math.random();

			if( randVal > 0.33 ) {
				width = 1;

				if( randVal > 0.66 ) {
					width = 3;
				}
			}

			widthTable.y.push(width);
		}

		intersectionGrid.eachPoint(function(point, x, y, self) {
			const CHANCE_TO_OFFSET	= config.chanceOffset || 0.85;
			const CHANCE_TO_DELETE	= config.chanceDelete || 0.2;
			const CHANCE_TO_BEND	= config.chanceBend || 0.87;
			const EDGE_DELETE_CHANCE	= 0.5;
			const WIDE_DELETE_CHANCE	= 0.08;
			const MODIFIER_RANGE	= config.range || 0.4;
			const ZONE_CHANCE		= 0.25;
			const ZONES			= ['blockade'];

			let xModifier	= 0;
			let yModifier	= 0;
			let xOffset	= 0;
			let yOffset	= 0;
			let xZone		= false;
			let yZone		= false;

			if( Math.random() < CHANCE_TO_OFFSET ) {
				xModifier	= Math.random() * MODIFIER_RANGE;
				xModifier	= ( Math.random() > 0.5 && x > 0 ) ? -xModifier : xModifier;
				xOffset	= Math.round(Constants.MAP_BLOCK_SIZE * xModifier);
			}
			if( Math.random() < CHANCE_TO_OFFSET ) {
				yModifier	= Math.random() * MODIFIER_RANGE;
				yModifier	= ( Math.random() > 0.5 && y > 0 ) ? -yModifier : yModifier;
				yOffset	= Math.round(Constants.MAP_BLOCK_SIZE * yModifier);
			}
			if( config.zones !== false ) {
				if( Math.random() < ZONE_CHANCE ) {
					xZone = ZONES.random();
				}
				if( Math.random() < ZONE_CHANCE ) {
					yZone = ZONES.random();
				}
			}

			var data = {
				offset:	{
					x:	xOffset,
					y:	yOffset,
				},
				base:	{
					x:	Constants.MAP_BLOCK_SIZE * x + xOffset,
					y:	Constants.MAP_BLOCK_SIZE * y + yOffset,
				},
				zone:	{
					x:	xZone,
					y:	yZone,
				},
				empty:	{
					x:	Math.random() < CHANCE_TO_DELETE,
					y:	Math.random() < CHANCE_TO_DELETE,
				},
				straight:	{
					x:	Math.random() > CHANCE_TO_BEND,
					y:	Math.random() > CHANCE_TO_BEND,
				},
				width:	{
					x:	widthTable.x[y],
					y:	widthTable.y[x],
				},
			};

			// Prevent points from missing both segments
			if( data.empty.x && data.empty.y ) {
				if( Math.random() > 0.5 ) {
					data.empty.x = false;
				} else {
					data.empty.y = false;
				}
			}

			if( data.empty.x && data.width.x > 2 ) {
				data.empty.x = ( Math.random() > WIDE_DELETE_CHANCE ) ? false : true;
			}
			if( data.empty.y && data.width.y > 2 ) {
				data.empty.y = ( Math.random() > WIDE_DELETE_CHANCE ) ? false : true;
			}

			if( data.empty.x ) {
				data.zone.x = false;
			}
			if( data.empty.y ) {
				data.zone.y = false;
			}

			self.setPoint(x, y, 1);
			self.setDataPoint(x, y, data);
		});
	};

	function _applyStreetsV7(intersectionGrid, mapGrid) {
		const GRID_X_OFFSET = -1 * Constants.MAP_BLOCK_SIZE;
		const GRID_Y_OFFSET = -1 * Constants.MAP_BLOCK_SIZE;

		intersectionGrid.eachPoint(function(point, x, y) {
			let data			= intersectionGrid.getDataPoint(x, y);
			let stamped		= false;
			let stampPointsX	= [];
			let stampPointsY	= [];

			while( !stamped ) {
				let basePoint = {
					x:	data.base.x,
					y:	data.base.y,
				};

				let leftNghbrData	= intersectionGrid.getDataPoint(x - 1, y);
				let rightNghbrData	= intersectionGrid.getDataPoint(x + 1, y);
				let upNghbrData	= intersectionGrid.getDataPoint(x, y - 1);
				let downNghbrData	= intersectionGrid.getDataPoint(x, y + 1);
				let rightDistX		= Constants.MAP_BLOCK_SIZE - data.offset.x;
				let rightDistY		= 0;
				let downDistX		= 0;
				let downDistY		= Constants.MAP_BLOCK_SIZE - data.offset.y;

				if( rightNghbrData ) {
					rightDistX = rightNghbrData.base.x - data.base.x;
					rightDistY = rightNghbrData.base.y - data.base.y;

					// Connect nearby points if they'd be extremely close
					if( data.straight.x && Math.abs(rightDistY) < 4 ) {
						data.straight.x = false;
					}
				}
				if( downNghbrData ) {
					downDistX = downNghbrData.base.x - data.base.x;
					downDistY = downNghbrData.base.y - data.base.y;

					// Connect nearby points if they'd be extremely close
					if( data.straight.y && Math.abs(downDistX) < 4 ) {
						data.straight.y = false;
					}
				}

				if( !data.empty.x ) {
					let baseAdj = 0;

					if( data.width.x > 2 ) {
						rightDistX++;;

						if( (upNghbrData && upNghbrData.width.y > 2) || data.width.y > 2 ) {
							baseAdj = 1;
						}
						if( rightNghbrData && rightNghbrData.width.y > 1 ) {
							rightDistX++;
						}
					}
					if( data.straight.x ) {
						for(let i = 0 - baseAdj; i < rightDistX; i++) {
							stampPointsX.push({x: data.base.x + i, y: data.base.y});

							if( data.width.x > 1 ) {
								stampPointsX.push({x: data.base.x + i, y: data.base.y + 1});
							}
							if( data.width.x > 2 ) {
								stampPointsX.push({x: data.base.x + i, y: data.base.y - 1});
							}
						}
					} else if( rightNghbrData ) {
						let halfWayX = Math.round(rightDistX / 2);

						for(let i = 0 - baseAdj; i < rightDistX; i++) {
							let baseY = data.base.y;

							if( i > halfWayX ) {
								baseY = rightNghbrData.base.y;
							}

							stampPointsX.push({x: data.base.x + i, y: baseY});

							if( data.width.x > 1 ) {
								stampPointsX.push({x: data.base.x + i, y: baseY + 1});
							}
							if( data.width.x > 2 ) {
								stampPointsX.push({x: data.base.x + i, y: baseY - 1});
							}
						}

						let startY = ( data.base.y < rightNghbrData.base.y ) ? data.base.y : rightNghbrData.base.y;

						rightDistY = Math.abs(rightDistY);

						// Perpendicular section
						if( data.width.x > 1 ) {
							rightDistY += 1;
						}
						if( data.width.x > 2 ) {
							startY -= 1;
							rightDistY += 1;
						}
						for(let i = 0; i <= rightDistY; i++) {
							stampPointsX.push({x: data.base.x + halfWayX, y: startY + i});

							if( data.width.x > 1 ) {
								stampPointsX.push({x: data.base.x + halfWayX + 1, y: startY + i});
							}
							if( data.width.x > 2 ) {
								stampPointsX.push({x: data.base.x + halfWayX - 1, y: startY + i});
							}
						}
					}
				}
				if( !data.empty.y ) {
					let baseAdj = 0;

					if( data.width.y > 2 ) {
						downDistY++;
					}
					if( downNghbrData && downNghbrData.width.x > 1 ) {
						downDistY++;
					}
					if( data.straight.y ) {
						for(let i = 0 - baseAdj; i < downDistY; i++) {
							stampPointsY.push({x: data.base.x, y: data.base.y + i});

							if( data.width.y > 1 ) {
								stampPointsY.push({x: data.base.x + 1, y: data.base.y + i});
							}
							if( data.width.y > 2 ) {
								stampPointsY.push({x: data.base.x - 1, y: data.base.y + i});
							}
						}
					} else if( downNghbrData ) {
						let halfWayY = Math.round(downDistY / 2);

						for(let i = 0 - baseAdj; i < downDistY; i++) {
							let baseX = data.base.x;

							if( i > halfWayY ) {
								baseX = downNghbrData.base.x;
							}

							stampPointsY.push({x: baseX, y: data.base.y + i});

							if( data.width.y > 1 ) {
								stampPointsY.push({x: baseX + 1, y: data.base.y + i});
							}
							if( data.width.y > 2 ) {
								stampPointsY.push({x: baseX - 1, y: data.base.y + i});
							}
						}

						let startX = ( data.base.x < downNghbrData.base.x ) ? data.base.x : downNghbrData.base.x;

						downDistX = Math.abs(downDistX);

						// Perpendicular section
						if( data.width.y > 1 ) {
							downDistX += 1;
						}
						if( data.width.y > 2 ) {
							startX -= 1;
							downDistX += 1;
						}
						for(let i = 0; i <= downDistX; i++) {
							stampPointsY.push({x: startX + i, y: data.base.y + halfWayY});

							if( data.width.y > 1 ) {
								stampPointsY.push({x: startX + i, y: data.base.y + halfWayY + 1});
							}
							if( data.width.y > 2 ) {
								stampPointsY.push({x: startX + i, y: data.base.y + halfWayY - 1});
							}
						}
					}
				}

				let shouldStamp = true;

				// Set intersections
				if( upNghbrData && !upNghbrData.empty.y && leftNghbrData && !leftNghbrData.empty.x && !data.empty.x && !data.empty.y ) {
					let upGrid	= new Grid(3, 3, {data: false, meta: false, scratch: false});
					let downGrid	= new Grid(3, 3, {data: false, meta: false, scratch: false});
					let leftGrid	= new Grid(3, 3, {data: false, meta: false, scratch: false});
					let rightGrid	= new Grid(3, 3, {data: false, meta: false, scratch: false});

					if( upNghbrData && !upNghbrData.empty.y ) {
						upGrid.setPoint(1, 0, 1);
						upGrid.setPoint(1, 1, 1);

						if( upNghbrData.width.y > 1 ) {
							upGrid.setPoint(2, 0, 1);
							upGrid.setPoint(2, 1, 1);

							if( upNghbrData.width.y > 2 ) {
								upGrid.setPoint(0, 0, 1);
								upGrid.setPoint(0, 1, 1);
							}
						}
					}

					if( leftNghbrData && !leftNghbrData.empty.x ) {
						leftGrid.setPoint(0, 1, 1);
						leftGrid.setPoint(1, 1, 1);

						if( leftNghbrData.width.x > 1 ) {
							leftGrid.setPoint(0, 2, 1);
							leftGrid.setPoint(1, 2, 1);

							if( leftNghbrData.width.x > 2 ) {
								leftGrid.setPoint(0, 0, 1);
								leftGrid.setPoint(1, 0, 1);
							}
						}
					}

					if( !data.empty.x ) {
						rightGrid.setPoint(1, 1, 1);
						rightGrid.setPoint(2, 1, 1);

						if( data.width.x > 1 ) {
							rightGrid.setPoint(1, 2, 1);
							rightGrid.setPoint(2, 2, 1);

							if( data.width.x > 2 ) {
								rightGrid.setPoint(1, 0, 1);
								rightGrid.setPoint(2, 0, 1);
							}
						}
					}

					if( !data.empty.y ) {
						downGrid.setPoint(1, 1, 1);
						downGrid.setPoint(1, 2, 1);

						if( data.width.y > 1 ) {
							downGrid.setPoint(2, 1, 1);
							downGrid.setPoint(2, 2, 1);

							if( data.width.y > 2 ) {
								downGrid.setPoint(0, 1, 1);
								downGrid.setPoint(0, 2, 1);
							}
						}
					}

					// Check that all four corners of an intersection are actually sidewalks
					let finalIntersectionCoords	= [];
					let shouldSetIntersection	= true;
					let overlapGrid			= new Grid(3, 3);

					upGrid.eachPoint(function(point, x, y) {
						let hits = 0;

						[upGrid, downGrid, leftGrid, rightGrid].forEach(function(grid) {
							if( grid.getPoint(x, y) ) {
								hits++;
							}
						});

						if( hits >= 2 ) {
							let coords = {
								x:	basePoint.x + x - 1 + GRID_X_OFFSET,
								y:	basePoint.y + y - 1 + GRID_Y_OFFSET,
							}
							finalIntersectionCoords.push({x: coords.x, y: coords.y});

							overlapGrid.setPoint(x, y, 1);
							overlapGrid.setDataPoint(x, y, {x: coords.x, y: coords.y});
						}
					});

					overlapGrid.setHexValues().eachPoint(function(overlapPoint, x, y, self) {
						if( overlapPoint ) {
							let overlapMetaPoint = self.getMetaPoint(x, y);

							if( overlapMetaPoint.type == 'corner' ) {
								let testCoords = {x: 1, y: 1};
								let overlapDataPoint = self.getDataPoint(x, y);

								if( overlapMetaPoint.rotations == 0 ) {

								} else if( overlapMetaPoint.rotations == 1 ) {
									testCoords.y = -1;
								} else if( overlapMetaPoint.rotations == 2 ) {
									testCoords.x = -1;
									testCoords.y = -1;
								} else {
									testCoords.x = -1;
								}

								let testDataPoint = self.getDataPoint(overlapDataPoint.x + testCoords.x, overlapDataPoint.y + testCoords.y);

								if( testDataPoint.type != 'sidewalk' && testDataPoint.type != 'guard-rail' ) {
									shouldSetIntersection = true;

									return true;
								}
							}
						}
					});

					if( shouldSetIntersection ) {
						finalIntersectionCoords.forEach(function(coord) {
							_loadMapType(mapGrid, coord.x, coord.y, 'street');
							_loadMapSubType(mapGrid, coord.x, coord.y, 'intersection');
						})
					} else {
						log('intersection discarded');
					}
				}

				/*
				// Check if points and neighborpoints are not already streets
				stampPointsX.forEach(function(stampPoint) {
					var testDataPoint = mapGrid.getDataPoint(stampPoint.x, stampPoint.y);

					if( testDataPoint.type == 'street' && testDataPoint.subtype != 'intersection' ) {
						//shouldStamp = false;
					}
				});
				stampPointsY.forEach(function(stampPoint) {
					var testDataPoint = mapGrid.getDataPoint(stampPoint.x, stampPoint.y);

					if( testDataPoint.type == 'street' && testDataPoint.subtype != 'intersection' ) {
						//shouldStamp = false;
					}
				});
				*/

				if( shouldStamp ) {
					stampPointsX.forEach(function(stampPoint) {
						_loadMapType(mapGrid, stampPoint.x + GRID_X_OFFSET, stampPoint.y + GRID_Y_OFFSET, 'street');

						if( data.zone.x ) {
							_insertDataPointValue(mapGrid, stampPoint.x + GRID_X_OFFSET, stampPoint.y + GRID_Y_OFFSET, 'zone', data.zone.x);
						}
					});
					stampPointsY.forEach(function(stampPoint) {
						_loadMapType(mapGrid, stampPoint.x + GRID_X_OFFSET, stampPoint.y + GRID_Y_OFFSET, 'street');

						if( data.zone.y ) {
							_insertDataPointValue(mapGrid, stampPoint.x + GRID_X_OFFSET, stampPoint.y + GRID_Y_OFFSET, 'zone', data.zone.y);
						}
					});

					/*
					[...stampPointsX, ...stampPointsY].forEach(function(stampPoint) {
						_loadMapType(mapGrid, stampPoint.x + GRID_X_OFFSET, stampPoint.y + GRID_Y_OFFSET, 'street');
					});
					*/

					stamped = true;
				} else {
					/*
					stampPointsX = [];
					stampPointsY = [];

					// Adjust data
					data.base.x += -data.offset.x;
					data.base.y += -data.offset.y;

					data.offset.x = 0;
					data.offset.y = 0;

					//data.straight.x = true;
					//data.straight.y = true;

					//data.empty.x = true;
					//data.empty.y = true;
					*/
				}
			} // end while
		});
	};

	function _applySidewalksV7(mapGrid) {
		// Fill anything in that isn't a street
		mapGrid.eachPoint(function(point, x, y, self) {
			if( !point ) {
				_loadMapType(mapGrid, x, y, 'sidewalk');
				mapGrid.setPoint(x, y, 1);
			}
		});

		// Apply district values
		const _MAP_TILE_SIZE_X		= Constants.MAP_BLOCK_WIDTH * Constants.MAP_BLOCK_SIZE;
		const _MAP_TILE_SIZE_Y		= Constants.MAP_BLOCK_HEIGHT * Constants.MAP_BLOCK_SIZE;
		const NUM_DISTRICTS			= 6;
		const DISTRICT_GRID_WIDTH	= 3;
		const DISTRICT_GRID_HEIGHT	= 3;
		const DISTRICT_WIDTH		= Math.floor(_MAP_TILE_SIZE_X / DISTRICT_GRID_WIDTH);
		const DISTRICT_HEIGHT		= Math.floor(_MAP_TILE_SIZE_Y / DISTRICT_GRID_HEIGHT);
		const EDGE_BUFFER			= 1;
		const NON_RANDOM_BUFFER		= 32;

		let districtGrid = [];

		for(let dy = 0; dy < DISTRICT_GRID_HEIGHT; dy++) {
			for(let dx = 0; dx < DISTRICT_GRID_WIDTH; dx++) {
				districtGrid.push({x: dx, y: dy});
			}
		}

		let densityQuadrants = [];

		// Determine density zone centers
		districtGrid.forEach(function(quadrant) {
			let quadrantCenter = {
				x:	quadrant.x * DISTRICT_WIDTH + Math.floor( Math.random() * DISTRICT_WIDTH ),
				y:	quadrant.y * DISTRICT_HEIGHT + Math.floor( Math.random() * DISTRICT_HEIGHT ),
			};

			densityQuadrants.push(quadrantCenter);
		});

		// Add medium density
		densityQuadrants.forEach(function(quadrantCenter) {
			let circlePoints = mapGrid.getCircle(quadrantCenter, 56);

			mapGrid.withPoints(circlePoints, function(circlePoint, x, y, self) {
				if( circlePoint ) {
					_insertDataPointValue(self, x, y, 'density', 'medium');
				}
			});
		});

		// Add high density
		densityQuadrants.forEach(function(quadrantCenter) {
			let circlePoints = mapGrid.getCircle(quadrantCenter, 28);

			mapGrid.withPoints(circlePoints, function(circlePoint, x, y, self) {
				if( circlePoint ) {
					_insertDataPointValue(self, x, y, 'density', 'high');
				}
			});
		});

		Utilities.shuffleArray(districtGrid);

		for(let d = 0; d < NUM_DISTRICTS; d++) {
			let coords = districtGrid.pop();

			let minBound = {
				x:	coords.x * DISTRICT_WIDTH + EDGE_BUFFER,
				y:	coords.y * DISTRICT_HEIGHT + EDGE_BUFFER,
			};
			let maxBound = {
				x:	Math.floor( (coords.x + 1) * _MAP_TILE_SIZE_X / DISTRICT_GRID_WIDTH) - EDGE_BUFFER,
				y:	Math.floor( (coords.y + 1) * _MAP_TILE_SIZE_Y / DISTRICT_GRID_HEIGHT) - EDGE_BUFFER,
			};

			let rectangleCoords = mapGrid.getRectangle(minBound, maxBound);

			Utilities.shuffleArray(rectangleCoords);

			let randomCoords = [];

			for(let i = 0; i < 16; i++) {
				randomCoords.push( rectangleCoords.pop() );
			}

			// Center zone
			minBound.x += NON_RANDOM_BUFFER;
			minBound.y += NON_RANDOM_BUFFER;
			maxBound.x -= NON_RANDOM_BUFFER;
			maxBound.y -= NON_RANDOM_BUFFER;

			let centerCoords = mapGrid.getRectangle(minBound, maxBound);

			mapGrid.withPoints([...randomCoords, ...centerCoords], function(point, x, y, self) {
				_loadMapDistrict(self, x, y, d + 1);
			});
		}

		log('---districts added.');
		_correctSidewalkDistricts(mapGrid);
		_correctSidewalkDistricts(mapGrid);
		log('---districts corrected.');

		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.type == 'sidewalk' ) {
					return point;
				}
			}

			return false;
		});

		// Purge certain unwanted sidewalk types and replace them with streets
		let allowTypes = ['bend', 'corner', 'edge', 'inside'];
		let search = true;

		while( search ) {
			let correctionMade = false;
			log('...performing sidewalk correction sweep');

			mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
				if( point ) {
					let dataPoint = self.getDataPoint(x, y);
					let metaPoint = self.getMetaPoint(x, y);

					if( dataPoint.type == 'sidewalk' ) {
						if( allowTypes.indexOf(metaPoint.type) == -1 ) {
							_loadMapType(self, x, y, 'guard-rail');
							_loadMapSubType(self, x, y, false);
							_loadMapDistrict(self, x, y, 0);
							correctionMade = true;
						}
					}
				}
			}, false);

			if( !correctionMade ) {
				search = false;
			}
		}

		// Seed actors
		mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let dataPoint = self.getDataPoint(x, y);
				let metaPoint = self.getMetaPoint(x, y);

				if( dataPoint.type == 'sidewalk' ) {
					_loadMapActorData(self, x, y, `sidewalk-${dataPoint.district}`, 'doodad', metaPoint);
				}
			}
		});

		//mapGrid.depopulate(100).populate(1.2).growPoints(false, 50).growPoints(false, 50).growPoints(false, 50);

		mapGrid.eachPoint(function(point, x, y, self) {
			if( point ) {
				let dataPoint = self.getDataPoint(x, y);
				let metaPoint = self.getMetaPoint(x, y);

				if( dataPoint.type == 'sidewalk' ) {
					_insertDataPointValue(self, x, y, 'temp', true);
				}
			}
		});

		mapGrid.populate(100);
		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = self.getDataPoint(x, y);

				if( dataPoint.type == 'sidewalk' ) {
					return point;
				}
			}

			return false;
		});

		/*
		mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let dataPoint = self.getDataPoint(x, y);
				let metaPoint = self.getMetaPoint(x, y);

				if( metaPoint.type == 'inside' && dataPoint.temp ) {
					//_insertDataPointValue(self, x, y, 'type', 'test');
				}
			}
		});
		*/
		//mapGrid.setHexValues();

		// turn off all dataPoint.temp values



		log('done adding sidewalk actor data');


		mapGrid.clearFilter();
	};

	function _correctSidewalkDistricts(mapGrid) {
		mapGrid.eachPoint(function(point, x, y, thisGrid) {
			if( point ) {
				let dataPoint = thisGrid.getDataPoint(x, y);

				 if( dataPoint.type == 'sidewalk' && dataPoint.district != 0 ) {
					 applyDistrictToNeighbors(x, y, dataPoint.district);
				 }
			}
		});

		function applyDistrictToNeighbors(x, y, district, depth = 0) {
			let testPoints = mapGrid.getOrdinalNeighbors(x, y);

			mapGrid.withPoints(testPoints, function(nghbrPoint, x, y) {
				if( !nghbrPoint ) {
					return;
				}

				let nghbrDataPoint = mapGrid.getDataPoint(x, y);

				if( nghbrDataPoint && nghbrDataPoint.type == 'sidewalk' && nghbrDataPoint.district != district ) {
					if( depth < 1200 ) {
						_loadMapDistrict(mapGrid, x, y, district);
						applyDistrictToNeighbors(x, y, district, depth + 1);
					}
				}
			});
		}
	}

	function _applyBuildingsV7(mapGrid) {
		mapGrid.eachPoint(function(point, x, y, self) {
			if( point ) {
				_insertDataPointValue(self, x, y, 'temp', false);
			}
		});

		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.type == 'sidewalk' ) {
					return point;
				}
			}

			return false;
		});

		let scanArea = function(origin = {}, direction = {}, sweepSize = 1, odd = (Math.random() > 0.5), shallow = []) {
			let openPoints	= [];
			let blocked	= false;

			if( sweepSize > 7 ) {
				return openPoints;
			}

			scanLoop:
			for(let i = 0; i < sweepSize; i++) {
				let testCoords = {};

				if( odd ) {
					// Vertical sweep
					testCoords.x = origin.x + (sweepSize - 1) * direction.x;
					testCoords.y = origin.y + i * direction.y;
				} else {
					// Horizontal sweep
					testCoords.x = origin.x + i * direction.x;
					testCoords.y = origin.y + sweepSize * direction.y;
				}

				let testDataPoint	= mapGrid.getDataPoint(testCoords.x, testCoords.y);
				let testMetaPoint	= mapGrid.getMetaPoint(testCoords.x, testCoords.y);

				let pointAdded		= false;
				let neighborsOkay	= true;

				if( testDataPoint && testDataPoint.type == 'sidewalk' && testMetaPoint.type == 'inside' && !testDataPoint.solid && !testDataPoint.temp ) {
					let neighborCoords = mapGrid.getOrdinalNeighbors(testCoords.x, testCoords.y);
					let counter = 0;

					mapGrid.withPoints(neighborCoords, function(neighborPoint, x, y) {
						if( neighborPoint ) {
							let neighborMeta = mapGrid.getMetaPoint(x, y);
							let neighborData = mapGrid.getDataPoint(x, y);

							if( shallow.indexOf(counter) != -1 ) {

							} else if( neighborMeta.type != 'inside' ) {
								neighborsOkay = false;
								return true;
							}
						}

						counter++;
					});

					if( neighborsOkay ) {
						pointAdded = true;

						openPoints.push({x: testCoords.x, y: testCoords.y});
					}
				}
				if( !pointAdded ) {
					blocked		= true;
					openPoints	= [];

					break scanLoop;
				}
			}

			odd = !odd;

			if( odd ) {
				sweepSize++;
			}
			if( Math.random() > 0.9 ) {
				return openPoints;
			}
			if( !blocked ) {
				openPoints = [...openPoints, ...scanArea(origin, direction, sweepSize, odd, shallow)];
			}

			return openPoints;
		};

		let buildingID = 0;
		//let buildingGroups = {};

		mapGrid.setHexValues(false, false).eachPointRandom(function(point, x, y, self) {
			if( point ) {
				let metaPoint = self.getMetaPoint(x, y);
				let scanDirectionX	= 1;
				let scanDirectionY	= 1;
				let scanBufferX	= 0;
				let scanBufferY	= 0;
				let shallowScan	= [];

				if( metaPoint.type == 'edge' ) {
					let streetCoords = {x: 0, y: 0};

					if( metaPoint.rotations == 0 ) {
						scanDirectionY = -1;
						scanBufferY = 1;
						streetCoords.y++;
						shallowScan = [2, 0];
					} else if( metaPoint.rotations == 1 ) {
						scanBufferX = 1;
						streetCoords.x--;
						shallowScan = [3, 1];
					} else if( metaPoint.rotations == 2 ) {
						scanBufferY = 1;
						streetCoords.y--;
						shallowScan = [0, 2];
					} else if( metaPoint.rotations == 3 ) {
						scanDirectionX = -1;
						scanBufferX = 1;
						streetCoords.x++;
						shallowScan = [1, 3];
					}

					let streetMetaPoint = self.getMetaPoint(x + streetCoords.x, y + streetCoords.y);

					if( streetMetaPoint && streetMetaPoint.type == 'channel' ) {
						scanBufferX *= 0.5;
						scanBufferY *= 0.5;
					}
				} else if( metaPoint.type == 'corner' || metaPoint.type == 'bend' ) {
					let streetCoords1 = {x: 0, y: 0};
					let streetCoords2 = {x: 0, y: 0};

					scanBufferX	= 1;
					scanBufferY	= 1;

					if( metaPoint.rotations == 0 ) {
						scanDirectionY = -1;
						scanDirectionX = -1;
						streetCoords1.y++;
						streetCoords2.x++;
					} else if( metaPoint.rotations == 1 ) {
						scanDirectionY = -1;
						streetCoords1.y++;
						streetCoords2.x--;
					} else if( metaPoint.rotations == 2 ) {
						streetCoords1.y--;
						streetCoords2.x--;
					} else if( metaPoint.rotations == 3 ) {
						scanDirectionX = -1;
						streetCoords1.y--;
						streetCoords2.x++;
					}

					if( metaPoint.type == 'corner' ) {
						let streetMetaPoint1 = self.getMetaPoint(x + streetCoords1.x, y + streetCoords1.y);
						let streetMetaPoint2 = self.getMetaPoint(x + streetCoords2.x, y + streetCoords2.y);

						if( streetMetaPoint1 && streetMetaPoint1.type == 'channel' ) {
							scanBufferY *= 0.5;

							shallowScan.push( streetCoords1.y > 0 ? 2 : 0 );
						}
						if( streetMetaPoint2 && streetMetaPoint2.type == 'channel' ) {
							scanBufferX *= 0.5;

							shallowScan.push( streetCoords2.x > 0 ? 1 : 3 );
						}
					}
				} else {
					return;
				}

				let scanOrigin		= {x: x + scanBufferX * scanDirectionX * 2, y: y + scanBufferY * scanDirectionY * 2};
				let scanDirection	= {x: scanDirectionX, y: scanDirectionY};
				let bldgPoints		= scanArea(scanOrigin, scanDirection, null, null, shallowScan);

				if( bldgPoints.length > 0 ) {
					let temp = (bldgPoints.length < 4 && Math.random() > 0.85) ? true : false;
					//let temp = false;

					self.withPoints(bldgPoints, function(bldgPoint, x, y) {
						_insertDataPointValue(self, x, y, 'temp', temp);

						if( !temp ) {
							//_insertDataPointValue(self, x, y, 'id', `building-${buildingID}`);
						}
					});

					if( !temp ) {
						let dataPoint = self.getDataPoint(x, y);

						// Find rectangular area bounds to determine base point and dimensions
						let min = false;
						let max = false;

						bldgPoints.forEach(function(point) {
							if( !min ) {
								min = {x: point.x, y: point.y};
							}
							if( !max ) {
								max = {x: point.x, y: point.y};
							}
							if( point.x < min.x ) {
								min.x = point.x;
							}
							if( point.y < min.y ) {
								min.y = point.y;
							}
							if( point.x > max.x ) {
								max.x = point.x;
							}
							if( point.y > max.y ) {
								max.y = point.y;
							}
							if( dataPoint.density == 'medium' ) {
								_insertDataPointValue(self, point.x, point.y, 'medbldg', true);
							}
							if( dataPoint.density == 'high' ) {
								_insertDataPointValue(self, point.x, point.y, 'highbldg', true);
							}
						});

						let width		= (max.x - min.x) + 1;
						let height	= (max.y - min.y) + 1;
						// TODO: incorporate density value into bulding query/seeding

						_seedBuildingSolid(width, height, {district: dataPoint.district}, min, mapGrid);
					}

					buildingID++;
				}
			}
		});

		mapGrid.eachPoint(function(point, x, y, self) {
			if( point ) {
				_insertDataPointValue(self, x, y, 'temp', false);
			}
		});

		log('buildings finished seeding');
	};

	function _seedCrosswalksV7(mapGrid) {
		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.type == 'street' && dataPoint.subtype == 'intersection' ) {
					return point;
				}
			}

			return false;
		});

		log('preparing to add traffic sign locations');
		mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let metaPoint = self.getMetaPoint(x, y);
				let neighbors = self.getOrdinalNeighbors(x, y);

				// Load small signs around island intersections
				if( metaPoint.type == 'island' ) {
					let diagNeighbors = self.getDiagonalNeighbors(x, y);

					self.withPoints(diagNeighbors, function(diagNeighbor, diagX, diagY) {
						_loadMapSubType(self, diagX, diagY, 'small-traffic-sign');
						// TODO: load actor data.
					});
				} else if( metaPoint.type == 'end' ) {
					let seedCoords = [];

					if( metaPoint.rotations == 0 ) {
						seedCoords.push({x: -1, y: 1});
						seedCoords.push({x: 1, y: 1});
					} else if( metaPoint.rotations == 1 ) {
						seedCoords.push({x: -1, y: -1});
						seedCoords.push({x: -1, y: 1});
					} else if( metaPoint.rotations == 2 ) {
						seedCoords.push({x: -1, y: -1});
						seedCoords.push({x: 1, y: -1});
					} else {
						seedCoords.push({x: 1, y: -1});
						seedCoords.push({x: 1, y: 1});
					}

					seedCoords.forEach(function(coord) {
						_loadMapSubType(self, x + coord.x, y + coord.y, 'small-traffic-sign');
						// TODO: load small traffic sign actor data.
					});
				} else if( metaPoint.type == 'corner' ) {
					let counter		= 0;
					let diagNeighbors	= self.getDiagonalNeighbors(x, y);
					let actorMap		= [0, 2, 1, 3]; // maps light orientations to correct corners
					let edgeCheck		= [
						{x: 0, y: -1},
						{x: 1, y: 0},
						{x: 0, y: 1},
						{x: -1, y: 0},
					];

					self.withPoints(diagNeighbors, function(diagNeighbor, diagX, diagY) {
						if( metaPoint.rotations == counter - 1 || (metaPoint.rotations == 3 && counter == 0) ) {
							let lightIndex		= actorMap[metaPoint.rotations];
							let edgeCoords		= edgeCheck[metaPoint.rotations];
							let edgeMetaPoint	= self.getMetaPoint(x + edgeCoords.x, y + edgeCoords.y);

							if( edgeMetaPoint.type == 'edge' ) {
								_loadMapSubType(self, diagX, diagY, 'large-traffic-sign');
								_loadMapActorData(self, diagX, diagY, `placeholder-traffic-light-${lightIndex}`, 'obstacle');
							} else {
								_loadMapSubType(self, diagX, diagY, 'medium-traffic-sign');
								_loadMapActorData(self, diagX, diagY, `placeholder-traffic-light-${lightIndex}`, 'obstacle');
							}

							return true;
						}

						counter++;
					});
				}

				self.withPoints(neighbors, function(nghbrPoint, nghbrX, nghbrY) {
					let nghbrDataPoint = self.getDataPoint(nghbrX, nghbrY);

					if( nghbrDataPoint.type == 'street' && nghbrDataPoint.subtype != 'intersection' ) {
						_loadMapSubType(self, nghbrX, nghbrY, 'crosswalk');
					}
				});
			}
		});

		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				var dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.type == 'street' && dataPoint.subtype == 'crosswalk' ) {
					return point;
				}
			}

			return false;
		});

		log('preparing to add crosswalk doodad');
		mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let metaPoint = self.getMetaPoint(x, y);

				if( metaPoint.type != 'island' ) {
					_loadMapActorData(mapGrid, x, y, 'crosswalk', 'doodad', metaPoint);
				} else {
					_loadMapSubType(self, x, y, false);
				}
			}
		});
	}

	function _seedStreetsV7(mapGrid) {
		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.type == 'street' ) {
					return point;
				}
			}

			return false;
		});

		mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.subtype == 'crosswalk' ) {
					let neighbors = self.getOrdinalNeighbors(x, y);

					self.withPoints(neighbors, function(neighborPoint, neighborX, neighborY) {
						let neighborDataPoint = self.getDataPoint(neighborX, neighborY);

						if( neighborDataPoint.type == 'street' && neighborDataPoint.subtype == false ) {
							_loadMapSubType(self, neighborX, neighborY, 'yield');
						}
					});
				}
			}
		}, false);

		mapGrid.eachPoint(function(point, x, y, self) {
			if( point ) {
				let dataPoint = self.getDataPoint(x, y);
				let metaPoint = self.getMetaPoint(x, y);

				if( !dataPoint || !metaPoint ) {
					return;
				}

				if( dataPoint.subtype == false ) {
					if( metaPoint.type == 'corner' || metaPoint.type == 'edge' || metaPoint.type == 'bend' ) {
						_loadMapActorData(mapGrid, x, y, 'street-markings', 'doodad', metaPoint);
					}
				} else if( dataPoint.subtype == 'yield' && metaPoint.type == 'edge' ) {
					let checkCoords = {x: 0, y: 0};

					if( metaPoint.rotations == 0 ) {
						checkCoords.x = -1;
					} else if( metaPoint.rotations == 1 ) {
						checkCoords.y = -1;
					} else if( metaPoint.rotations == 2 ) {
						checkCoords.x = 1;
					} else {
						checkCoords.y = 1;
					}

					let checkDataPoint = self.getDataPoint(x + checkCoords.x, y + checkCoords.y);

					if( checkDataPoint.subtype == 'crosswalk' ) {
						metaPoint.type = 'edgetee';
					}

					_loadMapActorData(mapGrid, x, y, 'street-markings-yield', 'doodad', metaPoint);
				}
			}
		});
	}

	function _seedStreetInfrastructureV7(mapGrid) {
		// Medians and median objects
		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.type == 'street' && dataPoint.subtype == false ) {
					return point;
				}
			}

			return false;
		});

		mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let metaPoint = mapGrid.getMetaPoint(x, y);

				if( metaPoint.type == 'inside' ) {
					_loadMapSubType(self, x, y, 'median');
				}
			}
		});

		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.type == 'street' && dataPoint.subtype == 'median' ) {
					return point;
				}
			}

			return false;
		});

		// Simplify what medians can occur
		mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let metaPoint = self.getMetaPoint(x, y);

				if( metaPoint.type != 'pipe' && metaPoint.type != 'end' && metaPoint.type != 'elbow' ) {
					_loadMapSubType(self, x, y, '');
				}
			}
		}, false);

		// Swap in guard rails for some medians
		mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let dataPoint = self.getDataPoint(x, y);
				let metaPoint = self.getMetaPoint(x, y);

				if( metaPoint.type == 'pipe' && Math.random() > 0.92 ) {
					const MAX_LENGTH = Math.floor(Math.random() * 4) + 3;
					let seedPoints	= [{x: x, y: y}];
					let seedable	= true;
					let scanDirs	= {x: 0, y: 0};

					if( metaPoint.rotations == 0 ) {
						scanDirs.y = 1;
					} else {
						scanDirs.x = 1;
					}

					for(let i = 1; i <= MAX_LENGTH; i++) {
						let testCoords = {x: x + scanDirs.x * i, y: y + scanDirs.y * i};
						let testPoint = self.getPoint(testCoords.x, testCoords.y);
						let testMetaPoint = self.getMetaPoint(testCoords.x, testCoords.y);

						if( testPoint && testMetaPoint.type == 'pipe' ) {
							seedPoints.push(testCoords);
						} else {
							break;
						}
					}

					if( seedPoints.length > 1 ) {
						seedPoints.forEach(function(seedPoint) {
							_loadMapType(self, seedPoint.x, seedPoint.y, 'guard-rail');
							_loadMapSubType(self, seedPoint.x, seedPoint.y, false);
						});
					}
				}
			}
		}, false);

		mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let metaPoint = self.getMetaPoint(x, y);

				if( metaPoint.type == 'island' ) {
					_loadMapSubType(self, x, y, '');
				} else {
					_loadMapActorData(self, x, y, 'street-median', 'doodad', metaPoint);
				}

				if( metaPoint.type == 'pipe' ) {
					let adjacent = false;

					if( metaPoint.rotations == 0 ) {
						if( _mapDataPointHasSolid(self, x, y - 1) || _mapDataPointHasSolid(self, x, y - 2) ) {
							adjacent = true;
						}
					} else {
						if( _mapDataPointHasSolid(self, x - 1, y) || _mapDataPointHasSolid(self, x - 2, y) ) {
							adjacent = true;
						}
					}

					if( !adjacent ) {
						// TODO: seed. orientation based on rotations
						// TODO: possibly seed items at random (signs, lights, etc.);
						_setMapDataPointAsSolid(self, x, y);
						_loadMapSubType(self, x, y, 'median-object');
					}
				}
			}
		});


		// Filter for guard rails
		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.type == 'guard-rail' ) {
					return point;
				}
			}

			return false;
		});

		mapGrid.setHexValues('linear6', false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let metaPoint	= self.getMetaPoint(x, y);
				let name		= '';

				if( metaPoint.type == 'pipe' ) {
					if( metaPoint.rotations == 0 ) {
						name = 'vert-1';
					} else {
						name = 'horz-1';
					}
				} else if( metaPoint.type == 'end' ) {
					if( metaPoint.rotations == 0 ) {
						name = 'vert-2';
					} else if( metaPoint.rotations == 1 ) {
						name = 'horz-0';
					} else if( metaPoint.rotations == 2 ) {
						name = 'vert-0';
					} else {
						name = 'horz-2';
					}
				}

				_loadMapActorData(self, x, y, `guard-rail-${name}`, 'obstacle');
			}
		});

		// TODO: large intersection paint/stripes


		// Vents/Plates/Manholes

	}

	function _seedSidewalkInfrastructure(mapGrid) {
		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.type == 'sidewalk' ) {
					return point;
				}
			}

			return false;
		});

		function scanArea(grid, baseX, baseY) {
			const MAX_LENGTH = 3;

			let areaData = {
				basePoint:	{x: baseX, y: baseY},
				facing:		'',
				points:		[],
				height:		1,
				width:		1,
			};
			let metaPoint	= grid.getMetaPoint(baseX, baseX);
			let scanDir	= {x: 0, y: 0};

			if( metaPoint.type != 'edge' ) {
				return false;
			}

			if( metaPoint.rotations == 0 ) {
				scanDir.x = 1;
				areaData.facing = 'S';
			} else if( metaPoint.rotations == 1 ) {
				scanDir.y = 1;
				areaData.facing = 'W';
			} else if( metaPoint.rotations == 2 ) {
				scanDir.x = 1;
				areaData.facing = 'N';
			} else {
				scanDir.y = 1;
				areaData.facing = 'E';
			}

			scanLoop:
			for(let i = 0; i < MAX_LENGTH; i++) {
				let testCoords	= {x: baseX + scanDir.x * i, y: baseY + scanDir.y * i};
				let point		= grid.getPoint(testCoords.x, testCoords.y);

				if( !point ) {
					break scanLoop;
				}

				let dataPoint	= grid.getDataPoint(testCoords.x, testCoords.y);
				let metaPoint	= grid.getMetaPoint(testCoords.x, testCoords.y);

				if( dataPoint.temp || dataPoint.solid || metaPoint.type != 'edge' ) {
					break scanLoop;
				}

				areaData.width = (i * scanDir.x) + 1;
				areaData.height = (i * scanDir.y) + 1;
				areaData.points.push(testCoords);

				if( Math.random() > 0.5 ) {
					break scanLoop;
				}
			}

			if( areaData.points.length < 1 ) {
				return false;
			}

			return areaData;
		}

		mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let areaData = scanArea(self, x, y);

				if( areaData ) {
					log(areaData);
					let dataPoint = self.getDataPoint(areaData.basePoint.x, areaData.basePoint.y);

					// Flag points as covered
					areaData.points.forEach(function(coord) {
						_insertDataPointValue(self, coord.x, coord.y, 'temp', true);
					});

					if( Math.random() > 0.65 ) {
						// TODO: include edge vs. inside in query?
						_seedSidewalkItem(areaData.width, areaData.height, {district: dataPoint.district}, areaData.basePoint, mapGrid);
					}
				}
			}
		}, false);

		// Reset "temp" values
		mapGrid.eachPoint(function(point, x, y, self) {
			if( point ) {
				_insertDataPointValue(self, x, y, 'temp', false);
			}
		});
	}

	function _seedSidewalkItem(width, height, config = {district: 0}, baseOffset = {x: 0 , y: 0}, mapGrid) {
		let queryArgs = {
			width:		width,
			height:		height,
			district:		config.district,
		};

		let matches	= _querySidewalkItems(queryArgs);
		let match		= matches.random();

		if( match ) {
			let itemData	= Data.sidewalkItems[match];
			let offset	= itemData.offset || {x: 0, y: 0};

			_loadMapActorData(mapGrid, baseOffset.x, baseOffset.y, itemData.name, 'obstacle', false, offset);

			for(let h = 0; h < height; h++) {
				for(let w = 0; w < width; w++) {
					if( w != 0 && h != 0 ) {
						_insertDataPointValue(baseOffset.x + w, baseOffset.y + h, 'solid', true, mapGrid);
					}
				}
			}
		}
	}

	function _querySidewalkItems(args = {}) {
		let matches = [];
		let query = {
			facing:		args.facing || 'S',
			name:		args.name || false,
			width:		args.width || 1,
			height:		args.height || 1,
			district:		args.district,
		};

		for(let name in Data.sidewalkItems) {
			let item = Data.sidewalkItems[name];

			if( query.name && query.name != name ) {
				continue;
			}
			if( query.width != item.width ) {
				continue;
			}
			if( query.height != item.height ) {
				continue;
			}
			if( query.facing && item.facing ) {
				let facingTests = ( typeof(item.facing) == 'string' ) ? [item.facing] : item.facing;
				let allowable = false;

				for(let test of facingTests) {
					if( query.facing == test ) {
						allowable = true;
					}
				}

				if( !allowable ) {
					continue;
				}
			}
			if( query.district && item.district ) {
				let facingTests = ( typeof(item.district) == 'number' ) ? [item.district] : item.district;
				let allowable = false;

				for(let test of facingTests) {
					if( query.district == test ) {
						allowable = true;
					}
				}

				if( !allowable ) {
					continue;
				}
			}

			matches.push(name);
		}

		return matches;
	}

	function _seedShantytownsV7(mapGrid) {
		// put seeds around building edges or sidewalk edges and grow. also add in inner-blocks
		// include barrels and car hulks with those buildings somehow
	}

	function _seedBlockadesV7(mapGrid) {
		// Barricaded streets (jersey barricades + barrels + car hulks + police barricades)
		// Street grid might be unnecessary. Just go off of street or sidewalk edges
		// form a snaking line or barricades, then add other items

		mapGrid.eachPoint(function(point, x, y, self) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.zone != 'blockade' ) {
					self.setPoint(x, y, 0);
				}
			}
		});

		mapGrid.setHexValues(false, false).growPoints(false, 100).growPoints(false, 100).eachPoint(function(point, x, y, self) {
			if( point ) {
				_insertDataPointValue(self, x, y, 'zone', 'blockade');
			} else {
				self.setPoint(x, y, 1);
			}
		});

		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.zone == 'blockade' ) {
					return point;
				}
			}

			return false;
		});

		mapGrid.setHexValues(false, false).eachPoint(function(point, x, y, self) {
			if( point ) {
				const MAX_LENGTH = 9;
				let metaPoint = self.getMetaPoint(x, y);

				if( metaPoint.type == 'edge' && Math.random() > 0.975 ) {
					let scanDir = {x: 0, y: 0};

					if( metaPoint.rotations == 0 ) {
						scanDir.y = -1;
					} else if( metaPoint.rotations == 1 ) {
						scanDir.x = 1;
					} else if( metaPoint.rotations == 2 ) {
						scanDir.y = 1;
					} else {
						scanDir.x = -1;
					}

					self.setPoint(x, y, 0);

					let testLength	= 0;
					let seedPoints	= [];

					scanLoop:
					for(let i = 0; i < MAX_LENGTH; i++) {
						let testCoords		= {x: x + i * scanDir.x, y: y + i * scanDir.y};
						let testDataPoint	= self.getDataPoint(testCoords.x, testCoords.y);

						if( !testDataPoint.solid ) {
							seedPoints.push(testCoords);
						} else {
							break scanLoop;
						}

						// TODO: if more than halfway, chance to zig-zag a little
					}

					if( seedPoints.length > 1 ) {
						seedPoints.forEach(function(seedPoint) {
							_insertDataPointValue(self, seedPoint.x, seedPoint.y, 'temp', true);
						});
					}

					self.setPoint(x, y, 1);
				}
			}
		});

		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.temp ) {
					return point;
				}
			}

			return false;
		});

		mapGrid.setHexValues('barricades', false).eachPoint(function(point, x, y, self) {
			if( point ) {
				let metaPoint	= self.getMetaPoint(x, y);
				let dataPoint	= self.getDataPoint(x, y);
				let yAdjust	= dataPoint.type == 'sidewalk' ? -7 : 0;
				let nameAddon	= '';

				if( metaPoint.type == 'pipe' ) {
					let num = Math.floor( Math.random() * 3 ); // three variations

					nameAddon = '-v' + num;
				}

				_insertDataPointValue(self, x, y, 'temp', false);
				_loadMapActorData(self, x, y, `concrete-barricade-${metaPoint.type}-${metaPoint.rotations}${nameAddon}`, 'obstacle', null, {x: 0, y: yAdjust});
				_insertDataPointValue(self, x, y, 'marker', true);
			}
		});
	}

	function _seedTrussesV7(intersectionGrid, mapGrid) {
		let gridOffset = {x: -5, y: -5};

		intersectionGrid.eachPoint(function(point, x, y) {
			let data = intersectionGrid.getDataPoint(x, y);
			let basePoint = {
				x:	data.base.x,
				y:	data.base.y,
			};

			let leftNghbrData	= intersectionGrid.getDataPoint(x - 1, y);
			let rightNghbrData	= intersectionGrid.getDataPoint(x + 1, y);
			let upNghbrData	= intersectionGrid.getDataPoint(x, y - 1);
			let downNghbrData	= intersectionGrid.getDataPoint(x, y + 1);
			let rightDistX		= Constants.MAP_BLOCK_WIDTH - data.offset.x;
			let rightDistY		= 0;
			let downDistX		= 0;
			let downDistY		= Constants.MAP_BLOCK_HEIGHT - data.offset.y;

			if( rightNghbrData ) {
				rightDistX = rightNghbrData.base.x - data.base.x;
				rightDistY = rightNghbrData.base.y - data.base.y;

				// Connect nearby points if they'd be extremely close
				if( data.straight.x && Math.abs(rightDistY) < 4 ) {
					data.straight.x = false;
				}
			}
			if( downNghbrData ) {
				downDistX = downNghbrData.base.x - data.base.x;
				downDistY = downNghbrData.base.y - data.base.y;

				// Connect nearby points if they'd be extremely close
				if( data.straight.y && Math.abs(downDistX) < 4 ) {
					data.straight.y = false;
				}
			}
			if( !data.empty.x ) {
				let baseAdj = 0;

				if( data.straight.x ) {
					for(let i = 0 - baseAdj; i < rightDistX; i++) {
						_loadMapTruss(mapGrid, data.base.x + i + gridOffset.x, data.base.y + gridOffset.y, true);
					}
				} else if( rightNghbrData ) {
					let halfWayX = Math.round(rightDistX / 2);

					for(let i = 0 - baseAdj; i < rightDistX; i++) {
						let baseY = data.base.y;

						if( i > halfWayX ) {
							baseY = rightNghbrData.base.y;
						}

						_loadMapTruss(mapGrid, data.base.x + i + gridOffset.x, baseY + gridOffset.y, true);
					}

					let startY = ( data.base.y < rightNghbrData.base.y ) ? data.base.y : rightNghbrData.base.y;

					rightDistY = Math.abs(rightDistY);

					// Perpendicular section
					for(let i = 0; i <= rightDistY; i++) {
						_loadMapTruss(mapGrid, data.base.x + halfWayX + gridOffset.x, startY + i + gridOffset.y, true);
					}
				}
			}
			if( !data.empty.y ) {
				let baseAdj = 0;

				if( data.straight.y ) {
					for(let i = 0 - baseAdj; i < downDistY; i++) {
						_loadMapTruss(mapGrid, data.base.x + gridOffset.x, data.base.y + i + gridOffset.y, true);
					}
				} else if( downNghbrData ) {
					let halfWayY = Math.round(downDistY / 2);

					for(let i = 0 - baseAdj; i < downDistY; i++) {
						let baseX = data.base.x;

						if( i > halfWayY ) {
							baseX = downNghbrData.base.x;
						}

						_loadMapTruss(mapGrid, baseX + gridOffset.x, data.base.y + i + gridOffset.y, true);
					}

					let startX = ( data.base.x < downNghbrData.base.x ) ? data.base.x : downNghbrData.base.x;

					downDistX = Math.abs(downDistX);

					// Perpendicular section
					for(let i = 0; i <= downDistX; i++) {
						_loadMapTruss(mapGrid, startX + i + gridOffset.x, data.base.y + halfWayY + gridOffset.y, true);
					}
				}
			}
		});

		// make additions
		// some are cantilevered sections. some are offset portions connected to larger truss


		// seed shadows in place, then seed trusses at -2/-3 Y
	}

	function _seedFencingV7(mapGrid) {
		mapGrid.addFilter(function(point, x, y) {
			if( point ) {
				let dataPoint = mapGrid.getDataPoint(x, y);

				if( dataPoint.type == 'sidewalk' && dataPoint.subtype == 'building' ) {
					return point;
				}
			}

			return false;
		});

		mapGrid.setHexValues(false, false).eachPoint(function(point, x , y, self) {
			const MAX_LENGTH = 3;

			if( point ) {
				let metaPoint = self.getMetaPoint(x, y);

				if( metaPoint.type == 'edge' ) {
					let orientation;
					let extending	= true;
					let blocked	= false;
					let abort		= false;
					let seedPoints	= [];
					let scanDirs	= {x: 0, y: 0};

					if( metaPoint.rotations == 0 ) {
						scanDirs.y	= 1;
						orientation	= 'vertical';
					} else if( metaPoint.rotations == 1 ) {
						scanDirs.x	= -1;
						orientation	= 'horizontal';
					} else if( metaPoint.rotations == 2 ) {
						scanDirs.y	= -1;
						orientation	= 'vertical';
					} else {
						scanDirs.x	= 1;
						orientation	= 'horizontal';
					}

					while( extending && seedPoints.length <= MAX_LENGTH ) {
						let testLength	= seedPoints.length + 1;
						let testCoords	= {x: x + scanDirs.x * testLength, y: y + scanDirs.y * testLength};
						let testPoint	= self.getPoint(testCoords.x, testCoords.y);

						if( testPoint ) {
							let testDataPoint = self.getDataPoint(testCoords.x, testCoords.y);

							if( !testDataPoint.solid && testDataPoint.type == 'sidewalk' ) {
								// Check that adjacent tiles are free also
								let adjData1;
								let adjData2;

								if( orientation == 'vertical' ) {
									// Check left/right
									adjData1 = self.getDataPoint(testCoords.x - 1, testCoords.y);
									adjData2 = self.getDataPoint(testCoords.x + 1, testCoords.y);
								} else {
									// Check up/down
									adjData1 = self.getDataPoint(testCoords.x, testCoords.y - 1);
									adjData2 = self.getDataPoint(testCoords.x, testCoords.y + 1);
								}

								if( adjData1 && adjData2 && !adjData1.solid && !adjData2.solid ) {
									seedPoints.push(testCoords);
								} else {
									abort = true;
									extending = false;
								}
							} else {
								let testMetaPoint = self.getMetaPoint(testCoords.x, testCoords.y);

								if( testDataPoint.subtype == 'building' && testMetaPoint.type == 'edge' ) {
									blocked = true;
								} else {
									abort = true;
								}

								extending = false;
							}
						} else {
							abort = true;
							extending = false;
						}
					}

					if( seedPoints.length > 0 && blocked && !abort ) {
						if( Math.random() > 0.8 ) {
							// TODO: determine fencing type
							seedPoints.forEach(function(seedPoint) {
								_insertDataPointValue(self, seedPoint.x, seedPoint.y, 'subtype', 'fencing');
								_insertDataPointValue(self, seedPoint.x, seedPoint.y, 'solid', true);
								// TODO: utilize "orientation" to set correct fence pieces
								// TODO: Seed actor data
							});
						}
					}
				}
			}
		});
	}


	function _seedRailNetworkV7(mapGrid) {
		// bubble network: group of rectangles which must touch edges
	}

	function _seedTrafficLightsV7(mapGrid) {
		// find any crosswalk pipes, the add lights opposite their ends
		// Also need to check adjacent crosswalk for orientation


		// Maybe put small traffic signs at small crosswalks
	}

	function _loadMapTruss(mapGrid, x, y, truss) {
		var dataPoint = mapGrid.getDataPoint(x, y);

		if( !dataPoint ) {
			dataPoint = {type: false, subtype: false, truss: false, id: 0, district: 0};
		}

		dataPoint.truss = truss;

		mapGrid.setPoint(x, y, dataPoint);
	}

	function _insertDataPointValue(grid, x, y, prop, value) {
		var dataPoint = grid.getDataPoint(x, y);

		dataPoint[prop] = value;

		//grid.setDataPoint(x, y, dataPoint);
	}

	function _loadMapType(mapGrid, x, y, type) {
		var dataPoint = mapGrid.getDataPoint(x, y);

		/*
		if( !dataPoint ) {
			dataPoint = {type: false, subtype: false, id: 0, district: 0};
		}
		*/

		dataPoint.type = type;

		mapGrid.setPoint(x, y, dataPoint);
	}

	function _loadMapSubType(mapGrid, x, y, subtype) {
		var dataPoint = mapGrid.getDataPoint(x, y);

		/*
		if( !dataPoint ) {
			dataPoint = {type: false, subtype: false, id: 0, district: 0};
		}
		*/

		dataPoint.subtype = subtype;

		mapGrid.setDataPoint(x, y, dataPoint);
	}

	function _loadMapDistrict(mapGrid, x, y, district = 0) {
		var dataPoint = mapGrid.getDataPoint(x, y);

		dataPoint.district = district;

		mapGrid.setDataPoint(x, y, dataPoint);
	}

	function _loadMapActorData(mapGrid, x, y, name, type, meta = {}, offset = {x: 0, y: 0}, yVirtual) {
		var dataPoint	= mapGrid.getDataPoint(x, y);
		var metaPoint	= (meta) ? meta : mapGrid.getMetaPoint(x, y);
		var xPosition	= x * Constants.TERRAIN_TILE_SIZE + (Constants.TERRAIN_TILE_SIZE * 0.5) + offset.x;
		var yPosition	= y * Constants.TERRAIN_TILE_SIZE + (Constants.TERRAIN_TILE_SIZE * 0.5) + offset.y;
		var dataBin, solidityCheck, typeAbbrev;

		if( !mapGrid.normalize(x, y) ) {
			return;
		}

		var loadable = {
			x:		xPosition,
			y:		yPosition,
			name:	name,
			type:	typeAbbrev,
		};

		switch(type) {
			case 'actor': // Enemies, NPCs
				dataBin = 'c';
				solidityCheck = true;
				typeAbbrev = 'ac';
				break;
			case 'doodad': // Non-solid tilesets
				dataBin = 'd';
				if( metaPoint.rotations != undefined ) {
					loadable.r = metaPoint.rotations;
				}
				if( metaPoint.type != undefined ) {
					loadable.t = metaPoint.type;
				}
				if( (metaPoint.type != undefined) && (metaPoint.rotations != undefined) ) {
					if( name == 'building-shadow' ) {
						loadable.v = 0;
					} else {
						loadable.v = Utilities.getRandomTilesetVariation(Tilesets[name], metaPoint.type, metaPoint.rotations);
					}
				}
				if( yVirtual ) {
					loadable.yv = yVirtual;
				}

				typeAbbrev = 'do';
				break;
			case 'obstacle': // Any solid, freestanding, immovable object
				dataBin = 'o';
				solidityCheck = true;
				typeAbbrev = 'ob';
				break;
			case 'terrain': // Invisible filler shapes
				dataBin = 't';
				name = 'filler';
				loadable.r = 0;
				loadable.t = 'inside';
				loadable.v = 0;
				solidityCheck = true;
				typeAbbrev = 'te';
				break;
			case 'troupe': // Enemies, NPCs
				dataBin = 'c';
				solidityCheck = true;
				typeAbbrev = 'tp';
				break;
			case 'weather':
				dataBin = 'c';
				typeAbbrev = 'wt';
				break;
			default:
				return;
				break;
		}

		if( solidityCheck ) {
			if( dataPoint.solid ) {
				return;
			}

			dataPoint.solid = true;
		}

		loadable.type = typeAbbrev;

		dataPoint.actorData[dataBin].push(loadable);

		mapGrid.setDataPoint(x, y, dataPoint);
	}

	function _setMapDataPointAsSolid(mapGrid, x, y) {
		var dataPoint = mapGrid.getDataPoint(x, y);

		dataPoint.solid = true;

		mapGrid.setDataPoint(x, y, dataPoint);
	}

	function _mapDataPointHasSolid(mapGrid, x, y) {
		var dataPoint = mapGrid.getDataPoint(x, y);

		return dataPoint.solid;
	}

	function _getDataPointExemplar(x, y) {
		return {
			actorData:	{
				'x':		x,	// area X coordinate
				'y':		y,	// area Y coordinate
				't':		[],	// terrain
				'c':		[],	// characters
				'd':		[],	// doodads
				'o':		[],	// obstacles
			},
			density:		'low',
			district:		0,
			solid:		false,
			subtype:		false,
			temp:		false,
			truss:		false,
			type:		false,
			zone:		false,
		};
	}

	function _setupActorData(grid) {
		// Stores data about actors, terrain and tile coordinates
		grid.eachDataPoint(function(dataPoint, x, y) {
			if( !dataPoint ) {
				dataPoint = _getDataPointExemplar(x, y);
			}

			grid.setDataPoint(x, y, dataPoint);
		});

		return grid;
	}

	// Copies actor data from a property of a data point into the primary point value
	function _finalizeActorData(grid) {
		grid.eachDataPoint(function(data, x, y) {
			// Setup finalized data to be loaded into the saved map grid
			var finalized = {
				x:		x,
				y:		y,
				t:		data.actorData.t,
				c:		data.actorData.c,
				d:		data.actorData.d,
				o:		data.actorData.o,
				dist:	data.district,
				type:	data.type,
				subtype:	data.subtype,
			};

			grid.setPoint(x, y, finalized);
			grid.setDataPoint(x, y, null);
			grid.setMetaPoint(x, y, null);
		});

		return grid;
	}

	_self.createV4 = function(type) {
		if( type == 'blank' ) {
			var map = new Grid(Constants.MAP_BLOCK_WIDTH * Constants.MAP_BLOCK_SIZE, Constants.MAP_BLOCK_HEIGHT * Constants.MAP_BLOCK_SIZE, {scratch: false, meta: false});

			_setupActorData(map);
			_finalizeActorData(map);

			return map;
		}

		var map = new Grid(Constants.MAP_BLOCK_WIDTH * Constants.MAP_BLOCK_SIZE, Constants.MAP_BLOCK_HEIGHT * Constants.MAP_BLOCK_SIZE, {scratch: false}); // each block is 12x12 tiles (9 sidewalk + 3 street)

		var blockGrid		= _createBlockSegmentsGrid();
		var streetGrid		= _createRoadGrid();
		var blockSegments	= _extractBlockSegments(blockGrid);

		log('Basic map grids created.');

		_unsetMergedBlockStreets(streetGrid, blockSegments);

		// create new grid of areas that are courtyard-like
			// unset these points from streetsGrid
		var railGrid	= _createElevatedRailGrid(streetGrid);

		_assignSegmentTerritories(blockGrid, blockSegments);

		_setupActorData(map);

		_setMapStreets(streetGrid, blockGrid, sunkenGrid, railGrid, map, blockSegments);

		_setMapBlockSidewalks(blockSegments, map);

		_applyDistrictsToMap(blockSegments, map);

		_seedElevatedRail(map); // add into air. then create pillars over streets (not sunken)

		_seedMapBuildings(blockSegments, map, streetGrid);

		_seedTrusses(map, streetGrid);

		// set street hex values and seed pusher doodads
		_seedStreetInfrastructure(map, streetGrid); // intersection tiles, crosswalk tiles, island tiles, island signs and streelights

		_correctSidewalkDistricts(map);

		_seedSidewalks(map);

		//_seedStreetCars(); // parked cars. create a table of possible doodads?

		//_seedRailyard(map);
		//log('Railyard added.');

		_seedHaze(map);

		////// Temporary: print map data //////
		var dims = map.getDimensions();

		//var visualMap = fs.openSync('../visualMap.txt');
		var visualMap;

		if( !fs.existsSync('visualMap.txt') ) {
			fs.createWriteStream('visualMap.txt');
		}

		visualMap = fs.openSync('visualMap.txt', 'w');

		var output = '';

		map.eachPoint(function(point, x, y, thisGrid) {
			if( !point ) {
				//log('+++MAP GENERATION ERROR+++');
			}
			if( point.rail ) {
				if( point.rail == 'shadow' ) {
					output += ',';
				} else if( point.rail == 'support' ) {
					output += '╥';
				} else {
					//output += '■';
					output += 'R';
				}
			} else if( point.type == 'truss' ) {
				output += '=';
			} else if( point.type == 'car' ) {
				output += 'c';
			} else if( point.type == 'railyard' ) {
				if( point.subtype == 'tanker-car' ) {
					output += 'C';
				} else {
					output += '#';
				}
			} else if( point.type == 'roof' ) {
				output += '*';
			} else if( point && point.type == 'sunken' ) {
				output += '_';
			} else if( point && point.type == 'sidewalk' ) {
				if( point.subtype ) {
					if( point.subtype == 'building' ) {
						output += '[';
					} else if( point.subtype == 'kiosk' ) {
						output += 'K';
					} else {
						output += point.subtype;
					}
				} else {
					var dataPoint = thisGrid.getDataPoint(x, y);
					//output += 'B';
					output += dataPoint.district;
				}
			} else if( point && point.type == 'street' ) {
				if( point.subtype  == 'streetlight' ) {
					output += '╮';
				} else if( point.subtype == 'intersection' ) {
					//output += '▓';
					output += 'x';
				} else if( point.subtype == 'crosswalk' ) {
					output += '|';
				} else if( point.subtype == '◄' || point.subtype == '▲' || point.subtype == '►' || point.subtype == '▼' ) {
					output += point.subtype;
				} else {
					//output += '░';
					output += '-';
				}
			} else {
				output += '.';
			}

			if( x == dims.width - 1 ) {
				fs.writeSync(visualMap, output + "\n");
				output = '';
			}
		});

		fs.closeSync(visualMap);
		log('Visual map file written.');

		//_loadMapActorData(map, 0, 1, 'streetlight-0', 'obstacle');
		//_loadMapActorData(map, 1, 0, 'streetlight-1', 'obstacle');
		//_loadMapActorData(map, 2, 0, 'concrete-barricade-corner-0', 'obstacle');

		_loadMapActorData(map, 0, 1, 'traffic-light-1', 'obstacle');

		_finalizeActorData(map);

		return map;
	};

	function _createRoadGrid() {
		// Create double-density grid to represent vertical & horizontal streets both mapped to a single block
		var roads	= new Grid(MAP_INSIDE_WIDTH, MAP_INSIDE_HEIGHT * 2, {meta: false, scratch: false, data: false});

		roads.eachPoint(function(point, x, y, self) {
			var value = 1;

			if( Math.random() > 0.5 ) {
				value = 'narrow';
			}

			self.setPoint(x, y, value);
		});

		return roads;
	}

	function _createElevatedRailGrid(streetGrid) {
		var railGrid			= new Grid(MAP_INSIDE_WIDTH, MAP_INSIDE_HEIGHT * 2, {meta: false, scratch: false, data: false});
		var districtWidth		= MAP_INSIDE_WIDTH / NUM_DISTRICTS_WIDE;
		var districtHeight		= MAP_INSIDE_HEIGHT * 2 / NUM_DISTRICTS_HIGH;
		var linesPerDistrict	= 2;

		return railGrid;

		var vertCoords = {
			'n':		[{x: 0, y: -1, direction: 'w'}, {x: 0, y: -2, direction: 'n'}, {x: 1, y: -1, direction: 'e'}],
			's':		[{x: 0, y: 1, direction: 'w'}, {x: 0, y: 2, direction: 's'}, {x: 1, y: 1, direction: 'e'}],
		};
		var horzCoords = {
			'e':		[{x: 1, y: 0, direction: 'e'}, {x: 0, y: -1, direction: 'n'}, {x: 0, y: 1, direction: 's'}],
			'w':		[{x: -1, y: 0, direction: 'w'}, {x: -1, y: -1, direction: 'n'}, {x: -1, y: 1, direction: 's'}],
		};

		for(var h = 0; h < NUM_DISTRICTS_HIGH; h++) {
			for(var w = 0; w < NUM_DISTRICTS_WIDE; w++) {
				for(var l = 0; l < linesPerDistrict; l++) {
					var streetStart = false;

					// Convert region coordinates into blockGrid coordinates
					var minBound = {
						x:	Math.floor(w * districtWidth),
						y:	Math.floor(h * districtHeight),
					};
					var maxBound = {
						x:	Math.floor( (w+1) * districtWidth) - 1,
						y:	Math.floor( (h+1) * districtHeight) - 1,
					};

					// Find a filled street starting point
					while( !streetStart.value ) {
						streetStart = streetGrid.getRandomPoint(minBound, maxBound);
					}

					var nextPoint		= {x: streetStart.x, y: streetStart.y};
					var directionSeed	= (Math.random() > 0.5);

					if( nextPoint.y % 2 == 0  ) {
						var direction = directionSeed ? 'n' : 's';
					} else {
						var direction = directionSeed ? 'e' : 'w';
					}

					while( nextPoint ) {
						railGrid.setPoint(nextPoint.x, nextPoint.y, 1);

						var validNeighbors = [];

						if( nextPoint.y % 2 == 0  ) {
							// Vertical
							var neighborCoords = vertCoords[direction];
						} else {
							// Horizontal
							var neighborCoords = horzCoords[direction];
						}

						for(var coord of neighborCoords) {
							var testPoint = {x: nextPoint.x + coord.x, y: nextPoint.y + coord.y};

							if( streetGrid.getPoint(testPoint.x, testPoint.y) && !railGrid.getPoint(testPoint.x, testPoint.y) ) {
								validNeighbors.push(coord);
							}
						}

						var randomDirection = validNeighbors.random();

						if( randomDirection ) {
							nextPoint = {x: nextPoint.x + randomDirection.x, y: nextPoint.y + randomDirection.y};
							direction = randomDirection.direction;
						} else {
							nextPoint = false;
						}
					}
				}
			}
		}

		return railGrid;
	}

	function _unsetMergedBlockStreets(streetGrid, blockSegments) {
		// For all adjacent points in block segments, unset the road point between them
		for(var blockName in blockSegments) {
			var blockData = blockSegments[blockName];
			var lastPoint = false;

			for(var point of blockData.points) {
				if( lastPoint ) {
					var xDiff = point.x - lastPoint.x;
					var yDiff = point.y - lastPoint.y;

					if( xDiff ) {
						// Horizontal merge
						var streetX = (point.x < lastPoint.x) ? point.x : lastPoint.x; // smaller of two X values
						streetGrid.setPoint(streetX, point.y*2, 0);
					} else {
						// Vertical merge
						var streetY = (point.y < lastPoint.y) ? point.y : lastPoint.y; // smaller of two Y values
						streetGrid.setPoint(point.x, streetY*2 + 1, 0);
					}
				}

				lastPoint = {x: point.x, y: point.y};
			}
		}
	}

	function _assignSegmentTerritories(blockGrid, masterSegments) {
		// Divide grid up into N rectangles. Then reduce area slightly and gather up blocks within area
		var dimensions		= blockGrid.getDimensions();
		var districtWidth	= dimensions.width / NUM_DISTRICTS_WIDE;
		var districtHeight	= dimensions.height / NUM_DISTRICTS_HIGH;

		var edgeBuffer		= 3;
		var quadrantCounter	= 1;

		for(var h = 0; h < NUM_DISTRICTS_HIGH; h++) {
			for(var w = 0; w < NUM_DISTRICTS_WIDE; w++) {
				// Convert region coordinates into blockGrid coordinates
				var minBound = {
					x:	Math.ceil(w * districtWidth) + edgeBuffer,
					y:	Math.ceil(h * districtHeight) + edgeBuffer,
				};
				var maxBound = {
					x:	Math.floor( (w+1) * districtWidth) - edgeBuffer,
					y:	Math.floor( (h+1) * districtHeight) - edgeBuffer,
				};

				var localSegments = _extractBlockSegments(blockGrid, minBound, maxBound);

				// Assign quadrant IDs to segments
				for(var s in localSegments) {
					if( masterSegments[s] ) {
						masterSegments[s].district = quadrantCounter;
					}
				}

				quadrantCounter++;
			}
		}
	}

	function _setMapStreets(streetGrid, blockGrid, sunkenGrid, railGrid, mapGrid, blockSegments) {
		streetGrid.eachPoint(function(point, x, y) {
			var xRange	= 0;
			var yRange	= 0;
			var xOffset	= (x + Constants.MAP_BUFFER_WEST) * Constants.MAP_BLOCK_SIZE;
			var yOffset	= (Math.floor(y/2) + Constants.MAP_BUFFER_NORTH) * Constants.MAP_BLOCK_SIZE;
			var type		= '';
			var subtype	= false;
			var alignment	= false;
			var district	= false;
			var openType	= false;
			var narrow		= false;
			var narrowPattern	= false;

			if( point ) {
				type = 'street';

				narrow = (point == 'narrow');

				if( narrow ) {
					narrowPattern = Math.floor( Utilities.randomFromTo(0, 4) );
				}
			} else {
				type = 'sidewalk'; // fills in merged blocks

				if( sunkenGrid.getPoint(x, y) ) {
					type = 'sunken';
				}
			}

			if( y % 2 == 1 ) {
				alignment = 'horizontal';
				xRange = SIDEWALK_SIZE;
				yRange = STREET_SIZE;

				yOffset += SIDEWALK_SIZE;
			} else {
				alignment = 'vertical';
				xRange = STREET_SIZE;
				yRange = SIDEWALK_SIZE;

				xOffset += SIDEWALK_SIZE;
			}
			if( type == 'street' ) {
				openType = 'open-' + alignment;
			}

			for(var xSeed = 0; xSeed < xRange; xSeed++) {
				for(var ySeed = 0; ySeed < yRange; ySeed++) {
					var mapX = xOffset + xSeed;
					var mapY = yOffset + ySeed;
					var forcedType = false;

					subtype = openType;

					// Set crosswalks
					if( point ) {
						if( alignment == 'horizontal' ) {
							if( xSeed == 0 || xSeed == xRange - 1 ) {
								subtype = 'filled';
							}
							if( xSeed == 1 || xSeed  == xRange - 2 ) {
								subtype = 'crosswalk';
							}
						}
						if( alignment == 'vertical' ) {
							if( ySeed == 0 || ySeed == yRange - 1 ) {
								subtype = 'filled';
							}
							if( ySeed == 1 || ySeed == yRange - 2 ) {
								subtype = 'crosswalk';
							}
						}
					}

					// Narrow street patterns
					if( narrow ) {
						if( alignment == 'horizontal' ) {
							switch(narrowPattern) {
								// Center
								case 0:
									if( ySeed == 0 || ySeed == STREET_SIZE-1 ) {
										forcedType = 'sidewalk';
									}
									break;
								// Offset 1-down
								case 1:
									if( ySeed == 0 || ySeed == STREET_SIZE-2 ) {
										forcedType = 'sidewalk';
									}
									break;
								// Bend
								case 2:
									if( ySeed == 0 || (ySeed == STREET_SIZE-2 && xSeed <= (Constants.MAP_BLOCK_SIZE/3 - 1)) || (ySeed == STREET_SIZE-1 && xSeed > Constants.MAP_BLOCK_SIZE/3) ) {
										forcedType = 'sidewalk';
									}
									break;
								case 3:
									if( ySeed == 0 || (ySeed == STREET_SIZE-2 && xSeed >= (Constants.MAP_BLOCK_SIZE/3 + 1)) || (ySeed == STREET_SIZE-1 && xSeed < Constants.MAP_BLOCK_SIZE/3) ) {
										forcedType = 'sidewalk';
									}
									break;
								default:
									break;
							}
						}
						if( alignment == 'vertical' ) {
							switch(narrowPattern) {
								// Center
								case 0:
									if( xSeed == 0 || xSeed == STREET_SIZE-1 ) {
										forcedType = 'sidewalk';
									}
									break;
								// Offset 1-right
								case 1:
									if( xSeed == 0 || xSeed == STREET_SIZE-2 ) {
										forcedType = 'sidewalk';
									}
									break;
								// Bend
								case 2:
									if( xSeed == 0 || (xSeed == STREET_SIZE-2 && ySeed <= (Constants.MAP_BLOCK_SIZE/3 - 1)) || (xSeed == STREET_SIZE-1 && ySeed > Constants.MAP_BLOCK_SIZE/3) ) {
										forcedType = 'sidewalk';
									}
									break;
								case 3:
									if( xSeed == 0 || (xSeed == STREET_SIZE-2 && ySeed >= (Constants.MAP_BLOCK_SIZE/3 + 1)) || (xSeed == STREET_SIZE-1 && ySeed < Constants.MAP_BLOCK_SIZE/3) ) {
										forcedType = 'sidewalk';
									}
									break;
								default:
									break;
							}
						}
					}

					if( type == 'sidewalk' || forcedType == 'sidewalk' ) {
						var blockPoint = blockGrid.getPoint(x, Math.floor(y/2));

						subtype = blockSegments[blockPoint].district;
						district = blockSegments[blockPoint].district;
					}

					var loadableType = forcedType || type;

					mapGrid.setPoint(mapX, mapY, {type: loadableType, subtype: subtype, id: 0, district: district});
				}
			}

			// Set intersections
			for(var xSeed = 0; xSeed < STREET_SIZE; xSeed++) {
				for(var ySeed = 0; ySeed < STREET_SIZE; ySeed++) {
					xOffset	= (x + Constants.MAP_BUFFER_WEST) * Constants.MAP_BLOCK_SIZE;
					yOffset	= (Math.floor(y/2) + Constants.MAP_BUFFER_NORTH) * Constants.MAP_BLOCK_SIZE;

					mapGrid.setPoint(xOffset + xSeed + SIDEWALK_SIZE, yOffset + ySeed + SIDEWALK_SIZE, {type: 'street', subtype: 'intersection', id: 0});
				}
			}
		});

		// Elevated rail
		// TODO: possibly create a separate rail grid that has a different spritesheets (alternate transporation line, or something different altogether (pipes, powerlines))
		streetGrid.eachPoint(function(streetPoint, x, y) {
			if( railGrid.getPoint(x, y) ) {
				var seedingWidth	= 1;
				var seedingHeight	= 1;
				var seedBase		= {x: -2, y: -2};
				var xOffset		= x * Constants.MAP_BLOCK_SIZE;
				var yOffset		= Math.floor(y/2) * Constants.MAP_BLOCK_SIZE;
				var alignment, point, shadowPoint, supportPoint;

				if( y % 2 == 1 ) {
					alignment		= 'horizontal';
					seedingWidth	= Constants.MAP_BLOCK_SIZE + 1;
					seedBase.y	= Constants.MAP_BLOCK_SIZE - 2;
				} else {
					alignment		= 'vertical';
					seedingHeight	= Constants.MAP_BLOCK_SIZE + 1;
					seedBase.x	= Constants.MAP_BLOCK_SIZE - 2;
				}

				for(var xSeed = 0; xSeed < seedingWidth; xSeed++) {
					for(var ySeed = 0; ySeed < seedingHeight; ySeed++) {
						var mapX	= xOffset + xSeed + seedBase.x;
						var mapY	= yOffset + ySeed + seedBase.y;

						if( point = mapGrid.getPoint(mapX, mapY - 1) ) {
							point.rail = 'track';

							mapGrid.setPoint(mapX, mapY - 1, point);
						}
						if( xSeed == 4 || xSeed == 8 ) { // hardcoded values based on blocksize of 12
							if( supportPoint = mapGrid.getPoint(mapX, mapY) ) {
								supportPoint.rail = 'support';

								mapGrid.setPoint(mapX, mapY, supportPoint);
							}
						}
						if( shadowPoint = mapGrid.getPoint(mapX, mapY) ) {
							shadowPoint.rail = (shadowPoint.rail != 'support') ? 'shadow' : shadowPoint.rail;

							mapGrid.setPoint(mapX, mapY, shadowPoint);
						}
					}
				}
			}
		});
	}

	function _setMapBlockSidewalks(segments, mapGrid) {
		for(var blockID in segments) {
			var segmentData = segments[blockID];

			var subtype = false;

			if( segmentData.district ) {
				subtype = segmentData.district;
			}

			for(var point of segmentData.points) {
				var xOffset = (point.x + Constants.MAP_BUFFER_WEST) * Constants.MAP_BLOCK_SIZE;
				var yOffset = (point.y + Constants.MAP_BUFFER_NORTH) * Constants.MAP_BLOCK_SIZE;

				for(var x = 0; x < SIDEWALK_SIZE; x++) {
					for(var y = 0; y < SIDEWALK_SIZE; y++) {
						mapGrid.setPoint(x + xOffset, y + yOffset, {type: 'sidewalk', subtype: subtype, id: blockID});

						_loadMapType(mapGrid, x + xOffset, y + yOffset, 'sidewalk');
					}
				}
			}
		}
	}

	function _applyDistrictsToMap(segments, mapGrid) {
		for(var i in segments) {
			var segment	= segments[i];
			var district	= segment.district;

			if( district ) {
				for(var blockPoint of segment.points) {
					var minBound = {
						x:	(blockPoint.x + Constants.MAP_BUFFER_WEST) * Constants.MAP_BLOCK_SIZE,
						y:	(blockPoint.y + Constants.MAP_BUFFER_NORTH) * Constants.MAP_BLOCK_SIZE,
					};
					var maxBound = {
						x:	minBound.x + Constants.MAP_BLOCK_SIZE - 1,
						y:	minBound.y + Constants.MAP_BLOCK_SIZE - 1,
					};

					mapGrid.eachPointWithin(minBound, maxBound, function(point, x, y, thisGrid) {
						_loadMapDistrict(thisGrid, x, y, district);
					});
				}
			}
		}
	}

	function _seedMapBuildings(segments, mapGrid, streetGrid) {
		// break each segment down into one or more rectangular areas
		// each rectangular area gets one or more buildings/alleys seeded into it.

		for(var s in segments) {
			var segment	= segments[s];
			var areas		= _breakSegmentIntoAreas(segment);

			for(var area of areas) {
				_seedAreaBuildings(area, mapGrid, streetGrid);
			}
		}
	}

	function _seedTrusses(mapGrid, streetGrid) {
		mapGrid.addFilter(function(point, x, y) {
			if( point.subtype == 'building' ) {
				return point;
			}

			return false;
		});

		mapGrid.setHexValues('reduced15', false).eachPoint(function(point, x, y) {
			if( point ) {
				var metaPoint = mapGrid.getMetaPoint(x, y);

				// Start at east-facing edges only
				if( metaPoint.type == 'edge' && metaPoint.rotations == 3 && Math.random() > 0.3 ) {
					var leftElevation	= point.elevation;
					var rightElevation	= 1;
					var extension		= 1;
					var maxExtension	= 20;
					var points		= [{x: x, y: y}];
					var success		= false;

					while( extension < maxExtension ) {
						var testCoords	= {x: x + extension, y: y};
						var testPoint	= mapGrid.getPoint(testCoords.x, testCoords.y);

						if( testPoint && testPoint.subtype == 'building' ) {
							var testMeta = mapGrid.getMetaPoint(testCoords.x, testCoords.y);

							if( testMeta.type == 'edge' && testMeta.rotations == 1 ) {
								rightElevation = testPoint.elevation;
								success = true;
							}

							points.push(testCoords);

							break;
						} else {
							points.push(testCoords);

							extension++;
						}
					}

					if( success && points.length > 3 ) {
						var elevation = (leftElevation > rightElevation) ? rightElevation : leftElevation;

						// Don't seed trusses for one-story buildings
						if( elevation > 1 ) {
							for(var i in points) {
								var seedCoord	= points[i];
								var position 	= 'middle';

								if( i == 0 ) {
									position = 'left';
								} else if( i == points.length - 1 ) {
									position = 'right';
								}

								_loadMapActorData(mapGrid, seedCoord.x, seedCoord.y - elevation, `truss-${position}`, 'obstacle');
								_loadMapActorData(mapGrid, seedCoord.x, seedCoord.y, `truss-shadow`, 'obstacle');

								//_loadMapType(mapGrid, seedCoord.x, seedCoord.y, 'truss');
							}
						}
					}
				}
			}
		});
	}

	function _breakSegmentIntoAreas(segment) {
		var areas			= [];
		var alignment		= 'any';
		var testAlignment	= false;
		var lastPoint		= false;
		var district		= segment.district;
		var area;

		function calcAreaMapCoords(area) {
			area.mapX = (area.x + Constants.MAP_BUFFER_WEST) * Constants.MAP_BLOCK_SIZE + SIDEWALK_BUFFER;
			area.mapY = (area.y + Constants.MAP_BUFFER_NORTH) * Constants.MAP_BLOCK_SIZE + SIDEWALK_BUFFER;
		}

		for(var point of segment.points) {
			if( lastPoint ) {
				if( point.x == lastPoint.x ) {
					testAlignment = 'vertical';

					if( alignment == 'vertical' || alignment == 'any' ) {
						// Extend area vertically
						area.height += BLDG_TO_BLDG + FOOTPRINT_SIZE;

						if( point.y < lastPoint.y ) {
							area.y = point.y;
						}
					} else {
						// Finish area
						calcAreaMapCoords(area);
						areas.push(area);

						// Create a joiner area
						var joiner = {width: FOOTPRINT_SIZE, height: BLDG_TO_BLDG, x: lastPoint.x, y: lastPoint.y, district: district, type: 'joiner'};
						calcAreaMapCoords(joiner);
						joiner.mapY += ( (point.y < lastPoint.y) ? (-1 * BLDG_TO_BLDG) : FOOTPRINT_SIZE );
						areas.push(joiner);

						// Start a new area
						area = {width: FOOTPRINT_SIZE, height: FOOTPRINT_SIZE, x: point.x, y: point.y, district: district, type: 'full'};
						alignment = 'any';
					}
				}
				if( point.y == lastPoint.y ) {
					testAlignment = 'horizontal';

					if( alignment == 'horizontal' || alignment == 'any' ) {
						// Extend area horizontally
						area.width += BLDG_TO_BLDG + FOOTPRINT_SIZE;

						if( point.x < lastPoint.x ) {
							area.x = point.x;
						}
					} else {
						// Finish area
						calcAreaMapCoords(area);
						areas.push(area);

						// Create a joiner area
						var joiner = {width: BLDG_TO_BLDG, height: FOOTPRINT_SIZE, x: lastPoint.x, y: lastPoint.y, district: district, type: 'joiner'};
						calcAreaMapCoords(joiner);
						joiner.mapX += ( (point.x < lastPoint.x) ? (-1 * BLDG_TO_BLDG) : FOOTPRINT_SIZE );
						areas.push(joiner);

						// Start a new area
						area = {width: FOOTPRINT_SIZE, height: FOOTPRINT_SIZE, x: point.x, y: point.y, district: district, type: 'full'};
						alignment = 'any';
					}
				}

				alignment = testAlignment;
			} else {
				area = {width: FOOTPRINT_SIZE, height: FOOTPRINT_SIZE, x: point.x, y: point.y, district: district, type: 'full'};
			}

			lastPoint = {x: point.x, y: point.y};
		}

		if( area ) {
			calcAreaMapCoords(area);
			areas.push(area);
		}

		return areas;
	}

	function _seedAreaBuildings(area, mapGrid, streetGrid) {
		var blockPoint		= {x: area.x, y: area.y};
		var width			= area.width;
		var height		= area.height;
		var baseSize		= SIDEWALK_SIZE - 2 * SIDEWALK_BUFFER;
		var offset		= {x: area.mapX, y: area.mapY};

		// Check for adjacent narrow streets and modify dimensions/offset accordingly
		if( width == baseSize ) {
			// North
			if( streetGrid.getPoint(area.x, area.y*2 - 1) == 'narrow' ) {
				offset.y -= 1;
				height += 1;
			}

			// South
			if( streetGrid.getPoint(area.x, area.y*2 + 1) == 'narrow' ) {
				height += 1;
			}
		}
		if( height == baseSize ) {
			// West
			if( streetGrid.getPoint(area.x-1, area.y) == 'narrow' ) {
				offset.x -= 1;
				width += 1;
			}

			// East
			if( streetGrid.getPoint(area.x, area.y) == 'narrow' ) {
				width += 1;
			}
		}

		if( width == baseSize && Math.random() > 0.5 ) {
			var widthPieces = [baseSize];
		} else {
			var widthPieces = Utilities.subdivideLength(width, [1, 2, 3, 4]);
		}

		for(var w in widthPieces) {
			var widthPiece		= widthPieces[w];
			var heightTotal	= 0;
			var isEdge		= (w == 0 || w == widthPieces.length - 1 );

			if( area.type == 'joiner' ) {
				isEdge = false;
			}

			if( height == baseSize && Math.random() > 0.5 ) {
				var heightPieces = [baseSize];
			} else {
				var heightPieces = Utilities.subdivideLength(height, [1, 2, 2, 3, 3]);
			}

			for(var heightPiece of heightPieces) {
				_seedBuildingSolid(widthPiece, heightPiece, {district: area.district, edge: isEdge}, {x: offset.x, y: offset.y + heightTotal}, mapGrid);

				heightTotal += heightPiece;
			}

			offset.x += widthPiece;
		}
	}

	/*
	function _seedSunken(mapGrid) {
		mapGrid.addFilter(function(point, x, y) {
			if( point.type == 'sunken' || point.type == 'sewer' ) {
				return point;
			}

			return false;
		});

		mapGrid.setHexValues('simple13', false);

		mapGrid.eachPoint(function(point, x, y, thisGrid) {
			if( point ) {
				_loadMapActorData(thisGrid, x, y, point.type, 'doodad');
			}
		});
	}

	function _seedAlley(width, height, config, baseOffset, mapGrid) {

	}

	function _seedBuildingScattered(width, height, config = {district: 0, edge: false}, baseOffset = {x: 0 , y: 0}, mapGrid) {
		if( height == 1 ) {
			//return;
		}

		var roofGrid = new Grid(width, height, {scratch: false, data: false});

		roofGrid.populate(65).fill(6).setHexValues('one-floor-roof');

		var footprintGrid = roofGrid.clone();

		roofGrid.eachPoint(function(point, x, y, thisGrid) {
			if( point ) {
				var metaPoint = thisGrid.getMetaPoint(x, y);
				var mapPoint = {
					x:	x + baseOffset.x,
					y:	y + baseOffset.y,
				};

				_loadMapActorData(mapGrid, mapPoint.x, mapPoint.y - 1, 'test-rooftop-5', 'doodad', metaPoint, {x: 0, y: 0}); // mapPoint.y + elevation
			}
		});

		footprintGrid.setHexValues('one-floor-building').eachPoint(function(point, x, y, thisGrid) {
			if( point ) {
				var metaPoint = thisGrid.getMetaPoint(x, y);
				var mapPoint = {
					x:	x + baseOffset.x,
					y:	y + baseOffset.y,
				};

				_loadMapActorData(mapGrid, mapPoint.x, mapPoint.y, 'filler', 'terrain');
				_loadMapActorData(mapGrid, mapPoint.x, mapPoint.y, 'test-building-5', 'doodad', metaPoint);
			}
		});
	}
	*/

	function _seedBuildingSolid(width, height, config = {district: 0}, baseOffset = {x: 0 , y: 0}, mapGrid) {
		let queryArgs = {
			width:		width,
			height:		height,
			district:		config.district,
		};

		let matches = _queryBuildingData(queryArgs);

		while( matches.length > 0 ) {
			Utilities.shuffleArray(matches);

			let seeded;
			let bldgName = matches.pop();
			let buildingData = Data.buildings[bldgName];

			if( buildingData.obstacle ) {
				seeded = _seedDoodadBuilding(bldgName, width, height, baseOffset, mapGrid);
			} else {
				seeded = _seedTileBuilding(bldgName, width, height, baseOffset, mapGrid);
			}

			if( seeded ) {
				matches = []; // exits loop
			}
		}
	}

	function _seedDoodadBuilding(bldgName, width, height, baseOffset, mapGrid) {
		var buildingData = Data.buildings[bldgName];

		// Check offset "solidPoints" array if present. If these are unavailable the seeding will fail and be re-attempted using new data
		if( buildingData.solidPoints ) {
			for(let p = 0; p < buildingData.solidPoints.length; p++) {
				let solidCoords	= buildingData.solidPoints[p];
				let testCoords		= {x: baseOffset.x + solidCoords.x, y: baseOffset.y + solidCoords.y};
				let dataPoint		= mapGrid.getDataPoint(testCoords.x, testCoords.y);

				if( dataPoint.solid ) {
					return false;
				} else {
					_insertDataPointValue(mapGrid, testCoords.x, testCoords.y, 'subtype', 'building');
					_insertDataPointValue(mapGrid, testCoords.x, testCoords.y, 'solid', true);
				}
			}
		}

		_loadMapActorData(mapGrid, baseOffset.x, baseOffset.y, buildingData.name, 'obstacle', false, buildingData.offset);

		// Flag all other points as being solid
		for(var x = 0; x < width; x++) {
			for(var y = 0; y < height; y++) {
				_insertDataPointValue(mapGrid, baseOffset.x + x, baseOffset.y + y, 'subtype', 'building');

				if( x != 0 && y != 0 ) {
					_insertDataPointValue(mapGrid, baseOffset.x + x, baseOffset.y + y, 'solid', true);
				}
			}
		}

		return true;
	}

	function _seedTileBuilding(bldgName, width, height, baseOffset, mapGrid) {
		var buildingData	= Data.buildings[bldgName];
		var roofName		= buildingData.name.replace('building', 'rooftop');
		var elevation		= Math.floor( Utilities.randomFromTo(buildingData.minElevation, buildingData.maxElevation + 1) );
		var footprintGrid	= new Grid(width, height, {scratch: false, data: false});
		var faceGrid		= new Grid(width, elevation, {scratch: false, data: false});
		var faceBaseAdj	= height - elevation;

		faceGrid.populate(100).setHexValues('reduced15').eachMetaPoint(function(metaPoint, x, y, thisGrid) {
			var mapCoords = {
				x:	x + baseOffset.x,
				y:	y + baseOffset.y + faceBaseAdj,
			};

			// Face doodad
			_loadMapActorData(mapGrid, mapCoords.x, mapCoords.y, buildingData.name, 'doodad', metaPoint, {x: 0, y: 0}, baseOffset.y + height - 1); //false, baseOffset.y + height - 1
		});

		footprintGrid.populate(100).setHexValues('reduced15').eachMetaPoint(function(metaPoint, x, y, thisGrid) {
			var mapCoords = {
				x:	x + baseOffset.x,
				y:	y + baseOffset.y,
			};

			// Solid point
			_loadMapActorData(mapGrid, mapCoords.x, mapCoords.y, 'filler', 'terrain');

			var shadow	= false;
			var shadowV	= 0;

			if( metaPoint.type == 'corner' ) {
				if( metaPoint.rotations == 0 ) {
					shadow	= true;
					shadowV	= 2;
				}
				if( metaPoint.rotations == 1 ) {
					shadow	= true;
					shadowV	= 0;
				}
				if( metaPoint.rotations == 2 ) {
					shadow	= true;
					shadowV	= 1;
				}
			}

			if( metaPoint.type == 'edge' ) {
				if( metaPoint.rotations == 0 || metaPoint.rotations == 1 ) {
					shadow	= true;
					shadowV	= 3;
				}
			}
			if( metaPoint.type == 'end' ) {
				shadow	= true;
				shadowV	= metaPoint.rotations + 4;
			}
			if( metaPoint.type == 'pipe' ) {
				shadow	= true;
				shadowV	= 3;
			}

			if( shadow ) {
				_loadMapActorData(mapGrid, mapCoords.x, mapCoords.y, 'building-shadow', 'doodad', {type: 'inside', rotations: shadowV}, {x: -25, y: 25});
			}

			// Roof dooodad
			_loadMapActorData(mapGrid, mapCoords.x, mapCoords.y - elevation, roofName, 'doodad', metaPoint, {x: 0, y: 0}, mapCoords.y + elevation); // false, mapCoords.y + elevation

			//var mapPoint = mapGrid.getPoint(mapCoords.x, mapCoords.y - elevation);
			/*
			var mapPoint = mapGrid.getPoint(mapCoords.x, mapCoords.y);

			if( !mapPoint ) {
				return;
			}

			mapPoint.subtype = 'building';
			mapPoint.elevation = elevation;

			mapGrid.setPoint(mapCoords.x, mapCoords.y, mapPoint);
			*/
			_insertDataPointValue(mapGrid, mapCoords.x, mapCoords.y, 'subtype', 'building');
		});

		return true;
	}

	/*
	function _seedElevatedRail(mapGrid) {
		// Tracks
		mapGrid.addFilter(function(point, x, y) {
			if( point.rail == 'track' ) {
				return point;
			}

			return false;
		});

		mapGrid.setHexValues('linear18', false);

		mapGrid.eachPoint(function(point, x, y, thisGrid) {
			if( point ) {
				//_loadMapActorData(mapGrid, x, y, 'rail-track', 'doodad', thisGrid.getMetaPoint(x, y));
			}
		});

		// Shadows
		mapGrid.addFilter(function(point, x, y) {
			if( point.rail == 'shadow' ) {
				return point;
			}

			return false;
		});

		mapGrid.setHexValues('horizontal3', false);

		mapGrid.eachPoint(function(point, x, y) {
			if( point ) {
				// TODO: add back in
				//var metaPoint = thisGrid.getMetaPoint(x, y); ???
				//_loadMapActorData(mapGrid, x, y, 'rail-shadow', 'doodad', metaPoint);
			}
		});

		// TODO: Add supports to corners? Could then eliminate shadows from ends

		// Supports
		mapGrid.eachPoint(function(point, x, y) {
			if( point.rail == 'support' ) {
				if( point.type != 'sunken' ) {
					// TODO: add back in
					//_loadMapActorData(mapGrid, x, y, 'rail-support', 'obstacle');
				}
			}
		});
	}
	*/

	// Add in sidewalk pavement doodads, then standalone doodads/obstacles on top of that
	function _seedSidewalks(mapGrid) {
		mapGrid.addFilter(function(point) {
			if( point.type == 'sidewalk' ) {
				return point;
			}

			return false;
		});

		mapGrid.setHexValues('simple13', false).setHexRelationships().eachPoint(function(mapPoint, mapX, mapY, selfGrid) {
			if( mapPoint ) {
				var meta = selfGrid.getMetaPoint(mapX, mapY);
				var data = selfGrid.getDataPoint(mapX, mapY);

				_loadMapActorData(mapGrid, mapX, mapY, 'sidewalk-' + (data.district || 0), 'doodad', meta);

				if( mapPoint.subtype == 'building' ) {
					_loadMapSubType(mapGrid, mapX, mapY, 'building');
				}

				var args = {
					tile:		'sidewalk',
					meta:		meta,
					district:		data.district,
				};

				var matches = _queryObstacleData(args);

				if( matches.length ) {
					// select a match at random
					var match = matches.random();

					// determine some amount of randomness in placement, according to match.nudge.x/y (0-1)
					// load in matching obstacle
				}

				// Corners
				/*
				if( meta.type == 'corner' && meta.rotations == 1 ) {
					var targetPoint = {x: mapX + 1, y: mapY - 1};

					if( !_mapDataPointHasSolid(selfGrid, targetPoint.x, targetPoint.y) ) {
						_loadMapActorData(selfGrid, targetPoint.x, targetPoint.y, 'traffic-light-1', 'obstacle');
					}
				}
				*/

				/*
				if( meta.type == 'edge' ) {
					if( Math.random() > 0.6 ) {
						if( meta.rotations == 0 ) {
							_loadMapActorData(mapGrid, mapX, mapY, 'streetlight-1', 'obstacle', false, {x: 0, y: -30});
						}
						if( meta.rotations == 1 ) {
							_loadMapActorData(mapGrid, mapX, mapY, 'streetlight-2', 'obstacle', false, {x: 30, y: 0});
						}
						if( meta.rotations == 2 ) {
							_loadMapActorData(mapGrid, mapX, mapY, 'streetlight-3', 'obstacle', false, {x: 0, y: 30});
						}
						if( meta.rotations == 3 ) {
							_loadMapActorData(mapGrid, mapX, mapY, 'streetlight-0', 'obstacle', false, {x: -30, y: 0});
						}
					}
				}
				*/

				// look for meta.type == 'edge' and 'corner'
					// then for edges, check rotations and find inside point that's one offset
					// 0: y - 1
					// 1: x + 1
					// 2: y + 1
					// 3: x - 3

					// Vending machines: only place on building corners
					// Bollards & plants that appear in groups: have a chance to repeat in tile 2-3 removed from it
					// Unsure how to deal with variations among obstacles (intact vs. damaged bollard, plants with variations)
			}
		}, false);

		log('clearing filter')
		mapGrid.clearFilter();
		log('filter cleared')
	}

	var obstacleLayouts = [
		/*
		{
			'name':			'test-sign',
			'tile':			'sidewalk',
			'meta':			{'type': ['inside', 'edge'], 'rotations': [0, 1, 2]},
			//'meta-type':		['inside', 'edge', 'corner'],
			//'meta-rotations':	[0, 1, 2, 3],
			'district':		[1, 2],
			'class':			'sign',
			'nudge':			{x: 0, y: 1}, // 0-1, for up +/-50% in both directions
			'blockX':			[1, 9],
			'blockY':			[0, 1, 2],
			'target':			{x: 1, y: -1}, // this is where the obstacle actually gets placed, so check this point first before loading here
		},
		*/
		{
			'name':			'traffic-light-1',
			'class':			'sign',
			'tile':			'sidewalk',
			'meta':			{
				'type':			['inside'],
				'rotations':		false, // [0, 1]
				'relationships':	[{direction: 'se', type: 'corner', operator: 'OR'}], // accepts AND or OR, but not a mix of the two
			},
			'district':		[0],
			'nudge':			{x: 0, y: 0}, // 0-1, for up +/-50% in both directions
			// blockX, blockY
		},
	];

	function _queryObstacleData(queryArgs = {}) {
		queryArgs.meta = queryArgs.meta || {};

		var matchingObstacles = [];

		for(var possible of obstacleLayouts) {
			if( queryArgs.name && queryArgs.name != possible.name ) {
				continue;
			}
			if( queryArgs.class && queryArgs.class != possible.class ) {
				continue;
			}
			if( queryArgs.tile && queryArgs.tile != possible.tile ) {
				continue;
			}
			if( possible.meta ) {
				if( queryArgs.meta.type && possible.meta.type ) {
					if( possible.meta.type.indexOf(queryArgs.meta.type) == -1 ) {
						continue;
					}
				}
				if( typeof(queryArgs.meta.rotations) != 'undefined' && possible.meta.rotations ) {
					if( possible.meta.rotations.indexOf(queryArgs.meta.rotations) == -1 ) {
						continue;
					}
				}
				if( possible.meta.relationships ) {
					if( !queryArgs.meta.neighbors ) {
						continue;
					}
					var matches	= 0;
					var required	= 0;

					for(var r in possible.meta.relationships) {
						var relation = possible.meta.relationships[r];

						if( queryArgs.meta.neighbors[relation.direction] == relation.type ) {
							matches++;
						}
						if( relation.operator == 'AND' ) {
							required++;
						}
					}

					if( matches < required || !matches ) {
						continue;
					}
				}
			}
			if( queryArgs.district ) {
				var districtTests = ( typeof(possible.district) == 'number' ) ? [possible.district] : possible.district;
				var allowable = false;

				for(var test of districtTests) {
					if( queryArgs.district == test || test == 0 ) {
						allowable = true;
					}
				}

				if( !allowable ) {
					continue;
				}
			}

			matchingObstacles.push(possible);
		}

		return matchingObstacles;
	}

	/**
	 * @method _queryBuildingData
	 * @private
	 *
	 * @param		{object}		queryArgs
	 * @return	{array}		An array of matching building names
	 */
	function _queryBuildingData(queryArgs = {}) {
		var query = {
			name:		queryArgs.name || false,
			width:		queryArgs.width || false,
			height:		queryArgs.height || false,
			elevation:	queryArgs.elevation || false,
			district:		queryArgs.district,
		};
		var matches = [];

		for(var name in Data.buildings) {
			var building = Data.buildings[name];

			if( query.name && query.name != name ) {
				continue;
			}
			if( query.width ) {
				if( query.width < building.minWidth || query.width > building.maxWidth ) {
					continue;
				}
			}
			if( query.height ) {
				if( query.height < building.minHeight || query.height > building.maxHeight ) {
					continue;
				}
			}
			if( query.elevation ) {
				if( query.elevation < building.minElevation || query.elevation > building.maxElevation ) {
					continue;
				}
			}
			if( query.district && building.district ) {
				var districtTests = ( typeof(building.district) == 'number' ) ? [building.district] : building.district;
				var allowable = false;

				for(var test of districtTests) {
					if( query.district == test ) {
						allowable = true;
					}
				}

				if( !allowable ) {
					continue;
				}
			}

			matches.push(name);
		}

		return matches;
	}

	function _seedRailyard(mapGrid) {
		for(var bx = 0, bxLim = Constants.MAP_BUFFER_WEST * Constants.MAP_BLOCK_SIZE; bx < bxLim; bx++) {
			for(var by = 0, byLim = Constants.MAP_BLOCK_SIZE * (Constants.MAP_BLOCK_HEIGHT - Constants.MAP_BUFFER_SOUTH); by < byLim; by++) {
				_loadMapType(mapGrid, bx, by, 'railyard');

				// set this area as district "R"
				if( bx % 2 == 0 && by % 2 == 0 ) {
					// TODO: randomly determine one of several rail tile types
					_loadMapActorData(mapGrid, bx, by, 'railyard-0', 'obstacle', false, {x: 36, y: 36});
				}
				if( (by % 2 == 1 && Math.random() > 0.86) || by == 1 || bx == 4 ) {
					_loadMapActorData(mapGrid, bx, by, 'tanker-car-example', 'obstacle', false, {x: 0, y: -45});
					_setMapDataPointAsSolid(mapGrid, bx, by - 1);

					_loadMapSubType(mapGrid, bx, by - 1, 'tanker-car');
					_loadMapSubType(mapGrid, bx, by, 'tanker-car');

					if( Math.random() > 0.5 ) {
						var carTestPoint = mapGrid.getPoint(bx, by - 2);

						if( carTestPoint && carTestPoint.subtype != 'tanker-car' ) {
							_loadMapActorData(mapGrid, bx, by - 2, 'tanker-car-example', 'obstacle', false, {x: 0, y: -45});
							_setMapDataPointAsSolid(mapGrid, bx, by - 3);

							_loadMapSubType(mapGrid, bx, by - 3, 'tanker-car');
							_loadMapSubType(mapGrid, bx, by - 2, 'tanker-car');
						}
					}
				} else if( [0, 2, 3, 5, 6, 7].indexOf(bx) != -1 ) {
					var craneTestPoint = mapGrid.getPoint(bx - 3, by);

					if( craneTestPoint && craneTestPoint.type == 'railyard' && !craneTestPoint.subtype ) {
						// load crane into some point, and mark offset point as solid
						// set both as subtype: 'crane'
					}
				}
			}
		}

		// tracks
		// tanker cars
		// signs
		// Top edge: solid train cars
		// Left edge: solid train cars, and beyond that just rail and cars, but entirely "filled" to prevent spawning within it
		// Right edge: fencing with some holes (torn/destroyed sections)
		// bottom edge: rail ends, fencing
	}

	function _seedHaze(mapGrid) {
		// check each tile, and position randomly within the tile
		mapGrid.eachPoint(function(point, x, y) {
			if( Math.random() > 0.7 ) {
				var xOffset = Math.floor(Math.random() * 36);
				var yOffset = Math.floor(Math.random() * 36);

				xOffset = ( Math.random() > 0.5 ) ? xOffset : -xOffset;
				yOffset = ( Math.random() > 0.5 ) ? yOffset : -yOffset;

				_loadMapActorData(mapGrid, x, y, 'haze-test-1', 'weather', false, {x: xOffset, y: yOffset});
			}
		});
	}

	function _createBlockSegmentsGrid() {
		var blocks = new Grid(MAP_INSIDE_WIDTH, MAP_INSIDE_HEIGHT, {meta: false, scratch: false});
		var mergingPasses = 2;
		var chanceToMerge = 0.4;

		// Seed grid of blocks with unique IDs
		blocks.eachPoint(function(point, x, y) {
			blocks.setPoint(x, y, `Block-${x},${y}`);
			blocks.setDataPoint(x, y, [{x: x, y: y}]);
		});

		var compass = new Compass();

		// Randomly extend blocks into block segments
		for(var r = 0; r < mergingPasses; r++) {
			blocks.eachPoint(function(point, x, y) {
				if( Math.random() < chanceToMerge ) {
					var ownCoords	= blocks.getDataPoint(x, y);

					// Prevent segments from being extended multiple times per instance of main loop
					if( ownCoords.length > (r + 1) ) {
						return;
					}

					compass.randomize();

					var coords	= compass.getState().coordinates;
					var endPoint	= ownCoords[ownCoords.length - 1]; // Only extend out the segment from its end
					var neighbor	= blocks.getPoint(endPoint.x + coords.x, endPoint.y + coords.y);

					if( neighbor ) {
						var nghbrCoords	= blocks.getDataPoint(endPoint.x + coords.x, endPoint.y + coords.y);
						var nghbrEndPoint	= nghbrCoords[nghbrCoords.length - 1];

						// Don't let large segments merge
						if( nghbrCoords.length > 1 && ownCoords.length > 1 ) {
							return;
						}
						// Ensure a segment can never wind up longer too much longer than the loop counter
						// due to individual cells all joining a large segment in a single loop
						if( (nghbrCoords.length + ownCoords.length) > (r + 2) ) {
							return;
						}
						// If a single cell is attempting to merge into a large segment, the
						// single cell must be ajacent to the segment's endpoint to ensure cohesiveness of
						// the segment point chain.
						if( nghbrCoords.length > 1 && ownCoords.length == 1 ) {
							var nghbrX = endPoint.x + coords.x;
							var nghbrY = endPoint.y + coords.y;

							if( nghbrX != nghbrEndPoint.x || nghbrY != nghbrEndPoint.y ) {
								return;
							}
						}

						for(var nghbrCoord of nghbrCoords) {
							blocks.setPoint(nghbrCoord.x, nghbrCoord.y, point);
						}

						// Determine order in which the points are concatenated
						if( nghbrCoords.length >= ownCoords.length ) {
							var combined = [...nghbrCoords, ...ownCoords];
						} else {
							var combined = [...ownCoords, ...nghbrCoords];
						}

						for(var ownCoord of combined) {
							blocks.setDataPoint(ownCoord.x, ownCoord.y, combined);
						}
					}
				}
			});
		}

		return blocks;
	}

	function _extractBlockSegments(blockGrid, minBound = {x: 0, y: 0}, maxBound = false) {
		var segments = {};

		if( !maxBound ) {
			var dimensions = blockGrid.getDimensions();

			maxBound = {x: dimensions.width - 1, y: dimensions.height - 1};
		}

		blockGrid.eachPointWithin(minBound, maxBound, function(point, x, y, self) {
			var data = self.getDataPoint(x, y);

			if( !segments[point] ) {
				segments[point] = {
					points:		data,
					buildings:	[],
				};
			}
		});

		return segments;
	}
};
