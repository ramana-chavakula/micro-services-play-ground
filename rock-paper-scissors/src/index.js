const express = require('express')
const prometheusClient = require('prom-client')
const { sleep, getLogger } = require('./utils/utils')
const logger = getLogger(__filename)
const TRACE_HEADERS = {
  traceId: 'x-trace-id',
  spanId: 'x-span-id',
  fromSpanId: 'x-from-span-id'
}
const endpointInterceptor = require('./utils/endpointInterceptor')({ TRACE_HEADERS })
const game = require('./game')

const app = express()
const port = process.env.PORT || 5000

app.use(endpointInterceptor)
app.get('/', (_, res) => res.send('Welcome to rock paper scissors game :)'))
app.get('/start/:input/:lapTime?', async (req, res) => {
  const { input, lapTime=100 } = req.params
  try {
    await sleep(lapTime)
    const result = game(input)
    if (result < 0) {
      res.status(500)
      .send('you loose the game')
    } else {
      res.status(200)
      if (result === 1) {
        res.send('you won the game')
      } else {
        res.send('the game resulted in draw')
      }
    }

  } catch (err) {
    res.status(400)
    .send(err)
  }
})
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheusClient.register.contentType)
  res.end(prometheusClient.register.metrics())
})
const server = app.listen(port, () => {
  const { address: host, port } = server.address()
  logger.info(`app listening at ${host}:${port}`)
})