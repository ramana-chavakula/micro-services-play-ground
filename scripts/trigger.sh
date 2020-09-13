url=$1
N=$2
for (( i=0; i<$N; i++ ))
do
  echo "Triggering $url endpoint for `expr $i + 1` time"
  echo `curl -k $url`
done