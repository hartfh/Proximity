var menus = {};

menus['cursor-tracker'] = function() {
	var args = {
		position:		{x: 0, y: 0},
		width:		Constants.VPORT_WIDTH,
		height:		Constants.VPORT_HEIGHT,
		layer:		'cursor'
	};

	var created = Game.Interface.addUIBox('cursor-tracker', args);

	var displayArgs = {
		width:	Constants.VPORT_WIDTH,
		height:	Constants.VPORT_HEIGHT,
		keys:	['move'],
		//scroll:	true,
		config:	{}
	};

	created.box.addDisplay(displayArgs);

	Game.Interface.addUIBoxTrigger(created.box, 'move', function(event) {
		// Convert screen position into world position
		var position = {
			x:	(event.position.x || 0) + Game.State.viewport.corner.x,
			y:	(event.position.y || 0) + Game.State.viewport.corner.y
		};

		Game.Cursor.updatePosition(position);
	});

	return created;
};

menus['mainmenu-bg'] = function() {
	var args = {
		position:		{x: 0, y: 0},
		width:		Constants.VPORT_WIDTH,
		height:		Constants.VPORT_HEIGHT,
		layer:		'ui-general-1'
	};

	var created = Game.Interface.addUIBox('mainmenu-bg', args);

	var displayArgs = {
		width:	Constants.VPORT_WIDTH,
		height:	Constants.VPORT_HEIGHT,
		config:	{
			inside:	{
				color:	'#202020',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	['Title Screen'],
				font:	'thintel',
				offset:	{x: 0, y: 0}
			}
		}
	};

	created.box.addDisplay(displayArgs);

	return created;
};

menus['mainmenu-credits'] = function() {
	// copyright, title at bottom of screen
};

menus['mainmenu-confirm'] = function() {
	var args = {
		position:		{x: 0, y: 0},
		width:		Constants.VPORT_WIDTH,
		height:		Constants.VPORT_WIDTH,
		keys:		['left'],
		layer:		'ui-general-3'
	};

	var created = Game.Interface.addUIBox('mainmenu-confirm', args);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {});

	var displayArgs = {
		width:	250,
		height:	100,
		position:	{x: 20, y: 20},
		config:	{
			inside:	{
				color:	'#880000',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	['Confirmation'],
				font:	'thintel',
				offset:	{x: 0, y: 0}
			}
		}
	};

	created.box.addDisplay(displayArgs);

	return created;
};

function buttonYes(buttonArgs) {
	var buttonArgs = {
		text:		buttonArgs.text || '',
		position:		buttonArgs.position || {x: 0, y: 0},
		action:		buttonArgs.action || function(){}
	};
	var args = {
		position:		buttonArgs.position,
		width:		60,
		height:		25,
		keys:		['left'],
		layer:		'ui-general-4'
	};

	var created = Game.Interface.addUIBox('button-yes', args);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		console.log('clicked Yes');
		buttonArgs.action();
	});

	var displayArgs = {
		width:	60,
		height:	25,
		config:	{
			inside:	{
				color:	'#55cc22',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	[buttonArgs.text],
				font:	'thintel',
				offset:	{x: 0, y: 0}
			}
		}
	};

	created.box.addDisplay(displayArgs);

	return created;
}

function buttonNo(buttonArgs) {
	var buttonArgs = {
		text:		buttonArgs.text || '',
		position:		buttonArgs.position || {x: 0, y: 0},
		action:		buttonArgs.action || function(){}
	};
	var args = {
		position:		buttonArgs.position,
		width:		60,
		height:		25,
		keys:		['left'],
		layer:		'ui-general-4'
	};

	var created = Game.Interface.addUIBox('button-no', args);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		console.log('clicked No');
		buttonArgs.action();
	});

	var displayArgs = {
		width:	60,
		height:	25,
		config:	{
			inside:	{
				color:	'#cc4000',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	[buttonArgs.text],
				font:	'thintel',
				offset:	{x: 0, y: 0}
			}
		}
	};

	created.box.addDisplay(displayArgs);

	return created;
}

