const { showArticleById } = require("../nc-models/articles.model");

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
