// lib/models/code.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var schema   = new Schema({
	phone: String,
	code: String,
	used: { type: Boolean, default: false }
});

module.exports = mongoose.model('Code', schema);