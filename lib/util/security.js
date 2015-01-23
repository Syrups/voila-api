var crypto = require('crypto');

module.exports = {

	// generate a random salt string
	salt: function () {
		var md5 = crypto.createHash('md5');
		return md5.update(Math.random().toString(36).substring(7)).digest('hex');
	},

	// generate a user token
	token: function (username) {
		var md5 = crypto.createHash('md5');
		return md5.update(Math.random().toString(36).substring(7)).digest('hex');
	}
};