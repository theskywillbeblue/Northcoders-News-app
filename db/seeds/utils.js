const db = require('../../db/connection');
const format = require('pg-format');

// convert the timestamp in any given data to an accepted format
exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
	if (!created_at) return { ...otherProperties };
	return { created_at: new Date(created_at), ...otherProperties };
};

// adjust comment data to have correct article_id for each comment
exports.articleIdToComments = (commentsData, articleData) => {
	const articleMap = articleData.reduce((acc, article) => {
		acc[article.title] = article.article_id;
		return acc;
	}, {});

	return commentsData.map((comment) => ({
		...comment,
		article_id: articleMap[comment.article_title],
	}));
};

// check if the database contains a certain parametric endpoint
exports.checkExists = (table, column, input) => {
	const query = format(
		`SELECT *
		FROM %I
		WHERE %I = $1`,
		table,
		column
	);

	return db.query(query, [input]).then(({ rows }) => {
		if (rows.length === 0) {
			throw { status: 404, msg: `${column} not found in database` };
		}
		return true;
	});
};
