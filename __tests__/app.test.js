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
			.get('/api/articles/4')
			.expect(200)
			.then(({ body }) => {
				const article = body.article;
				expect(article).toMatchObject({
					author: 'rogersop',
					title: 'Student SUES Mitch!',
					article_id: 4,
					body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
					topic: 'mitch',
					created_at: '2020-05-06T01:14:00.000Z',
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
				expect(body.msg).toBe('incorrect input type');
			});
	});
});
// Q4
describe('GET /api/articles', () => {
	test('200: Responds with an array of article objects, each of which has the body omitted and replaced with a comment count (showing the total number of comments for that article)', () => {
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
			});
	});
	test('200: The response object array of articles is default sorted by date in descending order', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				const articles = body.articles;
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
				expect(body.msg).toBe('incorrect input type');
			});
	});
	test('404: Responds with an error message if the article_id does not exist', () => {
		return request(app)
			.get('/api/articles/999999/comments')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('article_id not found in database');
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
						comment_id: 19,
						votes: 0,
						article_id: 3,
					})
				);
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
				expect(body.msg).toBe('article_id not found in database');
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
				expect(body.msg).toBe('username not found in database');
			});
	});
	test('400: Responds with an error if an incorrect format is used in the request object', () => {
		return request(app)
			.post('/api/articles/1/comments')
			.send({
				username: 'rogersop',
				body: 2212254,
			})
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid format: body');
			});
	});
});

// Q7
describe('PATCH /api/articles/:article_id', () => {
	test('200: Responds with the correct article with newly updated votes count (testing positive increment)', () => {
		return request(app)
			.patch('/api/articles/3')
			.send({ inc_votes: 10 })
			.expect(200)
			.then(({ body }) => {
        const article = body.article
				expect(article).toEqual(
					expect.objectContaining({
						author: expect.any(String),
						created_at: expect.any(String),
						title: expect.any(String),
						body: expect.any(String),
						article_img_url: expect.any(String),
						topic: expect.any(String),
						votes: 10,
						article_id: 3,
					})
				);
			});
	});
	test('200: Also updates the votes count negatively', () => {
		return request(app)
			.patch('/api/articles/3')
			.send({ inc_votes: -10 })
			.expect(200)
			.then(({ body }) => {
        const article = body.article
				expect(article.votes).toBe(-10);
				expect(article.article_id).toBe(3);
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
});

// Q8
describe('DELETE /api/comments/:comment_id', () => {
	test('204: Deletes the comment with the given comment_id from the database', async () => {
		const beforeDelete = await db.query(
			`SELECT * FROM comments WHERE comment_id = 3`
		);

		expect(beforeDelete.rows).toHaveLength(1);
		await request(app).delete('/api/comments/3').expect(204);
		const afterDelete = await db.query(
			`SELECT * FROM comments WHERE comment_id = 3`
		);
		expect(afterDelete.rows).toHaveLength(0);
	});
	test('404: Returns an error message when the comment_id does not exist in the database', () => {
		return request(app)
			.delete('/api/comments/99999')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('comment_id not found in database');
			});
	});
	test('400: Responds with error message if comment_id is in an invalid format', () => {
		request(app)
			.delete('/api/comments/word-not-number')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid format: comment_id');
			});
	});
});

// Q9
describe('GET /api/users', () => {
	test('200: Responds with an array of user objects from the database', () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then(({ body }) => {
				const users = body.users;
				expect(users.length).toBeGreaterThan(0);
				users.forEach((user) => {
					expect(user).toEqual(
						expect.objectContaining({
							username: expect.any(String),
							name: expect.any(String),
							avatar_url: expect.any(String),
						})
					);
				});
			});
	});
});

// Q10
describe('GET /api/articles/(sorting queries)', () => {
	test('200: Responds with an array of articles, sorted by column choice, then by asc or decs order by preference', () => {
		return request(app)
			.get('/api/articles/?sort_by=author&order=asc')
			.expect(200)
			.then(({ body }) => {
				const articles = body.articles;
				expect(articles).toHaveLength(13);
				articles.forEach((article) => {
					expect(article).toEqual(
						expect.objectContaining({
							article_id: expect.any(Number),
							article_img_url: expect.any(String),
							author: expect.any(String),
							topic: expect.any(String),
							title: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(Number),
							created_at: expect.any(String),
						})
					);
					expect(articles).toBeSortedBy('author', { descending: false });
					expect(articles[0]).toEqual({
						article_img_url:
							'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
						author: 'butter_bridge',
						comment_count: 11,
						created_at: '2020-07-09T20:11:00.000Z',
						title: 'Living in the shadow of a great man',
						topic: 'mitch',
						votes: 100,
						article_id: 1,
					});
				});
			});
	});
	test('400: Responds with an error if either sort by query or order by query are invalid', () => {
		return request(app)
			.get('/api/articles/?sort_by=newest&order=desc')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('invalid sort parameter');
			});
	});
	test('400: Responds with an error if either sort by query or order by query are invalid', () => {
		return request(app)
			.get('/api/articles/?sort_by=author&order=misc')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('invalid order parameter');
			});
	});
});

