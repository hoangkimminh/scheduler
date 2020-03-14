const Agenda = require('agenda')
const axios = require('axios')
const fp = require('fastify-plugin')

const { MONGODB_URI, GATEWAY_ADDRESS } = process.env

const scheduler = new Agenda({
  db: { address: MONGODB_URI },
  processEvery: '1 minute'
})

scheduler.define('execute-watch-session', async (job) => {
  const res = await axios.post(`${GATEWAY_ADDRESS}/api/crawler`, job.attrs.data)
  const { status } = res
  if (status < 200 || status >= 300)
    throw new Error('Failed to execute this watch session')
})

module.exports = fp(async (server) => {
  await scheduler.start()
  server.decorate('scheduler', scheduler)
})
