#!/bin/bash

############# INITIALIZE VALUES #############

DOCKER_USER="darkbones"
APP_NAME="darkbugs"
MAIN_BRANCH="main"

DOCKER_NAME=$DOCKER_USER/$APP_NAME

MASTER_KEY_FILE="config/master.key"
SECRETS_FILE="deploy/secrets.yaml"

# EXCLUDED ROOTS FOR DETECTING CHANGES
EXCLUDED_ROOTS=("deploy" "helm")

############# INITIALIZE OPTIONS #############

DEBUG_MODE=false
FORCE=false
LOCAL=false
GENERATE_NAME=false
SKIP_DOCKER_BUILD=false
BUILD_DOCKER=false

while test $# -gt 0; do
  case "$1" in
    -h|--help)
      echo "options"
      echo "-h, --help                show help"
      echo "-b, --build               force docker build"
      echo "-d, --debug               debug mode"
      echo "-f, --force               force install the current branch"
      echo "-l, --local               install locally on minikube"
      echo "-n, --generate-name       generate new helm name"
      echo "-s, --skip-docker         skip docker build"
      exit 0
      ;;
    -b|--build)
      BUILD_DOCKER=true
      shift
      ;;
    -d|--debug)
      DEBUG_MODE=true
      shift
      ;;
    -f|--force)
      FORCE=true
      shift
      ;;
    -l|--local)
      LOCAL=true
      shift
      ;;
    -n|--generate-name)
      GENERATE_NAME=true
      shift
      ;;
    --s|--skip-docker)
      SKIP_DOCKER_BUILD=true
      shift
      ;;
    *)
      break
      ;;
  esac
done

############# SECURITY CHECKS #############

if [ ! $(basename "$PWD") = "$APP_NAME" ]; then
  echo "ERROR: You must be in the $APP_NAME directory to run this script"
  exit 1
fi

if [ ! $FORCE = true ]; then
  if [ ! $(git rev-parse --abbrev-ref HEAD) = $MAIN_BRANCH ]; then
   echo "ERROR: You must be in branch '$MAIN_BRANCH' to run this script or set --force"
   exit 1
  fi
fi

############# SET UP SECRETS #############

echo "Setting up secrets..."

UPDATE_SECRETS_FILE=false

DB_USERNAME=""
DB_PASSWORD=""
KUBE_CONTEXT=""
ADMIN_EMAIL=""
MASTER_KEY=""
CURRENT_HELM_RELEASE=""
CREATE_SSL_CERT=false

# LOAD SECRETS FROM FILE
if [ -f "$SECRETS_FILE" ]; then
  while read line; do
    id="$( cut -d ':' -f 1 <<< "$line" )"
    string="$( cut -d ':' -f 2- <<< "$line"  | tr -d '[:space:]')"

    if [ $id = "db_username" ] && [ -n "$string" ]; then
      DB_USERNAME="$string"
      echo "  Found db username in deploy/secrets.yaml"
    elif [ $id = "db_password" ] && [ -n "$string" ]; then
      DB_PASSWORD="$string"
      echo "  Found db password in deploy/secrets.yaml"
    elif [ $id = "k8s_context" ] && [ -n "$string" ]; then
      KUBE_CONTEXT="$string"
      echo "  Found k8s context in deploy/secrets.yaml"
    elif [ $id = "current_helm_release" ] && [ -n "$string" ]; then
      CURRENT_HELM_RELEASE="$string"
      echo "  Found current helm release name in deploy/secrets.yaml"
    elif [ $id = "admin_email" ] && [ -n "$string" ]; then
      ADMIN_EMAIL="$string"
      echo "  Found admin email release name in deploy/secrets.yaml"
    elif [ $id = "create_ssl_cert" ]; then
      CREATE_SSL_CERT=true
    fi
  done < $SECRETS_FILE
fi

# LOAD RAILS MASTER KEY
if [ -f "$MASTER_KEY_FILE" ]; then
  if [ -n "$(cat $MASTER_KEY_FILE)" ]; then
    MASTER_KEY=$(cat $MASTER_KEY_FILE)
  fi
fi

# REQUEST MISSING SECRETS
if [ -z $DB_USERNAME ]; then
  UPDATE_SECRETS_FILE=true
  printf "\ndb username not found. Enter it here:\n"
  read input
  DB_USERNAME=$(echo "$input" | base64)
fi

if [ -z $DB_PASSWORD ]; then
  UPDATE_SECRETS_FILE=true
  printf "\ndb password not found. Enter it here:\n"
  read -s input
  DB_PASSWORD=$(echo "$input" | base64)
fi

