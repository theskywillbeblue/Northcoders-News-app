const db = require("../db/connection");
const format = require("pg-format")

exports.showArticles = () => {
	return db
		.query(
	`SELECT 
        articles.author, 
        articles.title, 
        articles.article_id, 
        articles.topic, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "no articles found",
				});
			}
			return rows;
		});
};

exports.showArticleById = (article_id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "article not found",
				});
			}
			return rows[0];
		});
};
