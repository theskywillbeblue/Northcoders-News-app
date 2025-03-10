const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
// test imports
const request = require("supertest")
const app = require('../app')

// beforeEach & afterAll functions
const seed = require("../db/seeds/seed");
const data = require("../db/data/development-data")

beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})


// GET /api/nonexistent
describe('GET a 404 for non existent endpoints', () => {
  test("404: Return a 404 error if the endpoint is not found", () => {
    return request(app)
    .get("/api/nonexistent")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("invalid endpoint")
    })
  })
})

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
        const topics = body.topics
        expect(topics).toHaveLength(3)
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe('string')
          expect(typeof topic.description).toBe('string')
        })
       
      })
  });
});
