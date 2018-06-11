module.exports = function(group) {
     group['placeholder-traffic-light-0'] = {
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
                              name:	'base',
                              width:	14,
                              height:	13,
                              types:	[],
                              options:	{},
                         },
                    ],
                    sensors:		[],
                    ornaments:	[
                         {
                              shape:	'rectangle',
                              name:	'pole',
                              width:	24,
                              height:	274,
                              x:        0,
                              y:        -131,
                              types:	[],
                              sprite:	'placeholder-traffic-light-0-p0',
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

     group['placeholder-traffic-light-1'] = {
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
                              name:	'base',
                              width:	11,
                              height:	10,
                              types:	[],
                              options:	{},
                         },
                    ],
                    sensors:		[],
                    ornaments:	[
                         {
                              shape:	'rectangle',
                              name:	'pole',
                              width:	13,
                              height:	185,
                              x:        0,
                              y:        -7,
                              types:	[],
                              sprite:	'placeholder-traffic-light-1-p0',
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

     group['placeholder-traffic-light-2'] = {
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
                              name:	'base',
                              width:	14,
                              height:	13,
                              types:	[],
                              options:	{},
                         },
                    ],
                    sensors:		[],
                    ornaments:	[
                         {
                              shape:	'rectangle',
                              name:	'pole',
                              width:	247,
                              height:	115,
                              x:        116,
                              y:        -51,
                              types:	[],
                              sprite:	'placeholder-traffic-light-2-p0',
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

     group['placeholder-traffic-light-3'] = {
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
                              name:	'base',
                              width:	14,
                              height:	13,
                              types:	[],
                              options:	{},
                         },
                    ],
                    sensors:		[],
                    ornaments:	[
                         {
                              shape:	'rectangle',
                              name:	'pole',
                              width:	247,
                              height:	172,
                              x:        -116,
                              y:        -79,
                              types:	[],
                              sprite:	'placeholder-traffic-light-3-p0',
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
};
