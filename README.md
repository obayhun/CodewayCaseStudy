
Codeway Case Study -- Oguz Bayhun
================================

Main goal of this project is to handle thousands of requests coming in short interval. To achieve this goal I used Fastify rather than express as my node js server framework. I think Fastify is the right fit for this case study.  Fastify is around 20% faster than Express in almost every request. It has async/await for all components and by default has secure JSON body-parser.

I defined 2 endpoints and didn't separate them into routes folder since the amount of endpoint required is not many.

## POST /log endpoint:

From the dummyEvents.json I created the schema for the request body. Fastify automatically rejects the upcoming requests if their body is not match with the schema rules. I would like to use bigquery for the insertions but my free trial didn't allow me to do that. To solve this issue I used traditional way and connected to Google Cloud MySQL database and then export the data as json and upload to bigquery.

You will see tests folder in the project structure where I sent each dummy event to server using /log endpoint. Without any delays in between 100% requests ended up with success.

## GET /summary endpoint:

This endpoint is our second and last endpoint in which we retrieve the summary information from Bigquery table. Writing the query was the toughest challenge for me in this project I created subqueries for daily_new_users, **average_daily_session_duration**, **daily_active_users** and **total_count** and then finally created one more query which groups the data as described in the case study guide.

You will need **key.json** file which is my **Cloud Credential file** and export it as GOOGLE_APPLICATION_CREDENTIALS and then the **.env** file which stores the mysql connection credentials.

To start the project:

`npm i && node server.js`