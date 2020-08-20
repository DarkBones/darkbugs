#!/bin/bash

kubectl get pods
echo "is the rails app pod running? [y/n]"
read input
if [ ! $input = 'y' ] && [ ! $input = 'Y' ]; then
  echo "TLS install cancelled"
  echo "To install them manually run:"
  echo "deploy/install_tls_resources.sh"
  exit 0
fi

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.26.1/deploy/static/mandatory.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.26.1/deploy/static/provider/cloud-generic.yaml

echo "Wait 2 minutes..."
sleep 120
kubectl get svc --namespace=ingress-nginx --watch

kubectl get pods
echo "is the rails ingress service running? [y/n]"
read input
if [ ! $input = 'y' ] && [ ! $input = 'Y' ]; then
  echo "Cert Manager install cancelled"
  echo "kubectl create namespace cert-manager"
  echo "kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.12.0/cert-manager.yaml"
  exit 0
fi

kubectl create namespace cert-manager
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.12.0/cert-manager.yaml
kubectl get pods --namespace cert-manager --watch
