var mongoose = require('mongoose');
var db = require('../../config/db');

/* 
 * Bootstrap file
 * Configuration
 */
module.exports = function () {
	return function (req, res, next) {
		mongoose.connect('mongodb://'+db.url+'/'+db.name);

		console.log(' [x] GET '+req.url);

		next();
	};
};