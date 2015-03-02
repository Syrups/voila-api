/*
 *
 * https://github.com/leoht/tenveux
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */
'use strict';

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development'
}

var app = require('./lib/app').app;
var port = Number(process.env.PORT || 8080);

app.listen(port, '0.0.0.0');

console.log(' [x] Listening on port ' + port);