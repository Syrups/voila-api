// lib/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var schema   = new Schema({
	phone: String,
	name: String,
	token: String
});

module.exports = mongoose.model('User', schema);