// Q11
describe('GET /api/articles/(topic query)', () => {
	test('200: Responds with an array of articles, filtered by topic value in the query, or all articles if omitted ', () => {
		return request(app)
			.get('/api/articles/?topic=mitch')
			.expect(200)
			.then(({ body }) => {
				const articles = body.articles;
				expect(articles).toHaveLength(12);
				articles.forEach((article) => {
					expect(article).toEqual(
						expect.objectContaining({
							topic: 'mitch',
							article_id: expect.any(Number),
							article_img_url: expect.any(String),
							author: expect.any(String),
							title: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(Number),
							created_at: expect.any(String),
						})
					);
				});
			});
	});
	test('200: The array of articles can still be filtered by topic value in the query, but also sorted by the column of choice and in the order specified ', () => {
		return request(app)
			.get('/api/articles/?sort_by=author&order=desc&topic=mitch')
			.expect(200)
			.then(({ body }) => {
				const articles = body.articles;
				expect(articles).toHaveLength(12);
				articles.forEach((article) => {
					expect(article).toEqual(
						expect.objectContaining({
							topic: 'mitch',
						})
					);
					expect(articles).toBeSortedBy('author', { descending: true });
				});
			});
	});
	test('404: Responds with an error if topic query word chosen is not a valid topic', () => {
		return request(app)
			.get('/api/articles/?topic=cheese')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('no articles found');
			});
	});
});


// Q12
describe('GET /api/articles/:article_id (comment_count)', () => {
	test('200: Responds with the given article object which now contains a comment_count property', () => {
		return request(app)
			.get('/api/articles/3')
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toEqual(
					expect.objectContaining({
						author: expect.any(String),
						created_at: expect.any(String),
						body: expect.any(String),
						votes: 0,
						article_id: 3,
						topic: expect.any(String),
						title: expect.any(String),
						comment_count: expect.any(Number),
					})
				);
			});
	});
	test('200: Responds with correct comment count value', async () => {
		const commentsQuery = await db.query(
			'SELECT * FROM comments WHERE article_id = 9'
		);
		const totalComments = commentsQuery.rowCount;

		return request(app)
			.get('/api/articles/9')
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toEqual(
					expect.objectContaining({
						comment_count: totalComments,
					})
				);
			});
	});
});

// Q16
describe('GET /api/users/:username', () => {
	test('200: Responds with user information belonging to the given username', () => {
		return request(app)
			.get('/api/users/lurker')
			.expect(200)
			.then(({ body }) => {
				const user = body.user;
				expect(user).toMatchObject({
					username: 'lurker',
          name: "do_nothing",
          avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
				});
			});
	});
  test('404: Responds with an error message if the user does not exist', () => {
		return request(app)
			.get('/api/users/NOT-A-USER')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('user not found');
			});
	});

});

// Q17
describe('PATCH /api/comments/:comment_id', () => {
	test('200: Responds with the correct comment with newly updated votes count (testing positive increment)', () => {
		return request(app)
			.patch('/api/comments/2')
			.send({ inc_votes: 10 })
			.expect(200)
			.then(({ body }) => {
        const comment = body.comment;
				expect(comment).toEqual(
					expect.objectContaining({
						comment_id: 2,
						created_at: expect.any(String),
						body: expect.any(String),
						article_id: expect.any(Number),
						author: expect.any(String),
						votes: 24,
					})
				);
			});
	});
	test('200: Also updates the votes count negatively', () => {
		return request(app)
			.patch('/api/comments/2')
			.send({ inc_votes: -10 })
			.expect(200)
			.then(({ body }) => {
        const comment = body.comment 
				expect(comment.votes).toBe(4);
				expect(comment.comment_id).toBe(2);
			});
	});
	test('400: Responds with an error if inc_votes is not a number', () => {
		return request(app)
			.patch('/api/comments/3')
			.send({ inc_votes: 'not-a-number' })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Votes need to be a number');
			});
	});
	test('404: Responds with an error if comment_id does not exist in the database', () => {
		return request(app)
			.patch('/api/comments/99999')
			.send({ inc_votes: 10 })
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Comment not found');
			});
	});
	test('400: Responds with error when inc_votes is missing i.e. has not been inputted', () => {
		return request(app)
			.patch('/api/comments/1')
			.send({})
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Missing required field: inc_votes');
			});
	});
});