var app = require('../lib/app').app;
var request = require('supertest');
var assert = require('assert');
var User = require('../lib/models/user');

describe('POST /users', function () {
  it('should return new user data', function (done) {
    request(app)
      .post('/api/users')
      .send({
        username: 'foo',
        password: 'bar'
      })
      .expect(201)
      .end(function (err, req) {
        res = JSON.parse(req.res.text);
        assert('id' in res, 'ID is not present');
        assert('token' in res, 'Token is not present');

        User.findByIdAndRemove(res.id, done);
      });
  });
});

describe('GET /users/authenticate', function () {
  var id, token;

  before(function (done) {
    request(app)
      .post('/api/users')
      .send({
        username: 'foo',
        password: 'bar'
      })
      .expect(201)
      .end(function (err, req) {
        res = JSON.parse(req.res.text);
        id = res.id;
        token = res.token;

        done();
      });
  })

  it('should authenticate with good credentials', function (done) {

    request(app)
      .get('/api/users/authenticate')
      .send({
        username: 'foo',
        password: 'bar'
      })
      .expect(200)
      .end(function (err, req) {
        res = JSON.parse(req.res.text);

        assert('token' in res, 'Token is not present in response');
        assert(res.token == token, 'Token is not the good one');


        done();
      });
  });

  it('should throw not found with bad username', function (done) {
    request(app)
      .get('/api/users/authenticate')
      .send({
        username: 'foobar',
        password: 'bar'
      })
      .expect(404, done);
  });

  it('should deny access with bad credentials', function (done) {
    request(app)
      .get('/api/users/authenticate')
      .send({
        username: 'foo',
        password: 'baz'
      })
      .expect(403, done);
  });

  after(function (done) {
    User.findByIdAndRemove(id, done);
  });
});

describe('GET /users/:id', function () {
  var id, token;

  before(function (done) {
    request(app)
      .post('/api/users')
      .send({
        username: 'foo',
        password: 'bar'
      })
      .expect(201)
      .end(function (err, req) {
        res = JSON.parse(req.res.text);
        id = res.id;
        token = res.token;

        done();
      });
  });

  it('should respond with json data', function (done) {
    request(app)
      .get('/api/users/' + id)
      .set('X-Authorization-Token', token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  after(function (done) {
    User.findByIdAndRemove(id, done);
  });
});