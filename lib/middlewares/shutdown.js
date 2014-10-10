var mongoose = require('mongoose');

/* 
 * Shutdown file
 */
module.exports = function () {
	return function (req, res, next) {
		res.on('finish', function () {
			
		});

		next();
	};
};