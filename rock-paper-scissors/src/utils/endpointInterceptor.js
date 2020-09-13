const uuid = require("uuid").v4
const onHeaders = require("on-headers")
const prometheusClient = require('prom-client')
const { getLogger} = require('./utils')
const logger = getLogger(__filename)
const tracer = require('./tracer')
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing')
const { name } = require('../../package.json');

const counter = new prometheusClient.Counter({
  name: `${name.replace(/-/g,'_')}_requests`,
  help: 'number of requests that hit the performance test service',
  labelNames: ['method', 'url', 'status', 'traceId']
})

// Prometheus metrics doesn't support dash or hyphen so replacing hyphen with underscore
const gauge = new prometheusClient.Gauge({
  name: `${name.replace(/-/g,'_')}_inprogress_requests`,
  help: 'number of requests that are inprogress in the performance test service',
  labelNames: ['url']
})

const TRACE_HEADERS = {
  traceId: 'x-trace-id',
  spanId: 'x-span-id',
  fromSpanId: 'x-from-span-id'
}

function getTraceInfo(req, TRACE_HEADERS) {
  const { headers } = req
  return {
    traceId: headers[TRACE_HEADERS.traceId],
    spanId: headers[TRACE_HEADERS.spanId],
    fromSpanId: headers[TRACE_HEADERS.fromSpanId]
  }
}

function onStart (req, res, { TRACE_HEADERS }) {
  const { method, originalUrl } = req
  if (originalUrl === '/metrics' || originalUrl === '/') {
    return
  }
  // fetchig / generating the trace headers
  const { traceId = uuid(), spanId = uuid(), fromSpanId } = getTraceInfo(req, TRACE_HEADERS)
  const traceObj = { traceId, spanId, fromSpanId }
  const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers)
  const span = tracer.startSpan(`${method}: ${originalUrl}`, {
    childOf: parentSpanContext
  })
  span.setTag('traceId', traceId)
  span.setTag('spanId', spanId)
  if (fromSpanId) {
    span.setTag('fromSpanId', fromSpanId)
  }
  span.setTag('url', originalUrl)
  span.setTag('method', method)
  // logIndex object is copied in to the JSON log line.
  const logIndex = { method, originalUrl, ...traceObj }
  // re-assigning trace headers
  req.headers[TRACE_HEADERS.traceId] = traceId
  req.headers[TRACE_HEADERS.spanId] = spanId
  req.headers[TRACE_HEADERS.fromSpanId] = fromSpanId
  req.headers.traceObj = traceObj
  req.span = span
  logger.info(logIndex, 'recieved request of', `method: ${method}`, `url: ${originalUrl}`)
  counter.labels(method, originalUrl, 'Inprogress', traceId)
  .inc()
  gauge.labels(originalUrl).inc()
}

function onEnd (req, res, { TRACE_HEADERS }) {
  const { method, originalUrl, span } = req
  if (originalUrl === '/metrics' || originalUrl === '/') {
    return
  }
  const { statusCode } = res
  const traceObj = req.headers.traceObj
  const logIndex = { ...traceObj }
  if (statusCode >= 400) {
    span.setTag(Tags.ERROR, true);
    span.log({'event': 'error', 'message': `request failed with status: ${statusCode}`})
    logger.error(logIndex, `request failed with status: ${statusCode}`)
    counter.labels(method, originalUrl, 'failed', traceObj.traceId)
    .inc()
  } else {
    span.log({'event': 'completed', 'status': statusCode})
    logger.info(logIndex, `completed the request with status: ${statusCode}`)
    counter.labels(method, originalUrl, 'success', traceObj.traceId)
    .inc()
  }
  span.finish()
  gauge.labels(originalUrl).dec()
}

function apiMetrics(options) {
  options = Object.assign({}, { TRACE_HEADERS }, options)
  const { before, after} = options || {}
  return function apiMetricsMiddleware(req, res, next) {
    onStart(req, res, options)
    if (typeof before === 'function') {
      before(req, res)
    }
    onHeaders(res, () => {
      onEnd(req, res, options)
      if (typeof after === 'function') {
        after(req, res)
      }
    })
    next()
  }
}

module.exports = apiMetrics