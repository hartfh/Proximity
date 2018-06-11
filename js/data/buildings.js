var buildings = {};

const _MAX_ELEV = 4;

/*
Add in a field for array of relative "solid" points to check for obstacles.
If no point is specified, defaults to base point.
	-Can be used for cantilevered structures.
	-E.g. have a 2x2 building that four solid points on a large offset
*/


buildings['placeholder-shanty-1'] = {
	name:		'placeholder-shanty-1',
	district:		false,
	minWidth:		1,
	maxWidth:		1,
	minHeight:	1,
	maxHeight:	1,
	obstacle:		true,
	offset:		{x: 0, y: -36},
};
buildings['placeholder-shanty-1-spaced'] = {
	name:		'placeholder-shanty-1',
	district:		false,
	minWidth:		2,
	maxWidth:		2,
	minHeight:	1,
	maxHeight:	1,
	obstacle:		true,
	offset:		{x: 0, y: -36},
};
buildings['placeholder-shanty-2'] = {
	name:		'placeholder-shanty-2',
	district:		false,
	minWidth:		1,
	maxWidth:		1,
	minHeight:	1,
	maxHeight:	1,
	obstacle:		true,
	offset:		{x: 0, y: -36},
};
buildings['placeholder-shanty-3'] = {
	name:		'placeholder-shanty-3',
	district:		false,
	minWidth:		1,
	maxWidth:		1,
	minHeight:	1,
	maxHeight:	1,
	obstacle:		true,
	offset:		{x: 0, y: -36},
};
buildings['placeholder-shanty-4'] = {
	name:		'placeholder-shanty-4',
	district:		false,
	minWidth:		1,
	maxWidth:		1,
	minHeight:	1,
	maxHeight:	1,
	obstacle:		true,
	offset:		{x: 0, y: -36},
};
// Purple set
buildings['building-set-1-purple-0'] = {
	name:		'building-set-1-purple-0',
	district:		false,
	minWidth:		3,
	maxWidth:		3,
	minHeight:	2,
	maxHeight:	2,
	obstacle:		true,
	offset:		{x: 72, y: 36},
};
buildings['building-set-1-purple-1'] = {
	name:		'building-set-1-purple-1',
	district:		false,
	minWidth:		2,
	maxWidth:		2,
	minHeight:	3,
	maxHeight:	3,
	obstacle:		true,
	offset:		{x: 36, y: 72},
};
buildings['building-set-1-purple-2'] = {
	name:		'building-set-1-purple-2',
	district:		false,
	minWidth:		3,
	maxWidth:		3,
	minHeight:	2,
	maxHeight:	2,
	obstacle:		true,
	offset:		{x: 72, y: 36},
};
buildings['building-set-1-purple-3'] = {
	name:		'building-set-1-purple-3',
	district:		false,
	minWidth:		3,
	maxWidth:		3,
	minHeight:	2,
	maxHeight:	2,
	obstacle:		true,
	offset:		{x: 72, y: 36},
};
buildings['building-set-1-purple-4'] = {
	name:		'building-set-1-purple-4',
	district:		false,
	minWidth:		2,
	maxWidth:		2,
	minHeight:	3,
	maxHeight:	3,
	obstacle:		true,
	offset:		{x: 36, y: 72},
};
buildings['building-set-1-purple-5'] = {
	name:		'building-set-1-purple-5',
	district:		false,
	minWidth:		5,
	maxWidth:		5,
	minHeight:	3,
	maxHeight:	3,
	obstacle:		true,
	offset:		{x: 108, y: 72},
};

/*
// News Stand (2x1)
buildings['news-stand-0'] = {
	district:		0,
	minWidth:		2,
	maxWidth:		2,
	minHeight:	1,
	maxHeight:	1,
	obstacle:		true,
	offset:		{x: 36, y: -36},
};
*/

/*
// Snack Mart (3x2)
buildings['snack-mart-0'] = {
	district:		0,
	minWidth:		3,
	maxWidth:		3,
	minHeight:	2,
	maxHeight:	2,
	obstacle:		true,
	offset:		{x: 72, y: -36},
};
*/

// cantilevered example

/*
buildings['cantilevered-test-1'] = {
	name:		'cantilevered-test-1',
	district:		0,
	minWidth:		2,
	maxWidth:		2,
	minHeight:	2,
	maxHeight:	2,
	obstacle:		true,
	solidPoints:	[{x: 0, y: 6}, {x: 0, y: 7}, {x: 1, y: 6}, {x: 1, y: 7}], // relative to basepoint (top-left)
	//offset:		{x: 0, y: 0},
};
*/

/*
// 1xN
buildings['building-2-rentapod'] = {
	name:		'building-2-rentapod',
	district:		false, // e.g. [0], [0, 1, 4], "false" implies no restrictions
	minWidth:		1,
	maxWidth:		1,
	minHeight:	2,
	maxHeight:	10,
	minElevation:	2,
	maxElevation:	3,
};
*/
// 2xN
buildings['building-1-pagoda'] = {
	name:		'building-1-pagoda',
	district:		false,
	minWidth:		2,
	maxWidth:		2,
	minHeight:	2,
	maxHeight:	10,
	minElevation:	2,
	maxElevation:	3,
};
// 3xN
/*
buildings['test-building-3'] = {
	district:		false,
	minWidth:		3,
	maxWidth:		10,
	minHeight:	1,
	maxHeight:	10,
	minElevation:	1,
	maxElevation:	5,
};
*/
/*
// Blue-Green office
buildings['building-3'] = {
	name:		'building-3',
	district:		false,
	minWidth:		3,
	maxWidth:		5,
	minHeight:	3,
	maxHeight:	5,
	minElevation:	3,
	maxElevation:	3,
};
*/

// Asian apartment block
buildings['building-3-tiled'] = {
	name:		'building-3-tiled',
	district:		false,
	minWidth:		3,
	maxWidth:		5,
	minHeight:	3,
	maxHeight:	3,
	minElevation:	3,
	maxElevation:	3,
};

buildings['building-4-redshops'] = {
	name:		'building-4-redshops',
	district:		false,
	minWidth:		3,
	maxWidth:		7,
	minHeight:	3,
	maxHeight:	3,
	minElevation:	2,
	maxElevation:	2,
};

// Nx1
/*
buildings['test-building-4'] = {
	district:		false,
	minWidth:		2,
	maxWidth:		10,
	minHeight:	1,
	maxHeight:	6,
	minElevation:	1,
	maxElevation:	1,
};
*/

module.exports = buildings;
