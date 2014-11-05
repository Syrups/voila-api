// lib/models/proposition.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	proposition: { type: Schema.Types.ObjectId, ref: 'Proposition' },
	answer: String,
	answeredAt: { type: Date, default: Date.now },
	from: String,
	fromName: String,
	to: String,
	acknowledged: { type: Boolean, default: false }
});

module.exports = mongoose.model('Answer', schema);