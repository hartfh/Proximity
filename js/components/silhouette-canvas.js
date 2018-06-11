module.exports = new function() {
     let _self      = {};
     let _hasData   = false;
     let _center    = {x: 0, y: 0};
     let _canvas    = document.createElement('canvas');
     let _context   = _canvas.getContext('2d');

     _canvas.width  = Constants.VPORT_WIDTH;
     _canvas.height = Constants.VPORT_HEIGHT;

     _context.imageSmoothingEnabled = false;

     _self.setCenter = function(x, y) {
          _center.x = x;
          _center.y = y;
     };

     _self.getContext = function() {
          return _context;
     };

     _self.setMode = function(mode) {
          switch(mode) {
               case 'background':
                    _context.globalCompositeOperation = 'source-over';
                    break;
               case 'foregroumd':
                    _context.globalCompositeOperation = 'source-in';
                    break;
               default:
                    break;
          }
     };

     _self.clear = function() {
		_context.beginPath();
		_context.clearRect(0, 0, _canvas.width, _canvas.height);
		_context.closePath();

          _hasData = false;
	};

     /*
     _self.render = function(texture, sprite, imageData, part) {
          _context.globalCompositeOperation = 'source-over';

          _context.translate(part.position.x, part.position.y);

          if( part.parent.angle != 0 ) {
               _context.rotate(part.parent.angle);
          }

          _context.drawImage(
               texture,
               imageData.x,
               imageData.y,
               imageData.w,
               imageData.h,
               imageData.w * -sprite.xOffset * sprite.xScale,
               imageData.h * -sprite.yOffset * sprite.yScale,
               imageData.w * sprite.xScale,
               imageData.h * sprite.yScale
          );

          if( part.parent.angle != 0 ) {
               _context.rotate(-part.parent.angle);
          }

          _context.translate(-part.position.x, -part.position.y);

          _hasData = true;
     };
     */

     _self.print = function(ctx) {
          // Blue fill
          _context.globalCompositeOperation = 'source-atop';
          _context.beginPath();
          _context.fillStyle = '#0088ff';
		_context.fillRect(0, 0, _canvas.width, _canvas.height);
		_context.closePath();

          ctx.globalCompositeOperation = 'source-over';

          ctx.beginPath();
		ctx.drawImage(_canvas, 0, 0);
		ctx.closePath();

          _self.clear();
     };

     return _self;
};
