// lib/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var schema   = new Schema({
	facebookId: String,
	name: String,
	token: String,
	salt: String,
	sent: { type: Number, default: 0 },
	taken: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', schema);