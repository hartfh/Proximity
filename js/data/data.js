var Bitmasks		= require('./bitmasks');
var Sprites		= require('./sprites');

var Beams			= require('./beams');
var Buildings		= require('./buildings');
var Characters		= require('./actors/characters');
var Doodads		= require('./actors/doodads');
var EffectActors	= require('./actors/effects');
var Effects		= require('./effects');
var Fonts			= require('./fonts');
var Images		= require('./images');
var Items			= require('./actors/items');
var Layers		= require('./layers');
var Levels		= require('./levels');
var Menus			= require('./menus');
var ModifierItems	= require('./modifier-items');
var Music			= require('./music');
var Obstacles		= require('./actors/obstacles');
var RenderPatterns	= require('./render-patterns');
var Screens		= require('./screens');
var ShakePatterns	= require('./shake-patterns');
var Shots			= require('./actors/shots');
var SidewalkItems	= require('./sidewalk-items');
var Sounds		= require('./sounds');
var Sheets		= require('./image-sheets');
var Special		= require('./actors/special');
var Terrain		= require('./actors/terrain');
var Troupes		= require('./troupes');
var WeaponActors	= require('./actors/weapons');
var Weapons		= require('./weapons');
var Weather		= require('./actors/weather');
var ZIndices		= require('./z-indices');

var data = {
	actors:		{
		characters:	Characters,
		//destructibles
		doodads:		Doodads,
		effects:		EffectActors,
		obstacles:	Obstacles,
		items:		Items,
		shots:		Shots,
		special:		Special,
		terrain:		Terrain,
		weapons:		WeaponActors,
		weather:		Weather
	},
	beams:			Beams,
	bitmasks:			Bitmasks,
	buildings:		Buildings,
	effects:			Effects,
	fonts:			Fonts,
	images:			Images,
	layers:			Layers,
	levels:			Levels,
	menus:			Menus,
	modifierItems:		ModifierItems,
	music:			Music,
	renderPatterns:	RenderPatterns,
	screens:			Screens,
	sidewalkItems:		SidewalkItems,
	shakePatterns:		ShakePatterns,
	sheets:			Sheets,
	sounds:			Sounds,
	sprites:			Sprites,
	troupes:			Troupes,
	weapons:			Weapons,
	zindices:			ZIndices
};

module.exports = data;
