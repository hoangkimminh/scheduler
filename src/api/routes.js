module.exports = (server, opts, next) => {
  const { scheduler } = opts

  server.get('/', async () => {
    return { iam: '/api' }
  })

  server.post('/watch', async (req) => {
    const { url, cssSelectors, interval } = req.body
    try {
      // req.body.interval in seconds, interval param of scheduler.every() in milliseconds
      await scheduler.every(interval * 1000, 'execute-watch-session', {
        url,
        cssSelectors
      })
      return { success: true }
    } catch (err) {
      req.log.error(err.message)
      return { success: false }
    }
  })

  next()
}
