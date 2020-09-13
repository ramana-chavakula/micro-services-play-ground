## Helm install usage
```
helm install <NAME> <CHART> [flags]
```

## Install Prometheus through helm

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm install my-prometheus-release -n=monitoring prometheus-community/prometheus \
--set server.global.scrape_interval=15s
```

## Delete Prometheus through helm
```
helm delete -n=monitoring my-prometheus-release
```

[Represent POD's CPU usage in terms of CPU cores using prometheus metrics](https://stackoverflow.com/questions/61693687/is-there-any-way-to-represent-pod-cpu-usage-in-terms-of-cpu-cores-using-promethe)

```PromQL
sum(rate(container_cpu_usage_seconds_total{namespace="$namespace", pod="$pod", container!="POD", container!=""}[1m])) by (pod)
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
* https://hub.helm.sh/charts/elastic/elasticsearch
* https://hub.helm.sh/charts/elastic/kibana/7.1.1
* https://github.com/elastic/helm-charts/blob/7.7/elasticsearch/README.md
* https://github.com/helm/charts/tree/master/stable/fluentd
* https://docs.fluentd.org/v/0.12/articles/kubernetes-fluentd
* https://docs.fluentd.org/container-deployment/kubernetes
* https://github.com/uken/fluent-plugin-elasticsearch
* https://github.com/fluent/fluentd-kubernetes-daemonset/blob/master/fluentd-daemonset-elasticsearch.yaml
* https://github.com/fluent/fluentd-kubernetes-daemonset/blob/master/fluentd-daemonset-elasticsearch-rbac.yaml
* https://www.digitalocean.com/community/tutorials/how-to-set-up-an-elasticsearch-fluentd-and-kibana-efk-logging-stack-on-kubernetes