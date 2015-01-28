// lib/models/proposition.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaOptions = {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
};

var schema = new Schema({

	image: String,

	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	receivers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],

	isPrivate: {
		type: Boolean,
		default: false
	},

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
		ref: 'Proposition',
		default: null
	},

	resenders: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],

	takers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],

	dismissers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],

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
}, schemaOptions);


schema.virtual('id').get(function () {
	return this._id.toHexString();
});



module.exports = mongoose.model('Proposition', schema);