## K8S

Start k8s object(pod/service/etc)
- `kubectl apply -f ./k8s/app.pod.yml` - configured pod
- `kubectl apply -f ./k8s/app.service.yml` - configured service

Retrieving status object(pod/service/etc)
- `kubectl get pods` - get statuses of pods
- `kubectl get services` - get statuses of services, get you opened ports
- `kubectl get deployments` - get deployments

For opening the app, you need IP of minikube(local VM with docker/k8s):
- `minikube ip`

-----

Details about object:
- `kubectl describe pod POD_NAME`

For deleting object:
- `kubectl delete service static-service`
