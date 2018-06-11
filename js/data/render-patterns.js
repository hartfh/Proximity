module.exports = {
	'invisible':						function() {

	},
	'thin-red-line':			function(ctx, start, end, fireTimer) {
		ctx.strokeStyle			= '#ff0000';
		ctx.lineWidth				= 0.25;

		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
		ctx.closePath();

		ctx.lineWidth = 1;
		ctx.globalCompositeOperation = 'source-over';
	},
	'thick-green-line':			function(ctx, start, end, fireTimer) {
		var lineWidth = 4;

		if( fireTimer > 30 ) {
			lineWidth += Math.floor( (fireTimer - 30) * 0.2);
		}

		if( lineWidth > 15 ) {
			lineWidth = 15;
		}

		ctx.globalCompositeOperation	= 'hard-light'; // color-burn, soft-light
		ctx.strokeStyle			= '#66cc99';
		ctx.lineWidth				= lineWidth;

		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
		ctx.closePath();

		ctx.lineWidth = 1;
		ctx.globalCompositeOperation = 'source-over';
	}
};
