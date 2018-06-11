var sidewalkTemplate = {
	bend:	[1, 1, 1, 1],
	corner:	[1, 1, 1, 1],
	edge:	[1, 1, 1, 1],
	inside:	[1, 0, 0, 0],
};

module.exports = {
	// {frames: X, speed: Y, padding: Z}
	'building-1-pagoda':	{
		corner:	[1, 1, 1, 1],
		edge:	[0, 1, 0, 1],
	},
	'rooftop-1-pagoda':	{
		corner:	[1, 1, 1, 1],
		edge:	[0, 1, 0, 1],
	},
	'building-2-rentapod':	{
		end:		[1, 0, 1, 0],
		pipe:	[1, 0, 0, 0],
	},
	'rooftop-2-rentapod':	{
		end:		[1, 0, 1, 0],
		pipe:	[1, 0, 0, 0],
	},
	'building-3-tiled':	{
		corner:	[1, 1, 1, 1],
		edge:	[17, 1, 1, 1],
		inside:	[1, 0, 0, 0],
	},
	'rooftop-3-tiled':	{
		corner:	[1, 1, 1, 1],
		edge:	[1, 1, 1, 1],
		inside:	[1, 0, 0, 0],
	},
	'building-4-redshops':	{
		corner:	[3, [{frames: 1}, {frames: 2, speed: 35}, {frames: 1}], 1, 1],
		edge:	[18, 0, 3, 0],
	},
	'rooftop-4-redshops':	{
		corner:	[1, 1, 1, 1],
		edge:	[3, 1, 1, 1],
		inside:	[1, 0, 0, 0],
	},
	'test-building-1':	{
		end:		[1, 0, 1, 0],
		pipe:	[1, 0, 0, 0],
	},
	'test-building-2':	{
		corner:	[1, 1, 1, 1],
		edge:	[0, 1, 0, 1],
	},
	'test-building-3':	{
		corner:	[1, 1, 1, 1],
		edge:	[1, 1, 1, 1],
		inside:	[1, 0, 0, 0],
	},
	'test-building-4':	{
		end:		[0, 1, 0, 1],
		pipe:	[0, 1, 0, 0],
	},
	'test-building-5':	{
		end:		[1, 1, 0, 1],
		inside:	[1, 0, 0, 0],
	},
	'test-rooftop-1':	{
		end:		[1, 0, 1, 0],
		pipe:	[1, 0, 0, 0],
	},
	'test-rooftop-2':	{
		corner:	[1, 1, 1, 1],
		edge:	[0, 1, 0, 1],
	},
	'test-rooftop-3':	{
		corner:	[1, 1, 1, 1],
		edge:	[1, 1, 1, 1],
		inside:	[1, 0, 0, 0],
	},
	'test-rooftop-4':	{
		end:		[0, 1, 0, 1],
		pipe:	[0, 1, 0, 0],
	},
	'test-rooftop-5':	{
		bend:	[1, 1, 1, 1],
		corner:	[1, 1, 1, 1],
		edge:	[1, 1, 1, 1],
		end:		[1, 1, 1, 1],
		inside:	[1, 0, 0, 0],
		pipe:	[1, 1, 0, 0],
	},
	'building-1':	{
		bend:	[0, 0, 0, 0],
		corner:	[[{frames: 2, padding: 8, speed: 15}], 3, 1, 1],
		edge:	[[{frames: 1}, {frames: 1}, {frames: 3, speed: 20}, {frames: 1}], 1, 1, 1],
		end:		[1, 1, 1, 1], // unnecessary?
		inside:	[1, 1, 1, 1],
		island:	[1], // unnecessary?
		pipe:	[1, 1] // unnecessary?
	},
	'building-2':	{
		bend:	[1, 1, 1, 1],
		corner:	[1, 1, 1, 1],
		edge:	[1, 1, 1, 1],
		end:		[1, 1, 1, 1],
		inside:	[1, 1, 1, 1],
		island:	[1],
		pipe:	[1, 1],
	},
	'building-3':	{
		corner:	[1, 1, 1, 1],
		edge:	[2, 1, 1, 1],
		inside:	[1, 0, 0, 0],
	},
	'building-4':	{
		corner:	[6, 5, 0, 0],
		edge:	[7, 4, 0, 4],
		inside:	[[{frames: 1}, {frames: 1}, {frames: 1}, {frames: 1}, {frames: 1}, {frames: 3, speed: 18}], 0, 0, 0],
	},
	'building-6':	{
		corner:	[1, 2, 1, 1],
		edge:	[[{frames: 1}, {frames: 2}, {frames: 1}, {frames: 1}, {frames: 1}, {frames: 1}, {frames: 1}, {frames: 1}, {frames: 2}, {frames: 1}, {frames: 1}], 1, 0, 1],
		inside:	[[{frames: 1}, {frames: 1}, {frames: 1}, {frames: 1}, {frames: 1}, {frames: 1}, {frames: 4, speed: 15}], 0, 0, 0],
	},
	'crosswalk':	{
		end:		[1, 1, 1, 1],
		pipe:	[1, 1, 0, 0],
	},
	'sidewalk-0':	sidewalkTemplate,
	'sidewalk-1':	sidewalkTemplate,
	'sidewalk-2':	sidewalkTemplate,
	'sidewalk-3':	sidewalkTemplate,
	'sidewalk-4':	sidewalkTemplate,
	'sidewalk-5':	sidewalkTemplate,
	'sidewalk-6':	sidewalkTemplate,
	'rooftop-1':	{
		bend:	[1, 1, 1, 1],
		corner:	[1, 2, 2, 1],
		edge:	[1, 1, 1, 1],
		inside:	[3, 1, 1, 1],
	},
	'rooftop-3':	{
		bend:	[0, 0, 0, 0],
		corner:	[1, 1, 1, 1],
		edge:	[1, 1, 1, 1],
		inside:	[1, 0, 0, 0]
	},
	'rooftop-4':	{
		bend:	[1, 1, 1, 1],
		corner:	[3, 4, 2, 4],
		edge:	[7, 2, 3, 3],
		inside:	[8, 0, 0, 0],
	},
	'rooftop-6':	{
		bend:	[0, 0, 0, 0],
		corner:	[1, 1, 1, 1],
		edge:	[2, 1, 1, 1],
		inside:	[1, 0, 0, 0],
	},
	'filler':		{
		inside:	[1, 1, 1, 1],
	},
	'street-markings':	{
		bend:	[1, 1, 1, 1],
		corner:	[1, 1, 1, 1],
		edge:	[1, 1, 1, 1],
	},
	'street-markings-yield':	{
		edge:	[1, 1, 1, 1],
		edgetee:	[1, 1, 1, 1],
	},
	'street-median':	{
		elbow:	[1, 1, 1, 1],
		end:		[1, 1, 1, 1],
		pipe:	[1, 1],
	},
};
