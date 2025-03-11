const { checkExists } = require("../db/seeds/utils");
const { sendComment } = require("../nc-models/comments.model");

exports.postComment = async (req, res, next) => {
	const artId = req.params.article_id;
	const { username, body } = req.body;

	if (!username) {
		return next({ status: 400, msg: "Missing username" });
	}
	if (!body) {
		return next({ status: 400, msg: "Missing body" });
	}

	try {
		await checkExists("articles", "article_id", artId);
		await checkExists("users", "username", username);
		const comment = await sendComment(artId, username, body);
		res.status(201).send({ comment });
	} catch (err) {
		next(err);
	}
};
