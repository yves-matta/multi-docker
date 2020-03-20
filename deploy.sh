docker build -t yvesjudematta/multi-client:latest -t yvesjudematta/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t yvesjudematta/multi-server:latest -t yvesjudematta/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t yvesjudematta/multi-worker:latest -t yvesjudematta/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push yvesjudematta/multi-client:latest
docker push yvesjudematta/multi-client:$SHA
docker push yvesjudematta/multi-server:latest
docker push yvesjudematta/multi-server:$SHA
docker push yvesjudematta/multi-worker:latest
docker push yvesjudematta/multi-worker:$SHA
kubectl apply -f k8s
kubectl set image deployments/client-deployment client=yvesmatta/multi-client:$SHA
kubectl set image deployments/server-deployment server=yvesmatta/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=yvesmatta/multi-worker:$SHA