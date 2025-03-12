const db = require('../db/connection');

exports.showTopics = () => {
	return db.query(`SELECT slug, description FROM topics`).then(({ rows }) => {
		return rows;
	});
};
