// lib/models/proposition.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var schema   = new Schema({
	sender: Schema.Types.ObjectId,
	receiver: Schema.Types.ObjectId,
	sentAt: { type: Date, default: Date.now },
	receivedAt: { type: Date, default: Date.now },
	image: String,
	taken: { type: Boolean, default: false },
	takers: [
		{ id: Schema.Types.ObjectId, name: String }
	],
	meta: {
		takeCount: { type: Number, default: 0 }
	}
});

module.exports = mongoose.model('Proposition', schema);