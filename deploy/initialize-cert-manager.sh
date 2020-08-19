# create namespace cert-manager
kubectl create namespace cert-manager

# install custom resource definitions
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.12.0/cert-manager.yaml

# print installed pods
kubectl get pods --namespace cert-manager

