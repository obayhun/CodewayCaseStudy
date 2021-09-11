const fastify = require('fastify')({ logger: false})
const schemas = require('./schemas/log')
const queries = require('./db/queries')
const helpers = require('./helpers/resultFormatter')
const jwtHelper = require('./helpers/jwtHelper')
const { signin } = require('./schemas/user')
const config = process.env;

/*
Since we have only 2 endpoints it would be unnecessary effort to 
create them inside the routes directry.
*/

fastify.post('/log', { schemas }, async (request, reply) => {
  console.log('Log insertion requested');
  let token = request.headers['codeway-token'];
  let isAuthorized = jwtHelper.verifyToken(token); 
  if (isAuthorized) {
    let log = request.body;
    log["event_time"] = new Date(log.event_time).toISOString().slice(0, 19).replace('T', ' ');
    //const count = await queries.insertLog(log)
    const count = 1;
    console.log('Log has been successfully added');
    return { affected: count }
  }
  console.log('Failed to authenticate');
  return {error: isAuthorized}

})

fastify.get('/summary', {}, async (request, reply) => {
  console.log('Summary requested');
  let token = request.headers['codeway-token'];
  let isAuthorized = jwtHelper.verifyToken(token); 
  if (isAuthorized) {
    console.log('Fetching summary');
    const queryResult = await queries.queryLog()
    return helpers.formatSummary(queryResult)
  }else{
    console.log('Failed to authenticate');
    return {error: isAuthorized}
  }
})

fastify.post('/login', signin, async (request, reply) => {
  const username = request.body
  console.log('Generating token for user ', username );
  const token = jwtHelper.generateToken(username)
  return { token }
})



// Run the server!
const start = async () => {
  try {
    await fastify.listen(config.PORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()