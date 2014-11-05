var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	name: String,
	logo: String,
	salt: String,
	advertisers: [
		type: Schema.Types.ObjectId,
		ref: 'Advertiser'
	],
	onwner: {
		type: Schema.Types.ObjectId,
		ref: 'SpotOwner'
	},
});


module.exports = mongoose.model('PublishingSpot', schema);