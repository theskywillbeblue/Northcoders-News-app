const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
	if (!created_at) return { ...otherProperties };
	return { created_at: new Date(created_at), ...otherProperties };
};

exports.articleIdToComments = (commentsData, articleData) => {
	const articleMap = articleData.reduce((acc, article) => {
	  acc[article.title] = article.article_id;
	  return acc;
	}, {});
  
	return commentsData.map(comment => ({
	  ...comment,
	  article_id: articleMap[comment.article_title]
	}));
  };
