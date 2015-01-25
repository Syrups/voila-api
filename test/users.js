var app = require('../lib/app').app;
var request = require('supertest');
var assert = require('assert');
var User = require('../lib/models/user');
var utils = require('./test_utils');

before(function () {
  utils.setup(app);
});

describe('POST /users', function() {
  it('should return new user data', function(done) {
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

  // it('should reponds 409 conflict if username is already taken', function(done) {
  //   User.create({ username: 'foo' }, function (err, user) {
  //     request(app)
  //     .post('/api/users')
  //     .send({
  //       username: 'foo',
  //       password: 'bar'
  //     })
  //     .expect(409, function () {
  //       User.findByIdAndRemove(user.id, done);
  //     });
  //   });
  // });

});

describe('GET /users/authenticate', function() {
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
  		.get('/api/users/'+id)
  		.set('X-Authorization-Token', token)
  		.expect('Content-Type', /json/)
  		.expect(200, done);
  });

  after(function (done) {
  	User.findByIdAndRemove(id, done);
  });
});


describe('POST /users/friends', function () {
  var id, token, friendId, friendToken;

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

  before(function (done) {
    request(app)
      .post('/api/users')
      .send({
        username: 'foo2',
        password: 'bar2'
      })
      .expect(201)
      .end(function (err, req) {
        res = JSON.parse(req.res.text);
        friendId = res.id;
        friendToken = res.token;

        done();
      });
  });

  // it('should add friend and have user ID in friend friends', function () {
  //   request(app)
  //     .post('/api/users/friends')
  //     .send({
  //       friend_id: friendId
  //     })
  //     .set('X-Authorization-Token', token)
  //     .expect(200, function (err, req) {
  //         res = JSON.parse(req.res.text);
          
  //         assert(res.friends.indexOf(id) != -1, 'User ID is not present in friend friends array');
  //     });
  // });

  after(function (done) {
    User.findByIdAndRemove(id, function () {
      User.findByIdAndRemove(friendId, done);
    });
  });
});

describe('GET /users/find', function () {
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

  it('should find the user with matching pattern', function (done) {
    request(app)
      .get('/api/users/find')
      .set('X-Authorization-Token', token)
      .send({ username: 'foo' })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should not find the user with not-matching pattern', function (done) {
    request(app)
      .get('/api/users/find')
      .set('X-Authorization-Token', token)
      .send({ username: 'baz' })
      .expect('Content-Type', /json/)
      .expect(404, done);
  })

  after(function (done) {
    User.findByIdAndRemove(id, done);
  });
})