menus['button-yes'] = function(args) {
	return buttonYes(args);
};

menus['button-no'] = function(args) {
	return buttonNo(args);
};

menus['title-load-game'] = function() {
	var args = {
		position:		{x: 70, y: 140},
		width:		200,
		height:		20,
		keys:		['left', 'wheel'],
		layer:		'ui-general-2'
	};

	var created = Game.Interface.addUIBox('title-load-game', args);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		Game.Slots.getSummaries(function(summaries) {
			Game.route('mainmenu/saves', false, {
				'save-slot-1':			0,
				'save-slot-2':			1,
				'save-slot-3':			2,
				'delete-save-slot-1':	0,
				'delete-save-slot-2':	1,
				'delete-save-slot-3':	2,
			});
		});
	});

	var displayArgs = {
		width:	200,
		height:	20,
		config:	{
			inside:	{
				color:	'#500099',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	['New/Load Game', 'Lorem Ipsum Dolor 1', 'Lorem Ipsum Dolor 2', 'Lorem Ipsum Dolor 3', 'Lorem Ipsum Dolor 4', 'Lorem Ipsum Dolor 5', 'Lorem Ipsum Dolor 6'],
				font:	'thintel',
				offset:	{x: 0, y: 0},
				print:	'slow',
			}
		}
	};

	var display = created.box.addDisplay(displayArgs);

	Game.Interface.addUIBoxTrigger(created.box, 'wheel', function(event) {
		if( event.direction == 'up' ) {
			display.scrollText(5);
		}
		if( event.direction == 'down' ) {
			display.scrollText(-5);
		}
	});

	return created;
};

menus['title-settings'] = function() {
	var args = {
		position:		{x: 70, y: 170},
		width:		200,
		height:		20,
		keys:		['left'],
		layer:		'ui-general-2',
	};

	var created = Game.Interface.addUIBox('title-settings', args);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		console.log('Settings option');
	});

	var displayArgs = {
		width:	200,
		height:	20,
		config:	{
			inside:	{
				color:	'#996600',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	['Settings'],
				font:	'thintel',
				offset:	{x: 0, y: 0},
			},
		},
	};

	created.box.addDisplay(displayArgs);

	return created;
};

menus['title-exit-game'] = function() {
	var args = {
		position:		{x: 70, y: 200},
		width:		200,
		height:		20,
		keys:		['left', 'move'],
		layer:		'ui-general-2'
	};

	var created = Game.Interface.addUIBox('title-exit-game', args);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		Game.route('mainmenu/title/exit', false, {
			'button-yes':		{text: 'Yes', position: {x: 50, y: 120}, action: function(){ Game.exit(); } },
			'button-no':		{text: 'No', position: {x: 150, y: 120}, action: function(){ Game.route('mainmenu/title'); } }
		});
	});

	var displayArgs = {
		width:	200,
		height:	20,
		config:	{
			inside:	{
				color:	'#990011',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	['Exit Game'],
				font:	'thintel',
				offset:	{x: 0, y: 0}
			}
		},
		activeConfig:	{
			inside:	{
				color:	'#ff4011'
			},
			text:	{
				content:	['Exit Game'],
				font:	'thintel',
				offset:	{x: 0, y: 0}
			}
		}
	};

	var display = created.box.addDisplay(displayArgs);

	Game.Interface.addUIBoxTrigger(created.box, 'move', function(event) {
		display.setActivity(true);
	}, function(event) {
		display.setActivity(false);
	});

	return created;
};

