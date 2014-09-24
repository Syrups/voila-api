var User = require('../models/user');
var Proposition = require('../models/proposition');

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

	takenPropositions: function (req, res, next) {
		Proposition.find({ receivedId: req.param['id'], taken: true }, function (err, propositions) {
			res.status(200).json({ code: 200, data: propositions });
		})
	},

	sentPropositions: function (req, res, next) {
		Proposition.find({ senderId: req.param['id'], taken: true }, function (err, propositions) {
			res.status(200).json({ code: 200, data: propositions });
		})
	},

	listContacts: function (req, res, next) {
		var phones = req.param('phones') || [];

		res.status(200).json(phones);

		next();
	}
};