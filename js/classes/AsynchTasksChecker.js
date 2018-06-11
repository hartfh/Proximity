module.exports = function(numTasks, callback = function(){}) {
	var self		= this;
	var completed	= 0;

	self.check = function(args) {
		completed++;

		if( completed == numTasks ) {
			callback(args);
		}
	};
};