function saveGameSlotMenu(slotIndex) {
	var slot = slotIndex + 1;
	var args = {
		position:		{x: 70, y: 50 + (60 * slotIndex)},
		width:		200,
		height:		50,
		keys:		['left'],
		layer:		'ui-general-2'
	};

	var created = Game.Interface.addUIBox('save-slot-' + slot, args);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		if( Game.State.summaries[slotIndex].gameStarted ) {
			Game.route('mainmenu/saves/use-slot-confirm', false, {
				//'mainmenu-confirm':		{text: 'Load this save slot?'},
				'button-yes':			{text: 'Yes', position: {x: 50, y: 120}, action: function(){ Game.Slots.load('00' + slot); console.log('Load up the saved game'); } },
				'button-no':			{text: 'No', position: {x: 150, y: 120}, action: function(){ Game.route('mainmenu/saves'); console.log('Dont load saved game'); } }
			});

			return;

			// TEMP:
			/*
			Game.TaskManager.createTask('load-map', {slotID: '001'}, function(response) {
				Game.Map.setMapConnection(true);

				Game.Profile.load(function() {
					Game.route('battlefield/active', true);
					Game.Player.create();

					var barricade = ActorFactory.create('neutral', ['obstacles', 'concrete-barricade-corner-2'], 0, -50);
					Game.World.add(barricade);

					var barricade = ActorFactory.create('neutral', ['obstacles', 'concrete-barricade-corner-3'], 100, -50);
					Game.World.add(barricade);

					var streetlight = ActorFactory.create('neutral', ['obstacles', 'streetlight-0'], -50, 0);
					Game.World.add(streetlight);

					var streetlight = ActorFactory.create('neutral', ['obstacles', 'streetlight-1'], -100, 90);
					Game.World.add(streetlight);

					// Down light
					var streetlight = ActorFactory.create('neutral', ['obstacles', 'streetlight-2'], -50, 200);
					Game.World.add(streetlight);

					// Up Light
					var streetlight = ActorFactory.create('neutral', ['obstacles', 'streetlight-3'], -100, 300);
					Game.World.add(streetlight);

				});
			});
			*/

		} else {
			console.log('Clicked on a New game slot');
			Game.route('mainmenu/saves/use-slot-confirm', false, {
				//'mainmenu-confirm':		{text: 'Load this save slot?'},
				'button-yes':			{text: 'Yes', position: {x: 50, y: 120}, action: function(){
						console.log('Create a new game map.');
						//Game.route('mainmenu/newgame');
						Game.Slots.load('00' + slot);
					}
				},
				'button-no':			{text: 'No', position: {x: 150, y: 120}, action: function(){ Game.route('mainmenu/saves'); console.log('Dont create game map'); } }
			});
		}
	});

	var displayArgs = {
		width:	200,
		height:	50,
		config:	{
			inside:	{
				color:	'#004444',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	['Save Slot ' + slot, 'Started: $1', 'Completed: $2'],
				font:	'thintel',
				offset:	{x: 0, y: 0},
				vars:	{
					'$1':	function() {
						return Game.State.summaries[slotIndex].gameStarted;
					},
					'$2':	function() {
						return Game.State.summaries[slotIndex].gameCompleted;
					}
				}
			}
		}
	};

	created.box.addDisplay(displayArgs);

	return created;
}

function saveSlotDelete(slotIndex) {
	var slot = slotIndex + 1;
	var args = {
		position:		{x: 270, y: 50 + (60 * slotIndex)},
		width:		20,
		height:		50,
		keys:		['left'],
		layer:		'ui-general-2'
	};

	var created = Game.Interface.addUIBox('delete-save-slot-' + slot, args);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		Game.route('mainmenu/saves/delete-slot-confirm', false, {
			//'mainmenu-confirm':		{text: 'Delete this save slot?'},
			'button-yes':			{text: 'Delete Slot', position: {x: 50, y: 120}, action: function(){
					Game.Slots.delete('00' + slot, function() {
						Game.Slots.getSummaries(function() {
							Game.route('mainmenu/saves', true, {
								'save-slot-1':			0,
								'save-slot-2':			1,
								'save-slot-3':			2,
								'delete-save-slot-1':	0,
								'delete-save-slot-2':	1,
								'delete-save-slot-3':	2
							});
						});
					});
				}
			},
			'button-no':			{text: 'Cancel', position: {x: 150, y: 120}, action: function(){ Game.route('mainmenu/saves'); console.log('Dont delete save slot'); } }
		});
	});

	var displayArgs = {
		width:	20,
		height:	50,
		config:	{
			inside:	{
				color:	'#bb4400',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	['X'],
				font:	'thintel',
				offset:	{x: 0, y: 0}
			}
		},
	};

	created.box.addDisplay(displayArgs);

	return created;
}

