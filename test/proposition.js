var app = require('../lib/app').app;
var request = require('supertest');
var assert = require('assert');
var Proposition = require('../lib/models/proposition');
var User = require('../lib/models/user');

var ObjectId = require('mongoose').Types.ObjectId;


var Utils = require('./test_utils');

describe('Prospositions API', function () {

	var receivers = [];
	var reReceivers = [];

	var glennID, sylID, leoID, oofId, fizID;
	var token, glennToken, sylToken;

	var data;

	var prodsition1ID, prodsition2ID;

	before(function (done) {

		Utils.createUser('oof', 'rab', 'o@gmail.com', function (res) {
			oofId = res.id;
			token = res.token;
		});

		Utils.createUser('glenn', 'google', 'g@gmail.com', function (res) {
			glennID = res.id;
			glennToken = res.token;

			receivers.push(glennID);

		});

		Utils.createUser('syl', 'tise', 'st@gmail.com', function (res) {
			sylID = res.id;
			sylToken = res.token;

			receivers.push(sylID);

		});

		Utils.createUser('leo', 'ruby', 'leoht@gmail.com', function (res) {
			leoID = res.id;

			reReceivers.push(leoID);

			done();
		});

	});



	describe('POST /propositions', function () {
		it('should create new proposition', function (done) {
			request(app)
				.post('/api/propositions')
				.set('X-Authorization-Token', token)
				.send({
					receivers: receivers,
					image: "http://www.online-image-editor.com//styles/2014/images/example_image.png"
				})
				.expect(201).end(function (err, req) {
					var res = req.res.body;

					assert('data' in res, 'Data is not present in response');

					var data = res.data;

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

					done();
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
	});

	describe('PUT /propositions/:id/take', function () {
		it('Glenn should take proposition', function (done) {

			var id = new ObjectId(prodsition1ID);

			request(app)
				.put('api/propositions/' + id + '/take')
				.set('X-Authorization-Token', glennToken)
				.expect(200).end(function (err, req) {
					//data = req.res.body;

					//assert('message' in data, 'message is not present in Data');

					//console.log(data.message);
					done();
				});
		});
	});



	after(function (done) {
		console.log('after');

		/*Proposition.findByIdAndRemove(prodsition1ID, function (err, results) {
			console.log('prodsition1ID', results.id);
		});

		Proposition.findByIdAndRemove(prodsition2ID, function (err, results) {
			console.log('prodsition2ID', results.id);
		});

		User.findByIdAndRemove(glennID, function (err, results) {
			console.log('glennID', results.id);
		});

		User.findByIdAndRemove(leoID, function (err, results) {
			console.log('leoID', results.id);
		});
		User.findByIdAndRemove(sylID, function (err, results) {
			console.log('sylID', results.id);
		});

		User.findByIdAndRemove(oofId, done);*/
		done();

	});
});