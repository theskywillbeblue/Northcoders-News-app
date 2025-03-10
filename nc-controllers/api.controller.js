const { showEndpoints } = require("../nc-models/api.model")

exports.getEndpoints = (req, res) => {
    const endpoints = showEndpoints()
    res.status(200).send({ endpoints })
}

