const db = require('../db/connection');

exports.showTopics = async () => {
	const { rows } = await db.query(`SELECT slug, description FROM topics`);
	return rows;
};
