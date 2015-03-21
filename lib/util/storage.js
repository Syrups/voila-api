

var gcloud = require('gcloud');

var bucket = gcloud.storage({
	projectId: 'ten-veux',
	keyFilename: __dirname+'/../../config/gcloud.json'
}).bucket('tenveuxmedia');

var fs = require('fs');

module.exports = {
	upload: function (params) {

		var stream = params.file;
		var name = params.name;

		var file = bucket.file(name);

	
		stream
		.pipe(file.createWriteStream())
		.on('error', function(err) {
			params.error(err);
		})
		.on('end', function () {

			setTimeout(function() {
			    params.done(name);
			}, 3000);
			
		}).on('complete', function() {
			console.log('Complete %j ', name);
		});
	},

	getUrl : function (name, cb) {
		var file = bucket.file(name);

		file.getSignedUrl({
            action: 'read',
            expires: Math.round(Date.now() / 1000) + (60 * 60 * 24), // 1 day.
            resource: name
        }, function (err, url) {
        	cb(err, url);
        });
	},

	download: function (name, cb) {

		var image = bucket.file(name);
		console.log('downloading... %j', name);
		var fileContents = new Buffer('');

		image.createReadStream()
			.on('data', function(chunk) {
				fileContents = Buffer.concat([fileContents, chunk]);
			})
			.on('complete', function() {
				// `fileContents` is ready
				console.log('%j fileContents` is ready', name);
				cb(fileContents);
			});
	}
}