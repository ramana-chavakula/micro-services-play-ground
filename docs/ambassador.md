# Ambassador

## Install Ambassador
```
helm repo add datawire https://www.getambassador.io
helm install ambassador -n=ambassador datawire/ambassador
```

## Delete Ambassador
```
helm delete -n=ambassador ambassador
```

## Accessing Ambassador via minikube
Minikube does not natively support load balancers.
The service ambassador is of type LoadBalancer. To access this service we can go with one of the below options
  * run minikube tunnel in a separate terminal
    ```sh
    minikube tunnel
    ```
    you can now access Ambassador at the external IP allotted to the ambassador service. Get the external IP with the following command:
    ```sh
    kubectl get service ambassador -n ambassador
    ```
  * using minikube service list
    ```sh
    minikube service list
    ```
    access with the url and port specified in the output

## Edge Policy Console

### edgectl CLI for MAC
```sh
sudo curl -fL https://metriton.datawire.io/downloads/darwin/edgectl -o /usr/local/bin/edgectl && sudo chmod a+x /usr/local/bin/edgectl
```
and place it somewhere in your shell PATH.

### login
```sh
edgectl login --namespace=ambassador <IP address of ambassador service>
```

## Key Note
Though default loadbalncing strategy for kubernetes services is round robin as the kube-proxy routes at L4 (TCP) you can observe the below ab request always routed to the same pod
```sh
ab -c 1 -n 10 http://localhost:8000/delay/10
```

where as Ambassador is built on Envoy Proxy, a L7 proxy, so each request is load balanced between available pods with the below command
```sh
sh scripts/trigger.sh https://192.168.64.6:32273/api/performance-test/delay/50 10
```

You can verify the above findings by navigating to this [Kibana link](http://localhost:5601/app/kibana#/discover?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(columns:!(kubernetes.pod_name,service,msg,level),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:d8107e50-f4bc-11ea-af91-018a76d20d86,key:service,negate:!f,params:(query:performance-test),type:phrase),query:(match_phrase:(service:performance-test)))),index:d8107e50-f4bc-11ea-af91-018a76d20d86,interval:auto,query:(language:kuery,query:delay),sort:!(!('@timestamp',desc))))

But make sure you exposed the kibana before trying to access the above link.
