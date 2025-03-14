const { checkExists, checkDoesNotExist } = require('../db/seeds/utils');
const { showTopics, sendTopic } = require('../nc-models/topics.model');

exports.getTopics = (req, res, next) => {
	showTopics()
		.then((rows) => {
			res.status(200).send({ topics: rows });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postTopic = async (req, res, next) => {
	const { description } = req.body;
	const { slug } = req.body;

	if (!slug) {
		return next({ status: 400, msg: 'Missing required field: slug' });
	}
	if (!description) {
		return next({ status: 400, msg: 'Missing required field: description' });
	}

	try {
		await checkDoesNotExist('topics', 'slug', slug);

		const topic = await sendTopic(slug, description);
		res.status(201).send({ topic });
	} catch (err) {
		next(err);
	}
};
