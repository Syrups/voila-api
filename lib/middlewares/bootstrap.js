var mongoose = require('mongoose');

/* 
 * Bootstrap file
 * Configuration
 */
module.exports = function () {
	return function (req, res, next) {
		mongoose.connect('mongodb://localhost/tenveux');

		next();
	};
};