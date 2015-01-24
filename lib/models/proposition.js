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
<<<<<<< HEAD

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
	},

=======
	sender: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	receivers: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
>>>>>>> 66c19cb68809d1588c169786825d6f52bf8612fb
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
<<<<<<< HEAD

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

=======
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
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	dismissers: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
>>>>>>> 66c19cb68809d1588c169786825d6f52bf8612fb
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