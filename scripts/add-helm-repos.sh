# update helm repos
helm repo update
# add ambassador repo
helm repo add datawire https://www.getambassador.io
# add prometheus repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
# add grafana repo
helm repo add grafana https://grafana.github.io/helm-charts
# add jaeger repo
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
