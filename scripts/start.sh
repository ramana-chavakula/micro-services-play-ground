# Init Namespaces
kubectl create -f observability/init-namespaces.yaml
# Install Kibana and Elastic search
kubectl create -f observability/EK.yaml
# Install Fulentd
kubectl create -f observability/fluentd-rbc-elastic.yaml
# Install prometheus through helm with scrape interval of 10s
helm install my-prometheus-release -n=monitoring prometheus-community/prometheus \
--set server.global.scrape_interval=15s
# Install grafana through helm 
helm install my-grafana-release -n=monitoring grafana/grafana
# install jaeger
helm install my-jaeger-release -n=observability jaegertracing/jaeger \
  --set provisionDataStore.cassandra=false \
  --set storage.type=elasticsearch \
  --set storage.elasticsearch.host=elasticsearch.observability.svc.cluster.local \
  --set storage.elasticsearch.port=9200
# installing ambassador
helm install ambassador -n=ambassador datawire/ambassador
# creating services images
sh scripts/int-services-images.sh
# start performance-test service
kubectl create -f performance-test/performance-test.yaml
# start rock-paper-scissors service
kubectl create -f rock-paper-scissors/rock-paper-scissors.yaml