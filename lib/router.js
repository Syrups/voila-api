var express = require('express');
var passport = require('passport');
var User = require('./models/user');
var Proposition = require('./models/proposition');
var userController = require('./controllers/user');
var propositionController = require('./controllers/proposition');

var router = express.Router();

router.get('/propositions/create', propositionController.create);
router.get('/propositions/take',   propositionController.take);
router.get('/users/create', 	   userController.create);
router.get('/users/list',   	   userController.listContacts);

router.get('', function (req, res) {
	res.json({ message: "Hello World" });
});

exports.router = router;