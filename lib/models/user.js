// lib/models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

	name: String,
	password: String,
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
});

module.exports = mongoose.model('User', schema);