var User = require('../models/user');
var security = require('../util/security');
var mailer = require('nodemailer');

var transport = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'syrupdev@gmail.com',
        pass: 'Maple212'
    }
});

module.exports = {
		request: function (req, res, next) {
			var token = security.token();
			
				User.findByIdAndUpdate(req.user.id, {
					resetPasswordToken: token,
					resetPasswordRequestedAt: Date.now
				}, function (err, user) {

					var options = {
						from: "T'en veux ?",
						to: user.email,
						subject: 'Changement de mot de passe',
						html: 'Cliquer sur ce lient pour changer votre mot de passe :'
					};

					res.status(201).send();
				});
		}
};