const db = require('../db/connection');

exports.showTopics = async () => {
	const { rows } = await db.query(`SELECT slug, description FROM topics`);
	return rows;
};

exports.sendTopic = async (slug, description) => {
	const { rows } = await db.query(
		`INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
		[slug, description]
	);
	return rows[0];
};
