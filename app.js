const express = require("express");
const app = express()
const {handleIncorrectEndpoints, handleServerErrors, handleTypeInputErrors, handleMissingInputs} = require("./error-handlers")
const { getEndpoints } = require("./nc-controllers/api.controller");
const { getTopics } = require("./nc-controllers/topics.controller")
const { getArticleById, getArticles, getCommentsByArticleId, patchArticle } = require("./nc-controllers/articles.controller");
const { postComment, deleteComment } = require("./nc-controllers/comments.controller");
const { getUsers } = require("./nc-controllers/users.controller");

app.use(express.json());

// endpoints

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchArticle)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)


// error handling


app.all("*", (req, res) => {
    res.status(404).send({msg: "invalid endpoint"})
})

app.use(handleMissingInputs)
app.use(handleTypeInputErrors)
app.use(handleIncorrectEndpoints)
app.use(handleServerErrors)


module.exports = app