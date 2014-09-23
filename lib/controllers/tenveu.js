var Tenveu = require('../models/tenveu');

module.exports = {

	send: function (req, res, next) {
		var user = req.user;

		Tenveu.create({
			sender : req.body.sender,
			receiver : req.body.receiver,
			sentAt : req.body.sentAt,
			receivedAt : req.body.receivedAt
		}, function (err) {
			if (!err) {
				res.status(201).json({ code: 201, message: "Tenveu created." });
			} else {
				res.status(500).json(err);
			}

			next();
		});
	}
};