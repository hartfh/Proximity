var Game = Game || {};

Game.data = Game.data || {};

Game.data.bitmasks = {};

Game.data.bitmasks.friendly = {
	'vehicle':	{
		category:		0x008,
		mask:		0x0BD
	},
	'shot':		{
		category:		0x002,
		mask:		0x024
	},
	'turret':		{
		category:		0x100,
		mask:		0x035
	},
	'shield':		{
		category:		0x200,
		mask:		0x001
	}
};

Game.data.bitmasks.enemy = {
	'vehicle':	{
		category:		0x004,
		mask:		0x02E
	},
	'shot':		{
		category:		0x001,
		mask:		0x028
	},
	'turret':		{
		category:		0x080,
		mask:		0x02A
	},
	'shield':		{
		category:		0x400,
		mask:		0x002
	}
};

Game.data.bitmasks.neutral = {
	'doodad':		{
		category:		0x040,
		mask:		0x000
	},
	'effect':		{
		category:		0x040,
		mask:		0x000
	},
	'item':		{
		category:		0x010,
		mask:		0x038
	},
	'terrain':	{
		category:		0x020,
		mask:		0x03F
	}
};

/*
Game.data.bitmasks = {
	'player':	{
		category:	0x008,
		mask:	0x0BD
	},
	'enemy':	{
		category:	0x004,
		mask:	0x02E
	},
	'playershot':	{
		category:	0x002,
		mask:	0x024
	},
	'enemyshot':	{
		category:	0x001,
		mask:	0x028
	},
	'specialfx':	{
		category:	0x040,
		mask:	0x000
	},
	'item':		{
		category:	0x010,
		mask:	0x038
	},
	'terrain':	{
		category:	0x020,
		mask:	0x03F
	},
	'playergun':	{
		category:	0x100,
		mask:	0x035
	},
	'enemygun':	{
		category:	0x080,
		mask:	0x02A
	},
};
*/

// eshieldcat		10000000000		1024		0x400
// pshieldcat		01000000000		512		0x200
// pguncat		00100000000		256		0x100
// eguncat		00010000000		128		0x080
// specialfxcat	00001000000		64		0x040
// terraincat		00000100000		32		0x020
// itemcat		00000010000		16		0x010
// playercat		00000001000		8		0x008
// enemycat		00000000100		4		0x004
// pshotcat		00000000010		2		0x002
// eshotcat		00000000001		1		0x001

// eshieldmask		00000000010		2		0x002
// pshieldmask		00000000001		1		0x001
// pgunmask		00000110101		53		0x035
// egunmask		00000101010		42		0x02A
// specialfxmask	00000000000		0		0x000
// terrainmask		00000111111		63		0x03F
// itemmask		00000111000		56		0x038
// playermask		00010111101		189		0x0BD
// enemymask		00000101110		46		0x02E
// pshotmask		00000100100		36		0x024
// eshotmask		00000101000		40		0x028
