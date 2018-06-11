var Fonts		= require('./fonts');
var Tilepieces	= require('./tilepieces');
var Tilesets	= require('./tilesets');

var images = {
	'person-1-east-normal':			{
		sheet: 'person-1', x: 50, y: 40, w: 25, h: 40
	},
	'person-1-west-normal':			{
		sheet: 'person-1', x: 0, y: 40, w: 25, h: 40
	},
	'person-1-north-normal':			{
		sheet: 'person-1', x: 25, y: 0, w: 25, h: 40
	},
	'person-1-south-normal':			{
		sheet: 'person-1', x: 25, y: 80, w: 25, h: 40
	},
	'person-1-northwest-normal':		{
		sheet: 'person-1', x: 0, y: 0, w: 25, h: 40
	},
	'person-1-northeast-normal':		{
		sheet: 'person-1', x: 50, y: 0, w: 25, h: 40
	},
	'person-1-southwest-normal':			{
		sheet: 'person-1', x: 0, y: 80, w: 25, h: 40
	},
	'person-1-southeast-normal':			{
		sheet: 'person-1', x: 50, y: 80, w: 25, h: 40
	},
	'person-1-east-moving-1':			{
		sheet: 'person-1', x: 125, y: 40, w: 25, h: 40
	},
	'person-1-west-moving-1':			{
		sheet: 'person-1', x: 75, y: 40, w: 25, h: 40
	},
	'person-1-north-moving-1':			{
		sheet: 'person-1', x: 100, y: 0, w: 25, h: 40
	},
	'person-1-south-moving-1':			{
		sheet: 'person-1', x: 100, y: 80, w: 25, h: 40
	},
	'person-1-northwest-moving-1':		{
		sheet: 'person-1', x: 75, y: 0, w: 25, h: 40
	},
	'person-1-northeast-moving-1':		{
		sheet: 'person-1', x: 125, y: 0, w: 25, h: 40
	},
	'person-1-southwest-moving-1':			{
		sheet: 'person-1', x: 75, y: 80, w: 25, h: 40
	},
	'person-1-southeast-moving-1':			{
		sheet: 'person-1', x: 125, y: 80, w: 25, h: 40
	},
	'person-1-east-moving-2':			{
		sheet: 'person-1', x: 200, y: 40, w: 25, h: 40
	},
	'person-1-west-moving-2':			{
		sheet: 'person-1', x: 150, y: 40, w: 25, h: 40
	},
	'person-1-north-moving-2':			{
		sheet: 'person-1', x: 175, y: 0, w: 25, h: 40
	},
	'person-1-south-moving-2':			{
		sheet: 'person-1', x: 175, y: 80, w: 25, h: 40
	},
	'person-1-northwest-moving-2':		{
		sheet: 'person-1', x: 150, y: 0, w: 25, h: 40
	},
	'person-1-northeast-moving-2':		{
		sheet: 'person-1', x: 200, y: 0, w: 25, h: 40
	},
	'person-1-southwest-moving-2':			{
		sheet: 'person-1', x: 150, y: 80, w: 25, h: 40
	},
	'person-1-southeast-moving-2':			{
		sheet: 'person-1', x: 200, y: 80, w: 25, h: 40
	},
	'vendor-1-north-normal':			{
		sheet: 'vendor-1', x: 0, y: 0, w: 90, h: 50
	},
	'vendor-1-left-normal':			{
		sheet: 'vendor-1', x: 90, y: 0, w: 90, h: 50
	},
	'vendor-1-right-normal':			{
		sheet: 'vendor-1', x: 90, y: 0, w: 90, h: 50
	},
	'vendor-2-left-normal':			{
		sheet: 'vendor-2', x: 0, y: 0, w: 90, h: 50
	},
	'vendor-2-right-normal':			{
		sheet: 'vendor-2', x: 90, y: 0, w: 90, h: 50
	},
	'enemy-ship-2-left-normal':			{
		sheet: 'enemy-ship-2', x: 0, y: 0, w: 74, h: 40
	},
	'enemy-ship-2-right-normal':			{
		sheet: 'enemy-ship-2', x: 74, y: 0, w: 74, h: 40
	},
	'enemy-ship-2-left-damaged':			{
		sheet: 'enemy-ship-2', x: 0, y: 40, w: 74, h: 40
	},
	'enemy-ship-2-right-damaged':			{
		sheet: 'enemy-ship-2', x: 74, y: 40, w: 74, h: 40
	},
	'enemy-ship-3-left-normal':			{
		sheet: 'enemy-ship-3', x: 0, y: 0, w: 77, h: 40
	},
	'enemy-ship-3-right-normal':			{
		sheet: 'enemy-ship-3', x: 77, y: 0, w: 77, h: 40
	},
	'enemy-ship-3-left-damaged':			{
		sheet: 'enemy-ship-3', x: 0, y: 40, w: 77, h: 40
	},
	'enemy-ship-3-right-damaged':			{
		sheet: 'enemy-ship-3', x: 77, y: 40, w: 77, h: 40
	},
	'filler-inside-0-v0-f0':				{
		sheet: 'building-1', x: 1008, y: 144, w: 72, h: 72
	},
	'muzzle-flash-test-1':				{
		sheet: 'muzzle-flash-test', x: 0, y: 0, w: 20, h: 20
	},
	'muzzle-flash-test-2':				{
		sheet: 'muzzle-flash-test', x: 20, y: 0, w: 20, h: 20
	},
	'energy-small':					{
		sheet: 'powerups-a', x: 0, y: 0, w: 20, h: 20
	},
	'energy-medium':					{
		sheet: 'powerups-a', x: 20, y: 0, w: 20, h: 20
	},
	'energy-large':					{
		sheet: 'powerups-a', x: 40, y: 0, w: 20, h: 20
	},
	'kinetic-small':					{
		sheet: 'powerups-a', x: 60, y: 0, w: 20, h: 20
	},
	'kinetic-medium':					{
		sheet: 'powerups-a', x: 80, y: 0, w: 20, h: 20
	},
	'kinetic-large':					{
		sheet: 'powerups-a', x: 100, y: 0, w: 20, h: 20
	},
	'explosive-small':					{
		sheet: 'powerups-a', x: 120, y: 0, w: 20, h: 20
	},
	'explosive-medium':					{
		sheet: 'powerups-a', x: 140, y: 0, w: 20, h: 20
	},
	'explosive-large':					{
		sheet: 'powerups-a', x: 160, y: 0, w: 20, h: 20
	},
	'electronic-small':					{
		sheet: 'powerups-a', x: 180, y: 0, w: 20, h: 20
	},
	'electronic-medium':					{
		sheet: 'powerups-a', x: 200, y: 0, w: 20, h: 20
	},
	'electronic-large':					{
		sheet: 'powerups-a', x: 220, y: 0, w: 20, h: 20
	},
	'ammo-item-get-1':			{
		sheet: 'powerups-a', x: 0, y: 20, w: 20, h: 20
	},
	'ammo-item-get-2':			{
		sheet: 'powerups-a', x: 20, y: 20, w: 20, h: 20
	},
	'ammo-item-get-3':			{
		sheet: 'powerups-a', x: 40, y: 20, w: 20, h: 20
	},
	'ammo-item-get-4':			{
		sheet: 'powerups-a', x: 6, y: 20, w: 20, h: 20
	},
	'ammo-item-get-5':			{
		sheet: 'powerups-a', x: 80, y: 20, w: 20, h: 20
	},
	'ammo-item-get-6':			{
		sheet: 'powerups-a', x: 100, y: 20, w: 20, h: 20
	},
	'purple-wave-1':					{
		sheet: 'wave-test', x: 0, y: 0, w: 16, h: 80
	},
	'purple-wave-2':					{
		sheet: 'wave-test', x: 16, y: 0, w: 16, h: 80
	},
	'purple-wave-3':					{
		sheet: 'wave-test', x: 32, y: 0, w: 16, h: 80
	},
	'purple-wave-4':					{
		sheet: 'wave-test', x: 48, y: 0, w: 16, h: 80
	},
	'purple-wave-5':					{
		sheet: 'wave-test', x: 64, y: 0, w: 16, h: 80
	},
	'purple-wave-6':					{
		sheet: 'wave-test', x: 80, y: 0, w: 16, h: 80
	},
	'purple-wave-7':					{
		sheet: 'wave-test', x: 96, y: 0, w: 16, h: 80
	},
	'purple-wave-8':					{
		sheet: 'wave-test', x: 112, y: 0, w: 16, h: 80
	},
	'purple-wave-9':					{
		sheet: 'wave-test', x: 128, y: 0, w: 16, h: 80
	},
	'purple-wave-10':					{
		sheet: 'wave-test', x: 144, y: 0, w: 16, h: 80
	},
	'purple-wave-11':					{
		sheet: 'wave-test', x: 160, y: 0, w: 16, h: 80
	},
	'test-bg-purple-1':					{
		sheet: 'test-bg-purple-1', x: 0, y: 0, w: 20, h: 20
	},
	'health-small':					{
		sheet: 'health-pickups', x: 0, y: 0, w: 20, h: 20
	},
	'health-medium':					{
		sheet: 'health-pickups', x: 20, y: 0, w: 20, h: 20
	},
	'health-large':					{
		sheet: 'health-pickups', x: 40, y: 0, w: 20, h: 20
	},
	'health-disappear-1':					{
		sheet: 'health-pickups', x: 0, y: 20, w: 20, h: 20
	},
	'health-disappear-2':					{
		sheet: 'health-pickups', x: 20, y: 20, w: 20, h: 20
	},
	'health-disappear-3':					{
		sheet: 'health-pickups', x: 40, y: 20, w: 20, h: 20
	},
	'health-disappear-4':					{
		sheet: 'health-pickups', x: 60, y: 20, w: 20, h: 20
	},
	'health-disappear-5':					{
		sheet: 'health-pickups', x: 80, y: 20, w: 20, h: 20
	},
	'turret-one-normal':				{
		sheet: 'turret-one', x: 0, y: 0, w: 24, h: 16
	},
	'turret-one-attacking-1':				{
		sheet: 'turret-one', x: 0, y: 16, w: 24, h: 16
	},
	'turret-one-attacking-2':				{
		sheet: 'turret-one', x: 24, y: 16, w: 24, h: 16
	},
	'turret-one-attacking-3':				{
		sheet: 'turret-one', x: 48, y: 16, w: 24, h: 16
	},
	'turret-one-damaged':				{
		sheet: 'turret-one', x: 0, y: 32, w: 24, h: 16
	},
	'turret-one-attacking-damaged':				{
		sheet: 'turret-one', x: 0, y: 48, w: 24, h: 16
	},
	'enemy-ship-1-left':				{
		sheet: 'enemy-ship-1', x: 0, y: 0, w: 90, h: 50
	},
	'enemy-ship-1-right':				{
		sheet: 'enemy-ship-1', x: 90, y: 0, w: 90, h: 50
	},
	'enemy-ship-1-left-damage':			{
		sheet: 'enemy-ship-1', x: 0, y: 50, w: 90, h: 50
	},
	'enemy-ship-1-right-damage':			{
		sheet: 'enemy-ship-1', x: 90, y: 50, w: 90, h: 50
	},
	'enemy-turret-1-normal':			{
		sheet: 'enemy-turret-1', x: 0, y: 0, w: 50, h: 20
	},
	'enemy-turret-1-damaged':			{
		sheet: 'enemy-turret-1', x: 0, y: 20, w: 50, h: 20
	},
	'enemy-turret-1-attacking-1':		{
		sheet: 'enemy-turret-1', x: 0, y: 40, w: 50, h: 20
	},
	'enemy-turret-1-attacking-2':		{
		sheet: 'enemy-turret-1', x: 0, y: 60, w: 50, h: 20
	},
	'enemy-turret-1-attacking-damaged-1':		{
		sheet: 'enemy-turret-1', x: 0, y: 80, w: 50, h: 20
	},
	'enemy-turret-1-attacking-damaged-2':		{
		sheet: 'enemy-turret-1', x: 0, y: 100, w: 50, h: 20
	},
	'expl-large-1':	{
		sheet: 'expl-large', x: 0, y: 0, w: 80, h: 80
	},
	'expl-large-2':	{
		sheet: 'expl-large', x: 80, y: 0, w: 80, h: 80
	},
	'expl-large-3':	{
		sheet: 'expl-large', x: 160, y: 0, w: 80, h: 80
	},
	'expl-large-4':	{
		sheet: 'expl-large', x: 240, y: 0, w: 80, h: 80
	},
	'expl-large-5':	{
		sheet: 'expl-large', x: 320, y: 0, w: 80, h: 80
	},
	'expl-large-6':	{
		sheet: 'expl-large', x: 400, y: 0, w: 80, h: 80
	},
	'expl-large-7':	{
		sheet: 'expl-large', x: 480, y: 0, w: 80, h: 80
	},
	'expl-large-8':	{
		sheet: 'expl-large', x: 560, y: 0, w: 80, h: 80
	},
	/*
	'expl-large-empty':	{
		//sheet: 'expl-large', x: 0, y: 0, w: 0, h: 0
		sheet: 'expl-large', x: 560, y: 0, w: 80, h: 80
	},
	*/
	'expl1-1':	{
		sheet: 'expl1', x: 0, y: 0, w: 26, h: 26
	},
	'expl1-2':	{
		sheet: 'expl1', x: 26, y: 0, w: 26, h: 26
	},
	'expl1-3':	{
		sheet: 'expl1', x: 52, y: 0, w: 26, h: 26
	},
	'expl1-4':	{
		sheet: 'expl1', x: 78, y: 0, w: 26, h: 26
	},
	'expl1-5':	{
		sheet: 'expl1', x: 104, y: 0, w: 26, h: 26
	},
	'expl1-6':	{
		sheet: 'expl1', x: 130, y: 0, w: 26, h: 26
	},
	'expl1-7':	{
		sheet: 'expl1', x: 156, y: 0, w: 26, h: 26
	},
	'expl1-8':	{
		sheet: 'expl1', x: 182, y: 0, w: 26, h: 26
	},
	'expl1-9':	{
		sheet: 'expl1', x: 208, y: 0, w: 26, h: 26
	},
	'expl1-10':	{
		sheet: 'expl1', x: 234, y: 0, w: 26, h: 26
	},
	'expl1-11':	{
		sheet: 'expl1', x: 260, y: 0, w: 26, h: 26
	},
	'test-border-1':	{
		sheet: 'test-borders', x: 0, y: 0, w: 10, h: 10
	},
	'test-border-2':	{
		sheet: 'test-borders', x: 10, y: 0, w: 10, h: 10
	},
	'test-border-3':	{
		sheet: 'test-borders', x: 20, y: 0, w: 10, h: 10
	},
	'test-border-4':	{
		sheet: 'test-borders', x: 0, y: 10, w: 10, h: 10
	},
	'test-border-5':	{
		sheet: 'test-borders', x: 20, y: 10, w: 10, h: 10
	},
	'test-border-6':	{
		sheet: 'test-borders', x: 0, y: 20, w: 10, h: 10
	},
	'test-border-7':	{
		sheet: 'test-borders', x: 10, y: 20, w: 10, h: 10
	},
	'test-border-8':	{
		sheet: 'test-borders', x: 20, y: 20, w: 10, h: 10
	},
	'blue-tint':			{
		sheet: 'blue-tint', x: 0, y: 0, w: 480, h: 270
	}
};

