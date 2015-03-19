

var gcloud = require('gcloud');

var bucket = gcloud.storage({
	projectId: 'ten-veux',
	keyFilename: __dirname+'/../../config/gcloud.json'
}).bucket('tenveuxmedia');

var fs = require('fs');
var tmp = require('tmp');
var temp = require('temp');

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
			params.done();
		});
	},

	download: function (name, cb) {

		var image = bucket.file(name);
		console.log('downloading... %j', name);

		tmp.file({postfix: '.jpg' }, function _tempFileCreated(err, path, fd, cleanupCallback) {
			if (err){
				console.log('tmp error', err)
			}else{
				console.log("File: ", path);
				//console.log("Filedescriptor: ", fd);
			
				image.createReadStream()
				.pipe(fs.createWriteStream(path))
				.on('error', function(err) {
					console.log('pipe error', err)
				})
				.on('end', function () {
					console.log('pipe end', err)
					cb(path, cleanupCallback);
				});
			}
		});
	}
}