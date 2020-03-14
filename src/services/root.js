const { ObjectID } = require('mongodb')

module.exports = class RootService {
  constructor(scheduler) {
    this.scheduler = scheduler
  }

  async createWatchJob(interval, payload) {
    // interval param above is in s, interval param of scheduler.every() is in ms
    await this.scheduler
      .create('execute-watch-session', payload)
      .repeatEvery(interval * 1000)
      .save()
  }

  async getWatchJobs() {
    let jobs = await this.scheduler.jobs({ name: 'execute-watch-session' })
    return jobs.map((job) => {
      const { _id, repeatInterval, data } = job.attrs
      return { _id, interval: repeatInterval, payload: data }
    })
  }

  async getWatchJobByID(id) {
    const _id = new ObjectID(id)
    const jobs = await this.scheduler.jobs({ name: 'execute-watch-session', _id })
    if (jobs.length) {
      const { _id, repeatInterval, data } = jobs[0].attrs
      return { _id, interval: repeatInterval, payload: data }
    }
    throw new Error(`No watch job with ID=${id} found`)
  }

  async deleteWatchJobByPayload(payload) {
    if (!payload) return
    await this.scheduler.cancel({ name: 'execute-watch-session', data: payload })
  }
}
