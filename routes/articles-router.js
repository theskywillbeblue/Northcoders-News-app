const articlesRouter = require("express").Router()
const { getArticleById, getArticles, getCommentsByArticleId, patchArticle, postArticle } = require("../nc-controllers/articles.controller");
const { postComment } = require("../nc-controllers/comments.controller");


articlesRouter
.route("/")
.get(getArticles)
.post(postArticle)

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchArticle)

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postComment)


module.exports = articlesRouter