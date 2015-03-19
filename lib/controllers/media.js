var crypto = require('crypto');
var fs = require('fs');

var uploads = __dirname + '/../../uploads/';
var storage = require('../util/storage');
var gm = require('gm');
var fs = require('fs');



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

				compress(file, function  (err, stdout, stderr) {
					storage.upload({
						file : stdout,
						name : cover,
						done : function () {
							storage.download('cov_2015-03-19_2633940fdc33edd45017bc731226d3f6.jpg', function (original, done) {
								var avatar = 'av_' + filename;

								thumb(res, type, original, cover, avatar, {
									success : function  () {
										res.status(201).json({
											filename : filename,
											avatar   : avatar
										});
									},
									error : function  (err) {
										res.status(500).json({
											error : err
										});
									}
								});
							});
						},
						error : function (err) {
							res.status(500).json({
								error: err
							});
						}
					});
				})
			}else{	

				filename = 'voil_' + filename;
				
				gm(file)
				.compress('JPEG')
				.stream(function (err, stdout, stderr) {
					if (err) {
						console.log("err", err);

						res.status(500).json({
							error: 'compression error'
						});

					} else {
						storage.upload({
							file : stdout,
							name : filename,
							done : function () {
								res.status(201).json({
									filename: filename
								});
							},
							error : function (err) {
								res.status(500).json({
									error: err
								});
							}
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

function compress (file, cb){
	gm(file)
	.compress('JPEG')
	.stream(function (err, stdout, stderr) {
		cb(err, stdout, stderr) ;
	});
}

function thumb (res, type, original, originalFileName, newFileName, cbs) {

	console.log("Got %j", originalFileName)

	gm(original)
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

					storage.upload({
						file : stdout,
						name : newFileName,
						done : cbs.success(newFileName),
						error : cbs.error({
							level : 'stream croped',
							message : err
						})
					});

				}else{
					console.error('resize', err);
					cbs.error({
						level : 'resize',
						message : err
					});
				}
			});
		}else{

			console.error('size', err);
			cbs.error({
				level : 'size',
				message : err
			});
		}
	});
	
}


module.exports = MediaController;