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

			gCloudStream.on('pipe', function() {
			 	console.error('something is piping into the writer');
			}).on('error', function(err) {
				console.error(err);
			}).on('finish', function () {
				console.info('all writes are now complete.', name);
				cb();
			});

			stream.pipe(gCloudStream);
			stream.on('close', function() {

				console.log('closed');

			}).on('data', function(chunk) {

			 	console.log('got %d bytes of data', chunk.length);

			}).on('error', function(err) {

				console.error(err);

			}).on('end', function () {

				console.info('end', name);
				cb();
			});
		});
	}
}

