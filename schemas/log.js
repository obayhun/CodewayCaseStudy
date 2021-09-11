'use strict'

const log = {
    body: {
        type: 'object',
        properties: {
            type: { type: 'string', minLength: 1 },
            app_id: { type: 'string', minLength: 1 },
            session_id: { type: 'string', minLength: 1, maxLength: 10 },
            event_name: { type: 'string', minLength: 1 },
            event_time: { type: 'integer'},
            page: { type: 'string', minLength: 1 },
            country: { type: 'string', minLength: 1 },
            region: { type: 'string', minLength: 1 },
            city: { type: 'string', minLength: 1 },
            user_id: { type: 'string', minLength: 1,maxLength: 10}
        },
    }
}

module.exports = { log }