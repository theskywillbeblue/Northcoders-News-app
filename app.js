const express = require("express");
const app = express()
const {handleIncorrectEndpoints, handleServerErrors} = require("../northcoders-news-BE/error-handlers")
const { getEndpoints } = require("./nc-controllers/api.controller");
const { getTopics } = require("./nc-controllers/topics.controller")

// endpoints

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)



// error handling

app.use(handleIncorrectEndpoints)
app.use(handleServerErrors)

app.all("*", (req, res) => {
    res.status(404).send({msg: "invalid endpoint"})
})


module.exports = app