// TEST UTILS

var request = require('supertest');
var app = require('../lib/app').app;

module.exports = {
	setup: function (app) {

	},

	createUser: function (username, password, email, callback) {
		request(app)
			.post('/api/users')
			.send({
				username: username,
				password: password,
				email: email
			})
			.expect(201)
			.end(function (err, req) {
				res = req.res.body;
				callback(res);
			});
	}
}