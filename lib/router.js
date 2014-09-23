var User = require('./models/user');
var Proposition = require('./models/proposition');
var userController = require('./controllers/user');
var propositionController = require('./controllers/proposition');
var tenveuController = require('./controllers/tenveu');


module.exports = function(app, router, passport) {
	//router.get('/propositions/create', propositionController.create);
	//router.get('/propositions/take',   propositionController.take);
	//router.get('/users/create', 	   userController.create);
	//router.get('/users/list',   	   userController.listContacts);

	router.get('/tenveu/send', tenveuController.send);
	router.get('/jenprend/send',   tenveuController.send);

	app.use('/api', router);

	app.get('/', function (req, res) {
		res.json({ message: "Hello World" });
	});

}
