# install mandatory resources
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.26.1/deploy/static/mandatory.yaml

# install nginx load balancer
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.26.1/deploy/static/provider/cloud-generic.yaml

# print pods
kubectl get pods --all-namespaces -l app.kubernetes.io/name=ingress-nginx

# print services
kubectl get svc --namespace=ingress-nginx
