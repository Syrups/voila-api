var twilioConfig = require('../config/twilio');
var twilio = require('twilio')(twilioConfig.accountId, twilioConfig.authToken);

module.exports = function (to, from, message, cb) {

	// test
	cb(false, "okay");
	return;

	twilio.messages.create({
		body: message,
		to: to,
		from: from
	}, function (err, message) {
		cb(err, message);
	});
};