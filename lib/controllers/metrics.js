	
var GeoData = require('../models/geoData');
var Proposition = require('../models/proposition');
var User = require('../models/user');
var _ = require('underscore');

module.exports = {
	

	all:function(req, res, next){

		res.header('Access-Control-Allow-Origin', '*');
    	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    	res.header('Access-Control-Allow-Headers', 'Content-Type');

		var data = {};

		
		Proposition.find({})
		.populate('sender')
		.exec(function (err, docs) {
			/* istanbul ignore else  */
		    if (err){ 
		    	res.status(500).json(docs);
		    } else {
		    	// Total number of tenveux
		    	data.propositions = docs.length;

		    	// Last tenveux
		    	data.lastPropositions = docs.slice(0,5)

		    	// most reshared
		    	data.topReshared = docs.sort(function(a, b){
				 	return b.resenders.length - a.resenders.length;
				}).slice(0,5)

				// Most taken
				data.topTaken = docs.sort(function(a, b){
				 	return b.takers.length - a.takers.length; 
				}).slice(0,5)

				// Most dimissed
				data.topDismissed = docs.sort(function(a, b){
				 	return b.dismissers.length - a.dismissers.length; 
				}).slice(0,5)

				// Top senders
				User.find({})
					.sort({sent: -1})
					.exec(function (err, docs) {
						/* istanbul ignore else  */
					    if (!err){
					    	data.users = docs.length; 
					    	data.topSenders = docs.slice(0,5)

					    	res.status(200).json(data);
					    } 
					});
		    }
		});
	},

	allGeo: function (req, res, next) {

		res.header('Access-Control-Allow-Origin', '*');
    	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    	res.header('Access-Control-Allow-Headers', 'Content-Type');

		GeoData.find({}).populate('proposition').exec(function (err, docs) {
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