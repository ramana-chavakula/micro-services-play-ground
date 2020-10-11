## Helm install usage
```
helm install <NAME> <CHART> [flags]
```

## Add a chart to helm

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

## Install a chart through helm
```
helm install my-prometheus-release -n=monitoring prometheus-community/prometheus \
--set server.global.scrape_interval=15s
```

## Delete a chart through helm
```
helm delete -n=monitoring my-prometheus-release
```

## Port Forwarding
```
kubectl port-forward service/kibana -n=observability 5601:5601
```

```
kubectl port-forward service/elasticsearch -n=observability 9200:9200
```

```
kubectl port-forward service/my-prometheus-release-server -n=monitoring 9090:80
```

```
kubectl port-forward service/my-grafana-release -n=monitoring 3000:80
```

```
kubectl port-forward service/my-jaeger-release-query -n=observability 16686:80
```

```
kubectl port-forward service/performance-test 8000:8000
```

```
kubectl port-forward service/rock-paper-scissors 5000:5000
```

## List elastic serach indexes
http://localhost:9200/_cat/indices

## Important links
* https://sysdig.com/blog/kubernetes-pod-evicted/
* https://www.robustperception.io/keep-it-simple-scrape_interval-id
* https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/
* https://www.alibabacloud.com/blog/kubernetes-eviction-policies-for-handling-low-ram-and-disk-space-situations---part-1_595202

## helm charts
* https://hub.helm.sh/charts/elastic/elasticsearch
* https://hub.helm.sh/charts/elastic/kibana/7.1.1
* https://github.com/elastic/helm-charts/blob/7.7/elasticsearch/README.md
* https://github.com/helm/charts/tree/master/stable/fluentd

## fluentd
* https://docs.fluentd.org/v/0.12/articles/kubernetes-fluentd
* https://docs.fluentd.org/container-deployment/kubernetes
* https://github.com/uken/fluent-plugin-elasticsearch
* https://github.com/fluent/fluentd-kubernetes-daemonset/blob/master/fluentd-daemonset-elasticsearch.yaml
* https://github.com/fluent/fluentd-kubernetes-daemonset/blob/master/fluentd-daemonset-elasticsearch-rbac.yaml
* https://www.digitalocean.com/community/tutorials/how-to-set-up-an-elasticsearch-fluentd-and-kibana-efk-logging-stack-on-kubernetes

## Database Sharding
* https://www.youtube.com/watch?v=ON3h1_bzg6g
* https://medium.com/@jeeyoungk/how-sharding-works-b4dec46b3f6

## Nodejs Async hooks
* https://stackabuse.com/using-async-hooks-for-request-context-handling-in-node-js/
