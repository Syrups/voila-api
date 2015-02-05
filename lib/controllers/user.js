var User = require('../models/user');
var Proposition = require('../models/proposition');
var Answer = require('../models/answer');
var keyDel = require('key-del');
var mongoose = require('mongoose');
var security = require('../util/security');
var crypto = require('crypto');

module.exports = {

	/**
	 * @api {POST} /user/ Create User
	 * @apiName CreateUser
	 * @apiGroup User
	 *
	 * @apiParam {String} username Users unique name
	 * @apiParam {String} password Users password
	 * @apiParam {String} email Users email
	 *
	 * @apiSuccess {String} firstname Firstname of the User.
	 * @apiSuccess {String} lastname  Lastname of the User.
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 201 Created
	 *     {
	 *			message: "User already exists.",
	 *			id: user.id,
	 *			name: user.name,
	 *			avatar: user.avatar,
	 *			token: token
	 *	   }
	 *
	 * @apiError UserNotFound The id of the User was not found.
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 409 User already exists
	 *     {
	 *       "error": "UserNotFound"
	 *		 "data": {}
	 *     }
	 */
	create: function (req, res, next) {
		var salt = security.salt();
		var token = security.token();

		crypto.pbkdf2(req.param('password'), new Buffer(salt), 1000, 25, function (err, password) {

			User.create({
				name: req.param('username'),
				password: password,
				email: req.param('email'),
				token: token,
				salt: salt
			}, function (err, user) {
				if (!err) {
					res.status(201).json({
						id: user.id,
						name: user.name,
						avatar: user.avatar,
						token: token
					});
				} else {
					User.findOne({
						name: req.param('username')
					}, function (err, user) {
						res.status(409).json(
							error: "User already exists.",
							data: {
								id: user.id,
								name: user.name,
								avatar: user.avatar,
								token: token
							});
					});
				}
			});
		});
	},



	/**
	 * @api {GET} /user/authenticate Authenticate User
	 * @apiName Authenticate
	 * @apiGroup User
	 *
	 * @apiParam {String} username Users unique name
	 * @apiParam {String} password Users password
	 *
	 * @apiSuccess {String} id Firstname of the User.
	 * @apiSuccess {String} token  Lastname of the User.
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "id": "John",
	 *       "name": "Doe",
	 *       "avatar": "a.png",
	 *       "token": "xxxxxxxxxx"
	 *     }
	 *
	 * @apiError UserNotFound The id of the User was not found.
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 403 User already exists
	 *     {
	 *       "error": "Access denied"
	 *     }
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 404 User already exists
	 *     {
	 *       "error": "Not found."
	 *     }
	 */
	authenticate: function (req, res, next) {
		User.findOne({
			name: req.param('username')
		}, function (err, user) {
			if (!user) {
				res.status(404).json({
					error: "Not found."
				});
			} else {
				if (crypto.pbkdf2Sync(req.param('password'), user.salt, 1000, 25) != user.password) {
					res.status(403).json({
						error: "Access denied"
					});
				} else {
					res.status(200).json({
						id: user.id,
						name: user.name,
						avatar: user.avatar,
						token: user.token,
					});
				}
			}
		});
	},

	/**
	 * @api {PUT} /users/:id/addfriends Addfriends
	 * @apiName Addfriends
	 * @apiGroup User
	 *
	 * @apiParam {String} friend_id User unique id
	 *
	 * @apiSuccess {String} id Firstname of the User.
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "id": "John",
	 *       "name": "Doe",
	 *       "avatar": "a.png",
	 *     }
	 *
	 * @apiError UserNotFound The id of the User was not found.
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 404 User already exists
	 *     {
	 *       "error": "Not found."
	 *     }
	 */
	addFriend: function (req, res, next) {

		User.findByIdAndUpdate(req.param('friend_id'), {
			$addToSet: {
				friends: req.user.id
			}
		}, function (err, user) {
			if (!user) {
				res.status(404).json(err);
			} else {
				User.findByIdAndUpdate(req.user.id, {
					$addToSet: {
						friends: user.id
					}
				}).select('-password -salt -token').exec(function (err, me) {
					if (!err) {
						res.status(200).json(user);
					}
				});
			}
		});
	},

	/**
	 * @api {GET} /users/:id/show Show user
	 * @apiName Show
	 * @apiGroup User
	 *
	 * @apiParam {String} friend_id User unique id
	 *
	 * @apiSuccess {String} id Firstname of the User.
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "id": "John",
	 *       "name": "Doe",
	 *       "avatar": "a.png",
	 *     }
	 *
	 * @apiError UserNotFound The id of the User was not found.
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 404 User already exists
	 *     {
	 *       "error": "Not found."
	 *     }
	 */
	show: function (req, res, next) {
		var id = req.params['id'];

		User.findOne({
			_id: id
		}).select('-password -salt -token').exec(function (err, user) {

			if (!err) {
				if (req.user.token != user.token) {
					user.token = undefined;
					user.phone = undefined;
				}
				res.status(200).json(user);
			} else {
				res.status(500).json(err);
			}
		});
	},

	/**
	 * Get user's friends
	 *
	 * @method GET
	 * @param id
	 * @return User[]
	 */
	friends: function (req, res, next) {
		if (req.user.id != req.params['id']) {
			// cannot see friends of another user
			res.status(403).json({
				message: "Access denied."
			});
		} else {
			User.findById(req.user.id).populate('friends', '-password -salt -token -friends').exec(function (err, user) {
				if (err) {
					res.status(500).json(err);
				} else {
					res.status(200).json(user.friends);
				}
			});
		}
	},

	takenPropositions: function (req, res, next) {
		Proposition.find({
			takers: req.user.id
		}, function (err, propositions) {
			res.status(200).json(propositions);
		})
	},

	pendingPropositions: function (req, res, next) {
		Proposition.find({
			receivers: req.user.id,
			"$and": [{
				dismissers: {
					$ne: req.user.id
				}
			}, {
				takers: {
					$ne: req.user.id
				}
			}]
		}, function (err, propositions) {
			//console.log(propositions);
			res.status(200).json(propositions);
		})
	},

	receivedPropositions: function (req, res, next) {
		Proposition.find({
			receivers: req.user.id
		}, function (err, propositions) {

			res.status(200).json(propositions);
		})
	},

	sentPropositions: function (req, res, next) {

		Proposition.find({
			sender: req.user.id
		}, function (err, propositions) {
			res.status(200).json(propositions);
		})
	},

	pendingAnswers: function (req, res, next) {
		Answer.find({
			to: req.user.id
		}).populate('proposition').exec(function (err, answers) {
			res.status(200).json(answers);
		});
	},

	pendingPropositionsAndAnswers: function (req, res, next) {
		var query = {
			receivers: req.user.id,
			$and: [{
				takers: { 
					$ne: req.user.id
				}
			}, {
				dismissers: {
					$ne: req.user.id
				}
			}]
		};

		Proposition.find(query, function (err, propositions) {
			Answer.find({
				to: req.user.id,
				acknowledged: false
			}).populate('proposition').exec(function (err, answers) {
				var all = propositions.concat(answers);

				// then sort by date
				all.sort(function (a, b) {
					if ('answeredAt' in a && 'answeredAt' in b) {
						return a.answeredAt > b.answeredAt;
					}
				})

				res.status(200).json({
					propositions: propositions,
					answers: answers
				});
			});
		})
	},

	/**
	 * Find user matching the string
	 *
	 * @method GET
	 * @param id
	 * @return Users
	 */
	find: function (req, res, next) {
		User.find({
			name: {
				$regex: req.param('username')
			}
		}, function (err, users) {
			if (err) {
				res.status(500).json(err);
			} else {
				if (users.length == 0) {
					res.status(404).json({
						message: "No user found."
					});
				} else {
					res.status(200).json(users);
				}
			}
		});
	},

	/**
	 * Add user as friend
	 
	 * the friendship is cnfirmed only both users had added each others
	 *
	 * @method POST
	 * @param id
	 * @return message
	 */
	// addFriend: function (req, res, next) {
	// 	var wannaFriendId = req.params['id'];

	// 	User.findById(wannaFriendId, function (err, wannaFriend) {
	// 		if (!err) {
	// 			User.findByIdAndUpdate(req.user.id, {
	// 				$push: {
	// 					"friends": wannaFriend._id
	// 				}
	// 			}, function (err) {
	// 				if (err) {
	// 					res.status(500).json(err);
	// 				} else {
	// 					res.status(201).json({
	// 						message: "Succesfully added friend"
	// 					});
	// 				}
	// 			});
	// 		} else {
	// 			res.status(500).json(err);
	// 		}
	// 	});
	// },
};