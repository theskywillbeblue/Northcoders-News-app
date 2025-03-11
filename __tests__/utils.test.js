const {
  convertTimestampToDate,
  checkExists
} = require("../db/seeds/utils");

const db = require("../db/connection");

afterAll(() => {
	return db.end();
});

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("checkExists util function", () => {
  test("Function resolves to true if the resource exists in the database", () => {
      return checkExists("articles", "article_id", 1)
      .then((res) => {
          expect(res).toBe(true);
      });
  });

  test("Function rejects if resource doesn't exist in the database", () => {
      return checkExists("articles", "article_id", 99999)
      .catch((err) => {
          expect(err.status).toBe(404);
          expect(err.msg).toBe("Resource not found");
      });
  });
});