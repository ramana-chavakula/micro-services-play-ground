const { name, version } = require('../../package.json')
const Logger = require('./logger')
const  { EventEmitter } = require('events');

function getLogger(filename) {
  return new Logger({
    name,
    version,
    filename
  })
}

function yooMemorySync(x) {
  for (i = 0; i < 100000; i++) {
    x.push("yooo")
  }
}

function yooMemory(x) {
  return new Promise(resolve => {
    const eventEmitter = new EventEmitter();
    setImmediate(() => {
      for (i = 0; i < 100000; i++) {
        x.push("yooo")
      }
      eventEmitter.emit('done')
    })
    eventEmitter.on('done', resolve)
  })
}

async function memoryIntensive(scale = 2) {
  let x = []
  const iterations = 10
  for (let count = 0; count < scale; count++) {
    for (let j = 0; j < iterations; j++) {
      await yooMemory(x)
    }
  }
  x = null
}

function memoryIntensiveSync(scale = 2) {
  let x = []
  const iterations = 10
  for (let count = 0; count < scale; count++) {
    for (let j = 0; j < iterations; j++) {
      yooMemorySync(x)
    }
  }
  x = null
}

function busyTheCPU () {
  for (let i = 0; i < 1e7; i++) {}
}
function cpuIntensive(scale = 1) {
  for (let count = 0; count < scale; count++) {
    setImmediate(busyTheCPU)
  }
}

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

module.exports = {
  getLogger,
  sleep,
  memoryIntensive,
  memoryIntensiveSync,
  cpuIntensive
}