const { db } = require('../utility/admin');

exports.getAllBarks = (req, res) => {
	db.collection('barks')
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let barks = [];
			data.forEach((doc) => {
				barks.push({
					barkId: doc.id,
					body: doc.data().body,
					userHandle: doc.data().userHandle,
					createdAt: doc.data().createdAt,
					commentCount: doc.data().commentCount,
					likeCount: doc.data().likeCount,
					userImage: doc.data().userImage,
				});
			});
			return res.json(barks);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};

exports.barkPost = (req, res) => {
	if (req.body.body.trim() === '') {
		return res.status(400).json({ body: 'Body must not be empty' });
	}
	const newBark = {
		body: req.body.body,
		userHandle: req.user.handle,
		createdAt: new Date().toISOString(),
		userImage: req.user.imageUrl,
		likeCount: 0,
		commentCount: 0,
	};

	db.collection('barks')
		.add(newBark)
		.then((doc) => {
			const resBark = newBark;
			resBark.barkId = doc.id;
			res.json(resBark);
		})
		.catch((err) => {
			res.status(500).json({ error: 'error has occured' });
			console.error(err);
		});
};

exports.getBark = (req, res) => {
	let barkData = {};
	db.doc(`/barks/${req.params.barkId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'Bark not found' });
			}
			barkData = doc.data();
			barkData.barkId = doc.id;
			return db
				.collection('comments')
				.orderBy('createdAt', 'desc')
				.where('barkId', '==', req.params.barkId)
				.get()
				.then((data) => {
					barkData.comments = [];
					data.forEach((doc) => {
						barkData.comments.push(doc.data());
					});
					return res.json(barkData);
				})
				.catch((err) => {
					console.error(err);
					res.status(500).json({ error: err.code });
				});
		});
};

exports.barkComment = (req, res) => {
	if (req.body.body.trim() === '') {
		return res.status(400).json({ comment: 'must not be empty' });
	}

	const newBarkComment = {
		body: req.body.body,
		userHandle: req.user.handle,
		createdAt: new Date().toISOString(),
		barkId: req.params.barkId,
		userImage: req.user.imageUrl,
	};

	db.doc(`/barks/${req.params.barkId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'Bark not found' });
			}
			return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
		})
		.then(() => {
			return db.collection('comments').add(newBarkComment);
		})
		.then(() => {
			res.json(newBarkComment);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'Something went wrong' });
		});
};

exports.barkLike = (req, res) => {
	const likeDocument = db
		.collection('likes')
		.where('userHandle', '==', req.user.handle)
		.where('barkId', '==', req.params.barkId)
		.limit(1);
	const barkDocument = db.doc(`/barks/${req.params.barkId}`);
	let barkData;

	barkDocument
		.get()
		.then((doc) => {
			if (doc.exists) {
				barkData = doc.data();
				barkData.barkId = doc.id;
				return likeDocument.get();
			} else {
				return res.status(404).json({ error: 'bark not found' });
			}
		})
		.then((data) => {
			if (data.empty) {
				return db
					.collection('likes')
					.add({
						barkId: req.params.barkId,
						userHandle: req.user.handle,
					})
					.then(() => {
						barkData.likeCount++;
						return barkDocument.update({ likeCount: barkData.likeCount });
					})
					.then(() => {
						return res.json(barkData);
					});
			} else {
				return res.status(400).json({ error: 'Bark has already been liked.' });
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({
				error: err.code,
			});
		});
};

exports.barkUnlike = (req, res) => {
	const likeDocument = db
		.collection('likes')
		.where('userHandle', '==', req.user.handle)
		.where('barkId', '==', req.params.barkId)
		.limit(1);
	const barkDocument = db.doc(`/barks/${req.params.barkId}`);
	let barkData;

	barkDocument
		.get()
		.then((doc) => {
			if (doc.exists) {
				barkData = doc.data();
				barkData.barkId = doc.id;
				return likeDocument.get();
			} else {
				return res.status(404).json({ error: 'bark not found' });
			}
		})
		.then((data) => {
			if (data.empty) {
				return res.status(400).json({ error: 'Bark has already been liked.' });
			} else {
				return db
					.doc(`/likes/${data.docs[0].id}`)
					.delete()
					.then(() => {
						barkData.likeCount--;
						return barkDocument.update({ likeCount: barkData.likeCount });
					})
					.then(() => {
						res.json(barkData);
					});
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({
				error: err.code,
			});
		});
};

exports.deleteBark = (req, res) => {
	const document = db.doc(`/barks/${req.params.barkId}`);
	document
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'Bark not found' });
			}
			if (doc.data().userHandle !== req.user.handle) {
				return res.status(403).json({ error: 'Unauthorized' });
			} else {
				return document.delete();
			}
		})
		.then(() => {
			res.json({ message: 'Bark deleted succsesfully' });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};
