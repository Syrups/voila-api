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
        var glennID, sylID, leoID;
        var glennToken, sylToken;

        before(function (done) {


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
        });

        describe('GET /users/authenticate', function () {

            it('should authenticate with good credentials', function (done) {

                request(app)
                    .get('/api/users/authenticate')
                    .send({
                        username: 'glenn',
                        password: 'google'
                    })
                    .expect(200)
                    .end(function (err, req) {
                        res = JSON.parse(req.res.text);

                        assert('token' in res, 'Token is not present in response');
                        assert(res.token == glennToken, 'Token is not the good one');

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
                        username: 'glenn',
                        password: 'baz'
                    })
                    .expect(403, done);
            });
        });

        describe('User API Friends', function () {

            it('/users/:id/addFriends Glenn should add leo as a friend', function (done) {
                request(app)
                    .put('/api/users/' + glennID + '/addfriends')
                    .set('X-Authorization-Token', glennToken)
                    .send({
                        friend_id: leoID,
                    })
                    .expect(200)
                    .end(function (err, req) {
                        //console.log(req.res.body);

                        //res = JSON.parse(req.res.text);

                        //assert('token' in res, 'Token is not present in response');
                        //assert(res.token == glennToken, 'Token is not the good one');

                        done();
                    });
            });

            it('/users/:id/friends should return glenn\'s friends', function (done) {
                request(app)
                    .get('/api/users/' + glennID + '/friends')
                    .set('X-Authorization-Token', glennToken)
                    .expect(200)
                    .end(function (err, req) {
                        assert.isArray(req.res.body, "result is not array");

                        done();
                    });
            });

            it('/users/:id/friends should throw 403 error', function (done) {
                request(app)
                    .get('/api/users/' + leoID + '/friends')
                    .set('X-Authorization-Token', glennToken)
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
                    .set('X-Authorization-Token', 'glennToken')
                    .expect(403, done);
            });

            it('/users/:id/taken should return glenn\'s taken proposition', function (done) {
                request(app)
                    .get('/api/users/' + glennID + '/taken')
                    .set('X-Authorization-Token', glennToken)
                    .expect(200, done);
            });

            it('/users/:id/pending should return glenn\'s pending proposition', function (done) {
                request(app)
                    .get('/api/users/' + glennID + '/pending')
                    .set('X-Authorization-Token', glennToken)
                    .expect(200)
                    .end(function (err, req) {
                        assert.isArray(req.res.body, "result is not array");

                        done();
                    });
            });

            it('/users/:id/received should return glenn\'s received proposition', function (done) {
                request(app)
                    .get('/api/users/' + glennID + '/received')
                    .set('X-Authorization-Token', glennToken)
                    .expect(200)
                    .end(function (err, req) {
                        assert.isArray(req.res.body, "result is not array");

                        done();
                    });
            });

            it('/users/:id/sent should return glenn\'s sent proposition', function (done) {
                request(app)
                    .get('/api/users/' + glennID + '/sent')
                    .set('X-Authorization-Token', glennToken)
                    .expect(200)
                    .end(function (err, req) {
                        assert.isArray(req.res.body, "result is not array");

                        done();
                    });
            });

            it('/users/:id/answers should return glenn\'s pending answers', function (done) {
                request(app)
                    .get('/api/users/' + glennID + '/answers')
                    .set('X-Authorization-Token', glennToken)
                    .expect(200)
                    .end(function (err, req) {
                        assert.isArray(req.res.body, "result is not array");

                        done();
                    });
            });


            it('/users/:id/pendingall should return glenn\'s pending proposition and answers', function (done) {
                request(app)
                    .get('/api/users/' + glennID + '/pendingall')
                    .set('X-Authorization-Token', glennToken)
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

            User.findByIdAndRemove(glennID, function (err, results) {
                //console.log('glennID', results.id);
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
});