menus['save-slot-1'] = function(index) { return saveGameSlotMenu(index); }
menus['save-slot-2'] = function(index) { return saveGameSlotMenu(index); }
menus['save-slot-3'] = function(index) { return saveGameSlotMenu(index); }

menus['delete-save-slot-1'] = function(index) { return saveSlotDelete(index); }
menus['delete-save-slot-2'] = function(index) { return saveSlotDelete(index); }
menus['delete-save-slot-3'] = function(index) { return saveSlotDelete(index); }

function vendorStoreMenu(inventory) {

}

menus['test-store'] = function(inventory) {
	return vendorStoreMenu(inventory);
};

function dialogueMenu(dialogue) {

}

menus['player-dialogue'] = function(dialogue) {
	return dialogueMenu(dialogue);

	// consider splitting up into two boxes (left/right) for conversations
	// press button to advanced or close
};

menus['player-move'] = function() {
	var args = {
		position:		{x: 0, y: 0},
		width:		Constants.VPORT_WIDTH,
		height:		Constants.VPORT_HEIGHT,
		keys:		['right', 'a', 'd', 's', 'w'],
		scroll:		true,
		layer:		'battlefield-input'
	};

	var created = Game.Interface.addUIBox('player-move', args);
	var _playerDirectionSwitch = function(event, active = false) {
		var direction = false;

		switch(event) {
			case 'a':
				direction = 'w';
				break;
			case 'd':
				direction = 'e';
				break;
			case 's':
				direction = 's';
				break;
			case 'w':
				direction = 'n';
				break;
			default:
				break;
		}

		if( direction ) {
			Game.Player.setMoveDirection(direction, active);
			Game.Player.moveDirection();
		}

		Game.Player.setAimDirection(active);
	};

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		var position = Game.Viewport.getViewportCursorPosition(event.position);
		Game.Player.action('pathfind-to', position);
		Game.Player.setAimDirection(true, position);
	});
	Game.Interface.addUIBoxTrigger(created.box, 'drag', function(event) {
		var position = Game.Viewport.getViewportCursorPosition(event.position);
		Game.Player.action('pathfind-to', position);
		Game.Player.setAimDirection(true, position);
	});
	Game.Interface.addUIBoxTrigger(created.box, 'keydown', function(event) {
		_playerDirectionSwitch(event, true);
	});
	Game.Interface.addUIBoxTrigger(created.box, 'keyup', function(event) {
		_playerDirectionSwitch(event, false);
	});

	return created;
};

menus['player-shoot'] = function() {
	var args = {
		position:		{x: 0, y: 0},
		width:		Constants.VPORT_WIDTH,
		height:		Constants.VPORT_HEIGHT,
		keys:		['left'],
		layer:		'battlefield-input'
	};
	var created = Game.Interface.addUIBox('player-shoot', args);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		var position = Game.Viewport.getViewportCursorPosition(event.position);
		Game.Player.startFireWeapon(position);
	});
	Game.Interface.addUIBoxTrigger(created.box, 'drag', function(event) {
		var position = Game.Viewport.getViewportCursorPosition(event.position);
		Game.Player.startFireWeapon(position);
	});
	Game.Interface.addUIBoxTrigger(created.box, 'unclick', function() {
		Game.Player.stopFireWeapon();
	});

	return created;
};

