var crypto = require('crypto');
var fs = require('fs');

var uploads = __dirname + '/../../uploads/';
//var storage = require('../util/storage');
var gm = require('gm');
var fs = require('fs');


var gcloud = require('gcloud');
//var storage = gcloud.storage();
var bucket = gcloud.storage({
	projectId: 'ten-veux',
	keyFilename: __dirname+'/../../config/gcloud.json'
}).bucket('tenveuxmedia');


var MediaController = {
	create: function (req, res, next) {
		var fstream;
		var type = req.param('type');
		
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {

			var d = new Date();
			var md5 = crypto.createHash('md5');

			filename = d.toISOString().substring(0, 10)+'_'+md5.update(filename + d.toString()).digest('hex') + ".jpg";
			var path = uploads + filename;

			if(type && type == 'avatar'){
				var cover = 'cov_' + filename;	

				console.info('MediaController compress %s', filename);
				storage.upload(cover, file, function () {
					storage.download(cover, function (original) {

						var avatar = 'av_' + filename;
						var readStream = original.createReadStream();

						piper(res, type, readStream, cover, avatar, function (doneFile) {
							
							res.status(201).json({
								filename: doneFile,
								cover : cover
							});
							
						});
					});
				});


			}else{	

				filename = 'voil_' + filename;
				var gFile = bucket.file(filename);

				gm(file)
				.compress('JPEG')
				.stream(function (err, stdout, stderr) {
					if (err) {
						console.log("err", err);
					} else {

							fstream = gFile.createWriteStream(); 
							fstream.on('error', function(err) {
								res.status(500).json({
									error: err
								});
							})
							.on('finish', function () {
								res.status(201).json({
									filename: filename
								});
							});

							stdout.pipe(fstream)
							.on('error', function(err) {
								res.status(500).json({
									error: err
								});
							});
						}
					});
			}	
		});
},

remove: function (file) {

	fs.unlink(uploads + file, function (err) {
		/* istanbul ignore if  */
		if (err) throw err;
		/*console.info('successfully deleted %s', file);*/
	});
},
};

function piper (res, type, original, originalFileName, newFileName, cb) {

	console.log("got %j", original)

	gm(original)
	.setFormat(format)
	.size({bufferStream: true}, function (err, size) {
		if (!err) {

			var y = (size.height * 0.5) - (size.width / 2);
			var wh = 100;

			console.info('MediaController size %s', originalFileName);

			this
			.crop(size.width, size.width, 0, y)
			.resize(wh)
			.stream(function (err, stdout, stderr) {

				console.info('MediaController resize %s', originalFileName);

				if (!err) {
					console.info('MediaController upload thumb %s', newFileName);

					storage.upload(newFileName, stdout, function () {
						cb(newFileName);
					});

				}else{
					console.log("resize fail", err);
					res.status(500).json({
						error: err
					});
				}
			});
		}else{
			console.log("size fail ", err);
			res.status(500).json({
				error: err
			});
		}
	});
	
}


module.exports = MediaController;