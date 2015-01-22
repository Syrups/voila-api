var MediaController = {
	create: function (req, res, next) {
		var fstream;
		var md5 = crypto.createHash('md5');
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {
			var d = new Date();
			filename = md5.update(filename + d.toString()).digest('hex') + ".jpg";

			console.log("Uploading: " + filename);

			path = __dirname + '/../uploads/' + filename;
			fstream = fs.createWriteStream(path);
			file.pipe(fstream);
			fstream.on('close', function () {
				res.status(201).json({
					code: 201,
					filename: conf.mediaRootUrl + '/' + filename
				});
			});
		});
	}
}

module.exports = MediaController;