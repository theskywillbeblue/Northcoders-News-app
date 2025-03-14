const topicsRouter = require("express").Router();
const { getTopics, postTopic } = require("../nc-controllers/topics.controller")


topicsRouter
.route("/")
.get(getTopics)
.post(postTopic)


module.exports = topicsRouter;