if [ -z $KUBE_CONTEXT ]; then
  UPDATE_SECRETS_FILE=true
  printf "\nk8s context not found. Find it by running 'kubectl config get-contexts' and enter it here:\n"
  read input
  KUBE_CONTEXT=$(echo "$input" | base64)
fi

if [ -z $ADMIN_EMAIL ]; then
  UPDATE_SECRETS_FILE=true
  printf "\nadmin email not found. Enter it here:\n"
  read input
  ADMIN_EMAIL=$(echo "$input" | base64)
fi

if [ -z $MASTER_KEY ]; then
  printf "\nrails master key not found. Enter it here:\n"
  read -s input
  RAILS_MASTER_KEY=$input
  echo $MASTER_KEY > $MASTER_KEY_FILE
  echo "created config/master.key"
fi

if [ -z "$CURRENT_HELM_RELEASE" ] || [ $GENERATE_NAME = true ]; then
  UPDATE_SECRETS_FILE=true
  GENERATE_NAME=true

  if [ $DEBUG_MODE = true ]; then
    CURRENT_HELM_RELEASE="test-release"
  fi
fi

# CHECK FOR CHANGES TO DETERMINE IF DOCKER NEEDS TO BUILD
DOCKER_TAG=""
GIT_HASH_FILE="deploy/git_hash.txt"

if [ $DEBUG_MODE = false ];then
  if [ $SKIP_DOCKER_BUILD = false ]; then
    while read -r line ; do
        root=$(echo "$line" | cut -d " " -f2- | xargs | cut -d "/" -f1)
        if  [[ ! "${EXCLUDED_ROOTS[@]}" =~ "${root}" ]]; then
          BUILD_DOCKER=true
        fi
    done <<< $(git status -s)

    # IF NO CHANGES WERE DETECTED, CHECK IF THERE IS A NEW GIT HASH
    if [ $BUILD_DOCKER = false ]; then
      echo "No git changes detected"
      LAST_GIT_HASH="empty"
      if [ -f $GIT_HASH_FILE ]; then
        LAST_GIT_HASH=$(cat $GIT_HASH_FILE)
      fi

      if [ ! $LAST_GIT_HASH = $(git rev-parse HEAD) ]; then
        BUILD_DOCKER=true
        echo $(git rev-parse HEAD) > $GIT_HASH_FILE
      fi
    fi
  fi

  # GET THE DOCKER TAG FROM THE LATEST GIT TAG
  if [ $BUILD_DOCKER = false ]; then
    LATEST_GIT_TAG=$(git describe --tags --abbrev=0)

    if [[ "$LATEST_GIT_TAG" =~ .*"-".* ]]; then
      adj=$(echo $LATEST_GIT_TAG | cut -d "-" -f1)
      noun=$(echo $LATEST_GIT_TAG | cut -d "-" -f2)
      noun=$(echo "$(tr '[:lower:]' '[:upper:]' <<< ${noun:0:1})${noun:1}")
      DOCKER_TAG="$adj$noun"
    else
      DOCKER_TAG=$LATEST_GIT_TAG
    fi

    # BUILD DOCKER IF NO NAME WAS FOUND
    if [ -z "$DOCKER_TAG" ]; then
      echo "No git tag found."
      BUILD_DOCKER=true
    fi
  fi

  if [ $SKIP_DOCKER_BUILD = true ]; then
    BUILD_DOCKER=false
  fi

  if [ $BUILD_DOCKER = true ]; then
    echo "Building new docker image..."
  fi

  # GENERATE RELEASE NAME
  echo $RELEASE_NAME
  exit
  if [ $BUILD_DOCKER = true ] || [ $GENERATE_NAME = true ]; then
    echo "Generating release name..."
    ATTEMPTS=0
    while [ true ]
    do
      ATTEMPTS=$(($ATTEMPTS+1))

      if [ $ATTEMPTS -ge 1000 ];then
        printf "\nERROR: Failed to find a unique after 1000 attempts\n"
        exit 1
      fi

      # GENERATE NAME
      adj=$(echo $(shuf -n 1 "deploy/words_adjectives.txt"))
      noun=$(echo $(shuf -n 1 "deploy/words_nouns.txt"))

      # CHECK IF UNIQUE
      UNIQUE=true
      for tag in $(git ls-remote --tags | sed -E 's/^[[:xdigit:]]+[[:space:]]+refs\/tags\/(.+)/\1/g')
      do
        if [ "$adj-$noun" = $tag ]; then
          UNIQUE=false
          break
        fi
      done

      if [ $UNIQUE=true ]; then
        ADJ=$(echo "$(tr '[:lower:]' '[:upper:]' <<< ${adj:0:1})${adj:1}")
        NOUN=$(echo "$(tr '[:lower:]' '[:upper:]' <<< ${noun:0:1})${noun:1}")

        if [ $BUILD_DOCKER = true ]; then
          DOCKER_TAG=$adj$NOUN
        fi

        if [ $GENERATE_NAME = true ]; then
          CURRENT_HELM_RELEASE=$adj-$noun
        fi

        RELEASE_NAME="$ADJ $NOUN"
        GIT_TAG="$adj-$noun"

        echo ""
        echo "Named release: $ADJ $NOUN"
        echo "Type 'ok' to continue"
        read input

        if [ -z $input ]; then
          echo "Deploy cancelled"
          exit 0
        fi
        if [ ! $input = 'ok' ]; then
          echo "Deploy cancelled"
          exit 0
        fi

        break
      fi

      printf "."
    done
  fi
