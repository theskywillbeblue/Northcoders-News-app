// Invalid type input
exports.handleTypeInputErrors = (err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ msg: "bad request" });
	} else {
		next(err);
	}
};

// invalid endpoint
exports.handleIncorrectEndpoints = (err, req, res, next) => {
	if (err.status === 404) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};

// everything else errors
exports.handleServerErrors = (err, req, res, next) => {
	res.status(500).send("We tried everything, and now we are out of ideas!");
};
