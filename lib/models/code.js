// lib/models/code.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var schema   = new Schema({
	phone: String,
	code: String,
	used: { type: Boolean, default: false },
	expires: { type: Date, default: new Date(new Date().getTime() + 1000*60*60) } // expires in 1 hour
});

module.exports = mongoose.model('Code', schema);