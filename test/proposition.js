var app = require('../lib/app').app;
var request = require('supertest');
var assert = require('chai').assert;
var Proposition = require('../lib/models/proposition');
var User = require('../lib/models/user');
var Answer = require('../lib/models/answer');

var ObjectId = require('mongoose').Types.ObjectId;


var Utils = require('./test_utils');
var Media = require('../lib/controllers/media');

describe('Prospositions API', function () {

	var receivers = [];
	var reReceivers = [];

	var larryID, sylID, leoID, oofId, fizID;
	var token, larryToken, sylToken;

	var data;

	var prodsition1ID, prodsition2ID;

	var fileName;

	before(function (done) {

		Utils.createUser('oof', 'rab', 'o@gmail.com', function (res) {
			oofId = res.id;
			token = res.token;
		});

		Utils.createUser('larry', 'google', 'g@gmail.com', function (res) {
			larryID = res.id;
			larryToken = res.token;

			receivers.push(larryID);

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


	it('should create new media', function (done) {
		request(app)
			.post('/images')
			.set('X-Authorization-Token', token)
			.attach('file', __dirname + '/test.jpg')
			.expect(201).end(function (err, req) {
				var file = req.res.body;
				fileName = file.filename;

				assert('filename' in file, 'filename is not present in response');

				done();
			})
	});

	describe('POST /propositions', function () {
		it('should create new proposition', function (done) {
			request(app)
				.post('/api/propositions')
				.set('X-Authorization-Token', token)
				.send({
					receivers: receivers,
					image: fileName
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
				.set('X-Authorization-Token', larryToken)
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


	describe('PUT /propositions/:id', function () {

		it('/take : larry should take proposition', function (done) {

			var id = new ObjectId(prodsition1ID);

			request(app)
				.put('/api/propositions/' + id + '/take')
				.set('X-Authorization-Token', larryToken)
				.expect(200).end(function (err, req) {

					data = req.res.body;

					assert('message' in data, 'message is not present in Data');

					done();
				});
		});

		it('/users/:id/pending should return Syl\'s pending proposition', function (done) {
			request(app)
				.get('/api/users/' + sylID + '/pending')
				.set('X-Authorization-Token', sylToken)
				.expect(200)
				.end(function (err, req) {
					console.log(req.res.body);
					assert.isArray(req.res.body, "result is not array");

					done();
				});
		});

		it('/dismiss : Syl should dismiss proposition', function (done) {

			var id = new ObjectId(prodsition1ID);

			request(app)
				.put('/api/propositions/' + id + '/dismiss')
				.set('X-Authorization-Token', sylToken)
				.expect(200).end(function (err, req) {

					data = req.res.body;

					assert('message' in data, 'message is not present in Data');

					done();
				});
		});

		var answers;

		it('/users/:id/answers should return larry\'s pending answers', function (done) {
			request(app)
				.get('/api/users/' + oofId + '/answers')
				.set('X-Authorization-Token', token)
				.expect(200)
				.end(function (err, req) {

					answers = req.res.body

					assert.isArray(answers, "answers is not array");
					assert.lengthOf(answers, 2, 'answers has not length of 2');

					done();
				});
		});

		it('/answers/:id/acknowledge : oof should asknowlege answer from previous proposition', function (done) {

			var answer = answers[0];
			var id = new ObjectId(answer._id);

			request(app)
				.put('/api/answers/' + id + '/acknowledge')
				.set('X-Authorization-Token', token)
				.expect(200)
				.end(function (err, req) {

					var data = req.res.body;

					assert('message' in data, 'message is not present in Data');

					done();
				});
		});

		it('/answers/:id/acknowledge : should throw 404', function (done) {

			request(app)
				.put('/api/answers/989O8n3n8/acknowledge')
				.set('X-Authorization-Token', token)
				.expect(404, done);
		});

		it('/answers/:id/acknowledge : should throw 403 unauthorized', function (done) {

			var answer = answers[1];
			var id = new ObjectId(answer._id);

			request(app)
				.put('/api/answers/' + id + '/acknowledge')
				.set('X-Authorization-Token', larryToken)
				.expect(403, done);
		});

		after(function (done) {
			Answer.findByIdAndRemove(answers[0]._id, function (err, results) {
				Answer.findByIdAndRemove(answers[1]._id, done);
			});
		});

	});

	describe('GET /propositions/:id', function () {
		it('/ should return proposition', function (done) {

			var id = new ObjectId(prodsition1ID);

			request(app)
				.get('/api/propositions/' + id)
				.set('X-Authorization-Token', larryToken)
				.expect(200).end(function (err, req) {

					assert('_id' in req.res.body, 'message is not present in Data');

					done();
				});
		});

		it('/ should return proposition takers', function (done) {

			var id = new ObjectId(prodsition1ID);

			request(app)
				.get('/api/propositions/' + id + "/takers")
				.set('X-Authorization-Token', larryToken)
				.expect(200).end(function (err, req) {

					assert('takers' in req.res.body, 'takers is not present in Propostion');

					done();
				});
		});

		it('/ should trhow 500', function (done) {
			request(app)
				.get('/api/propositions/aZEBJ323é')
				.set('X-Authorization-Token', larryToken)
				.expect(500).end(function (err, req) {

					//assert('_id' in req.res.body, 'message is not present in Data');

					done();
				});
		});
	});

	after(function (done) {

		Proposition.findByIdAndRemove(prodsition1ID, function (err, results) {
			//console.log('prodsition1ID', results.id);
			Media.remove(fileName);
		});

		Proposition.findByIdAndRemove(prodsition2ID, function (err, results) {
			//console.log('prodsition2ID', results.id);
		});

		User.findByIdAndRemove(larryID, function (err, results) {
			//console.log('larryID', results.id);
		});

		User.findByIdAndRemove(leoID, function (err, results) {
			//console.log('leoID', results.id);
		});
		User.findByIdAndRemove(sylID, function (err, results) {
			//console.log('sylID', results.id);
		});

		User.findByIdAndRemove(oofId, done);
		//done();
	});
});