images['empty'] = {
	sheet: 'empty', x: 1, y: 1, w: 1, h: 1
};

// Items (temp)
var itemSize = 22;
images['health-1'] = {
	sheet: 'common-item-placeholders', x: 0*itemSize, y: 0*itemSize, w: itemSize, h: itemSize,
};
images['health-2'] = {
	sheet: 'common-item-placeholders', x: 0*itemSize, y: 1*itemSize, w: itemSize, h: itemSize,
};
images['health-3'] = {
	sheet: 'common-item-placeholders', x: 0*itemSize, y: 2*itemSize, w: itemSize, h: itemSize,
};
images['health-4'] = {
	sheet: 'common-item-placeholders', x: 0*itemSize, y: 3*itemSize, w: itemSize, h: itemSize,
};
images['energy-1'] = {
	sheet: 'common-item-placeholders', x: 1*itemSize, y: 0*itemSize, w: itemSize, h: itemSize,
};
images['energy-2'] = {
	sheet: 'common-item-placeholders', x: 1*itemSize, y: 1*itemSize, w: itemSize, h: itemSize,
};
images['energy-3'] = {
	sheet: 'common-item-placeholders', x: 1*itemSize, y: 2*itemSize, w: itemSize, h: itemSize,
};
images['energy-4'] = {
	sheet: 'common-item-placeholders', x: 1*itemSize, y: 3*itemSize, w: itemSize, h: itemSize,
};
images['chemical-1'] = {
	sheet: 'common-item-placeholders', x: 2*itemSize, y: 0*itemSize, w: itemSize, h: itemSize,
};
images['chemical-2'] = {
	sheet: 'common-item-placeholders', x: 2*itemSize, y: 1*itemSize, w: itemSize, h: itemSize,
};
images['chemical-3'] = {
	sheet: 'common-item-placeholders', x: 2*itemSize, y: 2*itemSize, w: itemSize, h: itemSize,
};
images['chemical-4'] = {
	sheet: 'common-item-placeholders', x: 2*itemSize, y: 3*itemSize, w: itemSize, h: itemSize,
};
images['kinetic-1'] = {
	sheet: 'common-item-placeholders', x: 3*itemSize, y: 0*itemSize, w: itemSize, h: itemSize,
};
images['kinetic-2'] = {
	sheet: 'common-item-placeholders', x: 3*itemSize, y: 1*itemSize, w: itemSize, h: itemSize,
};
images['kinetic-3'] = {
	sheet: 'common-item-placeholders', x: 3*itemSize, y: 2*itemSize, w: itemSize, h: itemSize,
};
images['kinetic-4'] = {
	sheet: 'common-item-placeholders', x: 3*itemSize, y: 3*itemSize, w: itemSize, h: itemSize,
};
images['explosive-1'] = {
	sheet: 'common-item-placeholders', x: 4*itemSize, y: 0*itemSize, w: itemSize, h: itemSize,
};
images['explosive-2'] = {
	sheet: 'common-item-placeholders', x: 4*itemSize, y: 1*itemSize, w: itemSize, h: itemSize,
};
images['explosive-3'] = {
	sheet: 'common-item-placeholders', x: 4*itemSize, y: 2*itemSize, w: itemSize, h: itemSize,
};
images['explosive-4'] = {
	sheet: 'common-item-placeholders', x: 4*itemSize, y: 3*itemSize, w: itemSize, h: itemSize,
};
images['money-1'] = {
	sheet: 'common-item-placeholders', x: 5*itemSize, y: 0*itemSize, w: itemSize, h: itemSize,
};
images['money-2'] = {
	sheet: 'common-item-placeholders', x: 5*itemSize, y: 1*itemSize, w: itemSize, h: itemSize,
};
images['money-3'] = {
	sheet: 'common-item-placeholders', x: 5*itemSize, y: 2*itemSize, w: itemSize, h: itemSize,
};
images['money-4'] = {
	sheet: 'common-item-placeholders', x: 5*itemSize, y: 3*itemSize, w: itemSize, h: itemSize,
};

