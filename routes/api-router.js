const apiRouter = require("express").Router();
const { getEndpoints } = require("../nc-controllers/api.controller");



apiRouter.get("/", getEndpoints);



module.exports = apiRouter