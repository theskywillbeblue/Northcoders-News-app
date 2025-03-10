const { showTopics } = require("../nc-models/topics.model")

exports.getTopics = (req, res, next) => {
    showTopics()
    .then((rows) => {
        res.status(200).send({ topics: rows})
        console.log('🔶', {topics: rows});
    })
    .catch((err) => {
        console.log('🔶', err);
        next(err);
    })
}