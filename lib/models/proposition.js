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
		Schema.Types.ObjectId
	],
	dismissers: [
		Schema.Types.ObjectId
	],
	meta: {
		takeCount: {
			type: Number,
			default: 0
		}
	}
}, schemaOptions);


schema.virtual('id').get(function(){
    return this._id.toHexString();
});



module.exports = mongoose.model('Proposition', schema);