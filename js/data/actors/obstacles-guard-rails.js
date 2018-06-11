module.exports = function(group) {
     group['guard-rail-horz-0'] = {
          actor:		{
               inert:			true,
               indestructible:	true,
               type:			'groundcover',
          },
          body:		{
               parts:	{
                    structures:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-solid',
                              width:	66,
                              height:	37,
                              y:        7,
                              types:	[],
                              options:	{},
                         },
                    ],
                    sensors:		[],
                    ornaments:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-visual',
                              width:	66,
                              height:	52,
                              types:	[],
                              sprite:	'guard-rail-horz-0',
                              options:	{},
                         },
                    ],
               },
               options:	{
                    isStatic:		true,
               },
               zindex:	'doodad-fg-2',
               custom:	{noActor: true},
          }
     };

     group['guard-rail-horz-1'] = {
          actor:		{
               inert:			true,
               indestructible:	true,
               type:			'groundcover',
          },
          body:		{
               parts:	{
                    structures:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-solid',
                              width:	72,
                              height:	37,
                              y:        7,
                              types:	[],
                              options:	{},
                         },
                    ],
                    sensors:		[],
                    ornaments:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-visual',
                              width:	72,
                              height:	52,
                              types:	[],
                              sprite:	'guard-rail-horz-1',
                              options:	{},
                         },
                    ],
               },
               options:	{
                    isStatic:		true,
               },
               zindex:	'doodad-fg-2',
               custom:	{noActor: true},
          }
     };

     group['guard-rail-horz-2'] = {
          actor:		{
               inert:			true,
               indestructible:	true,
               type:			'groundcover',
          },
          body:		{
               parts:	{
                    structures:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-solid',
                              width:	66,
                              height:	37,
                              y:        7,
                              types:	[],
                              options:	{},
                         },
                    ],
                    sensors:		[],
                    ornaments:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-visual',
                              width:	66,
                              height:	52,
                              types:	[],
                              sprite:	'guard-rail-horz-2',
                              options:	{},
                         },
                    ],
               },
               options:	{
                    isStatic:		true,
               },
               zindex:	'doodad-fg-2',
               custom:	{noActor: true},
          }
     };

     group['guard-rail-vert-0'] = {
          actor:		{
               inert:			true,
               indestructible:	true,
               type:			'groundcover',
          },
          body:		{
               parts:	{
                    structures:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-solid',
                              width:	46,
                              height:	40,
                              types:	[],
                              options:	{},
                         },
                    ],
                    sensors:		[],
                    ornaments:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-visual',
                              width:	46,
                              height:	40,
                              types:	[],
                              sprite:	'guard-rail-vert-2',
                              options:	{},
                         },
                    ],
               },
               options:	{
                    isStatic:		true,
               },
               zindex:	'doodad-fg-2',
               custom:	{noActor: true},
          }
     };

     group['guard-rail-vert-1'] = {
          actor:		{
               inert:			true,
               indestructible:	true,
               type:			'groundcover',
          },
          body:		{
               parts:	{
                    structures:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-solid',
                              width:	46,
                              height:	72,
                              types:	[],
                              options:	{},
                         },
                    ],
                    sensors:		[],
                    ornaments:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-visual',
                              width:	46,
                              height:	72,
                              types:	[],
                              sprite:	'guard-rail-vert-1',
                              options:	{},
                         },
                    ],
               },
               options:	{
                    isStatic:		true,
               },
               zindex:	'doodad-fg-2',
               custom:	{noActor: true},
          }
     };

     group['guard-rail-vert-2'] = {
          actor:		{
               inert:			true,
               indestructible:	true,
               type:			'groundcover',
          },
          body:		{
               parts:	{
                    structures:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-solid',
                              width:	46,
                              height:	57,
                              y:        5,
                              types:	[],
                              options:	{},
                         },
                    ],
                    sensors:		[],
                    ornaments:	[
                         {
                              shape:	'rectangle',
                              name:	'guard-rail-visual',
                              width:	46,
                              height:   68,
                              types:	[],
                              sprite:	'guard-rail-vert-0',
                              options:	{},
                         },
                    ],
               },
               options:	{
                    isStatic:		true,
               },
               zindex:	'doodad-fg-2',
               custom:	{noActor: true},
          }
     };

     return group;
}
