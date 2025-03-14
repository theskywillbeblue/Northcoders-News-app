const {
	showArticleById,
	showArticles,
	showCommentsByArticleId,
	updateArticle,
	createArticle,
	removeArticle
} = require('../nc-models/articles.model');
const { checkExists } = require('../db/seeds/utils');

exports.getArticles = async (req, res, next) => {
	const { sort_by, order, topic} = req.query;

	try {
		if (topic) {
			await checkExists('topics', 'slug', topic);
		}

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
		res.status(200).send({ article });
	} catch (err) {
		next(err);
	}
};

exports.postArticle = async (req, res, next) => {
	const article = req.body;
	const { topic } = article;
	const { author } = article;

	if (!topic) {
		return next({ status: 400, msg: 'Missing required field: topic' });
	}
	if (!author) {
		return next({ status: 400, msg: 'Missing required field: author' });
	}

	try {
		await checkExists('topics', 'slug', topic);
		await checkExists('users', 'username', author);

		const newArticle = await createArticle(article);
		res.status(201).send({ newArticle });
	} catch (err) {
		next(err);
	}
};



exports.deleteArticle = async (req, res, next) => {
	const artId = req.params.article_id;

	if (isNaN(artId)) {
		return next({ status: 400, msg: 'Invalid format: article_id' });
	}

	try {
		await checkExists('articles', 'article_id', artId);
		await removeArticle(artId);
		res.status(204).send();
	} catch (err) {
		console.log('🔶',err);
		next(err);
	}
};