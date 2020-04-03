const WatchService = require('./service')

module.exports = async (server, opts) => {
  const { agenda } = opts
  const watchService = new WatchService(agenda)

  server.post('/watches', async (req, res) => {
    try {
      const { interval, payload } = req.body
      const job = await watchService.create(interval, payload)
      res.status(200).send(job)
    } catch (err) {
      server.log.error(err.message)
      res.status(500).send()
    }
  })

  server.get('/watches', async (req, res) => {
    try {
      const jobs = await watchService.get()
      res.status(200).send(jobs)
    } catch (err) {
      server.log.error(err.message)
      res.status(500).send()
    }
  })

  server.get('/watches/:id', async (req, res) => {
    try {
      const { id } = req.params
      const job = await watchService.getByID(id)
      if (job) res.status(200).send(job)
      else res.status(404).send()
    } catch (err) {
      server.log.error(err.message)
      res.status(500).send()
    }
  })

  server.delete('/watches', async (req, res) => {
    try {
      const { payload } = req.body
      await watchService.deleteByPayload(payload)
      res.status(204).send()
    } catch (err) {
      server.log.error(err.message)
      res.status(500).send()
    }
  })
}
