const fastify = require('fastify')({ logger: true })
const schemas = require('./schemas/log')
const queries = require('./db/queries')
const helpers = require('./helpers/resultFormatter')

/*
Since we have only 2 endpoints it would be unnecessary effort to 
create them inside the routes directry.
*/

fastify.post('/log', { schemas }, async (request, reply) => {
  let log = request.body;
  log["event_time"] = new Date(log.event_time).toISOString().slice(0, 19).replace('T', ' ');
  const count = await queries.insertLog(log)
  return { affected: count }
})

fastify.get('/summary', {}, async (request, reply) => {
  const queryResult = await queries.queryLog()
  return helpers.formatSummary(queryResult)
})



// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()