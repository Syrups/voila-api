var app = require('../lib/app').app;
var request = require('supertest');
var assert = require('assert');
var Proposition = require('../lib/models/proposition');

describe('POST /api/propositions', function () {
	it('should create proposition with one receiver', function (done) {
		request(app)
			.post('/api/propositions')
			.send({
				'receivers': ['54383304d3c611e8084ab5f0'],
				'image': 'foo.png'
			})
			.expect(201, function (err, req) {
				res = JSON.parse(req.res.text);

				Proposition.findByIdAndRemove(res.id, done);
			});
	});
});

describe('GET /api/propositions/:id', function () {

});