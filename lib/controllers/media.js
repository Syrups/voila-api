var crypto = require('crypto');
var fs = require('fs');


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
			filename = md5.update(filename + d.toString()).digest('hex') + ".jpg";



			path = __dirname + '/../../uploads/' + filename;
			fstream = fs.createWriteStream(path);
			file.pipe(fstream);
			fstream.on('close', function () {

				//console.log("Uploading: %s ", fullUrl + '/' + filename);

				res.status(201).json({
					filename: filename
				});
			});
		});
	}
}

module.exports = MediaController;