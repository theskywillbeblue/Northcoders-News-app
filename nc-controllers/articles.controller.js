const {
	showArticleById,
	showArticles,
} = require("../nc-models/articles.model");

exports.getArticles = (req, res, next) => {
	showArticles()
		.then((rows) => {
			res.status(200).send({ articles: rows });
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
