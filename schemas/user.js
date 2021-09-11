'use strict'

const signin = {
    body: {
        type: 'object',
        properties: {
            username: { type: 'string', minLength: 1 },
            password: { type: 'string', minLength: 1 }
        }
    }
}

module.exports = { signin }