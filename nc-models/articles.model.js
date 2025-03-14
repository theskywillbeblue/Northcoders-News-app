const db = require('../db/connection');
const { checkExists } = require('../db/seeds/utils');

exports.showArticles = async (
	sort_by = 'created_at',
	order = 'DESC',
	topic
) => {
	const validColumns = [
		'author',
		'title',
		'article_id',
		'topic',
		'created_at',
		'votes',
		'comment_count',
	];

	const validOrders = ['ASC', 'DESC', 'asc', 'desc'];

	if (!validColumns.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: 'invalid sort parameter' });
	}
	if (!validOrders.includes(order)) {
		return Promise.reject({ status: 400, msg: 'invalid order parameter' });
	}

	let articleQuery = `SELECT 
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
    ON articles.article_id = comments.article_id`;

	const queryValues = [];

	if (topic) {
		queryValues.push(topic);
		articleQuery += ` WHERE articles.topic = $1`;
	}

	articleQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;


	const { rows } = await db.query(articleQuery, queryValues);
	if (rows.length === 0 && (await !checkExists('topics', 'slug', topic))) {
		return Promise.reject({ status: 404, msg: 'no articles found' });
	}
	return rows;
};





exports.showArticleById = async (article_id) => {
	const { rows } = await db.query(
		`SELECT articles.*,
			COUNT(comments.comment_id)::INT AS comment_count
			FROM articles
			LEFT JOIN comments 
			ON articles.article_id = comments.article_id
			WHERE articles.article_id = $1 
			GROUP BY articles.article_id`,
		[article_id]
	);
	if (rows.length === 0) {
		return Promise.reject({
			status: 404,
			msg: 'article not found',
		});
	}
	return rows[0];
};

exports.showCommentsByArticleId = async (artId) => {
	const { rows } = await db.query(
		`SELECT *
            FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC`,
		[artId]
	);
	return rows;
};

exports.updateArticle = async (artId, voteChange) => {
	const { rows } = await db.query(
		`UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *`,
		[voteChange, artId]
	);
	return rows[0];
};

exports.createArticle = async (article) => {
	const { author, title, body, topic, article_img_url } = article;

	const { rows } = await db.query(
		`WITH inserted_article AS (
		INSERT INTO articles
		  (author, title, body, topic, article_img_url, created_at) 
		VALUES 
		  ($1, $2, $3, $4, COALESCE($5, 'https://your-default-image-url.com/default.jpg'), CURRENT_TIMESTAMP) 
		RETURNING *
	  )
	  SELECT 
		inserted_article.*,
		users.name AS author_name, 
		users.avatar_url AS author_avatar,
		COUNT(comments.comment_id)::INT AS comment_count
	  FROM inserted_article
	  JOIN users ON inserted_article.author = users.username
	  LEFT JOIN comments ON inserted_article.article_id = comments.article_id
	  GROUP BY inserted_article.article_id,
        inserted_article.author,
        inserted_article.title,
        inserted_article.body,
        inserted_article.topic,
        inserted_article.article_img_url,
        inserted_article.created_at,
        inserted_article.votes,
        users.name,
        users.avatar_url;;
	`,
		[author, title, body, topic, article_img_url]
	);
	return rows[0];
};




exports.removeArticle = async (artId) => {

	// necessary to delete all comments for the article that is then to be deleted
	await db.query(
		`DELETE FROM comments
			WHERE article_id = $1`,
		[artId]
	);
	const { rows } = await db.query(
		`DELETE FROM articles
			WHERE article_id = $1`,
		[artId]
	);
	return rows;
};