fi

if [ $UPDATE_SECRETS_FILE = true ]; then
  echo $DB_USERNAME
  echo $DB_PASSWORD
  echo $KUBE_CONTEXT
  echo $ADMIN_EMAIL
  echo "db_username: $DB_USERNAME" > $SECRETS_FILE
  echo "db_password: $DB_PASSWORD" >> $SECRETS_FILE
  echo "k8s_context: $KUBE_CONTEXT" >> $SECRETS_FILE
  echo "admin_email: $ADMIN_EMAIL" >> $SECRETS_FILE
  if [ -n "$CURRENT_HELM_RELEASE" ]; then
    echo "current_helm_release: $CURRENT_HELM_RELEASE" >> $SECRETS_FILE
  fi

  echo "udpated config/secrets.yaml"
fi

############# BUILD DOCKER IMAGE #############

if [ $DEBUG_MODE = false ]; then
  if [ $BUILD_DOCKER = true ]; then
    echo "Building Docker image..."

    DOCKER_IMG=$DOCKER_NAME:$DOCKER_TAG
    DOCKER_LATEST=$DOCKER_NAME:latest

    echo $DOCKER_IMG
    echo $DOCKER_LATEST

    docker build -t $DOCKER_IMG .
    docker tag $DOCKER_IMG $DOCKER_LATEST

    docker push $DOCKER_IMG
    docker push $DOCKER_LATEST
  fi
fi

############# INSTALL HELM CHART #############

if [ $LOCAL = true ] || [ $DEBUG_MODE = true ]; then
  CREATE_SSL_CERT=false
  KUBE_CONTEXT="minikube"
else
  KUBE_CONTEXT=$(echo $KUBE_CONTEXT | base64 --decode)
fi

kubectl config use-context $KUBE_CONTEXT

if [ $DEBUG_MODE = true ]; then
  helm upgrade --install \
    $CURRENT_HELM_RELEASE helm/main \
    --set rails-app.rails.masterKey="$MASTER_KEY" \
    --set rails-app.image.tag="$DOCKER_TAG" \
    --set rails-app.ingress.email="$ADMIN_EMAIL" \
    --set global.postgresql.postgresqlUsername="$DB_USERNAME" \
    --set global.postgresql.postgresqlPassword="$DB_PASSWORD" \
    --set global.release.helm=$CURRENT_HELM_RELEASE \
    --set global.release.git=$GIT_TAG \
    --dry-run --debug
else
  if [ $LOCAL = false ]; then
    echo ""
    echo "Create https Certificate: $CREATE_SSL_CERT"
    echo ""
    echo "********************** WARNING **********************"
    echo "Debug mode is off and install is set to prod."
    echo "Are you sure you want to release $RELEASE_NAME to production?"
    echo "Type 'prod' to confirm"
    read input
    if [ ! "$input" = "prod" ]; then
      echo "Release cancelled"
      exit 0
    fi
  fi
  echo "Releasing to $KUBE_CONTEXT..."
  sleep 2
  helm upgrade --install \
    $CURRENT_HELM_RELEASE helm/main \
    --set rails-app.rails.masterKey="$MASTER_KEY" \
    --set rails-app.image.tag="$DOCKER_TAG" \
    --set rails-app.ingress.email="$ADMIN_EMAIL" \
    --set global.postgresql.postgresqlUsername="$DB_USERNAME" \
    --set global.postgresql.postgresqlPassword="$DB_PASSWORD" \
    --set global.release.helm=$CURRENT_HELM_RELEASE \
    --set global.release.git=$GIT_TAG
fi

############# TAG GIT RELEASE #############

if [ $DEBUG_MODE = false ] && [ $LOCAL = false ]; then
  if [ $(git rev-parse --abbrev-ref HEAD) = $MAIN_BRANCH ]; then
    echo "Tag this release? [y/n]"
    read input
    if [ $input = 'y' ] || [ $input = 'Y' ]; then
      echo "Tagging release..."
      git tag "$GIT_TAG"
      git push origin "$GIT_TAG"
      sleep 2
    fi
  fi
fi
