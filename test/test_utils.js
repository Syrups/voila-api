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
	},

	takenPropositions: function (token, callback) {
		request(app)
			.get('/api/users/' + token + '/taken')
			.set('X-Authorization-Token', token)
			.expect(200)
			.end(function (err, req) {
				assert.isArray(req.res.body, "result is not array");
				callback();
			});
	},


	pendingPropositions: function (token, callback) {
		request(app)
			.get('/api/users/' + token + '/pending')
			.set('X-Authorization-Token', token)
			.expect(200)
			.end(function (err, req) {
				assert.isArray(req.res.body, "result is not array");
				callback();
			});
	},

	receivedPropositions: function (token, callback) {
		request(app)
			.get('/api/users/' + token + '/received')
			.set('X-Authorization-Token', token)
			.expect(200)
			.end(function (err, req) {
				assert.isArray(req.res.body, "result is not array");
				callback();
			});
	},

	sentPropositions: function (req, res, next) {

	},

	createUserBundle: function (username, password, email, callback) {
		Utils.createUser('oof', 'rab', 'o@gmail.com', function (res) {
			oofId = res.id;
			token = res.token;
		});

		Utils.createUser('glenn', 'google', 'g@gmail.com', function (res) {
			glennID = res.id;
			glennToken = res.token;


		});

		Utils.createUser('syl', 'tise', 'st@gmail.com', function (res) {
			sylID = res.id;
			sylToken = res.token;


		});

		Utils.createUser('leo', 'ruby', 'leoht@gmail.com', function (res) {
			leoID = res.id;
			done();
		});
	},



}