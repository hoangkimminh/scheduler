const fastify = require('fastify')
const agendaLoader = require('./loaders/agenda')
const rootRouter = require('./routers/root')

const { NODE_ENV, PORT } = process.env

const loggerLevel = NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })

const main = async () => {
  try {
    server.register(agendaLoader)
    server.register(rootRouter, (parent) => {
      return { scheduler: parent.scheduler }
    })
    await server.listen(PORT, '::') // listen to all IPv6 and IPv4 addresses
  } catch (err) {
    server.log.error(err.message)
    process.exit(1)
  }
}

main()