// Enemies temp
images['test-enemy-1'] = {
	sheet: 'test-enemy-1', x: 1, y: 1, w: 31, h: 55,
};
images['test-enemy-2'] = {
	sheet: 'test-enemy-2', x: 1, y: 1, w: 31, h: 55,
};
images['test-enemy-3'] = {
	sheet: 'test-enemy-3', x: 1, y: 1, w: 31, h: 55,
};
images['test-enemy-4'] = {
	sheet: 'test-enemy-4', x: 1, y: 1, w: 31, h: 55,
};
images['test-enemy-5'] = {
	sheet: 'test-enemy-5', x: 1, y: 1, w: 31, h: 55,
};
images['test-enemy-6'] = {
	sheet: 'test-enemy-6', x: 1, y: 1, w: 31, h: 55,
};

// Backgrounds
images['blue-background'] = {
	sheet: 'blue-background', x: 0, y: 0, w: 10, h: 10
};
images['orange-background'] = {
	sheet: 'orange-background', x: 0, y: 0, w: 10, h: 10
};
images['pink-background'] = {
	sheet: 'pink-background', x: 0, y: 0, w: 10, h: 10
};

// Destructibles
images['barrel-1-normal'] = {
	sheet: 'barrel-1', x: 0, y: 0, w: 26, h: 44,
};
images['barrel-1-damaged'] = {
	sheet: 'barrel-1', x: 0, y: 0, w: 26, h: 44,
};
images['boxes-1-normal'] = {
	sheet: 'boxes-1', x: 0, y: 0, w: 25, h: 39,
};
images['boxes-1-damaged'] = {
	sheet: 'boxes-1', x: 0, y: 0, w: 25, h: 39,
};
images['boxes-2-normal'] = {
	sheet: 'boxes-2', x: 0, y: 0, w: 35, h: 44,
};
images['boxes-2-damaged'] = {
	sheet: 'boxes-2', x: 0, y: 0, w: 35, h: 44,
};
images['boxes-3-normal'] = {
	sheet: 'boxes-3', x: 0, y: 0, w: 29, h: 48,
};
images['boxes-3-damaged'] = {
	sheet: 'boxes-3', x: 0, y: 0, w: 29, h: 48,
};
images['junk-1-normal'] = {
	sheet: 'junk-1', x: 0, y: 0, w: 44, h: 36,
};
images['junk-1-damaged'] = {
	sheet: 'junk-1', x: 0, y: 0, w: 44, h: 36,
};
images['cardboard-box-2-normal'] = {
	sheet: 'cardboard-box-2', x: 0, y: 0, w: 27, h: 35,
};
images['cardboard-box-2-damaged'] = {
	sheet: 'cardboard-box-2', x: 0, y: 0, w: 27, h: 35,
};
images['cardboard-box-3-normal'] = {
	sheet: 'cardboard-box-3', x: 0, y: 0, w: 32, h: 42,
};
images['cardboard-box-3-damaged'] = {
	sheet: 'cardboard-box-3', x: 0, y: 0, w: 32, h: 42,
};
images['cardboard-box-4-normal'] = {
	sheet: 'cardboard-box-4', x: 0, y: 0, w: 32, h: 37,
};
images['cardboard-box-4-damaged'] = {
	sheet: 'cardboard-box-4', x: 0, y: 0, w: 32, h: 37,
};
images['crate-1-normal'] = {
	sheet: 'crate-1', x: 0, y: 0, w: 42, h: 55,
};
images['crate-1-damaged'] = {
	sheet: 'crate-1', x: 0, y: 0, w: 42, h: 55,
};
images['crate-2-normal'] = {
	sheet: 'crate-2', x: 0, y: 0, w: 46, h: 56,
};
images['crate-2-damaged'] = {
	sheet: 'crate-2', x: 0, y: 0, w: 46, h: 56,
};
images['crate-3-normal'] = {
	sheet: 'crate-3', x: 0, y: 0, w: 35, h: 43,
};
images['crate-3-damaged'] = {
	sheet: 'crate-3', x: 0, y: 0, w: 35, h: 43,
};
images['tank-1-normal'] = {
	sheet: 'tank-1', x: 0, y: 0, w: 17, h: 39,
};
images['tank-1-damaged'] = {
	sheet: 'tank-1', x: 0, y: 0, w: 17, h: 39,
};
images['tank-2-normal'] = {
	sheet: 'tank-2', x: 0, y: 0, w: 17, h: 39,
};
images['tank-2-damaged'] = {
	sheet: 'tank-2', x: 0, y: 0, w: 17, h: 39,
};
images['trashcan-1-normal'] = {
	sheet: 'trashcan-1', x: 0, y: 0, w: 27, h: 40,
};
images['trashcan-1-damaged'] = {
	sheet: 'trashcan-1', x: 0, y: 0, w: 27, h: 40,
};


