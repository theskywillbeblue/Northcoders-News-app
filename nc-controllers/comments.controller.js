const { checkExists } = require('../db/seeds/utils');
const {
	sendComment,
	removeComment,
	updateCommentVotesById,
} = require('../nc-models/comments.model');

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

exports.patchCommentVotesById = async (req, res, next) => {
	commId = req.params.comment_id;
	const { inc_votes } = req.body;

	if (!inc_votes) {
		return next({ status: 400, msg: 'Missing required field: inc_votes' });
	}

	if (typeof inc_votes !== 'number') {
		return next({ status: 400, msg: 'Votes need to be a number' });
	}

	try {
		const comment = await updateCommentVotesById(commId, inc_votes);
		if (!comment) {
			return next({ status: 404, msg: 'Comment not found' });
		}
		res.status(200).send({ comment });
	} catch (err) {
		next(err);
	}
};
