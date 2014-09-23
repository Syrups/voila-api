/*
 * 
 * https://github.com/leoht/tenveux
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */

var APP_ROOT = __dirname,
	express  = require('express'),
	bodyParser = require('body-parser'),
	errorHandler = require('error-handler'),
	path 	 = require('path'),
	mongoose = require('mongoose'),
	router = require('./router').router,
	bootstrap = require('./middlewares/bootstrap'),
	shutdown = require('./middlewares/shutdown'),
	checkToken = require('./middlewares/check-token');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bootstrap());
app.use(shutdown());

app.use('/api', checkToken());
app.use('/api', router);

exports.app = app;