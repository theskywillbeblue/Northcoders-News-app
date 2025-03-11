const {
	showArticleById,
	showArticles,
	showCommentsByArticleId,
	updateArticle,
} = require('../nc-models/articles.model');

exports.getArticles = (req, res, next) => {
	showArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	showArticleById(article_id)
		.then((article) => {
			res.status(200).send(article);
		})
		.catch((err) => {
			next(err);
		});
};

exports.getCommentsByArticleId = (req, res, next) => {
	const artId = req.params.article_id;

	if (!typeof artId === 'number') {
		return Promise.reject({ status: 400, msg: 'Invalid article ID' });
	} else {
		showCommentsByArticleId(artId)
			.then((comments) => {
				res.status(200).send({ comments });
			})
			.catch((err) => {
				next(err);
			});
	}
};

exports.patchArticle = async (req, res, next) => {
	artId = req.params.article_id;
	const { inc_votes } = req.body;

	if (!inc_votes) {
		return next({ status: 400, msg: 'Missing required field: inc_votes' });
	}

	if (typeof inc_votes !== 'number') {
		return next({ status: 400, msg: 'Votes need to be a number' });
	}

	try {
		const article = await updateArticle(artId, inc_votes);
		if (!article) {
			return next({ status: 404, msg: 'Article not found' });
		}
		res.status(200).send(article);
	} catch (err) {
		next(err);
	}
};
