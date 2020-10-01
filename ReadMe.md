# Micro Services Play Ground
This Project is mainly intended lo explore the micro services world by playing with it in the minikube cluster

## Prerequisites
* [docker](https://docs.docker.com/docker-for-mac/install/)
* [helm](https://helm.sh/docs/intro/install/)
* [minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
* [apache benchmark](https://httpd.apache.org/docs/2.4/programs/ab.html)


**Run the below command to configure minikube to use the local docker environment**
```sh
eval $(minikube docker-env)
```

## Bootstrap

```
minikube start
```

```
sh scripts/add-helm-repos.sh
```

```
sh scripts/start.sh
```

Run the below commands, to make sure the start script created all the necessary namespaces, pods and services
  * kubectl get namespaces
  * kubectl get pods
  * kubectl get pods --namespace=observability
  * kubectl get pods --namespace=monitoring
  * kubectl get pods --namespace=ambassador

## Cleanup

```
sh scripts/stop.sh
```

## Micro Services

Below are the list of micro services that we have created in this project

  * **rock-paper-scissors** service exposes a start endpoint to serves as a rock paper scissors game
  * **performance-test** service expsoses various endpoints to test the POD resource metrics


## Documents

Below are the reference documents, for some of the tools and services that we have used in this project

[Ambassador](./docs/ambassador.md)

[Grafana](./docs/grafana.md)

[Jaeger](./docs/jaeger.md)

[Prometheus](./docs/prometheus.md)

[Minikube](./docs/minikube.md)
