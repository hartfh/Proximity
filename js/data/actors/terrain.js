var Tilepieces	= require('../tilepieces');

module.exports = function() {
	var _self = {};

	var terrainExemplar = {
		actor:		{
			inert:			true,
			indestructible:	true,
			payload:			{},
			type:			'terrain',
		},
		body:		{
			parts:	{
				structures:	[],
				sensors:		[],
				ornaments:	[],
			},
			options:	{
				isStatic:		true
			},
			zindex:	'terrain',
			//custom:	{}
			custom:	{noActor: true},
		},
	};

	for(var pieceName in Tilepieces) {
		var rotations = Tilepieces[pieceName];

		_self[pieceName] = [];

		for(var r = 0; r < rotations; r++) {
			_self[pieceName].push( Utilities.clone(terrainExemplar) );
		}
	}

	var solid = {
		x:		0,
		y:		0,
		width:	Constants.TERRAIN_TILE_SIZE,
		height:	Constants.TERRAIN_TILE_SIZE,
		shape:	'rectangle',
	};


	var tileSize	= Constants.TERRAIN_TILE_SIZE;
	var tileSixth	= Constants.TERRAIN_TILE_SIZE / 6;

	var corner0 = {
		shape:	'polygon',
		x:		-tileSixth,
		y:		-tileSixth,
		points:	[{x: 0, y: 0}, {x: tileSize, y: 0}, {x: 0, y: tileSize}],
	};

	var corner1 = {
		shape:	'polygon',
		x:		tileSixth,
		y:		-tileSixth,
		points:	[{x: 0, y: 0}, {x: tileSize, y: 0}, {x: tileSize, y: tileSize}],
	};

	var corner2 = {
		shape:	'polygon',
		x:		tileSixth,
		y:		tileSixth,
		points:	[{x: tileSize, y: 0}, {x: tileSize, y: tileSize}, {x: 0, y: tileSize}],
	};

	var corner3 = {
		shape:	'polygon',
		x:		-tileSixth,
		y:		tileSixth,
		points:	[{x: 0, y: 0}, {x: tileSize, y: tileSize}, {x: 0, y: tileSize}],
	};

	var ornament = {
		x:		0,
		y:		0,
		width:	20,
		height:	20,
		shape:	'rectangle',
	};

	_self.inside[0].body.parts.structures.push(solid);
	_self.island[0].body.parts.structures.push(solid);

	_self.bend[0].body.parts.structures.push(solid);
	_self.bend[1].body.parts.structures.push(solid);
	_self.bend[2].body.parts.structures.push(solid);
	_self.bend[3].body.parts.structures.push(solid);

	_self.corner[0].body.parts.structures.push(corner0);
	_self.corner[1].body.parts.structures.push(corner1);
	_self.corner[2].body.parts.structures.push(corner2);
	_self.corner[3].body.parts.structures.push(corner3);

	_self.edge[0].body.parts.structures.push(solid);
	_self.edge[1].body.parts.structures.push(solid);
	_self.edge[2].body.parts.structures.push(solid);
	_self.edge[3].body.parts.structures.push(solid);

	_self.end[0].body.parts.structures.push(solid);
	_self.end[1].body.parts.structures.push(solid);
	_self.end[2].body.parts.structures.push(solid);
	_self.end[3].body.parts.structures.push(solid);

	_self.pipe[0].body.parts.structures.push(solid);
	_self.pipe[1].body.parts.structures.push(solid);

	/*
	_self.pipe[0].body.parts.ornaments.push(ornament);
	_self.end[0].body.parts.ornaments.push(ornament);
	_self.end[2].body.parts.ornaments.push(ornament);
	*/

	// Adjust structures of some types
	//_self.corner[0].body.parts.structures.push( {} );
	//_self.corner[1].body.parts.structures.push( {} );


	return _self;
}();
