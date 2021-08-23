const db = require('./connection')
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

const datasetId = 'hosana';
const tableId = 'logs';

/*
For this project i created bigquery and sql database however now 
i noticed i have a debt of 1700TRY to google :) 
For the insertions it doesnt allow me to use insert method since 
it seems like free tier. 
*/

/*
I used this query below to insert row to MYSQL db on Google Cloud.
Then i had to export the data as json and upload it to bigquery table. 
*/
const insertLogSQL = `
INSERT INTO logs
            (type,
             app_id,
             session_id,
             event_name,
             event_time,
             page,
             country,
             region,
             city,
             user_id)
VALUES      (?) 
`

/*
I think it's always better to get the desired query result in one single query
from my end it was the toughest part in this project to write this query
*/

const query = `
WITH total_users AS (
    SELECT 
    COUNT(DISTINCT user_id) AS total_users
    FROM hosana.logs
),

daily_new_users AS (
    SELECT 
    join_date, 
    COUNT(DISTINCT user_id) AS daily_new_users -- count unique users by join_date (i.e. daily new user count)
    FROM (
            SELECT 
            user_id, 
            MIN(DATE(event_time)) as join_date -- get the first date a user had an event log
            FROM hosana.logs
            GROUP BY 1
        ) 
    GROUP BY 1
),

average_daily_session_duration AS (
    SELECT
    DATE(session_start_time) AS session_date,
    AVG(TIMESTAMP_DIFF(session_end_time, session_start_time, second)) AS average_daily_session_duration -- average session duration for a given day calcualted in seconds
    FROM (  
            SELECT -- Get the session start and end times for all of a user's unique sessions
            user_id,
            session_id,
            MIN(event_time) AS session_start_time,
            MAX(event_time) AS session_end_time
            FROM hosana.logs
            GROUP BY 1,2
        )
    GROUP BY 1
),

daily_active_users AS (
    SELECT 
    DATE(event_time) AS day,
    COUNT(DISTINCT user_id) AS daily_active_users
    FROM hosana.logs
    GROUP BY 1
),

daily_statistics AS ( -- combine all daily statistics into one table
SELECT
ARRAY_AGG(STRUCT(date, average_session_duration, active_user_count, new_user_count) ORDER BY date ASC) AS  daily_stats
FROM (
    SELECT 
    daily_active_users.day as date,
    average_daily_session_duration.average_daily_session_duration AS average_session_duration,
    daily_active_users.daily_active_users AS active_user_count,
    NULLIF(daily_new_users.daily_new_users,0) AS new_user_count
    FROM daily_active_users
    LEFT JOIN daily_new_users ON daily_active_users.day = daily_new_users.join_date
    LEFT JOIN average_daily_session_duration ON daily_active_users.day = average_daily_session_duration.session_date
    )
)

SELECT  
total_users,
daily_stats
FROM total_users
LEFT JOIN daily_statistics ON 1=1
`

const insertLog = async (values) => {
    // Here you can find the mentioned sql insertion above.

    // return new Promise((resolve, reject) => {
    //     db.query(insertLogSQL, [values], async (err, result) => {
    //         if (err) console.log(err)
    //         else resolve(result.affectedRows)
    //     });
    // })
    await bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert(values);
}

const queryLog = async () => {
    const options = {
        query: query,
        location: 'US',
    };

    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    return rows;
}


module.exports = { insertLog, queryLog }