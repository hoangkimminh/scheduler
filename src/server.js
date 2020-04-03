const fastify = require('fastify')
const loaders = require('./loaders')
const watchModule = require('./modules/watch')

const { NODE_ENV, PORT } = process.env

const main = async () => {
  const server = fastify({
    ignoreTrailingSlash: true,
    logger: { level: NODE_ENV !== 'production' ? 'debug' : 'info' },
  })

  try {
    server.register(loaders.agenda)
    server.register(watchModule.router, (parent) => {
      return { agenda: parent.agenda }
    })

    await server.listen(PORT, '::') // listen to all IPv6 and IPv4 addresses
  } catch (err) {
    server.log.error(err.message)
    process.exit(1)
  }
}

main()
