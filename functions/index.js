const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./utility/firebaseAuth');
const { db, admin } = require('./utility/admin');

const cors = require('cors');
app.use(cors());

const {
	signup,
	login,
	uploadImage,
	addUserDetails,
	getAuthenticatedUser,
	getUserDetails,
	markNotificationsRead,
	followUser,
	unfollowUser,
	getFollowedDogs,
	sendMessage,
	getMessages,
	markMessageRead,
} = require('./handlers/dogs');
const {
	getAllBarks,
	barkPost,
	getBark,
	barkComment,
	barkLike,
	barkUnlike,
	deleteBark,
} = require('./handlers/barks');

//Bark routes
app.get('/barks', getAllBarks);
app.post('/bark', FBAuth, barkPost);
app.get('/bark/:barkId', getBark);
app.delete('/bark/:barkId', FBAuth, deleteBark);
app.get('/bark/:barkId/like', FBAuth, barkLike);
app.get('/bark/:barkId/unlike', FBAuth, barkUnlike);
app.post('/bark/:barkId/comment', FBAuth, barkComment);

//Dog routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/dogs', getFollowedDogs);
app.post('/dog', FBAuth, addUserDetails);
app.post('/dog/image', FBAuth, uploadImage);
app.get('/dog', FBAuth, getAuthenticatedUser);
app.get('/dog/:handle', getUserDetails);
app.get('/dog/:handle/follow', FBAuth, followUser);
app.get('/dog/:handle/unfollow', FBAuth, unfollowUser);
app.post('/notifications', markNotificationsRead);

//Messaging
app.post('/sendmessage/:handle', FBAuth, sendMessage);
app.get('/getmessages', FBAuth, getMessages);
app.post('/readmessage', markMessageRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
	.document('/likes/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/barks/${snapshot.data().barkId}`)
			.get()
			.then((doc) => {
				if (
					doc.exists &&
					doc.data().userHandle !== snapshot.data().userHandle
				) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'like',
						read: false,
						barkId: doc.id,
					});
				}
			})

			.catch((err) => {
				console.error(err);
			});
	});

exports.deleteNotificationOnUnlike = functions.firestore
	.document('/likes/{id}')
	.onDelete((snapshot) => {
		return db
			.doc(`/notifications/${snapshot.id}`)
			.delete()

			.catch((err) => {
				console.error(err);
				return;
			});
	});

exports.createNotificationOnComment = functions.firestore
	.document('/comments/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/barks/${snapshot.data().barkId}`)
			.get()
			.then((doc) => {
				if (
					doc.exists &&
					doc.data().userHandle !== snapshot.data().userHandle
				) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'comment',
						read: false,
						barkId: doc.id,
					});
				}
			})
			.catch((err) => {
				console.error(err);
				return;
			});
	});

exports.createNotificationOnMessage = functions.firestore
	.document('/messages/{id}')
	.onCreate((snapshot) => {
		let senderUpdate = db.doc(`/dogs/${snapshot.data().sender}`).update({
			messages: admin.firestore.FieldValue.arrayUnion(snapshot.id),
			msgGroup: admin.firestore.FieldValue.arrayUnion(
				snapshot.data().recipient
			),
		});
		let recipUpdate = db.doc(`/dogs/${snapshot.data().recipient}`).update({
			messages: admin.firestore.FieldValue.arrayUnion(snapshot.id),
			msgGroup: admin.firestore.FieldValue.arrayUnion(snapshot.data().sender),
		});
		return senderUpdate, recipUpdate;
	});

exports.sendMessageOnUserCreation = functions.firestore
	.document('/dogs/{userId}')
	.onCreate((snapshot) => {
		let msg = db.doc(`/messages/${snapshot.data().userId}`).set({
			content: 'Welcome to DogBook. If you are a cat, please logout.',
			sender: 'kevin',
			recipient: snapshot.data().handle,
			time: new Date().toISOString(),
		});
		let following = db.doc(`/dogs/${snapshot.data().handle}`).update({
			following: admin.firestore.FieldValue.arrayUnion('kevin'),
		});
		return following, msg;
	});

exports.onUserImageChange = functions.firestore
	.document('/dogs/{userId}')
	.onUpdate((change) => {
		if (change.before.data().imageUrl !== change.after.data().imageUrl) {
			const batch = db.batch();
			return db
				.collection('barks')
				.where('userHandle', '==', change.before.data().handle)
				.get()
				.then((data) => {
					data.forEach((doc) => {
						const bark = db.doc(`/barks/${doc.id}`);
						batch.update(bark, { userImage: change.after.data().imageUrl });
					});
					return batch.commit();
				});
		}
	});

exports.onBarkDelete = functions.firestore
	.document('/barks/{barkId}')
	.onDelete((snapshot, context) => {
		const barkId = context.params.barkId;
		const batch = db.batch();
		return db
			.collection('comments')
			.where('barkId', '==', barkId)
			.get()
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/comments/${doc.id}`));
				});
				return db.collection('likes').where('barkId', '==', barkId).get();
			})
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/likes/${doc.id}`));
				});
				return db
					.collection('notifications')
					.where('barkId', '==', barkId)
					.get();
			})
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/notifications/${doc.id}`));
				});
				return batch.commit();
			})
			.catch((err) => console.error(err));
	});
