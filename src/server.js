require('dotenv-flow').config()

const fastify = require('fastify')
const Agenda = require('agenda')
const axios = require('axios')
const { ObjectID } = require('mongodb')

const { NODE_ENV, PORT, MONGODB_URI, CRAWLER_ADDRESS } = process.env

const loggerLevel = NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })
const scheduler = new Agenda({
  db: { address: MONGODB_URI },
  processEvery: '1 minute'
})

scheduler.define('execute-watch-session', async (job, done) => {
  try {
    const res = await axios.post(`${CRAWLER_ADDRESS}`, job.attrs.data)
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

server.post('/watches', async (req, res) => {
  const { interval, payload } = req.body
  try {
    // req.body.interval in seconds, interval param of scheduler.every() in milliseconds
    await scheduler
      .create('execute-watch-session', payload)
      .repeatEvery(interval * 1000)
      .save()
    res.code(204)
  } catch (err) {
    req.log.error(err.message)
    res.code(500)
  }
})

server.get('/watches', async (req, res) => {
  try {
    let jobs = await scheduler.jobs({ name: 'execute-watch-session' })
    jobs = jobs.map((job) => {
      const { _id, repeatInterval, data } = job.attrs
      return { _id, interval: repeatInterval, payload: data }
    })
    res.code(200).send(jobs)
  } catch (err) {
    req.log.error(err.message)
    res.code(500)
  }
})

server.get('/watches/:id', async (req, res) => {
  try {
    const _id = new ObjectID(req.params.id)
    const jobs = await scheduler.jobs({ name: 'execute-watch-session', _id })
    if (jobs) {
      const { _id, repeatInterval, data } = jobs[0].attrs
      return { _id, interval: repeatInterval, payload: data }
    }
    res.code(500)
  } catch (err) {
    req.log.error(err.message)
    res.code(500)
  }
})

server.delete('/watches/:id', async (req, res) => {
  try {
    const _id = new ObjectID(req.params.id)
    await scheduler.cancel({ name: 'execute-watch-session', _id })
    res.code(204)
  } catch (err) {
    req.log.error(err.message)
    res.code(500)
  }
})

const start = async () => {
  try {
    await Promise.all([
      server.listen(PORT, '::'), // listen to all IPv6 and IPv4 addresses
      scheduler.start()
    ])
  } catch (err) {
    server.log.error(err.message)
    process.exit(1)
  }
}

start()
