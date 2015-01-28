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
	proposition: { type: Schema.Types.ObjectId, ref: 'Proposition' },
	answer: String,
	answeredAt: { type: Date, default: Date.now },
	from: { type: Schema.Types.ObjectId, ref: 'User' },
	to: { type: Schema.Types.ObjectId, ref: 'User' },
	acknowledged: { type: Boolean, default: false }
}, schemaOptions);

schema.virtual('id').get(function () {
	return this._id.toHexString();
});


module.exports = mongoose.model('Answer', schema);