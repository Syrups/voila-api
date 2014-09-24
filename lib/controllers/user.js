var User = require('../models/user');
var Proposition = require('../models/proposition');
var crypto = require('crypto');

module.exports = {

	show: function (req, res, next) {
		var id = req.params['id'];

		User.findById(id, function (err, user) {
			if (!err) {
				res.status(200).json({ code: 200, data: user });
			} else {
				res.status(500).json(err);
			}
		});
	},

	create: function (req, res, next) {
		var md5 = crypto.createHash('md5');
		var token = md5.update(req.param('phone')).digest('hex');

		User.create({
			phone: req.param('phone'),
			name:  req.param('name'),
			token: token
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
	}
};