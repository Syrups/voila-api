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

var mongoose = require('mongoose');
var db = require('../config/db');

//var session = require('express-session');
//var morgan  = require('morgan');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
//var methodOverride = require('method-override');
//var cookieparser  = require('cookie-parser');
var passport = require('passport');

var app = require('express')();
var express = require('express');
var appleApn = require('./util/apple-push-service');

// mongoose.connect('mongodb://heroku_app32519883:efdotsksga3dqu0bleqhtge24l@ds063180.mongolab.com:63180/heroku_app32519883');
mongoose.connect('mongodb://db:27017/tenveux');
appleApn.connect();

app.use(bodyParser.urlencoded({ 
	extended: true
}));
app.use(bodyParser.json());
app.use(busboy());

app.use("/media", express.static(__dirname + '/../uploads'));

app.use(bootstrap());
app.use(shutdown());

// routes ======================================================================
require('./router.js')(app);

//app.use('/api', checkToken());


exports.app = app;