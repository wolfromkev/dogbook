const { admin, db } = require('../utility/admin');
const firebase = require('firebase');
const firebaseConfig = require('../utility/firebaseConfig');
const {
	validateSignUpData,
	validateLoginData,
	reduceUserDetails,
} = require('../utility/validation');

firebase.initializeApp(firebaseConfig);

exports.signup = (req, res) => {
	const newUser = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		handle: req.body.handle,
	};

	const { valid, errors } = validateSignUpData(newUser);
	if (!valid) {
		return res.status(400).json(errors);
	}

	const defaultImg = 'deafultDog.png';

	let token, userId;
	db.doc(`/dogs/${newUser.handle}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return res.status(400).json({ handle: 'handle is taken' });
			} else {
				return firebase
					.auth()
					.createUserWithEmailAndPassword(newUser.email, newUser.password);
			}
		})
		.then((data) => {
			userId = data.user.uid;
			return data.user.getIdToken();
		})
		.then((idToken) => {
			token = idToken;
			const userCredentials = {
				handle: newUser.handle,
				email: newUser.email,
				createdAt: new Date().toISOString(),
				imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${defaultImg}?alt=media`,
				userId,
				following: [],
			};
			return db.doc(`/dogs/${newUser.handle}`).set(userCredentials);
		})
		.then(() => {
			return res.status(201).json({ token });
		})
		.catch((err) => {
			console.error(err);
			if (err.code === 'auth/email-already-in-use') {
				return res.status(400).json({ email: 'Email is already in use' });
			} else {
				return res
					.status(500)
					.json({ general: 'Something went wrong, try again.' });
			}
		});
};

exports.login = (req, res) => {
	const user = {
		email: req.body.email,
		password: req.body.password,
	};

	const { valid, errors } = validateLoginData(user);
	if (!valid) {
		return res.status(400).json(errors);
	}

	firebase
		.auth()
		.signInWithEmailAndPassword(user.email, user.password)
		.then((data) => {
			return data.user.getIdToken();
		})
		.then((token) => {
			return res.json({ token });
		})
		.catch((err) => {
			console.error(err);
			if (err.code === 'auth/wrong-password') {
				return res
					.status(403)
					.json({ general: 'Incorrect credentials, please try again' });
			} else {
				return res.status(500).json({ error: err.code });
			}
		});
};

