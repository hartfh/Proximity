module.exports = function(gameStateData) {
	var _self		= this;
	var _stateProp	= gameStateData;

	function _setColor(color) {
		Game.State.color[_stateProp].color = color;
	}

	function _setMode(mode) {
		Game.State.color[_stateProp].mode = mode;
	}

	function _setOpacity(opacity) {
		Game.State.color[_stateProp].opacity = opacity;
	}

	function _hexToRGB(hex) {
		var hex = hex.replace('#', '');
		var rgb = [];

		rgb[0] = parseInt(hex[0] + hex[1], 16);
		rgb[1] = parseInt(hex[2] + hex[3], 16);
		rgb[2] = parseInt(hex[4] + hex[5], 16);

		return rgb;
	}

	function _rgbToHex(rgb) {
		var hex = '#';

		var hex1 = rgb[0];
		var hex2 = rgb[1];
		var hex3 = rgb[2];

		hex1 = hex1.toString(16);
		hex2 = hex2.toString(16);
		hex3 = hex3.toString(16);

		if( hex1.length == 1 ) {
			hex1 = '0' + hex1;
		}
		if( hex2.length == 1 ) {
			hex2 = '0' + hex2;
		}
		if( hex3.length == 1 ) {
			hex3 = '0' + hex3;
		}

		hex += hex1;
		hex += hex2;
		hex += hex3;

		return hex;
	}

	function _calculateColorSteps(hexA, hexB, steps = 20) {
		var rgbA		= _hexToRGB(hexA);
		var rgbB		= _hexToRGB(hexB);
		var hexValues	= [];

		var rStepSize	= (rgbB[0] - rgbA[0]) / steps;
		var gStepSize	= (rgbB[1] - rgbA[1]) / steps;
		var bStepSize	= (rgbB[2] - rgbA[2]) / steps;

		for(var s = 1; s < steps; s++) {
			var rgbValue = [];

			rgbValue[0] = parseInt( rgbA[0] + (rStepSize * s) );
			rgbValue[1] = parseInt( rgbA[1] + (gStepSize * s) );
			rgbValue[2] = parseInt( rgbA[2] + (bStepSize * s) );

			hexValues.push( _rgbToHex(rgbValue) );
		}

		hexValues.push(hexB);

		return hexValues;
	}

	function _calculateOpacitySteps(opacityA, opacityB, steps = 20) {
		var diff		= opacityB - opacityA;
		var step		= diff / steps;
		var values	= [];

		for(var s = 1; s < steps; s++) {
			var value = opacityA + (s * step);

			values.push(value);
		}

		values.push(opacityB);

		return values;
	}

	function _getConfigurationObject(arguments = {}) {
		var config		= {
			color:		arguments.color || '#000000',
			mode:		arguments.mode || 'soft-light',
			speed:		arguments.speed || 1000,
			duration:		arguments.duration || 0
		};

		config.opacity = (arguments.opacity == undefined) ? 1.0 : arguments.opacity;

		return config;
	}

	/**
	 * Quickly transition to color settings and then transition back
	 *
	 * @public
	 * @method	flash
	 *
	 */
	_self.flash = function(args = {}) {
		var config	= _getConfigurationObject(args);
		var origConfig	= {
			color:	Game.State.color[_stateProp].reset.color,
			mode:	Game.State.color[_stateProp].reset.mode,
			opacity:	Game.State.color[_stateProp].reset.opacity,
			speed:	config.speed
		};

		_self.shift(config, function() {
			setTimeout(function() {
				_self.shift(origConfig);
			}, config.duration);
		})
	};

	/**
	 * Permanent transition to new color settings
	 *
	 * @public
	 * @method	shift
	 *
	 */
	_self.shift = function(args = {}, callback = function(){}) {
		const STEPS		= 20;
		var config		= _getConfigurationObject(args);
		var currentColor	= Game.State.color[_stateProp].color;
		var currentOpacity	= Game.State.color[_stateProp].opacity;
		var hexValues		= _calculateColorSteps(currentColor, config.color, STEPS);
		var opacityValues	= _calculateOpacitySteps(currentOpacity, config.opacity, STEPS);
		var timeStep		= config.speed / STEPS;

		for(var s = 0; s < STEPS; s++) {
			(function(index) {
				setTimeout(function() {
					_setColor( hexValues[index] );
					_setOpacity( opacityValues[index] );

					if( index == STEPS - 1 ) {
						callback();
					}
				}, index * timeStep);
			}(s));
		}
	};
};
