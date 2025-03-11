const express = require("express");
const app = express()
const {handleIncorrectEndpoints, handleServerErrors, handleTypeInputErrors} = require("../northcoders-news-BE/error-handlers")
const { getEndpoints } = require("./nc-controllers/api.controller");
const { getTopics } = require("./nc-controllers/topics.controller")
const { getArticleById, getArticles, getCommentsByArticleId } = require("./nc-controllers/articles.controller")

// endpoints

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)


// error handling

app.use(handleTypeInputErrors)
app.use(handleIncorrectEndpoints)
app.use(handleServerErrors)

app.all("*", (req, res) => {
    res.status(404).send({msg: "invalid endpoint"})
})


module.exports = app