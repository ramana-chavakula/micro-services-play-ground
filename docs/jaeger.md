# Jaeger
## Install jaeger
```
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts

helm install jaeger jaegertracing/jaeger
```

By default, the chart deploys the following:

* Jaeger Agent DaemonSet
* Jaeger Collector Deployment
* Jaeger Query (UI) Deployment
* Cassandra StatefulSet

we can even use the existing elasticsearch instead of using Cassandra StatefulSet by passing the below properties to helm install command
```sh
helm install my-jaeger-release -n=observability jaegertracing/jaeger \
  --set provisionDataStore.cassandra=false \
  --set storage.type=elasticsearch \
  --set storage.elasticsearch.host=elasticsearch.observability.svc.cluster.local \
  --set storage.elasticsearch.port=9200
```

**FYI** 
* https://github.com/jaegertracing/helm-charts/tree/master/charts/jaeger
* https://logz.io/blog/jaeger-and-the-elk-stack/

## Delete jaeger
```
helm delete -n=observability my-jaeger-release
```

## view traces

Run the below commands

```apache benchmark
ab -n 5 http://localhost:8000/game/paper
```

```sh
curl --request GET 'http://localhost:8000/game/paper' \
-H 'x-trace-id: 6b8d2361-f3a2-4d33-b8b5-51ca27e70224'
```

and navigate to this [link](http://localhost:16686/search?end=1600003999162000&limit=20&lookback=1h&maxDuration&minDuration&operation=GET%3A%20%2Fgame%2Fpaper&service=performance-test&start=1600000399162000) to view the traces