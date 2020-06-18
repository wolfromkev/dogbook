const firebase = require('firebase');

exports.sendMessage = (body, sender, recipient) => {
	const message = {
		content: body,
		sender: sender,
		recipient: recipient,
		time: new Date().toISOString(),
	};

	db.collection('messages')
		.add(message)
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
