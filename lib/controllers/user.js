var User = require('../models/user');
var Proposition = require('../models/proposition');
var crypto = require('crypto');
var keyDel = require('key-del');

module.exports = {

	me: function (req, res, next) {
		User.findById(req.user.id, function (err, user) {
			if (!err) {
				res.status(200).json({ code: 200, data: user });
			} else {
				res.status(500).json(err);
			}
		});
	},

	show: function (req, res, next) {
		var id = req.params['id'];

		User.findById(id, function (err, user) {
			if (!err) {
				if (req.user.token != user.token) {
					user.token = undefined;
					user.phone = undefined;
				}

				res.status(200).json({ code: 200, data: user });
			} else {
				res.status(500).json(err);
			}
		});
	},

	create: function (req, res, next) {
		var md5 = crypto.createHash('md5');
		var salt = 'youpi';
		var token = md5.update((req.param('facebook_id') + salt)).digest('hex');


		User.create({
			facebookId: req.param('facebook_id'),
			name:  req.param('name'),
			token: token,
			salt: salt
		}, function (err, user) {
			if (!err) {
				res.status(201).json({ code: 201, message: "User created.", id: user.id, facebook_id: req.param('facebook_id'), token: token });
			} else {
				User.findOne({
					facebookId: req.param('facebook_id')
				}, function (err, user) {
					res.status(409).json({ code: 409, message: "User already exists.", id: user.id, facebook_id: req.param('facebook_id'), token: token });
				});
			}
		});
	},

	takenPropositions: function (req, res, next) {
		Proposition.find({ receivedId: req.param['id'], taken: true }, function (err, propositions) {
			res.status(200).json({ code: 200, data: propositions });
		})
	},

	pendingPropositions: function (req, res, next) {
		Proposition.find({ receivedId: req.param['id'], taken: false }, function (err, propositions) {
			res.status(200).json({ code: 200, data: propositions });
		})
	},

	receivedPropositions: function (req, res, next) {
		Proposition.find({ receivedId: req.param['id'] }, function (err, propositions) {
			res.status(200).json({ code: 200, data: propositions });
		})
	},

	sentPropositions: function (req, res, next) {
		Proposition.find({ senderId: req.param['id'], taken: true }, function (err, propositions) {
			res.status(200).json({ code: 200, data: propositions });
		})
	}
};