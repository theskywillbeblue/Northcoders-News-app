const { showUsers, showUserByUsername } = require('../nc-models/users.model');

exports.getUsers = async (req, res, next) => {
	try {
		const users = await showUsers();
		res.status(200).send({ users });
	} catch (err) {
		next(err);
	}
};

exports.getUserByUsername = async (req, res, next) => {
	try {
		const { username } = req.params
		const user = await showUserByUsername(username)
		res.status(200).send({ user })
	} catch (err) {
		next(err);
	}
}