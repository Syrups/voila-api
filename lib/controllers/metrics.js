	
var GeoData = require('../models/geoData');

module.exports = {
	
	allGeo: function (req, res, next) {

		GeoData.find({}).populate('proposition').exec(function (err, docs) {

		res.header('Access-Control-Allow-Origin', '*');
    	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    	res.header('Access-Control-Allow-Headers', 'Content-Type');

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

		res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

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