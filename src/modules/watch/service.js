const { ObjectID } = require('mongodb')

class WatchService {
  constructor(agenda) {
    this.agenda = agenda
  }

  async create(interval, payload) {
    // interval param above is in s, interval param of agenda.every() is in ms
    await this.deleteByPayload(payload)
    return this.agenda
      .create('execute-watch-session', payload)
      .repeatEvery(interval * 1000)
      .save()
  }

  async get() {
    const jobs = await this.agenda.jobs({ name: 'execute-watch-session' })
    return jobs.map((job) => {
      const { _id, repeatInterval, data } = job.attrs
      return { _id, interval: repeatInterval, payload: data }
    })
  }

  async getByID(id) {
    const _id = new ObjectID(id)
    const jobs = await this.agenda.jobs({ name: 'execute-watch-session', _id })
    if (jobs.length) {
      const { _id, repeatInterval, data } = jobs[0].attrs
      return { _id, interval: repeatInterval, payload: data }
    }
    return undefined
  }

  async deleteByPayload(payload) {
    if (!payload) return
    await this.agenda.cancel({ name: 'execute-watch-session', data: payload })
  }
}

module.exports = WatchService