exports.addUserDetails = (req, res) => {
	let userDetails = reduceUserDetails(req.body);

	db.doc(`/dogs/${req.user.handle}`)
		.update(userDetails)
		.then(() => {
			return res.json({ message: 'Details have been added succsesfully' });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

exports.getUserDetails = (req, res) => {
	let userData = {};
	db.doc(`/dogs/${req.params.handle}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				userData.user = doc.data();
				return db
					.collection('barks')
					.where('userHandle', '==', req.params.handle)
					.orderBy('createdAt', 'desc')
					.get();
			} else {
				return res.status(404).json({ error: 'User not found' });
			}
		})
		.then((data) => {
			userData.barks = [];
			data.forEach((doc) => {
				userData.barks.push({
					body: doc.data().body,
					createdAt: doc.data().createdAt,
					userHandle: doc.data().userHandle,
					userImage: doc.data().userImage,
					likeCount: doc.data().likeCount,
					commentCount: doc.data().commentCount,
					barkId: doc.id,
				});
			});
			return res.json(userData);
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

exports.markNotificationsRead = (req, res) => {
	let batch = db.batch();
	req.body.forEach((notificationId) => {
		const notification = db.doc(`/notifications/${notificationId}`);
		batch.update(notification, { read: true });
	});
	batch
		.commit()
		.then(() => {
			return res.json({ message: 'Notifications marked read' });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

exports.getAuthenticatedUser = (req, res) => {
	let userData = {};
	db.doc(`/dogs/${req.user.handle}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				userData.credentials = doc.data();
				return db
					.collection('likes')
					.where('userHandle', '==', req.user.handle)
					.get();
			}
		})
		.then((data) => {
			userData.likes = [];
			data.forEach((doc) => {
				userData.likes.push(doc.data());
			});
			return db
				.collection('notifications')
				.where('recipient', '==', req.user.handle)
				.orderBy('createdAt', 'desc')
				.limit(10)
				.get();
		})
		.then((data) => {
			userData.notifications = [];
			data.forEach((doc) => {
				userData.notifications.push({
					recipient: doc.data().recipient,
					sender: doc.data().sender,
					read: doc.data().read,
					barkId: doc.data().barkId,
					type: doc.data().type,
					createdAt: doc.data().createdAt,
					notificationId: doc.id,
				});
			});
			return res.json(userData);
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

exports.uploadImage = (req, res) => {
	const BusBoy = require('busboy');
	const path = require('path');
	const os = require('os');
	const fs = require('fs');
	const busboy = new BusBoy({ headers: req.headers });
	let imageFileName;
	let imageToBeUploaded = {};

	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
			return res
				.status(400)
				.json({ error: 'File type must be either jpeg or png' });
		}
		const imgType = filename.split('.')[filename.split('.').length - 1];
		imageFileName = `${Math.round(Math.random() * 100000000000)}.${imgType}`;
		const filePath = path.join(os.tmpdir(), imageFileName);
		imageToBeUploaded = {
			filePath,
			mimetype,
		};
		file.pipe(fs.createWriteStream(filePath));
	});
	busboy.on('finish', () => {
		admin
			.storage()
			.bucket()
			.upload(imageToBeUploaded.filePath, {
				resumable: false,
				metadata: {
					metadate: {
						contentType: imageToBeUploaded.mimetype,
					},
				},
			})
			.then(() => {
				const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
				return db.doc(`/dogs/${req.user.handle}`).update({ imageUrl });
			})
			.then(() => {
				return res.json({ message: 'Image uploaded succsesfully' });
			})
			.catch((err) => {
				console.error(err);
				return res.status(500).json({ error: err.code });
			});
	});
	busboy.end(req.rawBody);
};

exports.followUser = (req, res) => {
	const dogDoc = db.doc(`/dogs/${req.params.handle}`);

	const followingDoc = db
		.collection('dogs')
		.where('handle', '==', req.user.handle)
		.where('following', 'array-contains', req.params.handle);

	dogDoc
		.get()
		.then((doc) => {
			if (doc.exists) {
				return followingDoc.get();
			} else {
				return res.status(404).json({ error: 'User not found' });
			}
		})
		.then((data) => {
			if (data.empty) {
				return db
					.collection('dogs')
					.doc(req.user.handle)
					.update({
						following: admin.firestore.FieldValue.arrayUnion(req.params.handle),
					})
					.then(() => {
						return res.json(req.params.handle);
					});
			} else {
				return res.status(404).json({ error: 'You already follow this user' });
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({
				error: err.code,
			});
		});
};

exports.unfollowUser = (req, res) => {
	const dogDoc = db.doc(`/dogs/${req.params.handle}`);
	const followingDoc = db
		.collection('dogs')
		.where('handle', '==', req.user.handle)
		.where('following', 'array-contains', req.params.handle);

	dogDoc
		.get()
		.then((doc) => {
			if (doc.exists) {
				//dogData = doc.data();
				return followingDoc.get();
			} else {
				return res.status(404).json({ error: 'User not found' });
			}
		})
		.then((data) => {
			if (!data.empty) {
				return db
					.collection('dogs')
					.doc(req.user.handle)
					.update({
						following: admin.firestore.FieldValue.arrayRemove(
							req.params.handle
						),
					})
					.then(() => {
						return res.json(req.params.handle);
					});
			} else {
				return res.status(404).json({ error: 'You dont follow this user' });
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({
				error: err.code,
			});
		});
};

exports.getFollowedDogs = (req, res) => {
	db.collection('dogs')
		.orderBy('handle')
		.get()
		.then((data) => {
			let dogs = [];
			data.forEach((doc) => {
				dogs.push({
					handle: doc.data().handle,
					imageUrl: doc.data().imageUrl,
				});
			});
			return res.json(dogs);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};

exports.sendMessage = (req, res) => {
	const message = {
		content: req.body.body,
		sender: req.user.sender,
		recipient: req.params.handle,
		time: new Date().toISOString(),
	};

	db.collection('messages')
		.add({
			content: req.body.body,
			sender: req.user.handle,
			recipient: req.params.handle,
			time: new Date().toISOString(),
		})
		.then((ref) => {
			return res.json({
				message,
			});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({
				error: err.code,
			});
		});
};

exports.getMessages = (req, res) => {
	let messages = [];

	let receivedMessages = db
		.collection('messages')
		.where('recipient', '==', req.user.handle);

	db.collection('messages')
		.where('sender', '==', req.user.handle)
		.get()
		.then((data) => {
			data.forEach((doc) => {
				messages.push({
					content: doc.data().content,
					sender: doc.data().sender,
					recipient: doc.data().recipient,
					time: doc.data().time,
				});
			});
			return receivedMessages.get();
		})
		.then((data) => {
			data.forEach((doc) => {
				messages.push({
					content: doc.data().content,
					sender: doc.data().sender,
					recipient: doc.data().recipient,
					time: doc.data().time,
				});
			});
			return res.json(messages);
		});
};

exports.markMessageRead = (req, res) => {
	let batch = db.batch();
	req.body.forEach((notificationId) => {
		const notification = db.doc(`/notifications/${notificationId}`);
		batch.update(notification, { read: true });
	});
	batch
		.commit()
		.then(() => {
			return res.json({ message: 'Notifications marked read' });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};
