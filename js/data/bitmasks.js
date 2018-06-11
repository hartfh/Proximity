module.exports = {
	friendly:		{
		'person':		{
			category:		0x0008,
			mask:		0x10BD,
		},
		'shield':		{
			category:		0x0200,
			mask:		0x0001,
		},
		'shot':		{
			category:		0x0002,
			mask:		0x0024,
		},
		'turret':		{
			category:		0x0100,
			mask:		0x0035,
		},
		'vehicle':	{
			category:		0x0008,
			mask:		0x10BD,
		},
	},
	enemy:		{
		'flyer':		{
			category:		0x0004,
			mask:		0x000E,
		},
		'person':		{
			category:		0x0004,
			mask:		0x102E,
		},
		'shield':		{
			category:		0x0400,
			mask:		0x0002,
		},
		'shot':		{
			category:		0x0001,
			mask:		0x0028,
		},
		'turret':		{
			category:		0x0080,
			mask:		0x002A,
		},
		'vehicle':	{
			category:		0x0004,
			mask:		0x102E,
		},
	},
	neutral:		{
		'detector':	{
			//category:	0x800,
			//mask:		0x7FF,
			category:		0x0800,
			mask:		0x0000,
		},
		'doodad':		{
			category:		0x0040,
			mask:		0x0000,
		},
		'effect':		{
			category:		0x0040,
			mask:		0x0000,
		},
		'groundcover':	{
			category:		0x1000,
			mask:		0x103C,
		},
		'item':		{
			category:		0x0010,
			mask:		0x1038,
		},
		'person':		{
			category:		0x0020,
			mask:		0x103F,
		},
		'terrain':	{
			category:		0x0020,
			mask:		0x103F,
		},
		'vehicle':	{
			category:		0x0020,
			mask:		0x103F,
		},
	},
};

// groundcovercat	1000000000000		4096		0x1000
// detectorcat		0100000000000		2048		0x0800
// eshieldcat		0010000000000		1024		0x0400
// pshieldcat		0001000000000		512		0x0200
// pguncat		0000100000000		256		0x0100
// eguncat		0000010000000		128		0x0080
// specialfxcat	0000001000000		64		0x0040
// terraincat		0000000100000		32		0x0020
// itemcat		0000000010000		16		0x0010
// playercat		0000000001000		8		0x0008
// enemycat		0000000000100		4		0x0004
// pshotcat		0000000000010		2		0x0002
// eshotcat		0000000000001		1		0x0001

// groundcovermask	1000000111100		60+4096	0x103C
// detectormask	0011111111111		2047		0x07FF
// eshieldmask		0000000000010		2		0x0002
// pshieldmask		0000000000001		1		0x0001
// pgunmask		0000000110101		53		0x0035
// egunmask		0000000101010		42		0x002A
// specialfxmask	0000000000000		0		0x0000
// terrainmask		1000000111111		63+4096	0x103F
// itemmask		1000000111000		56+4096	0x1038
// playermask		1000010111101		189+4096	0x10BD
// enemymask		1000000101110		46+4096	0x102E
// pshotmask		0000000100100		36		0x0024
// eshotmask		0000000101000		40		0x0028

// enemyflyermask	000000001110		14		0x000E