menus['player-weapon-chemical'] = function() {
	var args = {
		position:		{x: 10, y: 32},
		width:		120,
		height:		20,
		keys:		['left', '2'],
		layer:		'battlefield-input-2',
	};
	var created = Game.Interface.addUIBox('player-weapon-chemical', args);

	var displayArgs = {
		width:	120,
		height:	20,
		config:	{
			inside:	{
				color:	'#666675',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	['Chemical: $1', '$2'],
				font:	'thintel',
				offset:	{x: 0, y: 0},
				vars:	{
					'$1':	function() {
						return Game.Profile.player.common.chemical.current + '/' + Game.Profile.player.common.chemical.max;
					},
					'$2':	function() {
						return Game.Profile.player.weapons.chemical;
					},
				},
			}
		},
	};
	created.box.addDisplay(displayArgs);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		Game.Player.setWeapon('chemical');
	});
	Game.Interface.addUIBoxTrigger(created.box, 'keydown', function(event) {
		Game.Player.setWeapon('chemical');
	});
};
menus['player-weapon-energy'] = function() {
	var args = {
		position:		{x: 10, y: 54},
		width:		120,
		height:		20,
		keys:		['left', '3'],
		layer:		'battlefield-input-2',
	};
	var created = Game.Interface.addUIBox('player-weapon-energy', args);

	var displayArgs = {
		width:	120,
		height:	20,
		config:	{
			inside:	{
				color:	'#666675',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	['Energy: $1', '$2'],
				font:	'thintel',
				offset:	{x: 0, y: 0},
				vars:	{
					'$1':	function() {
						return Game.Profile.player.common.energy.current + '/' + Game.Profile.player.common.energy.max;
					},
					'$2':	function() {
						return Game.Profile.player.weapons.energy;
					},
				},
			}
		},
	};
	created.box.addDisplay(displayArgs);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		Game.Player.setWeapon('energy');
	});
	Game.Interface.addUIBoxTrigger(created.box, 'keydown', function(event) {
		Game.Player.setWeapon('energy');
	});
};
menus['player-weapon-explosive'] = function() {
	var args = {
		position:		{x: 10, y: 76},
		width:		120,
		height:		20,
		keys:		['left', '4'],
		layer:		'battlefield-input-2',
	};
	var created = Game.Interface.addUIBox('player-weapon-explosive', args);

	var displayArgs = {
		width:	120,
		height:	20,
		config:	{
			inside:	{
				color:	'#666675',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	['Explosive: $1', '$2'],
				font:	'thintel',
				offset:	{x: 0, y: 0},
				vars:	{
					'$1':	function() {
						return Game.Profile.player.common.explosive.current + '/' + Game.Profile.player.common.explosive.max;
					},
					'$2':	function() {
						return Game.Profile.player.weapons.explosive;
					},
				},
			}
		},
	};
	created.box.addDisplay(displayArgs);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		Game.Player.setWeapon('explosive');
	});
	Game.Interface.addUIBoxTrigger(created.box, 'keydown', function(event) {
		Game.Player.setWeapon('explosive');
	});
};

// icon, name, ammo, modifiers (+2 damage, +1 ammo consumption)
menus['player-weapon-kinetic'] = function() {
	var args = {
		position:		{x: 10, y: 10},
		width:		120,
		height:		20,
		keys:		['left', '1'],
		layer:		'battlefield-input-2',
	};
	var created = Game.Interface.addUIBox('player-weapon-kinetic', args);

	var displayArgs = {
		width:	120,
		height:	20,
		config:	{
			inside:	{
				color:	'#666675',
				//image:	'test-bg-purple-1'
			},
			text:	{
				content:	['Kinetic: $1', '$2'],
				font:	'thintel',
				offset:	{x: 0, y: 0},
				vars:	{
					'$1':	function() {
						return Game.Profile.player.common.kinetic.current + '/' + Game.Profile.player.common.kinetic.max;
					},
					'$2':	function() {
						return Game.Profile.player.weapons.kinetic;
					},
				},
			}
		},
	};
	created.box.addDisplay(displayArgs);

	Game.Interface.addUIBoxTrigger(created.box, 'click', function(event) {
		Game.Player.setWeapon('kinetic');
	});
	Game.Interface.addUIBoxTrigger(created.box, 'keydown', function(event) {
		Game.Player.setWeapon('kinetic');
	});
};

