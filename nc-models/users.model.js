const db = require('../db/connection');

exports.showUsers = async () => {
	const { rows } = await db.query(`SELECT * FROM users`);
	return rows;
};