// Weather
images['rain-drop'] = {
	sheet: 'rain-drop', x: 1, y: 1, w: 13, h: 1
};
images['snow-flake'] = {
	sheet: 'snow-flake', x: 1, y: 1, w: 1, h: 1
};
images['haze-test-1'] = {
	sheet: 'haze-test-1', x: 0, y: 0, w: 322, h: 72
};


// Shadows
images['building-shadow-inside-0-v0-f0'] = {
	sheet: 'building-shadows', x: 0, y: 0, w: Constants.TERRAIN_TILE_SIZE, h: Constants.TERRAIN_TILE_SIZE
};
images['building-shadow-inside-1-v0-f0'] = {
	sheet: 'building-shadows', x: Constants.TERRAIN_TILE_SIZE*1, y: 0, w: Constants.TERRAIN_TILE_SIZE, h: Constants.TERRAIN_TILE_SIZE
};
images['building-shadow-inside-2-v0-f0'] = {
	sheet: 'building-shadows', x: Constants.TERRAIN_TILE_SIZE*2, y: 0, w: Constants.TERRAIN_TILE_SIZE, h: Constants.TERRAIN_TILE_SIZE
};
images['building-shadow-inside-3-v0-f0'] = {
	sheet: 'building-shadows', x: Constants.TERRAIN_TILE_SIZE*3, y: 0, w: Constants.TERRAIN_TILE_SIZE, h: Constants.TERRAIN_TILE_SIZE
};
images['building-shadow-inside-4-v0-f0'] = {
	sheet: 'building-shadows', x: Constants.TERRAIN_TILE_SIZE*4, y: 0, w: Constants.TERRAIN_TILE_SIZE, h: Constants.TERRAIN_TILE_SIZE
};
images['building-shadow-inside-5-v0-f0'] = {
	sheet: 'building-shadows', x: Constants.TERRAIN_TILE_SIZE*5, y: 0, w: Constants.TERRAIN_TILE_SIZE, h: Constants.TERRAIN_TILE_SIZE
};
images['building-shadow-inside-6-v0-f0'] = {
	sheet: 'building-shadows', x: Constants.TERRAIN_TILE_SIZE*6, y: 0, w: Constants.TERRAIN_TILE_SIZE, h: Constants.TERRAIN_TILE_SIZE
};
images['building-shadow-inside-7-v0-f0'] = {
	sheet: 'building-shadows', x: Constants.TERRAIN_TILE_SIZE*7, y: 0, w: Constants.TERRAIN_TILE_SIZE, h: Constants.TERRAIN_TILE_SIZE
};

