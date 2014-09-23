var User = require('../models/user');

module.exports = function () {
	return function (req, res, next) {
		if (!req.param('token')) {
			res.status(403).json({ code: 403, message: 'No token provided.'});
		} else {
			User.findOne({ token: req.param('token') }, function (err, user) {
				if (err || !user) {
					res.status(403).json({ code: 403, message: 'Invalid token.'});
				}
				if (user) {
					req.user = user;
					next();
				}
			});
		}	
	}
};