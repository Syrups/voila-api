var app = require('../lib/app').app;
var request = require('supertest');
var assert = require('chai').assert;
var User = require('../lib/models/user');
var Utils = require('./test_utils');

before(function () {
    Utils.setup(app);
});



describe('Users API', function () {


    // before(function (done) {});

    describe('POST /users', function () {
        it('should return new user data', function (done) {

            Utils.createUser('foo', 'bar', 'foo@gmail.com', function (user) {

                assert('id' in user, 'ID is not present');
                assert('token' in user, 'Token is not present');

                User.findByIdAndRemove(user.id, done);
            });
        });

        it('should reponds 409 conflict if username is already taken', function (done) {
            Utils.createUser('foo', 'bar', 'foo@bar.com', function (res) {
                request(app)
                    .post('/api/users')
                    .send({
                        username: 'foo',
                        password: 'bar'
                    })
                    .expect(409, function () {
                        User.findByIdAndRemove(res.id, done);
                    });
            });
        });
    });

    describe('Users Actions', function () {
        var larryID, sylID, leoID;
        var larryToken, sylToken;

        before(function (done) {


            Utils.createUser('larry', 'google', 'g@gmail.com', function (res) {
                larryID = res.id;
                larryToken = res.token;
            });

            Utils.createUser('syl', 'tise', 'st@gmail.com', function (res) {
                sylID = res.id;
                sylToken = res.token;
            });

            Utils.createUser('leo', 'ruby', 'leoht@gmail.com', function (res) {
                leoID = res.id;
                done();
            });
        });

        describe('POST /users/authenticate', function () {

            it('should authenticate with good credentials', function (done) {

                request(app)
                    .post('/api/users/authenticate')
                    .send({
                        username: 'larry',
                        password: 'google'
                    })
                    .expect(200)
                    .end(function (err, req) {
                        res = JSON.parse(req.res.text);

                        assert('token' in res, 'Token is not present in response');
                        assert(res.token == larryToken, 'Token is not the good one');

                        done();

                    });
            });

            it('should throw not found with bad username', function (done) {
                request(app)
                    .post('/api/users/authenticate')
                    .send({
                        username: 'foobar',
                        password: 'bar'
                    })
                    .expect(404, done);
            });

            it('should deny access with bad credentials', function (done) {
                request(app)
                    .post('/api/users/authenticate')
                    .send({
                        username: 'larry',
                        password: 'baz'
                    })
                    .expect(403, done);
            });
        });

        describe('User API Friends', function () {

            it('/users/:id/addFriends larry should add leo as a friend', function (done) {
                request(app)
                    .put('/api/users/' + larryID + '/addfriends')
                    .set('X-Authorization-Token', larryToken)
                    .send({
                        friend_id: leoID,
                    })
                    .expect(200)
                    .end(function (err, req) {
                        //console.log(req.res.body);

                        //res = JSON.parse(req.res.text);

                        //assert('token' in res, 'Token is not present in response');
                        //assert(res.token == larryToken, 'Token is not the good one');

                        done();
                    });
            });


            it('/users/:id/addFriends should throw 404 error', function (done) {
                request(app)
                    .put('/api/users/' + larryID + '/addfriends')
                    .set('X-Authorization-Token', larryToken)
                    .send({
                        friend_id: "leoID",
                    })
                    .expect(404, done);
            });

            it('/users/:id/friends should return larry\'s friends', function (done) {
                request(app)
                    .get('/api/users/' + larryID + '/friends')
                    .set('X-Authorization-Token', larryToken)
                    .expect(200)
                    .end(function (err, req) {
                        assert.isArray(req.res.body, "result is not array");

                        console.log(req.res.body);
                        done();
                    });
            });

            it('/users/:id/friends should throw 403 error', function (done) {
                request(app)
                    .get('/api/users/' + leoID + '/friends')
                    .set('X-Authorization-Token', larryToken)
                    .expect(403, done);
            });

            it('/users/:id/friends should throw 403 No token provided', function (done) {
                request(app)
                    .get('/api/users/' + leoID + '/friends')
                    .expect(403, done);
            });

            it('/users/:id/friends should throw 403 Invalid token', function (done) {
                request(app)
                    .get('/api/users/' + leoID + '/friends')
                    .set('X-Authorization-Token', 'larryToken')
                    .expect(403, done);
            });

            it('/users/:id/taken should return larry\'s taken proposition', function (done) {
                request(app)
                    .get('/api/users/' + larryID + '/taken')
                    .set('X-Authorization-Token', larryToken)
                    .expect(200, done);
            });

            it('/users/:id/pending should return larry\'s pending proposition', function (done) {
                request(app)
                    .get('/api/users/' + larryID + '/pending')
                    .set('X-Authorization-Token', larryToken)
                    .expect(200)
                    .end(function (err, req) {
                        assert.isArray(req.res.body, "result is not array");

                        done();
                    });
            });

            it('/users/:id/received should return larry\'s received proposition', function (done) {
                request(app)
                    .get('/api/users/' + larryID + '/received')
                    .set('X-Authorization-Token', larryToken)
                    .expect(200)
                    .end(function (err, req) {

                        console.log(req.res.body);
                        assert.isArray(req.res.body, "result is not array");

                        done();
                    });
            });

            it('/users/:id/sent should return larry\'s sent proposition', function (done) {
                request(app)
                    .get('/api/users/' + larryID + '/sent')
                    .set('X-Authorization-Token', larryToken)
                    .expect(200)
                    .end(function (err, req) {
                        assert.isArray(req.res.body, "result is not array");

                        done();
                    });
            });

            it('/users/:id/answers should return larry\'s pending answers', function (done) {
                request(app)
                    .get('/api/users/' + larryID + '/answers')
                    .set('X-Authorization-Token', larryToken)
                    .expect(200)
                    .end(function (err, req) {
                        assert.isArray(req.res.body, "result is not array");

                        done();
                    });
            });


            it('/users/:id/pendingall should return larry\'s pending proposition and answers', function (done) {
                request(app)
                    .get('/api/users/' + larryID + '/pendingall')
                    .set('X-Authorization-Token', larryToken)
                    .expect(200)
                    .end(function (err, req) {

                        var pendings = req.res.body;

                        assert.isObject(pendings, 'pendings is an object');

                        assert('propositions' in pendings, 'Propositions is not present');
                        assert('answers' in pendings, 'Answers is not present');

                        assert.isArray(pendings.propositions, "propositions is not array");
                        assert.isArray(pendings.answers, "answers is not array");

                        done();
                    });
            });
        });

        after(function (done) {

            User.findByIdAndRemove(larryID, function (err, results) {
                //console.log('larryID', results.id);
            });

            User.findByIdAndRemove(leoID, function (err, results) {
                //console.log('leoID', results.id);
            });
            User.findByIdAndRemove(sylID, function (err, results) {
                //console.log('sylID', results.id);
            });

            done();
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
                .get('/api/users/find/foo')
                .set('X-Authorization-Token', token)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('should not find the user with not-matching pattern', function (done) {
            request(app)
                .get('/api/users/find/baz')
                .set('X-Authorization-Token', token)
                .expect('Content-Type', /json/)
                .expect(404, done);
        })

        after(function (done) {
            User.findByIdAndRemove(id, done);
        });
    });

    describe('PUT /users/:id', function () {

        var userId, userToken;

        before(function (done) {
            Utils.createUser('larry', 'google', 'g@gmail.com', function (res) {
                userId = res.id;
                userToken = res.token;
                done();
            });
        });

        it('should update users avatar', function (done) {
            request(app)
                .put('/api/users/'+userId)
                .set('X-Authorization-Token', userToken)
                .send({
                    avatar: 'sample.jpg'
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, req) {
                    var res = JSON.parse(req.res.text);
                    assert('avatar' in res, 'Avatar was not updated');
                    assert(res.avatar == 'sample.jpg', 'Avatar was not updated correctly');

                    done();
                });
        });

        after(function (done) {
            User.findByIdAndRemove(userId, done);
        });
    });
});