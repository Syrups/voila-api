var Proposition = require('../models/proposition');
var Answer = require('../models/answer');
var User = require('../models/user');

module.exports = {

	/**
	 * Acknowledge read of an answer.
	 *
	 * @method GET
	 * @param id The answer ID
	 * @return 200
	 */
	acknowledge: function (req, res, next) {
		var user = req.user;

		Answer.findById(req.params['id'], function (err, answer) {
			if (!answer) {
				res.status(404).json({
					message: "answer not found"
				});
			} else {
				//console.log('is %s._id.equals(%s)', answer.to, user._id);

				//can't acknowledge answers not destinated to the request user
				if (answer.to.equals(user._id)) {

					answer.acknowledged = true;
					answer.save(function (err) {
						if (err)
							console.log(err)
						else
							res.status(200).json({
								message: "Answer acknowledged."
							});
					});
				} else {
					res.status(403).json({
						message: "Unauthorized"
					});
				}
			}
		});
	}
};