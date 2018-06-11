var doodads = {};

module.exports = function(doodads) {
	var _self = doodads;

	/*
	_self['sign-extension'] = {
		actor:		{
			inert:			true,
			indestructible:	true,
			payload:			{},
			type:			'doodad'
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'terrain1',
						width:	8,
						height:	50,
						//sprite:	'',
						options:	{}
					}
				],
				sensors:		[],
				ornaments:	[]
			},
			options:	{
				isStatic:		true
			},
			zindex:	'doodad-bg-1',
			custom:	{noActor: true}
		}
	};
	*/

	var exemplar = {
		actor:		{
			inert:			true,
			indestructible:	true,
			//payload:			{},
			type:			'doodad',
		},
		body:		{
			parts:	{
				structures:	[
					{
						shape:	'rectangle',
						name:	'terrain1',
						width:	Constants.TERRAIN_TILE_SIZE,
						height:	Constants.TERRAIN_TILE_SIZE,
						//sprite:	'',
						options:	{},
					}
				],
				sensors:		[],
				ornaments:	[],
			},
			options:	{
				isStatic:		true
			},
			zindex:	'doodad-bg-1',
			custom:	{noActor: true}
		}
	};

	var moverTile = {
		actor:		{
			inert:			true,
			indestructible:	true,
			//payload:			{},
			type:			'doodad',
		},
		body:		{
			parts:	{
				structures:	[],
				sensors:		[
					{
						shape:	'rectangle',
						name:	'road-mover',
						width:	Constants.TERRAIN_TILE_SIZE,
						height:	Constants.TERRAIN_TILE_SIZE,
						types:	[],
						//sprite:	'',
						options:	{}
					}
				],
				ornaments:	[]
			},
			options:	{
				isStatic:		true
			},
			zindex:	'doodad-fg-2',
			custom:	{noActor: true},
		}
	};

	var doodads = [
		'building-1-pagoda',
		'building-2-rentapod',
		'building-3-tiled',
		'building-4-redshops',
		'building-1',
		'building-2',
		'building-3',
		'building-4',
		'building-6',
		'crosswalk',
		'sidewalk',
		'sidewalk-0',
		'sidewalk-1',
		'sidewalk-2',
		'sidewalk-3',
		'sidewalk-4',
		'sidewalk-5',
		'sidewalk-6',
		'street-markings',
		'street-markings-yield',
		'street-median',
		'test-rooftop-1',
		'test-rooftop-2',
		'test-rooftop-3',
		'test-rooftop-4',
		'test-rooftop-5',
		'test-building-1',
		'test-building-2',
		'test-building-3',
		'test-building-4',
		'test-building-5',
		'rooftop-1-pagoda',
		'rooftop-2-rentapod',
		'rooftop-3-tiled',
		'rooftop-4-redshops',
		'rooftop-1',
		'rooftop-3',
		'rooftop-4',
		'rooftop-6',
		'building-shadow',
	];

	for(var doodad of doodads) {
		_self[doodad] = Utilities.clone(exemplar);
	}

	var streetZIndex = 'doodad-bg-7';
	var sidewalkZIndex = 'doodad-bg-7';
	var roofZIndex = 'doodad-fg-6';
	var elevRailZIndex = 'doodad-fg-4';
	var bldgFaceZIndex = 'doodad-fg-2';
	var shadowZIndex = 'doodad-bg-1';

	_self['crosswalk'].body.zindex = sidewalkZIndex;
	_self['sidewalk'].body.zindex = sidewalkZIndex;
	_self['sidewalk-0'].body.zindex = sidewalkZIndex;
	_self['sidewalk-1'].body.zindex = sidewalkZIndex;
	_self['sidewalk-2'].body.zindex = sidewalkZIndex;
	_self['sidewalk-3'].body.zindex = sidewalkZIndex;
	_self['sidewalk-4'].body.zindex = sidewalkZIndex;
	_self['sidewalk-5'].body.zindex = sidewalkZIndex;
	_self['sidewalk-6'].body.zindex = sidewalkZIndex;
	_self['street-markings'].body.zindex = sidewalkZIndex;
	_self['street-markings-yield'].body.zindex = sidewalkZIndex;
	_self['street-median'].body.zindex = sidewalkZIndex;
	_self['test-building-1'].body.zindex = bldgFaceZIndex;
	_self['test-building-2'].body.zindex = bldgFaceZIndex;
	_self['test-building-3'].body.zindex = bldgFaceZIndex;
	_self['test-building-4'].body.zindex = bldgFaceZIndex;
	_self['test-building-5'].body.zindex = bldgFaceZIndex;
	_self['building-1-pagoda'].body.zindex = bldgFaceZIndex;
	_self['building-2-rentapod'].body.zindex = bldgFaceZIndex;
	_self['building-3-tiled'].body.zindex = bldgFaceZIndex;
	_self['building-4-redshops'].body.zindex = bldgFaceZIndex;
	_self['building-3'].body.zindex = bldgFaceZIndex;
	_self['test-rooftop-1'].body.zindex = roofZIndex;
	_self['test-rooftop-2'].body.zindex = roofZIndex;
	_self['test-rooftop-3'].body.zindex = roofZIndex;
	_self['test-rooftop-4'].body.zindex = roofZIndex;
	_self['test-rooftop-5'].body.zindex = roofZIndex;
	_self['rooftop-1'].body.zindex = roofZIndex;
	_self['rooftop-3'].body.zindex = roofZIndex;
	_self['rooftop-4'].body.zindex = roofZIndex;
	_self['rooftop-6'].body.zindex = roofZIndex;
	_self['rooftop-1-pagoda'].body.zindex = roofZIndex;
	_self['rooftop-2-rentapod'].body.zindex = roofZIndex;
	_self['rooftop-3-tiled'].body.zindex = roofZIndex;
	_self['rooftop-4-redshops'].body.zindex = roofZIndex;
	_self['building-shadow'].body.zindex = shadowZIndex;

	/*
	_self['e-mover-tile'] = Utilities.clone(moverTile);
	_self['e-mover-tile'].body.parts.sensors[0].types = ['orienting', 'gravitating-y'];
	_self['e-mover-tile'].body.parts.sensors[0].sensorOptions = {direction: 'e', strength: 0.7};


	_self['e-mover-tile'] = Utilities.clone(moverTile);
	_self['e-mover-tile'].body.parts.sensors[0].types = ['orienting', 'gravitating-x'];
	_self['e-mover-tile'].body.parts.sensors[0].sensorOptions = {direction: 'n', strength: 0.5};
	*/

	return _self;
}(doodads);
