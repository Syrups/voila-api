var Proposition = require('../models/proposition');

module.exports = {

	send: function (req, res, next) {
		var user = req.user;

		Proposition.create({
			sender: user.id,
			receiver: req.param('receiverId'),
			image: '...',
			takers: []
		}, function (err) {
			if (!err) {
				res.status(201).json({ code: 201, message: "Proposition created." });
			} else {
				res.status(500).json(err);
			}

			next();
		});
	}
};