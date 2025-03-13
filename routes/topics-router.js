const topicsRouter = require("express").Router();
const { getTopics } = require("../nc-controllers/topics.controller")


topicsRouter
.route("/")
.get(getTopics);


module.exports = topicsRouter;