menus['player-health'] = function() {
	// hotkeys for restorative items
	// vertical bar

	var args = {
		position:		{x: 10, y: 98},
		width:		120,
		height:		30,
		layer:		'battlefield-input-2',
	};
	var created = Game.Interface.addUIBox('player-health', args);

	var displayArgs = {
		width:	120,
		height:	50,
		config:	{
			inside:	{
				color:	'#a66655',
				//image:	'test-bg-purple-1',
			},
			text:	{
				content:	['Health: %1', 'Wallet: %2', 'X,Y: %3', 'XP: %4', 'Level: %5'],
				font:	'thintel',
				offset:	{x: 0, y: 0},
				vars:	{
					'%1':	function() {
						return Game.Profile.player.common.health.current + '/' + Game.Profile.player.common.health.max;
					},
					'%2':	function() {
						return '$' + Game.Profile.player.common.money.current + '/' + Game.Profile.player.common.money.max;
					},
					'%3':	function() {
						return Math.floor(Game.Profile.player.position.x) + ', ' + Math.floor(Game.Profile.player.position.y);
					},
					'%4':	function() {
						return Game.Profile.player.xp;
					},
					'%5':	function() {
						return Game.Profile.player.level;
					},
				},
			}
		},
	};
	created.box.addDisplay(displayArgs);

	return created;
};

menus['player-minimap'] = function() {
	var args = {
		position:		{x: 0, y: 0},
		width:		0,
		height:		0,
		layer:		'battlefield-input'
	};

	var created = Game.Interface.addUIBox('player-minimap', args);

	var displayArgs = {
		width:	0,
		height:	0,
		config:	{
			custom: function(ctx) {
				var filled = '#d06555';
				var player = '#55f599';
				var other = '#ff0000';
				var empty = '#909090';
				const SIZE = 3;

				var bounds = Game.MapGrid.getBounds(); // used to offset points
				var dimensions = Game.MapGrid.getVisibleDimensions();

				ctx.fillStyle = '#003399';
				ctx.fillRect(0, 0, dimensions.width * SIZE, dimensions.height * SIZE);

				Game.MapGrid.eachVisiblePoint(function(point, x, y) {
					if( point ) {
						ctx.fillStyle = '#909090';

						if( point.s == 'P' ) {
							ctx.fillStyle = player;
						} else if( point.s == 'E' || point.s == 'N' || point.s == 'F' ) {
							ctx.fillStyle = other;
						} else if( point.s ) {
							ctx.fillStyle = '#d06555';
						}
					} else {
						ctx.fillStyle = '#000000';
					}

					ctx.fillRect( (x - bounds.min.x) * SIZE, (y - bounds.min.y) * SIZE, SIZE, SIZE );
				});
			}
		}
	};

	created.box.addDisplay(displayArgs);

	return created;
};

