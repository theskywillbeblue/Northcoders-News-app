const { checkExists } = require('../db/seeds/utils');
const { sendComment, removeComment } = require('../nc-models/comments.model');

exports.postComment = async (req, res, next) => {
	const artId = req.params.article_id;
	const { username, body } = req.body;

	if (!username) {
		return next({ status: 400, msg: 'Missing username' });
	}
	if (!body) {
		return next({ status: 400, msg: 'Missing body' });
	}
	if (typeof username !== 'string') {
		return next({ status: 400, msg: 'Invalid format: username' });
	}
	if (typeof body !== 'string') {
		return next({ status: 400, msg: 'Invalid format: body' });
	}
	try {
		await checkExists('articles', 'article_id', artId);
		await checkExists('users', 'username', username);
		const comment = await sendComment(artId, username, body);
		res.status(201).send({ comment });
	} catch (err) {
		next(err);
	}
};

exports.deleteComment = async (req, res, next) => {
	const commentId = req.params.comment_id;

	if (isNaN(commentId)) {
		return next({ status: 400, msg: 'Invalid format: comment_id' });
	}

	try {
		await checkExists('comments', 'comment_id', commentId);
		await removeComment(commentId);
		res.status(204).send();
	} catch (err) {
		next(err);
	}
};
