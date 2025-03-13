const db = require('../db/connection');

exports.showArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
	const validColumns = [
		'author',
		'title',
		'article_id',
		'topic',
		'created_at',
		'votes',
		'comment_count',
	];

	const validOrders = ['ASC', 'DESC', 'asc', 'desc'];

	if (!validColumns.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: 'invalid sort parameter' });
	}
	if (!validOrders.includes(order)) {
		return Promise.reject({ status: 400, msg: 'invalid order parameter' });
	}

	let articleQuery = `SELECT 
        articles.author, 
        articles.title, 
        articles.article_id, 
        articles.topic, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id`;

	const queryValues = [];

	if (topic) {
		queryValues.push(topic);
		articleQuery += ` WHERE articles.topic = $1`;
	}

	articleQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

	return db.query(articleQuery, queryValues).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'no articles found' });
		}
		return rows;
	});
};



exports.showArticleById = (article_id) => {

	return db
		.query(
		`SELECT 
        	articles.*,
        COUNT(comments.comment_id)::INT AS comment_count
		FROM articles
		LEFT JOIN comments 
		ON articles.article_id = comments.article_id
		WHERE articles.article_id = $1 
		GROUP BY articles.article_id`,
			[article_id]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: 'article not found',
				});
			}
			return rows[0];
		});
};



exports.showCommentsByArticleId = (artId) => {
	return db
		.query(
			`SELECT *
            FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC`,
			[artId]
		)
		.then(({ rows }) => {
			return rows;
		});
};



exports.updateArticle = async (artId, voteChange) => {
	const { rows } = await db.query(
		`UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *`,
		[voteChange, artId]
	);
	return rows[0];
};
