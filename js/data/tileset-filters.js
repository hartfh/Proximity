module.exports = {
	// bend, corner, cross, edge, edgetee, eight, elbow, end, inside, island, kayleft, kayright, pipe, tee, wye
	'horizontal3':	{
		default:		{type: 'pipe', rotations: 1},
		rules:		{
			corner:		[{type: 'end', rotations: 3}, {type: 'end', rotations: 1}, {type: 'end', rotations: 1}, {type: 'end', rotations: 3}],
			edge:		[{type: 'pipe', rotations: 1}, {type: 'end', rotations: 1}, {type: 'pipe', rotations: 1}, {type: 'end', rotations: 3}],
			elbow:		[{type: 'end', rotations: 3}, {type: 'end', rotations: 1}, {type: 'end', rotations: 1}, {type: 'end', rotations: 3}],
			end:			[{type: 'pipe', rotations: 1}, {type: 'end', rotations: 1}, {type: 'pipe', rotations: 1}, {type: 'end', rotations: 3}],
			tee:			[{type: 'pipe', rotations: 1}, {type: 'end', rotations: 1}, {type: 'pipe', rotations: 1}, {type: 'end', rotations: 3}],
		},
		whitelist:	[]
	},
	'vertical3':	{
		default:		{type: 'pipe', rotations: 0},
		rules:		{
			corner:		[{type: 'end', rotations: 0}, {type: 'end', rotations: 0}, {type: 'end', rotations: 2}, {type: 'end', rotations: 2}],
			edge:		[{type: 'end', rotations: 0}, {type: 'pipe', rotations: 0}, {type: 'end', rotations: 2}, {type: 'pipe', rotations: 0}],
			elbow:		[{type: 'end', rotations: 0}, {type: 'end', rotations: 0}, {type: 'end', rotations: 2}, {type: 'end', rotations: 2}],
			end:			[{type: 'end', rotations: 0}, {type: 'pipe', rotations: 0}, {type: 'end', rotations: 2}, {type: 'pipe', rotations: 0}],
			tee:			[{type: 'end', rotations: 0}, {type: 'pipe', rotations: 0}, {type: 'end', rotations: 2}, {type: 'pipe', rotations: 0}],
		},
		whitelist:	[]
	},
	'simple9':	{
		default:		{type: 'inside', rotations: 0},
		rules:		{
			elbow:		[{type: 'corner', rotations: 0}, {type: 'corner', rotations: 1}, {type: 'corner', rotations: 2}, {type: 'corner', rotations: 3}],
			kayleft:		[{type: 'edge', rotations: 0}, {type: 'edge', rotations: 1}, {type: 'edge', rotations: 2}, {type: 'edge', rotations: 3}],
			kayright:		[{type: 'edge', rotations: 0}, {type: 'edge', rotations: 1}, {type: 'edge', rotations: 2}, {type: 'edge', rotations: 3}],
		},
		whitelist:	['corner', 'edge', 'inside'],
	},
	'simple13':			{
		default:		{type: 'inside', rotations: 0},
		rules:		{
			elbow:		[{type: 'corner', rotations: 0}, {type: 'corner', rotations: 1}, {type: 'corner', rotations: 2}, {type: 'corner', rotations: 3}],
			kayleft:		[{type: 'edge', rotations: 0}, {type: 'edge', rotations: 1}, {type: 'edge', rotations: 2}, {type: 'edge', rotations: 3}],
			kayright:		[{type: 'edge', rotations: 0}, {type: 'edge', rotations: 1}, {type: 'edge', rotations: 2}, {type: 'edge', rotations: 3}],
		},
		whitelist:	['bend', 'corner', 'edge', 'inside']
	},
	'reduced15':	{
		default:		{type: 'inside', rotations: 0},
		rules:		{
			elbow:		[{type: 'corner', rotations: 0}, {type: 'corner', rotations: 1}, {type: 'corner', rotations: 2}, {type: 'corner', rotations: 3}],
			kayleft:		[{type: 'edge', rotations: 0}, {type: 'edge', rotations: 1}, {type: 'edge', rotations: 2}, {type: 'edge', rotations: 3}],
			kayright:		[{type: 'edge', rotations: 0}, {type: 'edge', rotations: 1}, {type: 'edge', rotations: 2}, {type: 'edge', rotations: 3}],
			tee:			[{type: 'edge', rotations: 0}, {type: 'edge', rotations: 1}, {type: 'edge', rotations: 2}, {type: 'edge', rotations: 3}],
		},
		whitelist:	['corner', 'edge', 'end', 'inside', 'pipe']
	},
	'linear6':	{
		default:		{type: 'pipe', rotations: 1},
		rules:		{
			corner:		[{type: 'end', rotations: 3}, {type: 'end', rotations: 1}, {type: 'end', rotations: 3}, {type: 'end', rotations: 1}],
		},
		whitelist:	['pipe', 'end'],
	},
	'streets-1':			{
		default:		{type: 'inside', rotations: 0},
		rules:		{},
		whitelist:	['corner', 'edge', 'elbow', 'end', 'inside', 'pipe'],
	},
	'one-floor-building':	{
		default:		{type: 'inside', rotations: 0},
		rules:		{
			//end:			[{type: 'end', rotations: 0}, {type: 'end', rotations: 1}, {type: 'inside', rotations: 0}, {type: 'end', rotations: 3}],
		},
		whitelist:	['end', 'inside'],
	},
	'one-floor-roof':	{
		default:		{type: 'inside', rotations: 0},
		rules:		{},
		whitelist:	['bend', 'corner', 'edge', 'end', 'pipe', 'inside'],
	},
	'barricades':	{
		default:		{type: 'pipe', rotations: 0},
		rules:		{
			corner:	[{type: 'elbow', rotations: 0}, {type: 'elbow', rotations: 1}, {type: 'elbow', rotations: 2}, {type: 'elbow', rotations: 3}],
			edge:	[{type: 'pipe', rotations: 1}, {type: 'pipe', rotations: 0}, {type: 'pipe', rotations: 1}, {type: 'pipe', rotations: 0}],
			end:		[{type: 'pipe', rotations: 0}, {type: 'pipe', rotations: 1}, {type: 'pipe', rotations: 0}, {type: 'pipe', rotations: 1}],
		},
		whitelist:	['elbow', 'pipe'],
	},
	'linear18':	{
		default:		{type: 'cross', rotations: 0},
		rules:		{
			bend:		[{type: 'elbow', rotations: 2}, {type: 'elbow', rotations: 3}, {type: 'elbow', rotations: 0}, {type: 'elbow', rotations: 1}],
			corner:		[{type: 'elbow', rotations: 0}, {type: 'elbow', rotations: 1}, {type: 'elbow', rotations: 2},{type: 'elbow', rotations: 3}],
			edge:		[{type: 'pipe', rotations: 1}, {type: 'pipe', rotations: 0}, {type: 'pipe', rotations: 1}, {type: 'pipe', rotations: 0}],
			edgetee:		[{type: 'tee', rotations: 2}, {type: 'tee', rotations: 3}, {type: 'tee', rotations: 0}, {type: 'tee', rotations: 1}],
			kayleft:		[{type: 'tee', rotations: 0}, {type: 'tee', rotations: 1}, {type: 'tee', rotations: 2}, {type: 'tee', rotations: 3}],
			kayright:		[{type: 'tee', rotations: 0}, {type: 'tee', rotations: 1}, {type: 'tee', rotations: 2}, {type: 'tee', rotations: 3}],
		},
		whitelist:	['elbow', 'end', 'cross', 'inside', 'pipe', 'tee'],
	}
};
