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