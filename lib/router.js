var User = require('./models/user');
var Proposition = require('./models/proposition');
var userController = require('./controllers/user');
var propositionController = require('./controllers/proposition');


module.exports = function(app, router, passport) {
	router.get('/propositions/create', propositionController.create);
	router.get('/propositions/take',   propositionController.take);
	router.get('/users/create', 	   userController.create);
	router.get('/users/list',   	   userController.listContacts);

	router.get('/tenveu/send', propositionController.create);
	router.get('/jenprend/send',   propositionController.take);

	app.use('/api', router);

	app.get('/', function (req, res) {
		res.json({ message: "Hello World" });
	});

}
