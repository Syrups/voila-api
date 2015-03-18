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

		// make file public
		file.acl.add({
			scope: 'allUsers',
			role: gcloud.storage.acl.READER_ROLE,
			generation: 1
		}, function (err, aclObject) {

			console.info('file.acl.add %s', name);

			stream.pipe(gCloudStream);

			stream.on('close', function() {
				console.log('closed');
			});

			stream.on('data', function(chunk) {
			 	console.log('got %d bytes of data', chunk.length);
			});

			stream.on('error', function(err) {
				console.log(err);
			});

			stream.on('end', function () {

				console.info('end', name);
				cb();
			});
		});
	}
}

