const express = require('express')
const prometheusClient = require('prom-client')
const request = require('request')
const { sleep, memoryIntensive, cpuIntensive, memoryIntensiveSync, getLogger } = require('./utils/utils')
const logger = getLogger(__filename)
const TRACE_HEADERS = {
  traceId: 'x-trace-id',
  spanId: 'x-span-id',
  fromSpanId: 'x-from-span-id'
}
const endpointInterceptor = require('./utils/endpointInterceptor')({ TRACE_HEADERS })
const { FORMAT_HTTP_HEADERS } = require('opentracing')
const tracer = require('./utils/tracer')

const app = express()
const { Game_Host='0.0.0.0', Game_Port='5000', PORT: port=8000 } = process.env

app.use(endpointInterceptor)
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/delay/:time', async (req, res) => {
  const { time } = req.params
  await sleep(time)
  res.send(`delayed by ${time}ms`)
})
app.get('/sleep/:time', async (req, res) => {
  const { time } = req.params
  res.redirect(`/delay/${time}`)
})
app.get('/memory[S|s]pike/:scale', async (req, res) => {
  const { scale } = req.params
  const result = await memoryIntensive(scale)
  res.send(result)
})
app.get('/sync/memory[S|s]pike/:scale', (req, res) => {
  const { scale } = req.params
  memoryIntensiveSync(scale)
  res.send('done')
})
app.get('/cpu[S|s]pike/:scale', (req, res) => {
  const { scale } = req.params
  cpuIntensive(scale)
  res.send('done')
})
app.get('/fail/:rate/:delay?', async (req, res) => {
  const { rate, delay = 100 } = req.params
  const value = Math.ceil(Math.random() * 100)
  let failed = true, message
  if (isNaN(rate) || rate < 0 || rate > 100) {
    res.status(400)
    message = 'rate should be in the range of [0-100]'
  } else if (value < rate) {
    failed = false
    res.status(200)
  } else {
    res.status(500)
  }

  await sleep(delay)
  res.send({ failed, message })
})
app.get('/game/:input/:lapTime?', async (req, res) => {
  const { input, lapTime=100 } = req.params
  const headers = {};
  tracer.inject(req.span.context(), FORMAT_HTTP_HEADERS, headers)
  const options = {
    url: `http://${Game_Host}:${Game_Port}/start/${input}/${lapTime}`,
    headers: {
      [TRACE_HEADERS['traceId']]: req.headers[TRACE_HEADERS.traceId],
      [TRACE_HEADERS['fromSpanId']]: req.headers[TRACE_HEADERS.spanId],
      ...headers
    }
  }
  request(options, function (error, response, body) {
    res.status(response.statusCode)
    if (error) {
      return res.send(error)
    }
    res.send(body)
  })
})
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheusClient.register.contentType)
  res.end(prometheusClient.register.metrics())
})
const server = app.listen(port, () => {
  const { address: host, port } = server.address()
  logger.info(`app listening at ${host}:${port}`)
})