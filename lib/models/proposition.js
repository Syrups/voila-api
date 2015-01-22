// lib/models/proposition.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var schemaOptions = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    }
  };

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
		ref: 'Proposition',
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
	dismissers: [
		Schema.Types.ObjectId
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
}, schemaOptions);


schema.virtual('id').get(function(){
    return this._id.toHexString();
});



module.exports = mongoose.model('Proposition', schema);