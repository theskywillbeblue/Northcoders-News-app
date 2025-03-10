const db = require("../db/connection");
const format = require("pg-format");

exports.showTopics = () => {
    return db.query(`SELECT slug, description FROM topics`)
    .then(({rows}) => {
        return rows
    })
}