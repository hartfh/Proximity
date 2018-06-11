module.exports = function(images) {

	// Traffic Light
	images['traffic-light-1'] = {
		sheet: 'traffic-light-1', x: 0, y: 0, w: 276, h: 135
	};

	// Placeholder Traffic Lights (3-wide streets)
	// Face North
	images['placeholder-traffic-light-0-p0'] = {
		sheet: 'placeholder-traffic-lights', x: 28, y: 2, w: 24, h: 274
	};
	// Face South
	images['placeholder-traffic-light-1-p0'] = {
		sheet: 'placeholder-traffic-lights', x: 101, y: 20, w: 13, h: 185
	};
	// Face East
	images['placeholder-traffic-light-2-p0'] = {
		sheet: 'placeholder-traffic-lights', x: 160, y: 10, w: 247, h: 115
	};
	// Face West
	images['placeholder-traffic-light-3-p0'] = {
		sheet: 'placeholder-traffic-lights', x: 172, y: 162, w: 247, h: 172
	};

	// Left
	images['streetlight-0-v0-p0'] = {
		sheet: 'streetlights', x: 24, y: 12, w: 56, h: 82
	};
	images['streetlight-0-v0-p1'] = {
		sheet: 'streetlights', x: 66, y: 94, w: 14, h: 11
	};
	images['streetlight-0-v0-p2'] = {
		sheet: 'streetlights', x: 15, y: 106, w: 61, h: 90
	};
	images['streetlight-0-v0-p3'] = {
		sheet: 'streetlights', x: 15, y: 206, w: 61, h: 36
	};

	// Right
	images['streetlight-1-v0-p0'] = {
		sheet: 'streetlights', x: 82, y: 12, w: 56, h: 82
	};
	images['streetlight-1-v0-p1'] = {
		sheet: 'streetlights', x: 82, y: 94, w: 14, h: 11
	};
	images['streetlight-1-v0-p2'] = {
		sheet: 'streetlights', x: 86, y: 106, w: 61, h: 90
	};
	images['streetlight-1-v0-p3'] = {
		sheet: 'streetlights', x: 86, y: 206, w: 61, h: 36
	};

	// Down
	images['streetlight-2-v0-p0'] = {
		sheet: 'streetlights', x: 302, y: 45, w: 14, h: 82
	};
	images['streetlight-2-v0-p1'] = {
		sheet: 'streetlights', x: 302, y: 127, w: 14, h: 11
	};
	images['streetlight-2-v0-p2'] = {
		sheet: 'streetlights', x: 413, y: 108, w: 40, h: 96
	};
	images['streetlight-2-v0-p3'] = {
		sheet: 'streetlights', x: 289, y: 230, w: 40, h: 50
	};

	// Up
	images['streetlight-3-v0-p0'] = {
		sheet: 'streetlights', x: 385, y: 14, w: 14, h: 113
	};
	images['streetlight-3-v0-p1'] = {
		sheet: 'streetlights', x: 385, y: 127, w: 14, h: 11
	};
	images['streetlight-3-v0-p2'] = {
		sheet: 'streetlights', x: 246, y: 108, w: 40, h: 96
	};
	images['streetlight-3-v0-p3'] = {
		sheet: 'streetlights', x: 372, y: 230, w: 40, h: 50
	};

	return images;
}
