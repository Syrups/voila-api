var Proposition = require('../models/proposition');
var Answer = require('../models/answer');
var User = require('../models/user');
var GeoData = require('../models/geoData');
var apns = require('../util/apple-push-service');
var gcm = require('../util/google-cloud-messaging');

module.exports = {

	//TODO : à revoir comme algo je pense qu'on devrait pas appller cette fonction pour "reproposer"
	/**
	 * Create and send a proposition.
	 * If the proposition is a reproposal from an existing proposition,
	 * #originalProposition will be set to the ID of the original prop.
	 *
	 * @method POST
	 * @param receivers Array of user IDs
	 * @param image URL of the image
	 * @return 201
	 */
	send: function (req, res, next) {
		var user = req.user;

		var data = {
			sender: user.id,
			receivers: req.param('receivers'),
			image: req.param('image') || "",
			isPrivate: req.param('isPrivate') ? req.param('isPrivate') : false,
			allReceivers: req.param('receivers')
		};

		var message = "Proposition created";

		// If there's an original proposition, add the user to the resenders
		// Well it's not a major error if there's a problem here
		// so we'll see better error handling later :)
		if (req.param('originalProposition') != "<null>") {
			data.originalProposition = req.param('originalProposition');

			Proposition.findByIdAndUpdate(data.originalProposition, {
				$push: {
					"resenders": user.id,
					allReceivers: data.receivers
				}
			}, function (err, original) {

				if (!err) {
					message = "Proposition bounced";
					//console.log(err);
				}
			});
		}

		// Effectively create the new prop
		Proposition.create(data, function (err, proposition) {

			/* istanbul ignore else  */
			if (!err) {
				User.findByIdAndUpdate(user.id, {
					$inc: {
						"sent": 1
					}
				}, function (err, user) {

					/* istanbul ignore else  */
					if (!err) {

						GeoData.create({
							proposition: proposition.id,
							geo: req.geoData
						}, function (err, geo) {

						});

						var notifMessage = 'Vous avez été servi par '+user.username;
						apns.sendNotificationToMany(data.receivers, {
							message: notifMessage
						});

						gcm.sendNotificationToMany(data.receivers, {
							message: notifMessage
						});

						res.status(201).json({
							data: proposition,
							message: message
						});
					} else {
						res.status(404).json({
							error: err
						});
					}
				});

			} else {
				console.log(err);
				res.status(500).json(err);
			}
		});
	},


	/**
	 * Bounce (re-propose) a proposition.
	 * If the proposition is a reproposal from an existing proposition,
	 * #originalProposition will be set to the ID of the original prop.
	 *
	 * @method POST
	 * @param receivers Array of user IDs
	 * @param image URL of the image
	 * @return 201
	 */
	/*bounce: function (req, res, next) {
		var user = req.user;

		var data = {
			sender: user.id,
			receivers: req.param('receivers'),
			image: req.param('image'),
			originalProposition: req.param('originalProposition')
		};

		Proposition.findByIdAndUpdate(data.originalProposition, {
			$push: {
				"resenders": data.sender
			},
		}, function (err) {
			if (!err) {
				res.status(201).json({
					message: "Proposition bounced."
				});
			} else {
				res.status(500).json(err);
			}
		});
	},*/

	/**
	 * Take a proposition,
	 * then creates an Answer which is destinated to the
	 * proposition sender.
	 *
	 * @method GET
	 * @param id The proposition ID
	 * @return 200
	 */
	take: function (req, res, next) {
		var id = req.params['id'];

		var usr = req.user;

		Proposition.findByIdAndUpdate(id, {
			taken: true,
			$addToSet: {
				"takers": usr.id
			}
		}, function (err, proposition) {
			/* istanbul ignore else  */
			if (!err) {
				User.findByIdAndUpdate(usr.id, {
					$inc: {
						"taken": 1
					}
				}, function (err) {
					/* istanbul ignore if  */
					if (err) {
						res.status(500).json(err);
					} else {

						// Create answer for proposition sender
						var answer = {
							proposition: proposition.id,
							answer: "yes",
							from: usr.id,
							to: proposition.sender
						};

						apns.sendNotificationToMany([proposition.sender], {
							message: usr.username+ " : j'en prends !"
						});

						gcm.sendNotificationToMany([proposition.sender], {
							message: usr.username+ " : j'en prends !"
						});

						Answer.create(answer, function (err, answer) {
							/* istanbul ignore if  */
							if (err) {
								res.status(500).json(err);
							} else {
								res.status(200).json({
									code: 200,
									message: "Proposition taken."
								});
							}
						});
					}
				});
			} else {
				res.status(500).json(err);
			}
		});
	},

	/**
	 * Dismiss a proposition,
	 * then create an answer (NO) to the prop sender.
	 *
	 * @method GET
	 * @param id The proposition ID
	 * @return 200
	 */
	dismiss: function (req, res, next) {
		var id = req.params['id'];

		Proposition.findByIdAndUpdate(id, {
			$addToSet: {
				"dismissers": req.user.id
			}
		}, function (err, proposition) {
			/* istanbul ignore else  */
			if (!err) {

				var answer = {
					proposition: proposition.id,
					answer: "no",
					from: req.user.id,
					to: proposition.sender
				};

				Answer.create(answer, function (err, answer) {
					/* istanbul ignore if  */
					if (err) {
						res.status(500).json(err);
					} else {
						res.status(200).json({
							code: 200,
							message: "Proposition dismissed."
						});
					}
				});

			} else {
				res.status(500).json(err);
			}
		});
	},

	/**
	 * Show a proposition
	 *
	 * @method GET
	 * @param id The proposition ID
	 * @return Proposition
	 */
	show: function (req, res, next) {
		var id = req.params['id'];

		Proposition.findById(id).populate('originalProposition').exec(function (err, proposition) {
			/* istanbul ignore else  */
			if (!err) {
				res.status(200).json(proposition);
			} else {
				res.status(500).json(err);
			}
		});
	},

	/**
	 * Show takers of a proposition
	 *
	 * @method GET
	 * @param id The proposition ID
	 * @return 200 Users[]
	 */
	takers: function (req, res, next) {
		var id = req.params['id'];

		Proposition.findById(id, function (err, proposition) {
			/* istanbul ignore else  */
			if (!err) {
				res.status(200).json(proposition);
			} else {
				res.status(500).json(err);
			}
		});
	},

	/**
	 * Show popular propositions in user's friends network
	 *
	 * @method GET
	 * @return 200 Propositions[]
	 */
	popular: function (req, res, next) {
		var query = {
			isPrivate: { $ne: true },
			sender: { $in: req.user.friends },
			$where: 'this.resenders.length >= 1'
		}

		Proposition.find(query)
			.populate('originalProposition')
			.exec(function (err, propositions) {
				if (!err) {
					res.status(200).json(propositions);
				} else {
					res.status(500).json(err);
				}
			});
	}
};