images['guard-rail-horz-0'] = {
	sheet: 'guard-rails', x: 6, y: 4, w: 66, h: 52,
};
images['guard-rail-horz-1'] = {
	sheet: 'guard-rails', x: 72, y: 4, w: 72, h: 52,
};
images['guard-rail-horz-2'] = {
	sheet: 'guard-rails', x: 144, y: 4, w: 66, h: 52,
};
images['guard-rail-vert-0'] = {
	sheet: 'guard-rails', x: 13, y: 72, w: 46, h: 40,
};
images['guard-rail-vert-1'] = {
	sheet: 'guard-rails', x: 85, y: 72, w: 46, h: 72,
};
images['guard-rail-vert-2'] = {
	sheet: 'guard-rails', x: 157, y: 76, w: 46, h: 68,
};


// Standalone Buildings
images['building-blinds'] = {
	sheet: 'building-blinds', x: 1, y: 1, w: 132, h: 275,
};
images['building-blinds-shadow-1'] = {
	sheet: 'building-blinds', x: 133, y: 1, w: 13, h: 114,
};
images['building-blinds-shadow-2'] = {
	sheet: 'building-blinds', x: 1, y: 276, w: 121, h: 15,
};
images['building-junkspace'] = {
	sheet: 'building-junkspace', x: 1, y: 1, w: 134, h: 267,
};
images['building-junkspace-shadow-1'] = {
	sheet: 'building-junkspace', x: 136, y: 3, w: 14, h: 119,
};
images['building-junkspace-shadow-2'] = {
	sheet: 'building-junkspace', x: 2, y: 279, w: 139, h: 14,
};
images['building-placeholder-shanty-1'] = {
	sheet: 'placeholder-shanties', x: 0, y: 0, w: 72, h: 144,
};
images['building-placeholder-shanty-2'] = {
	sheet: 'placeholder-shanties', x: 72, y: 0, w: 72, h: 144,
};
images['building-placeholder-shanty-3'] = {
	sheet: 'placeholder-shanties', x: 144, y: 0, w: 72, h: 144,
};
images['building-placeholder-shanty-4'] = {
	sheet: 'placeholder-shanties', x: 216, y: 0, w: 72, h: 144,
};
images['building-set-1-purple-0'] = {
	sheet: 'building-set-1-purple', x: 71, y: 106, w: 215, h: 157,
};
images['building-set-1-purple-0-shadow'] = {
	sheet: 'building-set-1-purple', x: 80, y: 574, w: 217, h: 69,
};
images['building-set-1-purple-1'] = {
	sheet: 'building-set-1-purple', x: 294, y: 32, w: 136, h: 229,
};
images['building-set-1-purple-1-shadow'] = {
	sheet: 'building-set-1-purple', x: 301, y: 593, w: 140, h: 48,
};
images['building-set-1-purple-2'] = {
	sheet: 'building-set-1-purple', x: 433, y: 1, w: 210, h: 188,
};
images['building-set-1-purple-2-shadow'] = {
	sheet: 'building-set-1-purple', x: 442, y: 490, w: 212, h: 81,
};
images['building-set-1-purple-3'] = {
	sheet: 'building-set-1-purple', x: 1, y: 312, w: 214, h: 162,
};
images['building-set-1-purple-3-shadow'] = {
	sheet: 'building-set-1-purple', x: 13, y: 690, w: 213, h: 95,
};
images['building-set-1-purple-4'] = {
	sheet: 'building-set-1-purple', x: 290, y: 270, w: 141, h: 206,
};
images['building-set-1-purple-4-shadow'] = {
	sheet: 'building-set-1-purple', x: 300, y: 711, w: 132, h: 77,
};
images['building-set-1-purple-5'] = {
	sheet: 'building-set-1-purple', x: 441, y: 268, w: 280, h: 212,
};
images['building-set-1-purple-5-shadow'] = {
	sheet: 'building-set-1-purple', x: 449, y: 667, w: 283, h: 124,
};


