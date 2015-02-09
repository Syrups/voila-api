var apn = require('apn');
var connection;

module.exports = {
	connect: function () {
		connection = new apn.Connection({
			cert: 'cert.pem',
			key: 'key.pem'
		});

		connection.on('connected', function () {
			console.log(' [x] Connected to Apple Push Notification Service Gateway');
		});

		connection.on('timeout', function () {
		    console.log(" [x] Connection Timeout");
		});

		connection.on('socketError', console.error);
	},

	sendNotification: function (user, notification) {

		if (user.appleDeviceTokens.length == 0) return;

		var note = new apn.Notification();

		note.expiry = Math.floor(Date.now() / 1000) + 7200;
		note.sound = 'ping.aiff';
		note.contentAvailable = 1;
		note.alert = notification

		for (t in user.appleDeviceTokens) {
			console.log(user.appleDeviceTokens[t])
			if (user.appleDeviceTokens[t]) {
				var device = new apn.Device(user.appleDeviceTokens[t]);
				connection.pushNotification(note, device);
			}
		}

	}
};

