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

	username: {
		type: String,
		index: {
			unique: true
		}
	},
	email: {
		type: String,
		index: {
			unique: true
		}
	},
	password: String,

	token: String,
	salt: String,
	avatar: String,
	active: { type: Boolean, default: true },
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
	}],

	appleDeviceTokens: [{ type: String }],

	androidDeviceTokens: [{ type: String }],

	resetPasswordToken: String,
	resetPasswordRequestedAt: Date

}, schemaOptions);

schema.virtual('id').get(function () {
	return this._id.toHexString();
});

module.exports = mongoose.model('User', schema);