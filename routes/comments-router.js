const commentsRouter = require("express").Router()
const { deleteComment, patchCommentVotesById } = require("../nc-controllers/comments.controller")


commentsRouter
.route("/:comment_id")
.patch(patchCommentVotesById)
.delete(deleteComment);


module.exports = commentsRouter;