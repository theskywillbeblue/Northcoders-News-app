const db = require("../connection")
const format = require("pg-format");
const { convertTimestampToDate, articleIdToComments } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
             return db.query('DROP TABLE IF EXISTS comments')
  .then(()=>{return db.query('DROP TABLE IF EXISTS articles')})
  .then(()=>{return db.query('DROP TABLE IF EXISTS topics')})
  .then(()=>{return db.query('DROP TABLE IF EXISTS users')})
  .then(()=>{return createUsers()})
  .then(()=>{return insertUsers(userData)})
  .then(()=>{return createTopics()})
  .then(()=>{return insertTopics(topicData)})
  .then(()=>{return createArticles()})
  .then(()=>{return insertArticles(articleData)})
  .then((articleRes) => {
    return createComments().then(() => {
      return insertComments(articleRes.rows, commentData);
    });
  });
};
module.exports = seed;


// creations //

function createTopics(){
  return db.query(`CREATE TABLE topics (
    slug VARCHAR(255) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    img_url VARCHAR(1000)
    )`);
}

function createUsers(){
  return db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR(100),
    avatar_url VARCHAR(1000)
    )`);
}

function createArticles(){
  return db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    topic VARCHAR REFERENCES topics(slug),
    title VARCHAR(100),
    body TEXT,
    created_at TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000) NOT NULL,
    author VARCHAR REFERENCES users(username)
    )`);
}

function createComments(){
  return db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body TEXT,
    votes INT NOT NULL DEFAULT(0),
    created_at TIMESTAMP,
    author VARCHAR REFERENCES users(username),
    article_id INT REFERENCES articles(article_id)
    )`);
}


// insertions //

function insertTopics(data){
  const sqlData = data.map((topic) => {
    return [topic.slug, topic.description, topic.img_url];
  })
  const topicsInsertQuery = format(
    ` INSERT INTO topics
      (slug, description, img_url)
      VALUES
      %L
      RETURNING *
      `,
    sqlData
  );

  return db.query(topicsInsertQuery);
}

function insertUsers(data){
  const sqlData = data.map((user) => {
    return [user.username, user.name, user.avatar_url];
  })
  const usersInsertQuery = format(
    ` INSERT INTO users
      (username, name, avatar_url)
      VALUES
      %L
      RETURNING *
      `,
    sqlData
  );

  return db.query(usersInsertQuery);
}

function insertArticles(data){

  const newData = data.map(object => {return convertTimestampToDate(object)})

  const sqlData = newData.map((article) => {
      return [article.title, article.body, article.created_at, article.votes, article.article_img_url, article.author, article.topic];
  })


  const articlesInsertQuery = format(
    ` INSERT INTO articles
      (title, body, created_at, votes, article_img_url, author, topic)
      VALUES
      %L
      RETURNING *
      `,
    sqlData
  );

  return db.query(articlesInsertQuery);
}

function insertComments(artData, comData){

  const newData = comData.map(object => {return convertTimestampToDate(object)})

  const upDatedComments = articleIdToComments(newData, artData)

  const sqlData = upDatedComments.map((comment) => {
    return [
      comment.article_id,
      comment.body,
      comment.votes,
      comment.author,
      comment.created_at
    ];
  })

  const commentsInsertQuery = format(
    ` INSERT INTO comments
      (article_id, body, votes, author, created_at)
      VALUES
      %L
      RETURNING *
      `,
    sqlData
  );

  return db.query(commentsInsertQuery);
}







