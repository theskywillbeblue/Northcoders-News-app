const usersRouter = require("express").Router()
const { getUsers, getUserByUsername } = require("../nc-controllers/users.controller")


usersRouter
.route('/')
.get(getUsers)

usersRouter
.route('/:username')
.get(getUserByUsername)


module.exports = usersRouter