var User = require('../models/user');

module.exports = function () {
	return function (req, res, next) {
		if (!req.get('X-Authorization-Token')) {
			res.status(403).json({ code: 403, message: 'No token provided.'});
		} else {
			User.findOne({ token: req.get('X-Authorization-Token') }).exec()
			.then(function (user) {
				if (!user) {
					res.status(403).json({ code: 403, message: 'Invalid token.'});
				} else {
					req.user = user;
					next();
				}
			});
		}
	}
};