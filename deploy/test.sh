#!/bin/bash

DNS_CLOUD_SECRET_NAME="default-token-tnjx4"
SET_CLOUD_DNS_SECRET=false
for secret in $(kubectl get secrets); do
  if [ $secret = $DNS_CLOUD_SECRET_NAME ]; then
    SET_CLOUD_DNS_SECRET=true
  fi
done

echo $SET_CLOUD_DNS_SECRET
