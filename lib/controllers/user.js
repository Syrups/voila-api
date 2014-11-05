var User = require('../models/user');
var Proposition = require('../models/proposition');
var Answer = require('../models/answer');
var crypto = require('crypto');
var keyDel = require('key-del');
var mongoose = require('mongoose');

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

		var regex = new RegExp("^[0-9a-fA-F]{24}$");

		if (regex.test(id)) { // object ID
			query = { "_id": id };
		} else { // facebook ID
			query = { "facebookId": id };
		}

		User.findOne(query, function (err, user) {
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
			salt: salt,
			avatar : req.param('avatar')
		}, function (err, user) {
			if (!err) {
				res.status(201).json({ code: 201, message: "User created.", id: user.id, facebook_id: req.param('facebook_id'), name: user.name, avatar : user.avatar, token: token });
			} else {
				User.findOne({
					facebookId: req.param('facebook_id')
				}, function (err, user) {
					res.status(409).json({ code: 409, message: "User already exists.", id: user.id, facebook_id: req.param('facebook_id'), name: user.name,  avatar : user.avatar,  token: token });
				});
			}
		});
	},

	takenPropositions: function (req, res, next) {
		Proposition.find({ receiver: req.user.facebookId, takers: req.user.facebookId}, function (err, propositions) {
			res.status(200).json(propositions);
		})
	},

	pendingPropositions: function (req, res, next) {
		Proposition.find({ receivers: req.user.facebookId, "$and": [
			{ dismissers: {$ne: req.user._id} },
			{ takers: {$ne: req.user._id} }
		]}, function (err, propositions) {
			console.log(propositions);
			res.status(200).json(propositions);
		})
	},

	receivedPropositions: function (req, res, next) {
		Proposition.find({ receivers: req.user.facebookId }, function (err, propositions) {
			res.status(200).json(propositions);
		})
	},

	sentPropositions: function (req, res, next) {
		Proposition.find({ sender: req.user.facebookId }, function (err, propositions) {
			res.status(200).json(propositions);
		})
	},

	pendingAnswers: function (req, res, next) {
		Answer.find({
			to: req.user.facebookId
		}).populate('proposition').exec(function (err, answers) {
			res.status(200).json(answers);
		});
	},

	pendingPropositionsAndAnswers: function (req, res, next) {
		var query = {
			receivers: req.user.facebookId, $and: [
				{ takers: { $ne: req.user.id } },
				{ dismissers: { $ne: req.user.id } }
			]
		};

		Proposition.find(query, function (err, propositions) {
			Answer.find({
				to: req.user.facebookId,
				acknowledged: false
			}).populate('proposition').exec(function (err, answers) {
				var all = propositions.concat(answers);

				// then sort by date
				all.sort(function (a, b) {
					if ('answeredAt' in a && 'answeredAt' in b) {
						return a.answeredAt > b.answeredAt;
					}
				})

				res.status(200).json(all);
			});
		})
		
	}
};