/*
menus['player-stats'] = function() {
	var uiBoxArgs = {
		position:		{x: 10, y: 10},
		width:		130,
		height:		9,
		keys:		['left'],
		layer:		'battlefield-stats'
	};
	var createdBox = Game.Interface.addUIBox('playerLaserSelect', uiBoxArgs);
	Game.Interface.addUIBoxTrigger(createdBox.box, 'click', function() {
		log('Laser selected');

		Game.Player.setWeapon('energy');
	});
	Game.Interface.addUIBoxTrigger(createdBox.box, 'drag');
	var displayArgs = {
		width:	130,
		height:	9,
		config:	{
			inside:	{
				color:	'#33ccb5',
				opacity:	0.5
			},
			text:	{
				content:	['Energy     $1'],
				font:	'sad-machine-white',
				offset:	{x: 0, y: 0},
				padding:	{h: 3, v: 0},
				vars:	{
					'$1':	function() {
						var current	= String(Game.Profile.player.common.energy.current);
						var max		= String(Game.Profile.player.common.energy.max);
						var text		= Utilities.padStart(current, 4, '0') + '/' + Utilities.padStart(max, 4, '0');

						return text;
					}
				}
			}
		}
	};
	createdBox.box.addDisplay(displayArgs);

	var uiBoxArgs = {
		position:		{x: 10, y: 20},
		width:		130,
		height:		9,
		keys:		['left'],
		layer:		'battlefield-stats'
	};
	var createdBox = Game.Interface.addUIBox('playerSlugSelect', uiBoxArgs);
	Game.Interface.addUIBoxTrigger(createdBox.box, 'click', function() {
		log('Slug selected');
		Game.Player.setWeapon('kinetic');
	});
	Game.Interface.addUIBoxTrigger(createdBox.box, 'drag');
	var displayArgs = Utilities.clone(displayArgs);
	displayArgs.config.text.content = ['Kinetic    $1'];
	displayArgs.config.text.vars = {
		'$1':	function() {
			var current	= String(Game.Profile.player.common.kinetic.current);
			var max		= String(Game.Profile.player.common.kinetic.max);
			var text		= Utilities.padStart(current, 4, '0') + '/' + Utilities.padStart(max, 4, '0');

			return text;
		}
	};
	createdBox.box.addDisplay(displayArgs);


	var uiBoxArgs = {
		position:		{x: 10, y: 30},
		width:		130,
		height:		9,
		keys:		['left'],
		layer:		'battlefield-stats'
	};
	var createdBox = Game.Interface.addUIBox('playerMissileSelect', uiBoxArgs);
	Game.Interface.addUIBoxTrigger(createdBox.box, 'click', function() {
		log('Missile selected');
		Game.Player.setWeapon('explosive');
	});
	Game.Interface.addUIBoxTrigger(createdBox.box, 'drag');
	var displayArgs = Utilities.clone(displayArgs);
	displayArgs.config.text.content = ['Explosive  $1'];
	displayArgs.config.text.vars = {
		'$1':	function() {
			var current	= String(Game.Profile.player.common.explosive.current);
			var max		= String(Game.Profile.player.common.explosive.max);
			var text		= Utilities.padStart(current, 4, '0') + '/' + Utilities.padStart(max, 4, '0');

			return text;
		}
	};
	createdBox.box.addDisplay(displayArgs);

	Game.Interface.addUIBoxTrigger(created.box, 'keydown', function() {
		//Game.ColorTint.shift({color: '#55ff00', opacity: 0.0});
		//Game.ColorTint.flash({color: '#55ff00', original: '#002244', speed: 200, opacity: 1.0, duration: 1500});
		//Game.ColorFill.flash({color: '#55ff00', original: '#002244', speed: 200, opacity: 1.0, duration: 700});
	});
};
*/

menus['fps'] = function() {
	var args = {
		position:		{x: 390, y: 20},
		width:		90,
		height:		50,
		layer:		'fps'
	};

	Game.Events.subscribe('afterRender', function() {
		Game.State.fps++;
	}, 'tick-fps');

	setInterval(function() {
		Game.State.actualFPS = Game.State.fps;
		Game.State.fps = 0;
	}, 1000);

	var created = Game.Interface.addUIBox('fps', args);

	var displayArgs = {
		width:	90,
		height:	50,
		config:	{
			inside:	{
				color: '#202020'
			},
			text:	{
				content:	[
					'fps: $1',
					'Bodies: $2',
					'Actors: $3'
				],
				font:	'thintel',
				offset:	{x: 0, y: 0},
				vars:	{
					'$1':	function() {
						return Game.State.actualFPS
					},
					'$2':	function() {
						return Matter.Composite.allBodies(Game.Engine.engine.world).length;
					},
					'$3':	function() {
						return ActorFactory.countActors();
					}
				}
			}
		}
	};

	created.box.addDisplay(displayArgs);

	return created;
};

