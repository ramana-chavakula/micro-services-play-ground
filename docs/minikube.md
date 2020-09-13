# Minikube
## Minikube Config
To view minikube config
```sh
cat ~/.minikube/config/config.json
```

**By default minikube takes 2 CPU cores and 2GB memory**

you can use minikube commands to update the config

```sh
minikube config set cpus 3
minikube config set memory 3072
```

(or) you can directly update the minikube config file
```json
{
  "cpus": 3,
  "dashboard": true,
  "memory": 3072
}
```

## Virtual Machine
We can configure the minikube to use any virtual machine by using the **vm-driver** config.

E.g: By setting the vm-driver config of minikube to virtualbox as below we can deploy all the kubernetes objects in to the virtual box

```sh
minikube config set vm-driver virtualbox
```
## List addons
```sh
minikube addons list
```

## Enable addons
```sh
minikube addons enable metrics-server
```
