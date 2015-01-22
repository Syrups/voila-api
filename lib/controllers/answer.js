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
		Answer.findByIdAndUpdate(req.params['id'], { acknowledged: true }, function (err, answer) {
			if (err) {
				res.status(500).json({ message: "Error acknowledging answer."});
			} else {
				res.status(200).json({ message: "Answer acknowledged."});
			}
		});
	}
};