var app = require('../lib/app').app;
var request = require('supertest');
var assert = require('assert');
var Proposition = require('../lib/models/proposition');
var User = require('../lib/models/user');

describe('POST /propositions', function () {

	var receivers = ["54383304d3c611e8084ab5f0"];

	var zifID;
	var fizID;
	var token;

	var data;

	before(function (done) {
		request(app)
			.post('/api/users')
			.send({
				username: 'oof',
				password: 'rab'
			})
			.expect(201)
			.end(function (err, req) {
				var res = JSON.parse(req.res.text);
				zifID = res.id;
				token = res.token;

				done();
			});
	});

	it('should create new proposition', function (done) {

		request(app)
			.post('/api/propositions')
			.set('X-Authorization-Token', token)
			.send({
				receivers: receivers,
				image: "http://www.online-image-editor.com//styles/2014/images/example_image.png"
			})
			.expect(201).end(function (err, req) {
				res = JSON.parse(req.res.text);
				assert('data' in res, 'Data is not present in response');

				data = res.data;

				assert('_id' in data, 'id is not present in Data');

				Proposition.findByIdAndRemove(data.id, done);
			});
	});


	after(function (done) {

		User.findByIdAndRemove(zifID, done);
		//User.findByIdAndRemove(fizID, done);
	});
});