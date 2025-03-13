const {
	showArticleById,
	showArticles,
	showCommentsByArticleId,
	updateArticle,
} = require('../nc-models/articles.model');
const { checkExists } = require('../db/seeds/utils');

exports.getArticles = async (req, res, next) => {
	const { sort_by, order, topic } = req.query;

	try {
		const articles = await showArticles(sort_by, order, topic);

		res.status(200).send({ articles });
	} catch (err) {
		next(err);
	}
};

exports.getArticleById = async (req, res, next) => {
	const { article_id } = req.params;

	try {
		const article = await showArticleById(article_id);
		res.status(200).send({ article });
	} catch (err) {
		next(err);
	}
};

exports.getCommentsByArticleId = async (req, res, next) => {
	const artId = req.params.article_id;

	try {
		await checkExists('articles', 'article_id', artId);

		const comments = await showCommentsByArticleId(artId);

		res.status(200).send({ comments });
	} catch (err) {
		next(err);
	}
};

exports.patchArticle = async (req, res, next) => {
	const artId = req.params.article_id;
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
