const formatSummary = (queryResult) => {
    if (queryResult.length > 0) {
        // Just to not repeat the object with the same key as value
        const total_users = queryResult[0].total_users['total_users'];
        queryResult[0].total_users = total_users;
        for(let i = 0; i< queryResult[0].daily_stats.length; i++){
            queryResult[0].daily_stats[i].average_session_duration = 
            Math.round(queryResult[0].daily_stats[i].average_session_duration);
            queryResult[0].daily_stats[i].date = queryResult[0].daily_stats[i].date.value;
            if(queryResult[0].daily_stats[i].new_user_count === null){
                queryResult[0].daily_stats[i].new_user_count = 0;
            }
        }
        return queryResult
    }
    return []
}

module.exports = { formatSummary }