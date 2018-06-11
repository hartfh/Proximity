var screens = {
	'battlefield':		{
		menus:		['cursor-tracker', 'pause', 'tint', 'fill', 'fps'],
		subs:		{
			'active':		{
				menus:	['player-move', 'player-shoot', 'player-weapon-chemical', 'player-weapon-energy', 'player-weapon-explosive', 'player-weapon-kinetic', 'player-health'], // 'player-minimap'
				subs:	{},
			},
			'dialogue':	{
				menus:	['player-move', 'player-shoot', 'player-dialogue'],
				subs:	{},
			},
			'loading':	{
				menus:	[],
				subs:	{},
			},
			'paused':		{
				menus:	['pause-city-map', 'pause-screen'],
				subs:	{},
			},
			'store':		{
				menus:	[],
				subs:	{}, // confirmation box to purchase
			},
		},
	},
	'mainmenu':		{
		menus:	['cursor-tracker', 'mainmenu-bg', 'mainmenu-credits'], // universal menu background/elements ("escape" for back or exit)
		subs:	{
			'ending':		{
				menus:	['ending-scrolling-text'], // exit trigger area, confirm exit
				subs:	{},
			},
			'loading':	{
				menus:	[],
				subs:	{},
			},
			'creation':	{
				menus:	[], // series of items that show each stage of generation
				subs:	{},
			},
			'newgame':	{
				menus:	['newgame-gender-mr', 'newgame-gender-mx', 'newgame-gender-ms'], // gender options, Create button, back button, any other creation options? difficulty
				subs:	{}, // create new game?
			},
			'saves':		{
				menus:	['save-slot-1', 'save-slot-2', 'save-slot-3', 'delete-save-slot-1', 'delete-save-slot-2', 'delete-save-slot-3'], // also possible include Delete buttons, Back button
				subs:	{
					'use-slot-confirm':	{
						menus:	['mainmenu-confirm', 'button-yes', 'button-no'],
						subs:	{},
					},
					'delete-slot-confirm':	{ // refresh menus after confirmation
						menus:	['mainmenu-confirm', 'button-yes', 'button-no'],
						subs:	{},
					},
				}
			},
			'settings':	{
				menus:	['settings-music-level', 'settings-effects-level', 'settings-back', 'settings-save'],
				subs:	{},
			},
			'title':		{ // logo and game choices (saves, settings, exit)
				menus:	['title-load-game', 'title-settings', 'title-exit-game'], // jumps to either /saves or /newgame
				subs:	{
					'exit':	{
						menus:	['mainmenu-confirm', 'button-yes', 'button-no'],
						subs:	{},
					},
					/*
					'exit':	{
						menus:	['title-confirm-exit', 'title-deny-exit'],
						subs:	{}
					}
					*/
				}
			}
		}
	}
};

module.exports = screens;
