var apn = require('apnagent');
var agent;
var join = require('path').join
var certPath = process.env.NODE_ENV != 'production' ? '../../cert/apns-dev.p12' : '../../cert/apns-prod.p12'
var pfx = join(__dirname, certPath);

var User = require('../models/user');

module.exports = {
	connect: function () {
		agent = new apn.Agent();
		agent.set('pfx file', pfx)

		if (process.env.NODE_ENV != 'production') {
			agent.enable('sandbox');
		}

		console.log(' [x] APNS : connecting...');

		agent.connect(this.connectionHandler);

		agent.on('message:error', this.messageErrorHandler);
	},

	sendNotification: function (user, notification) {

		if (user.appleDeviceTokens.length == 0) return;

		for (var i = 0 ; i < user.appleDeviceTokens.length ; i++) {
			var token = user.appleDeviceTokens[i];
			agent.createMessage()
				.device(token)
				.contentAvailable(true)
				.alert(notification.message)
				.send();
		}

	},

	sendNotificationToMany: function (ids, notification) {
		var $self = this;
		User.find({ _id: { $in: ids }}, function (err, users) {
			for (var i = 0; i < users.length; i++) {
				$self.sendNotification(users[i], notification);
			}
		});
	},

	connectionHandler: function (err) {
		if (err && err.name === 'GatewayAuthorizationError') {
			console.log(' [x] APNS : Authentication Error : %s', err.message);
		} else if (err) {
			console.log(' [x] APNS : Error : %s', err.message)
		}

		console.log(' [x] APNS : connected [env=%s]', process.env.NODE_ENV)
	},

	messageErrorHandler: function (err, msg) {
		switch (err.name) {
			case 'GatewayNotificationError':

				// Error code 8 means device token is invalid,
				// we should delete this token from the user
				if (err.code === 8) {
					var invalidToken = msg.device().toString();
					User.findOneAndUpdate({
						$eq: { appleDeviceTokens: invalidToken}
					}, {
						$pull: { appleDeviceTokens: invalidToken }
					});
				} else {
					console.log(' [x] APNS : error sending message / gateway error : %s', err.message);
				}

				break;

			default:
				console.log(' [x] APNS : error sending message : %s', err.message);
				break;
		}
	}
};

