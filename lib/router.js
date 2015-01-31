var express = require('express');
var checkToken = require('./middlewares/check-token');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var User = require('./models/user');
var Proposition = require('./models/proposition');
var userController = require('./controllers/user');
var propositionController = require('./controllers/proposition');
var answerController = require('./controllers/answer');
var mediaController = require('./controllers/media');

var fs = require('fs');
var conf = require('../config/url');

var mediaRootUrl = 'http://localhost';



module.exports = function (app, passport) {

	var router = express.Router();

	/* ---------- USERS API ------------ */

	router.post('/users', userController.create); // public route
	router.get('/users/authenticate', userController.authenticate); // public route
	router.post('/users/friends', checkToken(), userController.addFriend);
	router.get('/users/find', checkToken(), userController.find);
	router.get('/users/:id', checkToken(), userController.show);
	router.get('/users/:id/friends', checkToken(), userController.friends);
	router.get('/users/:id/taken', checkToken(), userController.takenPropositions);
	router.get('/users/:id/pending', checkToken(), userController.pendingPropositions);
	router.get('/users/:id/received', checkToken(), userController.receivedPropositions);
	router.get('/users/:id/sent', checkToken(), userController.sentPropositions);
	router.get('/users/:id/answers', checkToken(), userController.pendingAnswers);
	router.get('/users/:id/pendingall', checkToken(), userController.pendingPropositionsAndAnswers);
	// router.get('/me', checkToken(), userController.me);

	//router.get('/users/:username', checkToken(), userController.findUser); // public route
	//router.put('/users/friend/:id', checkToken(), userController.addFriend); // public route


	/* ---------- PROPOSITIONS API --------- */

	router.post('/propositions', checkToken(), propositionController.send);
	router.get('/propositions/:id', checkToken(), propositionController.show);
	router.get('/propositions/:id/acknowledge', checkToken(), propositionController.acknowledge);
	router.get('/propositions/:id/take', checkToken(), propositionController.take);
	router.get('/propositions/:id/dismiss', checkToken(), propositionController.dismiss);
	router.get('/propositions/:id/takers', checkToken(), propositionController.takers);


	/* ---------- ANSWER API ------------ */

	router.get('/answers/:id/acknowledge', checkToken(), answerController.acknowledge);

	/* ----------- MEDIA API ------------- */

	app.post('/images', checkToken(), mediaController.create);

	app.use('/api', bodyParser.json(), router);

};