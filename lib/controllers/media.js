var crypto = require('crypto');
var fs = require('fs');

var uploads = __dirname + '/../../uploads/';
var storage = require('../util/storage');
var gm = require('gm');

/**
TODO : upload on google appEngine !
*/
var MediaController = {
	create: function (req, res, next) {
		var fstream;
		var md5 = crypto.createHash('md5');

		req.pipe(req.busboy);

		req.busboy.on('file', function (fieldname, file, filename) {
			var d = new Date();
			filename = d.toISOString().substring(0, 10)+'_'+md5.update(filename + d.toString()).digest('hex') + ".jpg";

			var path = uploads + filename;

			/*storage.upload(filename, file, function () {
				res.status(201).json({
					filename: filename
				});
			})*/


			gm(file)
			.size({bufferStream: true}, function (err, size) {
				if (!err) {
					console.log('width = ' + size.width);
					console.log('height = ' + size.height);

					var y = (size.height * 0.5) - (size.width / 2);
					var wh = 100;

					this
					.crop(size.width, size.width, 0, y)
					.thumb(wh, wh, path, 100, function(err) {
			                // save thumbnail
			                if (!err) {
			                	console.log('done');
			                	res.status(201).json({
			                		filename: filename
			                	});
			                }
			                else  {
			                	console.log(err);
			                }
			        });
				}
			});

			//fstream = fs.createWriteStream(path);
			//file.pipe(fstream);
			
			/*fstream.on('close', function () {

				//console.log("Uploading: %s ", fullUrl + '/' + filename);

				res.status(201).json({
					filename: filename
				});
});*/
		});
	},

	remove: function (file) {

		fs.unlink(uploads + file, function (err) {
			/* istanbul ignore if  */
			if (err) throw err;
			//console.info('successfully deleted %s', file);
		});
	}
}

module.exports = MediaController;