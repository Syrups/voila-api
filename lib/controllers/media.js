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

		var type = req.param('type');

		req.busboy.on('file', function (fieldname, file, filename) {

			var d = new Date();
			filename = d.toISOString().substring(0, 10)+'_'+md5.update(filename + d.toString()).digest('hex') + ".jpg";
			var path = uploads + filename;

			if(type && type == 'avatar'){

				var cover = filename;
				//upload original
				storage.upload(cover, file, function () {

					var avatar = 'av_' + filename
					gm(file)
					.size({bufferStream: true}, function (err, size) {
						if (!err) {

							var y = (size.height * 0.5) - (size.width / 2);
							var wh = 100;

							this
							.crop(size.width, size.width, 0, y)
							.resize(wh)
							//.quality(100)
							.stream(function (err, stdout, stderr) {

								if (!err) {
									//upload thumb
									storage.upload(avatar, stdout, function () {
										res.status(201).json({
											filename: avatar,
											cover : cover
										});
									});
								}else{
									console.log(err);
									res.status(500).json({
										error: err
									});
								}
							});
						}else{
							res.status(500).json({
								error: err
							});
						}
					});
				});
			}
			else{

				filename = 'voil_' + filename
				storage.upload(filename, file, function () {
					res.status(201).json({
						filename: filename
					});
				});
			}
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