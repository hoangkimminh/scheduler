const Agenda = require('agenda')
const axios = require('axios').default
const fp = require('fastify-plugin')

const { MONGODB_URI, GATEWAY_ADDRESS } = process.env

const agenda = new Agenda({
  db: { address: MONGODB_URI },
  processEvery: '1 minute',
})

agenda.define('execute-watch-session', async (job) => {
  await axios.post(`${GATEWAY_ADDRESS}/api/crawler`, job.attrs.data)
})

module.exports = fp(async (server) => {
  await agenda.start()
  server.decorate('agenda', agenda)
})
