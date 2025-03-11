const endpointsJson = require('../endpoints.json');
const db = require('../db/connection');
// test imports
const request = require('supertest');
const app = require('../app');

// beforeEach & afterAll functions
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	return db.end();
});

// GET /api/nonexistent
describe('GET a 404 for non existent endpoints', () => {
	test('404: Return a 404 error if the endpoint is not found', () => {
		return request(app)
			.get('/api/nonexistent')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('invalid endpoint');
			});
	});
});

// Q1
describe('GET /api', () => {
	test('200: Responds with an object detailing the documentation for each endpoint', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body: { endpoints } }) => {
				expect(endpoints).toEqual(endpointsJson);
			});
	});
});

// Q2
describe('GET /api/topics', () => {
	test('200: Responds with an an array of topic objects, each of which has a slug and a description', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				const topics = body.topics;
				expect(topics).toHaveLength(3);
				topics.forEach((topic) => {
					expect(typeof topic.slug).toBe('string');
					expect(typeof topic.description).toBe('string');
				});
			});
	});
});
// Q3
describe('GET /api/articles/:article_id', () => {
	test('200: Responds with an article object, with the corresponding given article_id number', () => {
		return request(app)
			.get('/api/articles/3')
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
					article_img_url:
						'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
				});
			});
	});
	test('404: Responds with an error message if the article does not exist', () => {
		return request(app)
			.get('/api/articles/999999')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('article not found');
			});
	});
	test('400: Responds with an error message if the article_id type is not valid', () => {
		return request(app)
			.get('/api/articles/liverpool')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('bad request');
			});
	});
});
// Q4
describe('GET /api/articles', () => {
	test('200: Responds with an array of article objects, each of which has the body omited and replaced with a comment count (showing the total number of comments for that article) and they are ordered by date decs', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				const articles = body.articles;
				expect(articles).toHaveLength(13);
				articles.forEach((article) => {
					expect(typeof article.author).toBe('string');
					expect(typeof article.title).toBe('string');
					expect(typeof article.article_id).toBe('number');
					expect(typeof article.topic).toBe('string');
					expect(typeof article.created_at).toBe('string');
					expect(typeof article.votes).toBe('number');
					expect(typeof article.article_img_url).toBe('string');
					expect(typeof article.comment_count).toBe('number');
					expect(article).not.toHaveProperty('body');
				});
				expect(articles).toBeSortedBy('created_at', { descending: true });
			});
	});
});

// Q5
describe('GET /api/articles/:article_id/comments', () => {
	test('200: Responds with an array of comments objects for the given article_id, ordered by the most recent first', () => {
		return request(app)
			.get('/api/articles/5/comments')
			.expect(200)
			.then(({ body }) => {
				const comments = body.comments;
				expect(comments).toHaveLength(2);
				comments.forEach((comment) => {
					expect(typeof comment.comment_id).toBe('number');
					expect(typeof comment.votes).toBe('number');
					expect(typeof comment.created_at).toBe('string');
					expect(typeof comment.author).toBe('string');
					expect(typeof comment.body).toBe('string');
					expect(comment.article_id).toBe(5);
				});
				expect(comments).toBeSortedBy('created_at', { descending: true });
			});
	});
	test('200: Responds with an empty array if NO comments are found for a GENUINE article Id', () => {
		return request(app)
			.get('/api/articles/2/comments')
			.expect(200)
			.then(({ body }) => {
				expect(body.comments).toEqual([]);
			});
	});
	test('400: Responds with an error if the article_id is given in an incorrect format', () => {
		return request(app)
			.get('/api/articles/not-a-number/comments')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('bad request');
			});
	});
	test('404: Responds with an error message if the article_id does not exist', () => {
		return request(app)
			.get('/api/articles/999999/comments')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not found in database');
			});
	});
});

// Q6
describe('POST /api/articles/:article_id/comments', () => {
	test('201: Responds with the posted comment', () => {
		return request(app)
			.post('/api/articles/3/comments')
			.send({
				username: 'rogersop',
				body: 'Liverpool are going to win the league!',
			})
			.expect(201)
			.then(({ body }) => {
				expect(body.comment).toEqual(
					expect.objectContaining({
						author: expect.any(String),
						created_at: expect.any(String),
					})
				);
				expect(body.comment.comment_id).toBe(19);
				expect(body.comment.votes).toBe(0);
				expect(body.comment.article_id).toBe(3);
			});
	});
	test('404: Responds with an error if article_id does not exist', () => {
		return request(app)
			.post('/api/articles/999999/comments')
			.send({
				username: 'rogersop',
				body: 'Liverpool are going to win the league!',
			})
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not found in database');
			});
	});
	test('400: Responds with an error if username is missing in the post', () => {
		return request(app)
			.post('/api/articles/4/comments')
			.send({ body: 'Liverpool are going to win the league!' })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Missing username');
			});
	});
	test('400: Responds with an error if body is missing in the post', () => {
		return request(app)
			.post('/api/articles/1/comments')
			.send({ username: 'rogersop' })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Missing body');
			});
	});
	test('404: Responds with an error if user does not exist in the username table', () => {
		return request(app)
			.post('/api/articles/7/comments')
			.send({
				username: 'Diogo Jota',
				body: 'Liverpool are going to win the league!',
			})
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not found in database');
			});
	});
});

// Q7
describe('PATCH /api/articles/:article_id', () => {
	test('200: Responds with the correct article with newly updated votes count (positive increment)', () => {
		return request(app)
			.patch('/api/articles/3')
			.send({ inc_votes: 10 })
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(
					expect.objectContaining({
						author: expect.any(String),
						created_at: expect.any(String),
						title: expect.any(String),
						body: expect.any(String),
						article_img_url: expect.any(String),
						topic: expect.any(String),
					})
				);
				expect(body.votes).toBe(10);
				expect(body.article_id).toBe(3);
			});
	});
	test('200: Also updates the votes count negatively', () => {
		return request(app)
			.patch('/api/articles/3')
			.send({ inc_votes: -10 })
			.expect(200)
			.then(({ body }) => {
				expect(body.votes).toBe(-10);
				expect(body.article_id).toBe(3);
			});
	});
	test('400: Responds with an error if inc_votes is not a number', () => {
		return request(app)
			.patch('/api/articles/6')
			.send({ inc_votes: 'not-a-number' })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Votes need to be a number');
			});
	});
	test('404: Responds with an error if article_id does not exist in the database', () => {
		return request(app)
			.patch('/api/articles/99999')
			.send({ inc_votes: 10 })
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Article not found');
			});
	});
	test('400: Responds with error when inc_votes is missing i.e. has not been inputted', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({})
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Missing required field: inc_votes');
			});
	});
	test('200: Responds with the newly updated votes count in the article at the article_id endpoint submitted', () => {
		return request(app)
			.patch('/api/articles/3')
			.send({ inc_votes: 10 })
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(
					expect.objectContaining({
						author: expect.any(String),
						created_at: expect.any(String),
						title: expect.any(String),
						body: expect.any(String),
						article_img_url: expect.any(String),
						topic: expect.any(String),
					})
				);
				expect(body.votes).toBe(10);
				expect(body.article_id).toBe(3);
			});
	});
});
