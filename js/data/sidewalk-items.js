let items = {};

items['streetlight-0'] = {
     name:          'streetlight-0',
     district:		false,
     facing:        'W',
     height:        1,
     width:         1,
     offset:        {x: 0, y: 0},
};
items['streetlight-1'] = {
     name:          'streetlight-1',
     district:		false,
     facing:        'N',
     height:        1,
     width:         1,
     offset:        {x: 0, y: 0},
};
items['streetlight-2'] = {
     name:          'streetlight-2',
     district:		false,
     facing:        'E',
     height:        1,
     width:         1,
     offset:        {x: 0, y: 0},
};
items['streetlight-3'] = {
     name:          'streetlight-3',
     district:		false,
     facing:        'S',
     height:        1,
     width:         1,
     offset:        {x: 0, y: 0},
};
items['bollards-horz'] = {
     name:          'bollards-horz',
     district:      false,
     facing:        ['N', 'S'],
     height:        1,
     width:         3,
     offset:        {x: 72, y: 0},
};
items['bollards-vert'] = {
     name:          'bollards-vert',
     district:      false,
     facing:        ['E', 'W'],
     height:        3,
     width:         1,
     offset:        {x: 0, y: 72},
};
items['dumpster-horz'] = {
     name:          'dumpster-horz',
     district:      false,
     facing:        ['N', 'S'],
     height:        1,
     width:         2,
     offset:        {x: 36, y: 0},
};
items['dumpster-vert'] = {
     name:          'dumpster-vert',
     district:      false,
     facing:        ['E', 'W'],
     height:        2,
     width:         1,
     offset:        {x: 0, y: 36},
};

items['street-sign-1'] = {
     name:          'street-sign-1',
     district:      false,
     facing:        'S',
     height:        1,
     width:         1,
     offset:        false,
};

// recycle bin
// tree projections
// railings
// bench
// large overhanging traffic signs
// small traffic signs
// advertisement signs
// utility boxes
// planter box?????
// row of newspaper dispensers
// bus stop
// subway station
// street vendors
// stack of boxes/bins/trash

module.exports = items;
