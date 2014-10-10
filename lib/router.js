var express = require('express');
var checkToken = require('./middlewares/check-token');

var User = require('./models/user');
var Proposition = require('./models/proposition');
var userController = require('./controllers/user');
var propositionController = require('./controllers/proposition');
var tenveuController = require('./controllers/tenveu');
var codeController = require('./controllers/code');


module.exports = function(app, passport) {

	var router = express.Router();

	router.post('/propositions', 			checkToken(), propositionController.send);
	router.get('/propositions/:id',  			checkToken(), propositionController.show);
	router.get('/propositions/:id/take',   		checkToken(), propositionController.take);
	router.get('/propositions/:id/takers', 		checkToken(), propositionController.takers);

	router.get('/me',							checkToken(), userController.me);
	router.get('/users/create', 	   			userController.create);
	router.get('/users/:id', 	   	   			checkToken(), userController.show);
	router.get('/users/:id/taken',   	   		checkToken(), userController.takenPropositions);
	router.get('/users/:id/pending',   	   		checkToken(), userController.pendingPropositions);
	router.get('/users/:id/received',   	   	checkToken(), userController.receivedPropositions);
	router.get('/users/:id/sent',   	   		checkToken(), userController.takenPropositions);



	// Following routes are not behind the checkToken firewall
	// No token is required.

	
	router.get('/codes/request/:phone',    		codeController.requestCode);
	router.get('/codes/validate/:code',    		codeController.validate);

	app.use('/api', router);

};
