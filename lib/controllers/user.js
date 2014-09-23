var User = require('../models/user');

module.exports = {

	create: function (req, res, next) {
		User.create({
			phone: req.param('phone'),
			name:  req.param('name'),
			token: 'toto93'
		}, function (err) {
			if (!err) {
				res.status(201).json({ code: 201, message: "User created." });
			}

			next();
		});
	},

	listContacts: function (req, res, next) {
		var phones = req.param('phones') || [];

		res.status(200).json(phones);

		next();
	}
};