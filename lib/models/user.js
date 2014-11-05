// lib/models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	facebookId: String,
	name: String,
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

	//I'll explain all about it {
	isAdvertisingUnit: {
		type: Boolean,
		default: false
	},
	linkedAdvertiser: {
		type: Schema.Types.ObjectId,
		ref: 'Advertiser'
	}
	//}
});


module.exports = mongoose.model('User', schema);