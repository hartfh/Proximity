module.exports = new function() {
	var _self = this;

	_self.load = function(callback = function(){}) {
		document.fonts.ready.then(function() {
			callback();
		});

		for(var name in Data.fonts) {
			var font		= Constants.FONTS_DIR + Data.fonts[name];
			var fontFace	= new FontFace(name, `url(${font})`);

			document.fonts.add(fontFace);
		}
	};
};
