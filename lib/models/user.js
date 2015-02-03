// lib/models/user.js

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

	name: String,
	password: String,
	email: String,
	token: String,
	salt: String,
	avatar: String,
	sent: {
		type: Number,
		default: 0
	},
	taken: {
		type: Number,
		default: 0
	},

	friends: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
}, schemaOptions);

schema.virtual('id').get(function () {
	return this._id.toHexString();
});

module.exports = mongoose.model('User', schema);