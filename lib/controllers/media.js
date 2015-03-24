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


			if(type && type == 'avatar'){
				filename = req.user.id;
				var cover = 'cov_' + filename + ".jpg"

				compress(file, function  (err, stdout, stderr) {
					storage.upload({
						file : stdout,
						name : cover,
						done : function () {

							storage.getUrl(cover, function  (err, url) {

								if(err){
									res.status(404).json({
										level : 'getUrl :' + url,
										error : err
									});
								}else {

									//res.redirect(url);
									/*res.status(200).json({
										level : 'getUrl',
										url : url
									});*/

									storage.download(cover, function (original) {
										var avatar = 'av_' + filename + ".jpg";

										thumb(res, type, original, cover, avatar, {
											success : function  (newFile) {
												res.status(201).json({
													filename : cover,
													avatar   : newFile
												});
											},
											error : function  (err) {
												console.log(err.message)
												res.status(500).json({
													error : err
												});
											}
										});
									});
								}
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

				var d = new Date();
				var md5 = crypto.createHash('md5');

				filename = d.toISOString().substring(0, 10)+'_'+md5.update(filename + d.toString()).digest('hex') + ".jpg";
				filename = 'voil_' + filename;

				var path = uploads + filename;
				
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

function write_local(file, filename, cbs){
	var path = uploads + filename;

	file.pipe(fs.createWriteStream(path))
	.on('error', function(err) {
		cbs.error(err);
	})
	.on('end', function() {
		console.log('%j fileContents` is ready', name);
		cbs.done(path);
	});
}


function thumb (res, type, original, originalFileName, newFileName, cbs) {

	//console.log("Got %j", originalFileName)

	gm(original)
	.size({bufferStream: true}, function (err, size) {
		if (!err) {

			var y = (size.height * 0.5) - (size.width / 2);
			var wh = 100;

			//console.info('MediaController size %s', originalFileName);

			this
			.compress('JPEG')
			.crop(size.width, size.width, 0, y)
			.resize(wh)
			.stream(function (err, stdout, stderr) {

				//console.info('MediaController resize %s', originalFileName);

				if (!err) {
					//console.info('MediaController upload thumb %s', newFileName);

					/*write_local(stdout, newFileName, {
						done : function  (filename) {
							cbs.success(filename);
						},
						error : function  (err) {
							cbs.error({
								level : 'stream croped',
								message : err
							});
						}
					});*/

					storage.upload({
						file : stdout,
						name : newFileName,
						done : function  (filename) {
							cbs.success(filename);
						},
						error : function  (err) {
							cbs.error({
								level : 'stream croped',
								message : err
							});
						}
					});
				}else{
					cbs.error({
						level : 'resize',
						message : err
					});
				}
			});
		}else{
			cbs.error({
				level : 'size',
				message : err
			});
		}
	});	
}


module.exports = MediaController;