var app = require('../lib/app').app;
var request = require('supertest');
var assert = require('assert');
var Proposition = require('../lib/models/proposition');
var User = require('../lib/models/user');


var Utils = require('./test_utils');

describe('POST /propositions', function () {

	var receivers = ["54383304d3c611e8084ab5f0"];
	var reReceivers = ["54383508133b7ed110e5f24f", "5455480fa57c6c000002eedf"];

	var zifID;
	var fizID;
	var token;

	var data;

	var prodsition1ID, prodsition2ID;

	before(function (done) {
		Utils.createUser('oof', 'rab', function (res) {
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

				prodsition1ID = data.id;

				done();
				//Proposition.findByIdAndRemove(data.id, done);	
			})
	});

	it('should resend proposition with originalProposition param', function (done) {

		request(app)
			.post('/api/propositions')
			.set('X-Authorization-Token', token)
			.send({
				receivers: reReceivers,
				originalProposition: prodsition1ID
			})
			.expect(201).end(function (err, req) {
				res = JSON.parse(req.res.text);
				assert('data' in res, 'Data is not present in response');

				data = res.data;

				assert('_id' in data, 'id is not present in Data');

				prodsition2ID = data.id;

				Proposition.findByIdAndRemove(prodsition1ID);
				Proposition.findByIdAndRemove(prodsition2ID, done);
			});
	});


	it('should throw error 403', function (done) {

		request(app)
			.post('/api/propositions')
			//.set('X-Authorization-Token', token)
			.send({
				user: "ok",
				receivers: receivers,
				maninthemiddle: "hahahaha!"
			})
			.expect(403).end(function (err, req) {

				data = JSON.parse(req.res.text);

				assert('message' in data, 'message is not present in Data');
				done();

			});
	});

	after(function (done) {

		User.findByIdAndRemove(zifID, done);
		//User.findByIdAndRemove(fizID, done);
	});
});


describe('POST /propositions', function () {});