const { initTracer, PrometheusMetricsFactory } = require('jaeger-client');
const promClient = require('prom-client');
const { name, version } = require('../../package.json');
const { getLogger} = require('./utils')
const logger = getLogger(__filename)

// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
const config = {
  serviceName: name,
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    // Provide the traces endpoint; this forces the client to connect directly to the Collector and send
    // spans over HTTP
    collectorEndpoint: 'http://my-jaeger-release-collector.observability.svc.cluster.local:14268/api/traces',
    // Provide username and password if authentication is enabled in the Collector
    // username: '',
    // password: ''
  }
};
// http://my-jaeger-release-query.observability.svc.cluster.local:16687/api/traces
var metrics = new PrometheusMetricsFactory(promClient, name.replace(/-/g, '_'))
const options = {
  tags: {
    [`${name}.version`]: version,
  },
  metrics,
  logger
};
const tracer = initTracer(config, options);
module.exports = tracer