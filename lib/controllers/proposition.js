var Proposition = require('../models/proposition');

module.exports = {

	send: function (req, res, next) {
		var user = req.user;

		Proposition.create({
			sender: user.id,
			receiver: req.param('receiverId'),
			image: req.param('image'),
			takers: []
		}, function (err) {
			if (!err) {
				res.status(201).json({ code: 201, message: "Proposition created." });
			} else {
				res.status(500).json(err);
			}

			next();
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
				res.status(201).json({ code: 201, message: "Proposition taken." })
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