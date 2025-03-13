const db = require('../db/connection');

exports.showUsers = async () => {
	const { rows } = await db.query(`SELECT * FROM users`);
	return rows;
};

exports.showUserByUsername = async (username) => {
	const { rows } = await db.query(
		`SELECT * FROM users 
		WHERE username = $1`,
		[username]
	);
	if (rows.length === 0) {
		return Promise.reject({
			status: 404,
			msg: 'user not found',
		});
	}
	return rows[0];
};
