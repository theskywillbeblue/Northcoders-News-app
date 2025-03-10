

// invalid endpoint
exports.handleIncorrectEndpoints = (err, req, res, next) => {
    console.log(err, "404: data not found at endpoint")
    if (err.status === 404) {
        res.status(err.status).send({ msg: err.msg })
    }
    else {
        next(err)
    }
}

// everything else errors
exports.handleServerErrors = (err, req, res, next) => {
    console.log(err, "500: internal server error")
    res.status(500).send("We tried everything, and now, we are out of ideas!")
}