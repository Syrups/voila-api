// lib/models/proposition.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	sender: String,
	receivers: [
		String
	],
	senderName: String,
	sentAt: {
		type: Date,
		default: Date.now
	},
	receivedAt: {
		type: Date,
		default: null
	},
	originalProposition: {
		type: Schema.Types.ObjectId,
		default: null
	},
	image: String,
	taken: {
		type: Boolean,
		default: false
	},
	dismissed: {
		type: Boolean,
		default: false
	},
	reproposedCount: {
		type: Number,
		default: 0
	},
	takers: [
		String
	],
	dismissers: [
		String
	],
	meta: {
		takeCount: {
			type: Number,
			default: 0
		}
	},
	answerAcknowledged: {
		type: Boolean,
		default: false,
	}
});

module.exports = mongoose.model('Proposition', schema);