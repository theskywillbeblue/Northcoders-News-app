const { showUsers } = require('../nc-models/users.model');

exports.getUsers = async (req, res, next) => {
	try {
		const users = await showUsers();
		res.status(200).send({ users });
	} catch (err) {
		next(err);
	}
};
