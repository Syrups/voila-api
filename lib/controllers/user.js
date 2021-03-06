var User = require('../models/user');
var Proposition = require('../models/proposition');
var Answer = require('../models/answer');
var keyDel = require('key-del');
var mongoose = require('mongoose');
var security = require('../util/security');
var crypto = require('crypto');
var apns = require('../util/apple-push-service');
var gcm = require('../util/google-cloud-messaging');
var NotifMessages  = require('../../config/notif_messages');

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
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "id": "John",
	 *       "username": "Doe",
	 *       "avatar": "a.png",
	 *       "token": "xxxxxxxxxx"
	 *     }
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

			var appleDevices = [];
			var androidDevices = [];

			if (req.param('ios_device_token')) {
				appleDevices.push(req.param('ios_device_token'));
			}

			if (req.param('android_token')) {
				androidDevices.push(req.param('android_token'));
			}


			User.create({
				username: req.param('username'),
				password: password,
				email: req.param('email'),
				token: token,
				salt: salt,
				appleDeviceTokens: appleDevices,
				androidDeviceTokens: androidDevices
			}, function (err, user) {
				
				if (!err) {
					res.status(201).json(user);
				} else {
					User.findOne({
						username: req.param('username')
					}, function (err, user) {
						res.status(409).json({
							error: "User already exists.",
							data: {
								id: user.id,
								username: user.username,
								avatar: user.avatar,
								token: token
							}
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
	 *       "username": "Doe",
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
			username: req.param('username'),
			active: { $ne: false }
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
						username: user.name,
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
	 *       "username": "Doe",
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
	// addFriend: function (req, res, next) {

	// 	User.findByIdAndUpdate(req.param('friend_id'), {
	// 		$addToSet: {
	// 			friends: req.user.id
	// 		}
	// 	}, function (err, user) {
	// 		if (!user) {
	// 			res.status(404).json(err);
	// 		} else {
	// 			User.findByIdAndUpdate(req.user.id, {
	// 				$addToSet: {
	// 					friends: user.id
	// 				}
	// 			}).select('-password -salt -token').exec(function (err, me) {
	// 				if (!err) {
	// 					res.status(200).json(user);
	// 				}
	// 			});
	// 		}
	// 	});
	// },

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

			/* istanbul ignore else  */
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
	 * @api {PUT} /user/:id Update User
	 * @apiName UpdateUser
	 * @apiGroup User
	 *
	 * @apiParam {String} avatar Users avatar
	 * @apiParam {String} ios_token Users IOS device token
	 * @apiParam {String} android_token Users Android device token
	 * @apiParam {String} password Users password
	 */
	update: function (req, res, next) {
		var update = {};

		if (req.param('avatar')) {
			update.avatar = req.param('avatar');
		}

		if (req.param('ios_token') || req.param('android_token')) {
			update.$push = {};
			
			if (req.param('ios_token')) {
				update.$push.appleDeviceTokens = req.param('ios_token');
			}

			if (req.param('android_token')) {
				update.$push.androidDeviceTokens = req.param('android_token');
			}
		}

		User.findByIdAndUpdate(req.user.id, update, function (err, user) {
			if (!err) {
				res.status(200).json(user);
			} else {
				res.status(500);
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

			// User.findById(req.user.id).populate('friends', '-password -salt -token -friends').exec(function (err, user) {
			// 	if (err) {
			// 		res.status(500).json(err);
			// 	} else {
			// 		res.status(200).json(user.friends);
			// 	}
			// });

			// Friends means: users who got current user in their friends AND who are in current user's friends
			User.find({
					friends: req.user.id
				})
				.select('-password -salt -token -friends')
				.exec(function (err, users) {
					if (!err && users.length > 0) {
						var friends = [];

						for (u in users) {
							if (req.user.friends.indexOf(users[u].id) != -1) {
								friends.push(users[u]);
							}
						}

						res.status(200).json(friends);
					} else if (users.length == 0) {
						res.status(200).json([]);
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
		})
		.sort([['sentAt', 'descending']])
		.populate('sender').exec(function (err, propositions) {

			res.status(200).json(propositions);
		})
	},

	sentPropositions: function (req, res, next) {

		Proposition.find({
			sender: req.user.id
		})
		.sort([['sentAt', 'descending']])
		.limit(25)
		.populate('receivers', '-password -token -salt')
		.exec(function (err, propositions) {
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

		Proposition.find(query).populate('sender originalProposition receivers dismissers takers resenders', '-password -token -salt').exec(function (err, propositions) {
			Answer.find({
				to: req.user.id,
				acknowledged: false
			}).populate('proposition proposition.sender from to', '-password -salt -token').exec(function (err, answers) {
				var all = propositions.concat(answers);

				// then sort by date
				/*all.sort(function (a, b) {
					if ('answeredAt' in a && 'answeredAt' in b) {
						//if ('answeredAt' in a && 'answeredAt' in b) {
						return a.answeredAt > b.answeredAt;
					}
				})*/

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

		var username = req.params['username'];

		User.find({
			username: {
				$regex: username
			},
			active: { $ne: false },
			_id: { $not: { $in: req.user.friends } }
		}, function (err, users) {

			/* istanbul ignore if  */
			if (err) {
				console.log(err)
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
	 *       "username": "Doe",
	 *       "avatar": "a.png",
	 *     }
	 *
	 * @apiError UserNotFound The id of the User was not found.
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 404 User not found
	 *     {
	 *       "error": "Not found."
	 *     }
	 */
	addFriend: function (req, res, next) {
		var wannaFriendId = req.param('friend_id');

		User.findById(wannaFriendId, function (err, wannaFriend) {
			if (!err) {
				User.findByIdAndUpdate(req.user.id, {
					$push: {
						"friends": wannaFriend._id
					}
				}, function (err) {
					if (err) {
						res.status(500).json(err);
					} else {

						// If the targeted user has not friended with current user yet,
						// this is a request
						if (wannaFriend.friends.indexOf(req.user.id) == -1) {
							apns.sendNotification(wannaFriend, {
								message: req.user.username+" souhaite vous ajouter à ses amis. T'en veux ?"
							});

							gcm.sendNotification(wannaFriend, {
								type : NotifMessages.FRIEND_WANNA,
								name : req.user.username
							});
						} else { // else this is an acceptance
							apns.sendNotification(wannaFriend, {
								message: req.user.username+" vous a accepté dans ses amis"
							});

							gcm.sendNotification(wannaFriend, {
								type : NotifMessages.FRIEND_ACCEPTED,
								name : req.user.username
							});
						}

						res.status(201).json({
							message: "Succesfully added friend"
						});
					}
				});
			} else {
				res.status(404).json(err);
			}
		});
	},

	/**
	 * @api {PUT} /users/:id/unfriend Addfriends
	 * @apiName Unfriend
	 * @apiGroup User
	 *
	 * @apiParam {String} friend_id User unique id
	 */
	unfriend: function (req, res, next) {
		var friendId = req.param('friend_id');

		User.findByIdAndUpdate(req.user.id, {
			$pull: { friends: friendId }
		}, function (err, user) {
			User.findByIdAndUpdate(friendId, {
				$pull: { friends: req.user.id }
			}, function (err, user) {
				if (!user) {
					res.status(404);
				} else {
					res.status(200).json({ message: "Friend succesfully unfriended"});
				}
			});
		})
	},

	dismissFriendRequest: function (req, res, next) {
		User.findByIdAndUpdate(req.param('friend_id'), {
			$pull: { friends: req.user.id }
		}, function (err, user) {
			res.status(200).send();
		});
	},

	friendRequests: function (req, res, next) {

		// Find users who have the current user in their friend
		// BUT who are not in current user's friends yet.
		User.find({
				friends: req.user.id
			})
			.select('-password -token -salt')
			.exec(function (err, users) {
				var requests = [];
				if (!err && users.length > 0) {
					for (u in users) {

						// If this user is not in current user's friends
						if (req.user.friends.indexOf(users[u].id) == -1)  {
							requests.push(users[u]);
						}
					}

					res.status(200).json(requests);
				}
			});
	},

	sentFriendRequests: function (req, res, next) {

		User.find({
				_id: { $in: req.user.friends }
			})
			.select('-password -token -salt')
			.exec(function (err, users) {
				var requests = [];
				if (!err && users.length > 0) {
					for (u in users) {

						// If this user does not have the current user in its friends
						if (users[u].friends.indexOf(req.user.id) == -1)  {
							requests.push(users[u]);
						}
					}

					res.status(200).json(requests);
				}
			});
	},


	destroy: function (req, res, next) {
		// delete all sent propositions
		Proposition.remove({
			sender: req.user.id
		});

		// remove user from any friends
		User.update({ 
			_id: { $in: req.user.friends }
		}, {
			$pull: { friends: req.user.id }
		}, function (err, users) {

			User.findByIdAndRemove(req.user.id, function (err) {
				// finally remove user
				res.status(200).send();
			});
			
		});

	}
};