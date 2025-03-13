const usersRouter = require("express").Router()
const { getUsers } = require("../nc-controllers/users.controller")


usersRouter
.route('/')
.get(getUsers)


module.exports = usersRouter