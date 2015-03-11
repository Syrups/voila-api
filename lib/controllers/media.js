var crypto = require('crypto');
var fs = require('fs');

var uploads = __dirname + '/../../uploads/';
var storage = require('../util/storage');

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

			storage.upload(filename, file, function () {
				res.status(201).json({
					filename: filename
				});
			})

			// path = uploads + filename;
			// fstream = fs.createWriteStream(path);
			// file.pipe(fstream);
			// fstream.on('close', function () {

			// 	//console.log("Uploading: %s ", fullUrl + '/' + filename);

			// 	res.status(201).json({
			// 		filename: filename
			// 	});
			// });
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