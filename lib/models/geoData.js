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

	proposition: {
		type: Schema.Types.ObjectId,
		ref: 'Proposition'
	},
	geo: Schema.Types.Mixed

}, schemaOptions);

schema.virtual('id').get(function () {
	return this._id.toHexString();
});

module.exports = mongoose.model('GeoData', schema);