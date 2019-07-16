require('dotenv-flow').config()

const fastify = require('fastify')
const Agenda = require('agenda')
const axios = require('axios')
const mongo = require('mongodb')

const loggerLevel = process.env.NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })
const scheduler = new Agenda({
  db: { address: process.env.MONGODB_URI },
  processEvery: '1 minute'
})

scheduler.define('execute-watch-session', async (job, done) => {
  try {
    const res = await axios.post(`${process.env.CRAWLER_ADDRESS}`, job.attrs.data)
    const { success } = res.data
    if (success) done()
    else done(new Error('Failed to execute watch session')) // may add more details about the failed session later
  } catch (err) {
    done(new Error('Failed to process the request to the crawler'))
  }
})

server.get('/', async () => {
  return { iam: '/' }
})

server.post('/watch', async (req) => {
  const { interval, payload } = req.body
  try {
    // req.body.interval in seconds, interval param of scheduler.every() in milliseconds
    await scheduler.every(interval * 1000, 'execute-watch-session', payload)
    return { success: true }
  } catch (err) {
    req.log.error(err.message)
    return { success: false }
  }
})

server.delete('/watch/:id', async (req, res) => {
  try {
    const id = req.params.id
    await scheduler.cancel({name: 'execute-watch-session', _id: new mongo.ObjectID(id)})
    return {success: true}
  } catch (err) {
    req.log.error(err.message)
    return {success: false}
  }
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
