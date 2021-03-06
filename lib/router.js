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
var resettingController = require('./controllers/resetting');

var metricsController = require('./controllers/metrics');

var fs = require('fs');
var conf = require('../config/url');

var mediaRootUrl = 'http://localhost';



module.exports = function (app) {

	var router = express.Router();

	/* ---------- USERS API ------------ */

	router.post('/users', userController.create); // public route
	router.put('/users/:id/addfriends', checkToken(), userController.addFriend);
	router.put('/users/:id/unfriend', checkToken(), userController.unfriend);
	router.get('/users/:id/requests', checkToken(), userController.friendRequests);
	router.get('/users/:id/requests/sent', checkToken(), userController.sentFriendRequests);
	router.put('/users/:id/requests/dismiss', checkToken(), userController.dismissFriendRequest);

	router.post('/users/authenticate', userController.authenticate); // public route

	router.get('/users/find/:username', checkToken(), userController.find);
	router.get('/users/:id', checkToken(), userController.show);
	router.get('/users/:id/friends', checkToken(), userController.friends);
	router.get('/users/:id/taken', checkToken(), userController.takenPropositions);
	router.get('/users/:id/pending', checkToken(), userController.pendingPropositions);
	router.get('/users/:id/received', checkToken(), userController.receivedPropositions);
	router.get('/users/:id/sent', checkToken(), userController.sentPropositions);
	router.get('/users/:id/answers', checkToken(), userController.pendingAnswers);
	router.get('/users/:id/pendingall', checkToken(), userController.pendingPropositionsAndAnswers);
	router.put('/users/:id', checkToken(), userController.update);
	router.delete('/users/:id', checkToken(), userController.destroy);

	router.post('/users/:id/requestreset', checkToken(), resettingController.request);
	// router.get('/me', checkToken(), userController.me);

	//router.get('/users/:username', checkToken(), userController.findUser); // public route
	//router.put('/users/friend/:id', checkToken(), userController.addFriend); // public route

	/* ---------- PROPOSITIONS API --------- */

	router.post('/propositions', checkToken(), propositionController.send);
	router.get('/propositions/popular', checkToken(), propositionController.popular);
	router.get('/propositions/:id', checkToken(), propositionController.show);
	router.get('/propositions/:id/takers', checkToken(), propositionController.takers);

	router.put('/propositions/:id/take', checkToken(), propositionController.take);
	router.put('/propositions/:id/dismiss', checkToken(), propositionController.dismiss);


	/* ---------- ANSWER API ------------ */

	router.put('/answers/:id/acknowledge', checkToken(), answerController.acknowledge);

	/* ----------- Metrics API ------------- */

	router.get('/metrics/all', metricsController.all);
	router.get('/metrics/geos', metricsController.allGeo);

	/* ----------- MEDIA API ------------- */

	app.post('/images', checkToken(), mediaController.create);
	app.post('/images/:type',checkToken(), mediaController.create);
	//app.delete('/images/:file/remove', checkToken(), mediaController.remove);




	//Check for request location
	app.use(function (req, res, next) {
		var geoip = require('geoip-lite');

		var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
     
		if (ip === "127.0.0.1") {
			ip = "88.185.178.7";
		}

		var geo = geoip.lookup(ip);

		req.geoData = geo;

		next();
	});

	app.use('/api', bodyParser.json(), router);
};