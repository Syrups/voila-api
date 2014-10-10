var generator = require('../util/code-generator');
var twilioConfig = require('../../config/twilio');
var sendSms = require('../send-sms');
var Code = require('../models/code');
var userController = require('../controllers/user');

module.exports = {

	requestCode: function (req, res, next) {
		var phone = req.params['phone'];

		var code = generator();

		var message = "Code de confirmation : "+code;

		sendSms(phone, twilioConfig.number, message, function (err, message) {
			if (err) {
				res.status(500).json(err);
			} else {
				Code.create({
					phone: phone,
					code: code
				}, function (err) {
					if (!err) {
						res.status(201).json({ code: 201, message: "Code created." });
					}
				});
			}
		});
	},

	validate: function (req, res, next) {
		var phone = req.param('phone');
		var code = req.params['code'];

		Code.findOneAndUpdate({ code: code, phone: phone, expires: { $gte: Date.now } }, { used: true }, function (err, code) {
			if (!code) {
				res.status(404).json({ code: 404, message: "Invalid code." });
			} else {
				userController.create(req, res, next);
			}
		})
	}

};