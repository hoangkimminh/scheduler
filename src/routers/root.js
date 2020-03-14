const RootService = require('../services/root')

module.exports = async (server, opts) => {
  const { scheduler } = opts
  const rootService = new RootService(scheduler)

  server.post('/watches', async (req, res) => {
    try {
      const { interval, payload } = req.body
      await rootService.createWatchJob(interval, payload)
      res.code(204)
    } catch (err) {
      server.log.error(err.message)
      res.code(500).send()
    }
  })

  server.get('/watches', async (req, res) => {
    try {
      const jobs = await rootService.getWatchJobs()
      res.code(200).send(jobs)
    } catch (err) {
      server.log.error(err.message)
      res.code(500).send()
    }
  })

  server.get('/watches/:id', async (req, res) => {
    try {
      const { id } = req.params
      const job = await rootService.getWatchJobByID(id)
      res.code(200).send(job)
    } catch (err) {
      server.log.error(err.message)
      res.code(500).send()
    }
  })

  server.delete('/watches', async (req, res) => {
    try {
      const { payload } = req.body
      await rootService.deleteWatchJobByPayload(payload)
      res.code(204)
    } catch (err) {
      server.log.error(err.message)
      res.code(500).send()
    }
  })
}
