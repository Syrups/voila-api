// lib/models/proposition.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var schema   = new Schema({
	sender: Number,
	receiver: Number,
	sentAt: { type: Date, default: Date.now },
	receivedAt: { type: Date, default: Date.now }
	meta: {
		takeCount: { type: Number, default: 0 }
	}
});

module.exports = mongoose.model('Proposition', schema);