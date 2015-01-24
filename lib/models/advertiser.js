var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adschema = new Schema({
	name: String,
	logo: String,
	salt: String,
	tracking_id: {
		type: Number,
		default: 0
	}
});


module.exports = mongoose.model('Advertiser', adschema);