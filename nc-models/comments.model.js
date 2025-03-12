const db = require('../db/connection');

exports.sendComment = async (artId, username, body) => {
	const { rows } = await db.query(
		`INSERT INTO comments
        (article_id, author, body, created_at) 
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
        RETURNING *`,
		[artId, username, body]
	);
	return rows[0];
};

exports.removeComment = async (commentId) => {
	const { rows } = await db.query(
		`DELETE FROM comments
			WHERE comment_id = $1`,
		[commentId]
	);
	return rows;
};
