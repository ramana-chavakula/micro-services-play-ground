# Prometheus

## Install Prometheus

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm install my-prometheus-release -n=monitoring prometheus-community/prometheus \
--set server.global.scrape_interval=15s
```

## Delete Prometheus
```
helm delete -n=monitoring my-prometheus-release
```

## PromQL Examples

- To get the cpu core limit of the POD
```
avg(kube_pod_container_resource_limits_cpu_cores{namespace=~"$namespace", pod=~"$pod", container!="POD", container!=""})
```
- [Represent POD's CPU usage in terms of CPU cores using prometheus metrics](https://stackoverflow.com/questions/61693687/is-there-any-way-to-represent-pod-cpu-usage-in-terms-of-cpu-cores-using-promethe)


```PromQL
sum(rate(container_cpu_usage_seconds_total{namespace="$namespace", pod="$pod", container!="POD", container!=""}[1m])) by (pod)
```

## Prometheus UI

click on this [link](http://localhost:9090/graph) to navigate to Prometheus UI