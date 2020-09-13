if [ $1 ]
then
  service=$1
else
  echo "service name not provided"
  exit 1
fi
echo "building $service image"

docker build -f $service/Dockerfile -t $service:local ./$service