images = require('./images/concrete-barricades')(images);
images = require('./images/streetlights')(images);

function tilesetToImages(tilesetName) {
	const TS = Constants.TERRAIN_TILE_SIZE;

	var y = 0;

	for(var type in Tilepieces) {
		var rotations = Tilepieces[type];

		for(var r = 0; r < rotations; r++) {
			var x = 1;

			if( Tilesets[tilesetName][type] ) {
				var typeSet = Tilesets[tilesetName][type];

				if( typeof( typeSet[r] ) == 'number' ) {
					// Variations with a single frame
					for(var v = 0, vLimit = typeSet[r]; v < vLimit; v++) {
						var imageName = `${tilesetName}-${type}-${r}-v${v}-f0`;

						images[imageName] = {
							sheet:	tilesetName,
							x:		x * TS,
							y:		y * TS,
							w:		TS,
							h:		TS
						};

						x++;
					}
				} else {
					// Variations with multiple frames
					for(var v in typeSet[r]) {
						var frameSet = typeSet[r][v]['frames'];

						for(var f = 0; f < frameSet; f++) {
							var imageName = `${tilesetName}-${type}-${r}-v${v}-f${f}`;

							images[imageName] = {
								sheet:	tilesetName,
								x:		x * TS,
								y:		y * TS,
								w:		TS,
								h:		TS
							};

							x++;
						}
					}
				}
			}

			y++;
		}
	}
}

