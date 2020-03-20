docker build -t yvesmatta/multi-client:latest -t yvesmatta/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t yvesmatta/multi-server:latest -t yvesmatta/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t yvesmatta/multi-worker:latest -t yvesmatta/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push yvesmatta/multi-client:latest
docker push yvesmatta/multi-client:$SHA
docker push yvesmatta/multi-server:latest
docker push yvesmatta/multi-server:$SHA
docker push yvesmatta/multi-worker:latest
docker push yvesmatta/multi-worker:$SHA
kubectl apply -f k8s
kubectl set image deployments/client-deployment client=yvesmatta/multi-client:$SHA
kubectl set image deployments/server-deployment server=yvesmatta/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=yvesmatta/multi-worker:$SHA