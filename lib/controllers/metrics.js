	
var GeoData = require('../models/geoData');

module.exports = {
	
	allGeo: function (req, res, next) {

		GeoData.find({}, function(err, docs) {

			/* istanbul ignore else  */
		    if (!err){ 
		    	res.status(200).json(docs);
		    } else {
		    	res.status(500).json({
					error: err
				});
		    }
		});
	},

	allPropositionByGeo: function (req, res, next) {

		GeoData.find({}, function(err, docs) {

			/* istanbul ignore else  */
		    if (!err){ 
		    	res.status(200).json(docs);
		    } else {
		    	res.status(500).json({
					error: err
				});
		    }
		});
	}
}