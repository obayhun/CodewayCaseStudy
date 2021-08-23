const formatSummary = (queryResult) => {
    if (queryResult.length > 0) {
        // Just to not repeat the object with the same key as value
        const total_users = queryResult[0].total_users['total_users'];
        queryResult[0].total_users = total_users;
        return queryResult
    }
    return []
}

module.exports = { formatSummary }