// Wrapper for directionalToImages() with height/width predefined
function personToImages(imageSheet, imageSlug = false, numFrames = 1, xOffset = 0, yOffset = 0) {
	directionalToImages(imageSheet, 45, 63, imageSlug, numFrames);
}

function squareToImages(imageSheet, imageWidth = 0, imageHeight = 0, imageSlug = false, numFrames = 1, xOffset = 0, yOffset = 0, square = false) {
	directionalToImages(imageSheet, imageWidth, imageHeight, imageSlug, numFrames, xOffset, yOffset, true);
}

// For animated sprites with up to eight directions
function directionalToImages(imageSheet, imageWidth = 0, imageHeight = 0, imageSlug = false, numFrames = 1, xOffset = 0, yOffset = 0, square = false) {
	var directions	= ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'];
	var slug = imageSlug || imageSheet;

	if( square ) {
		directions = ['e', 'n', 'w', 's'];
	}

	for(var d in directions) {
		var direction = directions[d];

		for(var n = 0; n < numFrames; n++) {
			images[`${slug}-${direction}-${n}`] = {
				sheet:	imageSheet,
				x:		n * imageWidth + xOffset,
				y:		d * imageHeight + yOffset,
				w:		imageWidth,
				h:		imageHeight
			};
		}
	}
}

// For basic animated sprites with no directionality
function collectionToImages(imageSheet, imageWidth = 0, imageHeight = 0, imageSlug = false, numFrames = 1, xOffset = 0, yOffset = 0) {
	var slug = imageSlug || imageSheet;

	for(var n = 0; n < numFrames; n++) {
		images[`${slug}-${n}`] = {
			sheet:	imageSheet,
			x:		n * imageWidth + xOffset,
			y:		d * imageHeight + yOffset,
			w:		imageWidth,
			h:		imageHeight
		};
	}
}


personToImages('person-animation-test-3', 'person-0-normal', 3);
personToImages('person-animation-test-2', 'person-0-moving', 6);

