require('dotenv-flow').config()

const fastify = require('fastify')
const Agenda = require('agenda')
const axios = require('axios')
const apiRoutes = require('./api/routes')

const loggerLevel = process.env.NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })
const scheduler = new Agenda({
  db: { address: process.env.MONGODB_URI },
  processEvery: '1 minute'
})

scheduler.define('execute-watch-session', async (job, done) => {
  const { url, cssSelectors } = job.attrs.data
  try {
    const res = await axios.post(`${process.env.CRAWLER_ADDRESS}/api`, {
      url,
      cssSelectors
    })
    const { success } = res.data
    if (success) done()
    else done(new Error('Failed to execute watch session')) // may add more details about the failed session later
  } catch (err) {
    done(new Error('Failed to process the request to the crawler'))
  }
})

server.register(apiRoutes, { prefix: '/api', scheduler })

server.get('/', async () => {
  return { iam: '/' }
})

const start = async () => {
  try {
    await Promise.all([
      server.listen(process.env.PORT || 3001, '::'), // listen to all IPv6 and IPv4 addresses
      scheduler.start()
    ])
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
