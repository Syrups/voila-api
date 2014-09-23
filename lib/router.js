var User = require('./models/user');
var Proposition = require('./models/proposition');
var userController = require('./controllers/user');
var propositionController = require('./controllers/proposition');
var tenveuController = require('./controllers/tenveu');


module.exports = function(app, router, passport) {

	router.get('/propositions/:id',  propositionController.show);
	router.get('/propositions/send', propositionController.send);
	router.get('/propositions/:id/take',   propositionController.take);
	router.get('/propositions/:id/takers', propositionController.takers);
	router.get('/users/create', 	   userController.create);
	router.get('/users/list',   	   userController.listContacts);

	router.get('/tenveu/send', 	   propositionController.send);
	router.get('/jenprend/send',   propositionController.take);

	router.get('/', function (req, res) {
		res.json({ message: "Hello World" });
	});

	app.use('/api', router);

};
