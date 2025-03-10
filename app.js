const express = require("express");
const app = express()
const { getEndpoints } = require("./nc-controllers/api.controller");

// endpoints

app.get("/api", getEndpoints)




// error handling



module.exports = app