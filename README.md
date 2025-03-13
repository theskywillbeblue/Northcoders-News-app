# NC News Seeding
Northcoders News API

This API is used to interact with the nc-news SQL database. You can get articles, comments, users and topics, query by topics, post comments, patch articles, and delete comments using different endpoints (see /api endpoint for a json representation of all the available endpoints with response examples).

The hosted version of this API can be found here: https://northcoders-news-app-jog4.onrender.com/api

You can use a local version of this API by doing the following:


Getting Started:

Make sure you have Node.js (min. v6.0.0) and PostgreSQL (min. v8.13.3) installed. The following instructions also assume the use of NPM (Node Package Manager) to manage our project dependencies.

Clone this repo locally using the command: git clone https://github.com/theskywillbeblue/Northcoders-News-app.git

Install dependencies by navigating to the root directory and running; npm i.

In order to run this project locally, you must create two .env files. These should be; .env.test and .env.development. Within these files, set place; PGDATABASE=nc_news_test and PGDATABASE=nc_news respectively. (Ensure these .env files are included in your .gitignore).

To set-up and seed the local database, run: npm run setup-dbs and then: npm run seed-dev.

Now you're ready to use the API!

To run the server with the development database, use the command npm start. To run tests (which will use the test database) use npm test. There are multiple test files located in __tests__ and you can choose to only run app.test.js using shorthand command: npm t a, or: npm t u, to only run utils.test.js.