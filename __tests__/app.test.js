const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
// test imports
const request = require("supertest");
const app = require("../app");
const jestSorted = require("jest-sorted");

// beforeEach & afterAll functions
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	return db.end();
});

// GET /api/nonexistent
describe("GET a 404 for non existent endpoints", () => {
	test("404: Return a 404 error if the endpoint is not found", () => {
		return request(app)
			.get("/api/nonexistent")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("invalid endpoint");
			});
	});
});

// GET /api
describe("GET /api", () => {
	test("200: Responds with an object detailing the documentation for each endpoint", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body: { endpoints } }) => {
				expect(endpoints).toEqual(endpointsJson);
			});
	});
});

// GET /api/topics
describe("GET /api/topics", () => {
	test("200: Responds with an an array of topic objects, each of which has a slug and a description", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				const topics = body.topics;
				expect(topics).toHaveLength(3);
				topics.forEach((topic) => {
					expect(typeof topic.slug).toBe("string");
					expect(typeof topic.description).toBe("string");
				});
			});
	});
});
// GET /api/articles/:article_id
describe("GET /api/articles/:article_id", () => {
	test("200: Responds with an article object, with the corresponding given article_id number", () => {
		return request(app)
			.get("/api/articles/3")
			.expect(200)
			.then(({ body }) => {
				expect(body).toMatchObject({
          article_id: 3,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: '2020-11-03T09:12:00.000Z',
          votes: 0,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        });
			});
	});
	test("404: Responds with an error message if the article does not exist", () => {
		return request(app)
			.get("/api/articles/999999")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("article not found");
			});
	});
	test("400: Responds with an error message if the article_id type is not valid", () => {
		return request(app)
			.get("/api/articles/liverpool")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("bad request");
			});
	});
});
// GET /api/articles
describe("GET /api/articles", () => {
	test("200: Responds with an array of article objects, each of which has the body omited and replaced with a comment count (showing the total number of comments for that article) and they are ordered by date decs", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				const articles = body.articles;
				expect(articles).toHaveLength(13);
				articles.forEach((article) => {
					expect(typeof article.author).toBe("string");
					expect(typeof article.title).toBe("string");
					expect(typeof article.article_id).toBe("number");
					expect(typeof article.topic).toBe("string");
					expect(typeof article.created_at).toBe("string");
					expect(typeof article.votes).toBe("number");
					expect(typeof article.article_img_url).toBe("string");
					expect(typeof article.comment_count).toBe("number");
					expect(article).not.toHaveProperty("body");
				});
				expect(articles).toBeSortedBy("created_at", { descending: true });
			});
	});
});

// GET /api/articles/:article_id/comments
describe("GET /api/articles/:article_id/comments", () => {
	test("200: Responds with an array of comments objects for the given article_id, ordered by the most recent first", () => {
		return request(app)
			.get("/api/articles/5/comments")
			.expect(200)
			.then(({ body }) => {
				const comments = body
				expect(comments).toHaveLength(2);
				comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
					expect(typeof comment.author).toBe("string");
					expect(typeof comment.body).toBe("string");
					expect(typeof comment.article_id).toBe("number");
				});
				expect(comments).toBeSortedBy("created_at", { descending: true });
			});
	});
  test("404: Responds with an error if no comments are found for that article_id", () => {
		return request(app)
			.get("/api/articles/25/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('no comments found');
				
			});
	});
});
