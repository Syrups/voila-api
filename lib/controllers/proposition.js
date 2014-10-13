var Proposition = require('../models/proposition');
var User = require('../models/user');

module.exports = {

	send: function (req, res, next) {
		var user = req.user;

		var data = {
			sender: user.facebookId,
			senderName: req.param('senderName'),
			receiver: req.param('receiverId'),
			receiverName: req.param('receiverName'),
			image: req.param('image'),
			takers: []
		};

		if (req.param('originalProposition') != "<null>") {
			data.originalProposition = req.param('originalProposition');
		}

		Proposition.create(data, function (err, proposition) {
			if (!err) {
				User.findByIdAndUpdate(user.id, { $inc: { "sent" : 1 }}, function (err) {
					if (err) {
						res.status(500).json(err);
					} else {

						res.status(201).json({ code: 201, message: "Proposition created." });
					} 
				});
				
			} else {
				console.log(err);
				res.status(500).json(err);
			}
		});
	},

	take: function (req, res, next) {
		var id = req.params['id'];

		Proposition.findByIdAndUpdate(id, {
			taken: true,
			$addToSet: { "takers": req.user.id },
			receivedAt: Date.now()
		}, function (err, proposition) {
			if (!err) {
				User.findByIdAndUpdate(req.user.id, { $inc: { "taken" : 1 }}, function (err) {
					if (err) {
						res.status(500).json(err);
					} else {

						res.status(200).json({ code: 200, message: "Proposition taken." });
					} 
				});
			} else {
				res.status(500).json(err);
			}
		});
	},

	show: function (req, res, next) {
		var id = req.params['id'];

		Proposition.findById(id, function (err, proposition) {
			if (!err) {
				res.status(200).json({ code: 200, data: proposition });
			} else {
				res.status(500).json(err);
			}
		});
	},

	acknowledge: function (req, res, next) {
		var id = req.params['id'];

		Proposition.findByIdAndUpdate(id, { "receivedAt": Date.now }, function (err, proposition) {
			if (!err) {
				res.status(200).json({ code: 200, data: proposition });
			} else {
				res.status(500).json(err);
			}
		});
	},

	takers: function (req, res, next) {
		var id = req.params['id'];

		Proposition.findById(id, function (err, proposition) {
			if (!err) {
				res.status(200).json({ code: 200, data: { takers: proposition.takers } });
			} else {
				res.status(500).json(err);
			}
		});
	}
};