menus['tint'] = function() {
	var args = {
		position:		{x: 0, y: 0},
		width:		Constants.VPORT_WIDTH,
		height:		Constants.VPORT_HEIGHT,
		layer:		'tint'
	};

	var created = Game.Interface.addUIBox('tint', args);

	var displayArgs = {
		width:	Constants.VPORT_WIDTH,
		height:	Constants.VPORT_HEIGHT,
		config:	{
			inside:	{
				color:	'$color',
				mode:	'$mode',
				opacity:	'$opacity',
				vars:	{
					'$color':		function() {
						return Game.State.color.tint.color;
					},
					'$mode':		function() {
						return Game.State.color.tint.mode;
					},
					'$opacity':	function() {
						return Game.State.color.tint.opacity;
					}
				}
			}
		}
	};

	created.box.addDisplay(displayArgs);

	return created;
};

menus['fill'] = function() {
	var args = {
		position:		{x: 0, y: 0},
		width:		Constants.VPORT_WIDTH,
		height:		Constants.VPORT_HEIGHT,
		layer:		'fill'
	};

	var created = Game.Interface.addUIBox('fill', args);

	var displayArgs = {
		width:	Constants.VPORT_WIDTH,
		height:	Constants.VPORT_HEIGHT,
		config:	{
			inside:	{
				color:	'$color',
				mode:	'$mode',
				opacity:	'$opacity',
				vars:	{
					'$color':		function() {
						return Game.State.color.fill.color;
					},
					'$mode':		function() {
						return Game.State.color.fill.mode;
					},
					'$opacity':	function() {
						return Game.State.color.fill.opacity;
					}
				}
			}
		}
	};

	created.box.addDisplay(displayArgs);

	return created;
};

menus['pause'] = function() {
	var args = {
		position:		{x: 0, y: 0},
		width:		Constants.VPORT_WIDTH,
		height:		Constants.VPORT_HEIGHT,
		keys:		[' ', 'Escape'],
		layer:		'battlefield-input'
	};

	var created = Game.Interface.addUIBox('pause', args);

	Game.Interface.addUIBoxTrigger(created.box, 'keydown', function(key) {
		// Add split between Escape to pause and Space to unpause

		if( Game.pause(true) ) {
			console.log('Paused');
		} else {
			console.log('Resumed');
		}
	});

	return created;
};

menus['pause-city-map'] = function() {
	var args = {
		position:		{x: 40, y: 40},
		width:		0,
		height:		0,
		layer:		'pause-2'
	};

	var created = Game.Interface.addUIBox('pause-city-map', args);

	var displayArgs = {
		width:	0,
		height:	0,
		config:	{
			custom: function(ctx) {
				var filled = '#005599';
				var player = '#359599';
				var other = '#ff0000';
				var empty = '#909090';
				var SIZE = 1;

				Game.MapGrid.eachPoint(function(point, x, y) {
					if( point ) {
						ctx.fillStyle = filled;

						if( point.s == 'P' ) {
							ctx.fillStyle = player;
						}
						if( point.s == 'E' || point.s == 'N' ) {
							ctx.fillStyle = other;
						}
						ctx.fillRect( (x * SIZE) + 20, (y * SIZE) + 20, SIZE, SIZE );
					}
				});
			}
		}
	};

	created.box.addDisplay(displayArgs);

	return created;
};

menus['pause-screen'] = function() {
	var args = {
		position:		{x: 10, y: 10},
		width:		Constants.VPORT_WIDTH - 20,
		height:		Constants.VPORT_HEIGHT - 20,
		keys:		[],
		layer:		'pause'
	};

	var created = Game.Interface.addUIBox('pause-screen', args);

	var displayArgs = {
		width:	Constants.VPORT_WIDTH - 20,
		height:	Constants.VPORT_HEIGHT - 20,
		config:	{
			inside:	{
				color:	'#805500',
				opacity:	0.7
			},
			text:	{
				content:	['-Pause Screen-'],
				font:	'sad-machine-white',
				offset:	{x: 0, y: 0},
				padding:	{h: 10, v: 0},
			}
		}
	};

	created.box.addDisplay(displayArgs);

	return created;
};


module.exports = menus;
