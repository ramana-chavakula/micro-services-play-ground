const pino = require('pino')
const level = process.env.LOG_LEVEL || 'info'
const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

class Logger {
  constructor(options) {
    const { filename, name, version } = options
    if (!filename || !filename.trim()) {
      throw Error("filename is a required property in the options")
    }
    if (!name || !name.trim()) {
      throw Error("name is a required property in the options")
    }
    if (!version || !version.trim()) {
      throw Error("version is a required property in the options")
    }
    this.options = { filename, version, service: name }
    this.logger = pino({ name, level })
    for (const level of LOG_LEVELS) {
      Object.defineProperty(this, level, {
        value: (...args) => {
          return this.log(level, ...args)
        } 
      })
    }
  }

  log(level, ...args) {
    let obj = { ...this.options, level }
    let msg = ''
    for (const arg of args) {
      if (typeof arg === 'object') {
        obj = Object.assign({}, obj, arg)
      }
      if (typeof arg === 'string') {
        msg += arg + ' '
      }
    }
    msg.trim()
    this.logger[level](obj, msg)
  }
}

// const logger = new Logger({ name: 'performance-test', filename: 'test-file', version: '1.0'})
// logger.log('info', 'hello')
// logger.log('info', 'hello', { traceId: 'traceId', 'spanId': '13242345'}, "it's working")
// logger.fatal('hello', { traceId: 'traceId', 'spanId': '13242345'}, "it's working")
// logger.warn('hello', { traceId: 'traceId', 'spanId': '13242345'}, "it's working")

module.exports = Logger