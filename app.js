const express = require("express");
const {handleIncorrectEndpoints, handleServerErrors, handleTypeInputErrors, handleMissingInputs} = require("./error-handlers")
const app = express()
app.use(express.json());


// routers

const apiRouter = require("./routes/api-router")
const topicsRouter = require("./routes/topics-router")
const commentsRouter = require("./routes/comments-router")
const articlesRouter = require("./routes/articles-router");
const usersRouter = require("./routes/users.router");


// endpoints

app.use("/api", apiRouter)

app.use("/api/topics", topicsRouter)

app.use("/api/articles", articlesRouter)

app.use("/api/comments", commentsRouter)

app.use("/api/users", usersRouter)


// error handling

app.all("*", (req, res) => {
    res.status(404).send({msg: "invalid endpoint"})
})

app.use(handleMissingInputs)
app.use(handleTypeInputErrors)
app.use(handleIncorrectEndpoints)
app.use(handleServerErrors)


module.exports = app