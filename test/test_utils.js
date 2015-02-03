// TEST UTILS

var request = require('supertest');
var app = require('../lib/app').app;

module.exports = {
	setup: function (app) {

	},

	createUser: function (username, password, callback) {
		request(app)
			.post('/api/users')
			.send({
				username: username,
				password: password
			})
			.expect(201)
			.end(function (err, req) {
				res = JSON.parse(req.res.text);

				callback(res);
			});
	}
}