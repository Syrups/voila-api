// lib/models/proposition.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var schema   = new Schema({
	sender: String,
	receiver: String,
	calledback: Boolean,
	sentAt: { type: Date, default: Date.now },
	receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('tenveu', schema);