personToImages('armored-trooper-1-normal', 'armored-trooper-1-normal');
personToImages('armored-trooper-1-attacking', 'armored-trooper-1-attacking');
personToImages('armored-trooper-1-moving', 'armored-trooper-1-moving', 6);

directionalToImages('weapon-chemical-1', 58, 19, 'weapon-chemical-1-normal', 1);
directionalToImages('weapon-chemical-2', 56, 21, 'weapon-chemical-2-normal', 1);

directionalToImages('weapon-energy-1', 66, 13, 'weapon-energy-1-normal', 1, 1, 1);
directionalToImages('weapon-energy-6', 66, 19, 'weapon-energy-6-normal', 1, 1, 1);
directionalToImages('weapon-energy-7', 58, 17, 'weapon-energy-7-normal', 1, 1, 1);
directionalToImages('weapon-energy-8', 58, 24, 'weapon-energy-8-normal', 1, 1, 1);

directionalToImages('weapon-explosive-1', 58, 19, 'weapon-explosive-1-normal', 1);
directionalToImages('weapon-explosive-2', 60, 23, 'weapon-explosive-2-normal', 1);
directionalToImages('weapon-explosive-6', 67, 23, 'weapon-explosive-6-normal', 1);

directionalToImages('weapon-kinetic-1', 60, 14, 'weapon-kinetic-1-normal', 1);
directionalToImages('weapon-kinetic-2', 68, 19, 'weapon-kinetic-2-normal', 1);
directionalToImages('weapon-kinetic-2', 68, 19, 'weapon-kinetic-2-attacking', 2);
directionalToImages('weapon-kinetic-2', 68, 19, 'weapon-kinetic-2-moving', 1);
directionalToImages('weapon-kinetic-4', 62, 16, 'weapon-kinetic-5-normal', 1);
directionalToImages('weapon-kinetic-5', 61, 23, 'weapon-kinetic-5-normal', 1);
directionalToImages('weapon-kinetic-7', 62, 19, 'weapon-kinetic-7-normal', 1);
directionalToImages('weapon-kinetic-9', 61, 15, 'weapon-kinetic-9-normal', 1);
directionalToImages('weapon-kinetic-10', 62, 18, 'weapon-kinetic-10-normal', 1);
directionalToImages('weapon-armored-trooper-1', 62, 16, 'weapon-armored-trooper-1-normal', 1, 1, 1);

// Vehicles
//squareToImages('vehicle-1', 105, 105, 'vehicle-1-normal'); // do three frames for normal. (will be no "active")
//squareToImages('vehicle-2', 105, 105, 'vehicle-2-normal');

// Parked Vehicles
squareToImages('vehicle-1', 105, 105, 'vehicle-1');
//squareToImages('vehicle-2', 105, 105, 'vehicle-2');


tilesetToImages('test-building-1');
tilesetToImages('test-building-2');
tilesetToImages('test-building-3');
tilesetToImages('test-building-4');
tilesetToImages('test-building-5');
tilesetToImages('test-rooftop-1');
tilesetToImages('test-rooftop-2');
tilesetToImages('test-rooftop-3');
tilesetToImages('test-rooftop-4');
tilesetToImages('test-rooftop-5');
tilesetToImages('building-1-pagoda');
tilesetToImages('rooftop-1-pagoda');
tilesetToImages('building-2-rentapod');
tilesetToImages('rooftop-2-rentapod');
tilesetToImages('building-3-tiled');
tilesetToImages('rooftop-3-tiled');
tilesetToImages('building-4-redshops');
tilesetToImages('rooftop-4-redshops');
tilesetToImages('building-1');
tilesetToImages('building-2');
tilesetToImages('building-3');
tilesetToImages('building-4');
tilesetToImages('building-6');
tilesetToImages('crosswalk');
tilesetToImages('rooftop-1');
tilesetToImages('rooftop-3');
tilesetToImages('rooftop-4');
tilesetToImages('rooftop-6');
tilesetToImages('sidewalk-0');
tilesetToImages('sidewalk-1');
tilesetToImages('sidewalk-2');
tilesetToImages('sidewalk-3');
tilesetToImages('sidewalk-4');
tilesetToImages('sidewalk-5');
tilesetToImages('sidewalk-6');
tilesetToImages('sidewalk-6');
tilesetToImages('street-markings');
tilesetToImages('street-markings-yield');
tilesetToImages('street-median');


function textToImages(dataSet, font) {
	for(var i in Constants.FONT_CHARACTERS) {
		var character = Constants.FONT_CHARACTERS[i];

		if( character == '.' ) {
			character = 'escaped_dot';
		}

		var xPosition = i % font.charsPerLine * font.width;
		var yPosition = Math.floor(i / font.charsPerLine) * font.height;

		dataSet[font.sheet + '-' + character] = {
			sheet:	font.sheet,
			x:		xPosition,
			y:		yPosition,
			w:		font.width,
			h:		font.height
		};
	}
}

for(var i in Fonts) {
	textToImages(images, Fonts[i]);
}


module.exports = images;
