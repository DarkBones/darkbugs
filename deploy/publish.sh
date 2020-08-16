#!/bin/bash

DOCKER_NAME=darkbones/darkbugs

MASTER_KEY_FILE="config/master.key"
SECRETS_FILE="deploy/secrets.yaml"

DB_USERNAME=""
DB_PASSWORD=""
KUBE_CONTEXT=""
RAILS_MASTER_KEY=""
UPDATE_YAML=false

############# SECURITY CHECKS #############

if [ ! $(basename "$PWD") = "darkbugs" ]; then
  echo "ERROR: You must be in the darkbugs directory to run this script"
  exit 1
fi

if [ ! $(git rev-parse --abbrev-ref HEAD) = "main" ]; then
  echo "ERROR: You must be in main branch to run this script"
#  exit 1
fi

############# SET UP SECRETS #############
echo "Setting up secrets..."
while read line; do
  id="$( cut -d ':' -f 1 <<< "$line" )"
  string="$( cut -d ':' -f 2- <<< "$line"  | tr -d '[:space:]')"

  if [ $id = "db_username" ] && [ -n $string ]; then
    DB_USERNAME=$string
    echo "  Found db username in deploy/secrets.yaml"
  elif [ $id = "db_password" ] && [ -n $string ]; then
    DB_PASSWORD=$string
    echo "  Found db password in deploy/secrets.yaml"
  elif [ $id = "k8s_context" ] && [ -n $string ]; then
    KUBE_CONTEXT=$string
    echo "  Found k8s context in deploy/secrets.yaml"
  fi
done < $SECRETS_FILE

if [ -f $MASTER_KEY_FILE ]; then
  string=`cat /app/config/master.key`
  if [ -n $string ]; then
    RAILS_MASTER_KEY=$string
    echo "  Found rails master key in config/master.key"
  fi
fi

if [ -z $DB_USERNAME ]; then
  UPDATE_YAML=true
  printf "\n  db username not found. Enter it here:\n"
  read dbusername
  DB_USERNAME=$dbusername
fi

if [ -z $DB_PASSWORD ]; then
  UPDATE_YAML=true
  printf "\n  db password not found. Enter it here:\n"
  read -s dbpassword
  DB_PASSWORD=$dbpassword
fi

if [ -z $KUBE_CONTEXT ]; then
  UPDATE_YAML=true
  printf "\n  k8s context not found. Enter it here:\n"
  read kubecontext
  KUBE_CONTEXT=$kubecontext
fi

if [ -z $MASTER_KEY_FILE ]; then
  printf "\n  rails master key not found. Enter it here:\n"
  read -s masterkey
  RAILS_MASTER_KEY=$masterkey
  echo $RAILS_MASTER_KEY > $MASTER_KEY_FILE
  echo "  created config/master.key"
fi

if [ $UPDATE_YAML = true ]; then
  printf "db_username: $DB_USERNAME\ndb_password: $DB_PASSWORD\nk8s_context: $KUBE_CONTEXT\n" > $SECRETS_FILE
  echo "  updating config/secrets.yaml"
fi

############# GENERATE RELEASE NAME #############

while [ 1 ]
do
  adj=`echo $(shuf -n 1 "deploy/words_adjectives.txt")`
  noun=`echo $(shuf -n 1 "deploy/words_nouns.txt")`
  RELEASE_NAME_DOCKER="$adj$noun"
  RELEASE_NAME_HELM="$adj-$( echo $noun | tr '[:upper:]' '[:lower:]' )"

  IN_FILE=false
  while read line; do
    if [ $line = $RELEASE_NAME_HELM ]; then
      IN_FILE=true
      break
    fi
  done < "deploy/versions.txt"

  if [ $IN_FILE = false ]; then
    printf "\nNamed release: $RELEASE_NAME_HELM\n"
    break
  fi
done

echo "Release $RELEASE_NAME_HELM to production? Type 'ok'"
read confirm
if [ -z $confirm ]; then
  echo "Deploy cancelled"
  exit 0
fi
if [ ! $confirm = 'ok' ]; then
  echo "Deploy cancelled"
  exit 0
fi

echo "Releasing $RELEASE_NAME_DOCKER"

############# BUILD DOCKER IMAGE #############

echo "building docker image..."

DOCKER_IMG=$DOCKER_NAME:$RELEASE_NAME_DOCKER
DOCKER_LATEST=$DOCKER_NAME:latest

echo "  $DOCKER_IMG"

docker build -t $DOCKER_IMG .
docker tag $DOCKER_IMG $DOCKER_LATEST

docker push $DOCKER_NAME

############# INSTALL HELM CHART #############

kubectl config use-context $KUBE_CONTEXT

helm upgrade --install \
  $RELEASE_NAME_HELM helm/main \
  --set rails-app.rails.masterKey=$RAILS_MASTER_KEY \
  --set rails-app.image.tag=$RELEASE_NAME_DOCKER \
  --set global.postgresql.postgresqlUsername=$DB_USERNAME \
  --set global.postgresql.postgresqlPassword=$DB_PASSWORD

git tag $RELEASE_NAME_HELM
echo $RELEASE_NAME_HELM >> "deploy/versions.txt"
