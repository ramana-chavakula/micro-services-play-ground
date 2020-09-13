# Delete grafana through helm 
helm delete -n=monitoring my-grafana-release
# Delete prometheus through helm 
helm delete -n=monitoring my-prometheus-release
# Delete jaeger through helm 
helm delete -n=observability my-jaeger-release
# Delete Fulentd
kubectl delete -f observability/fluentd-rbc-elastic.yaml
# Delete Kibana and Elastic search
kubectl delete -f observability/EK.yaml
# Delete performance-test service
kubectl delete -f performance-test/performance-test.yaml
# Delete rock-paper-scissors service
kubectl delete -f rock-paper-scissors/rock-paper-scissors.yaml
# Delete ambassador
helm delete -n=ambassador ambassador
# Delete namespaces
kubectl delete -f observability/init-namespaces.yaml
