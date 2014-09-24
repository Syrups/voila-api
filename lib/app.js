/*
 * 
 * https://github.com/leoht/tenveux
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */

 var APP_ROOT = __dirname,
 //errorHandler = require('error-handler'),
 //path 	 = require('path');
 bootstrap = require('./middlewares/bootstrap'),
 shutdown = require('./middlewares/shutdown');

 //var session = require('express-session');
 //var morgan  = require('morgan');
 var bodyParser     = require('body-parser');
 //var methodOverride = require('method-override');
 var mongoose = require('mongoose');
 //var cookieparser  = require('cookie-parser');
 // var passport = require('passport');

 var app = require('express')();


 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());

 app.use(bootstrap());
 app.use(shutdown());

 // routes ======================================================================
require('./router.js')(app);

//app.use('/api', checkToken());


 exports.app = app;