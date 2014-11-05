var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	name: String,
	salt: String,
	isMerchant: Boolean,
	spots: [
		type: Schema.Types.ObjectId,
		ref: 'PublishingSpot'
	],
	tracking_id: {
		type: Number,
		default: 0
	}
});


module.exports = mongoose.model('SpotOwner', schema);