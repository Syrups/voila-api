var gcm = require('node-gcm');

var User = require('../models/user');
var config = require('../../config/gcm');

module.exports = {

 	sendNotification: function (user, notification) {

		if (user.androidDeviceTokens.length == 0) return;

		var registrationIds = [];

		for (var i = 0 ; i < user.androidDeviceTokens.length ; i++) {
			var androidDeviceTokens = user.androidDeviceTokens[i];
			registrationIds = registrationIds.concat(androidDeviceTokens);

		
			if(i >= user.androidDeviceTokens.length - 1){

				var message = new gcm.Message({
				    collapseKey: 'voila',
				    delayWhileIdle: true,
				    //timeToLive: 3,
				    data: notification
				});

				var sender = new gcm.Sender("AIzaSyB6q9imJpq2fHYe8tjn46odK4Ot0WRgxyY");
					//config.api_key);
				sender.send(message, registrationIds, 3, function (err, result) {
					if(err) {
						console.error('[X]Android GCM error %j', err);
					}
					else {
						console.log('[X]Android GCM \n - result : %j \n - registrationIds : %j', result, registrationIds);
					} 
				});
			}
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

	/*sendNotificationToMany: function (ids, notification) {
		var $self = this;
		User.find({ _id: { $in: ids }},'androidDeviceTokens -_id' function (err, users) {
			for (var i = 0; i < users.length; i++) {
				$self.sendNotification(users[i], notification);
			}
		});
	},*/
}
