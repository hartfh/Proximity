module.exports = {
	FONT_CHARACTERS:		[
		' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4',
		'5', '6', '7', '8', '9',	':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
		'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^',
		'_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
		't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}'
	],
	COMMON_ITEM_TYPES:		['health', 'energy', 'explosive', 'kinetic', 'chemical', 'money'], // Add 'money'?. Other currency type things 'parts'?
	WEAPON_TYPES:			['energy', 'explosive', 'kinetic', 'chemical'],
	SPRITE_FACINGS:		['e', 'w', 's', 'n', 'se', 'sw', 'ne', 'nw'],
	MAP_TILE_HEIGHT:		99,
	MAP_TILE_WIDTH:		99,
	//MAP_BLOCK_WIDTH:		30, // 28 + buffers
	//MAP_BLOCK_HEIGHT:		20, // 18 + buffers
	MAP_BLOCK_WIDTH:		18,
	MAP_BLOCK_HEIGHT:		12,
	//MAP_BLOCK_SIZE:		12, // one city block (# of tiles in width/height)
	MAP_BLOCK_SIZE:		24, // 22
	MAP_BUFFER_NORTH:		0,
	MAP_BUFFER_EAST:		0,
	MAP_BUFFER_SOUTH:		0,
	MAP_BUFFER_WEST:		0,
	MAP_REGION_HEIGHT:		3,
	MAP_REGION_WIDTH:		3,
	AREA_TILE_SIZE_X:		8,
	AREA_TILE_SIZE_Y:		6,
	TERRAIN_TILE_SIZE:		72,
	VPORT_WIDTH:			480,
	VPORT_HEIGHT:			270,
	VPORT_X_BUFFER:		190,
	VPORT_Y_BUFFER:		105,
	PARALLAX_1:			0.25,
	ASSETS_DIR:			__dirname + '/../assets/',
	SOUND_DIR:			__dirname + '/../assets/sound/',
	FONTS_DIR:			__dirname + '/../assets/fonts/',
	IMG_DIR:				__dirname + '/../assets/img/',
	JS_DIR:				__dirname + '/../js/',
	DB_DIR:				__dirname + '/../database/',
	ROOT_DIR:				__dirname + '/..'
};
