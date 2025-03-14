
# NC News Seeding
## Northcoders News API

This API is used to interact with the nc-news SQL database. You can get articles, comments, users, and topics, query by topics, post comments, patch articles, and delete comments using different endpoints (see /api endpoint for a JSON representation of all the available endpoints with response examples).

The hosted version of this API can be found here: [https://northcoders-news-app-jog4.onrender.com/api](https://northcoders-news-app-jog4.onrender.com/api)

You can use a local version of this API by doing the following:

---

## Getting Started:

Make sure you have Node.js (min. v6.0.0) and PostgreSQL (min. v8.13.3) installed. The following instructions also assume the use of NPM (Node Package Manager) to manage our project dependencies.

1. **Clone this repo locally** using the command:
    ```bash
    git clone https://github.com/theskywillbeblue/Northcoders-News-app.git
    ```

2. **Install dependencies** by navigating to the root directory and running:
    ```bash
    npm i
    ```

3. **Create `.env` files**:
   You must create two `.env` files. These should be:
   - `.env.test`: Set `PGDATABASE=nc_news_test`
   - `.env.development`: Set `PGDATABASE=nc_news`

   Ensure these `.env` files are included in your `.gitignore`.

4. **Set-up and seed the local database**:
    Run the following commands to set up and seed the database:
    ```bash
    npm run setup-dbs
    npm run seed-dev
    ```

5. Now you're ready to use the API!

---

## Running the API

- **To run the server with the development database**, use the command:
    ```bash
    npm start
    ```

- **To run tests** (which will use the test database), use:
    ```bash
    npm test
    ```

    You can choose to only run specific test files located in the `__tests__` folder. For example:
    - Run `app.test.js`:
        ```bash
        npm t a
        ```
    - Run `utils.test.js`:
        ```bash
        npm t u
        ```

---

## Application Dependencies:
- **npm**: 8.x
- **express**: 4.x
- **pg**: 8.x
- **pg-format**: 1.x
- **dotenv**: 14.x
- **nodemon**: 2.x

## Developer-only Dependencies:
- **jest**: 27.x
- **jest-sorted**: 1.x
- **supertest**: 6.x

---