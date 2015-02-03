var apn = require('apn');
var connection;

module.exports = {
	connect: function () {
		connection = new apn.Connection()
	}
}

