var fs = require('fs');

var gcloud = require('gcloud');

var bucket = gcloud.storage({
	projectId: 'ten-veux-test',
	keyFilename: __dirname+'/../../config/gcloud.json'
}).bucket('tenveux-medias');

module.exports = {
	upload: function (name, stream, cb) {

		var file = bucket.file(name);
		var gCloudStream = file.createWriteStream();

		var out = '';
		// make file public
		file.acl.add({
			scope: 'allUsers',
			role: gcloud.storage.acl.READER_ROLE,
			generation: 1
		}, function (err, aclObject) {

			console.info('file.acl.add %j', name);

			gCloudStream
			.on('error', function(err) {
				console.error('gc error', err);
			}).on('finish', function () {
				console.info('all writes are now finished.', name);
				//cb();
			});

			stream.pipe(gCloudStream)
			.on('close', function() {

				console.log('closed');

			}).on('error', function(err) {

				console.error('stream error', err);

			})
			.on('end', function () {

				console.info('end', name);
				cb();
			});
		});
	},

	download: function (name, cb) {

		var file = bucket.file(name);
		var image = file.createWriteStream();

		cb(image.createReadStream())
	}
}

