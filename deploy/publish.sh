#!/bin/bash

main() {

  set_options "$@"
  initialize_values "deploy/values.yaml"
  initialize_secrets
  get_release_values

  detect_changes
  security_checks

  determine_build_docker

  determine_generate_release_name
  if [ $GENERATE_RELEASE_NAME = true ]; then
    generate_release_name
    confirm_release_name
  fi

  build_docker

  set_release_values

  set_kube_context
  #  determine_tls
  set_dns_secret
  install_helm

#  install_tls_resources
}

set_dns_secret() {
  installed=false

  kubectl create namespace cert-manager

  for secret in $(kubectl get secrets --namespace="cert-manager"); do
    if [ $secret = $DNS_CLOUD_SECRET_NAME ]; then
      installed=true
    fi
  done

  if [ $installed = false ]; then
    print_header
    kubectl create secret generic $DNS_CLOUD_SECRET_NAME --from-file=deploy/service-account.json --namespace="cert-manager"
  fi
}

install_tls_resources() {
  if [ $O_DEBUG_MODE = true ] || [ $O_LOCAL_INSTALL = true ] || [ $TLS_CERTIFICATES = true ]; then
    exit 0
  fi

  print_header "INSTALL TLS RESOURCES"

  deploy/install_tls_resources.sh
}

determine_build_docker() {
  print_header "BUILD DOCKER?"
  if [ $O_DEBUG_MODE = false ]; then
    if [ $O_SKIP_DOCKER_BUILD = false ]; then
      if [ -z $CURRENT_DOCKER_TAG ]; then
        echo "Building docker image because current tag isn't found"
        BUILD_DOCKER=true
      elif [ ! $(git rev-parse HEAD) = $CURRENT_GIT_HASH ]; then
        echo "Building docker image because changes were detected"
        BUILD_DOCKER=true
      fi
    elif [ $O_FORCE_BUILD_DOCKER = true ]; then
      echo "Building docker image because --build is set"
      BUILD_DOCKER=true
    fi
  fi
}

build_docker() {
  if [ $BUILD_DOCKER = true ]; then
    print_header "BUILDING DOCKER IMAGE"

    docker build -t "$DOCKER_USER/$APP_NAME:$NEW_RELEASE_NAME_DOCKER" .
    docker push "$DOCKER_USER/$APP_NAME:$NEW_RELEASE_NAME_DOCKER"
    docker tag "$DOCKER_USER/$APP_NAME:$NEW_RELEASE_NAME_DOCKER" "$DOCKER_USER:latest"
    docker push "$DOCKER_USER/$APP_NAME:latest"

    echo ""
    echo "Tag this release? [y/n]"
    read input
    if [ $input = 'y' ] || [ $input = 'Y' ]; then
      echo "Tagging release $NEW_RELEASE_NAME_GIT"
      git tag "$NEW_RELEASE_NAME_GIT"
      git push origin --tags
      sleep 2
    fi
  fi
}

install_helm() {
  print_header "INSTALL HELM CHART"

  cmd="helm upgrade --install \
    $CURRENT_HELM_RELEASE helm/main \
    --set rails-app.rails.masterKey=\"$MASTER_KEY\" \
    --set rails-app.image.tag=\"$CURRENT_DOCKER_TAG\" \
    --set rails-app.ingress.email=\"$ADMIN_EMAIL\" \
    --set global.postgresql.postgresqlUsername=\"$DB_USERNAME\" \
    --set global.postgresql.postgresqlPassword=\"$DB_PASSWORD\" \
    --set global.release.helm=\"$CURRENT_HELM_RELEASE\" \
    --set global.release.git=\"$CURRENT_GIT_TAG\" \
    --set rails-app.ingress.enabled=$TLS_CERTIFICATES \
    --set rails-app.ingress.cloud_secret_name=$DNS_CLOUD_SECRET_NAME
    "

  if [ $O_DEBUG_MODE = true ]; then
    cmd="$cmd --dry-run --debug"
  fi

  echo $cmd
  echo ""

  if [ $O_DEBUG_MODE = false ] && [ $O_LOCAL_INSTALL = false ]; then
    echo "WARNING: This will deploy to PRODUCTION."
    echo "Type 'prod' to continue"

    read input
    if [ -z $input ] || [ ! $input = "prod" ]; then
      echo "Deploy cancelled. Exiting..."
      exit 0
    fi
  fi

  eval $cmd
}

determine_tls() {
  if [[ -z $(helm list -q) ]]; then
    print_header "DISABLE TLS?"
    echo "No current helm releases detected"
    echo "Disabling TLS certificates..."
    TLS_CERTIFICATES=false
  fi
}

set_kube_context() {
  if [ $O_LOCAL_INSTALL = false ]; then
    USE_KUBE_CONTEXT=$KUBE_CONTEXT
  fi

  kubectl config use-context $USE_KUBE_CONTEXT
}

get_release_values() {
  print_header "CURRENT RELEASE VALUES"
  CURRENT_HELM_RELEASE=$(deploy/bin/get_value_from_file.sh $RELEASE_VALUES_FILE "helm_name")
  CURRENT_DOCKER_TAG=$(deploy/bin/get_value_from_file.sh $RELEASE_VALUES_FILE "docker_tag")
  CURRENT_GIT_TAG=$(deploy/bin/get_value_from_file.sh $RELEASE_VALUES_FILE "git_tag")
  CURRENT_GIT_HASH=$(deploy/bin/get_value_from_file.sh $RELEASE_VALUES_FILE "git_hash")

  echo "current helm release: $CURRENT_HELM_RELEASE"
  echo "current docker tag:   $CURRENT_DOCKER_TAG"
  echo "current git tag:      $CURRENT_GIT_TAG"
  echo "current git hash:     $CURRENT_GIT_HASH"
}

set_release_values() {
  if [ $O_DEBUG_MODE = true ]; then
    return 0
  fi

  helm_name=$CURRENT_HELM_RELEASE
  docker_tag=$CURRENT_DOCKER_TAG
  git_tag=$CURRENT_DOCKER_TAG

  if [ $O_GENERATE_NAME = true ] || [ -z $helm_name ]; then
    CURRENT_HELM_RELEASE=$NEW_RELEASE_NAME_HELM
    deploy/bin/set_value_in_file.sh $RELEASE_VALUES_FILE "helm_name" $CURRENT_HELM_RELEASE
  fi

  if [ $BUILD_DOCKER = true ]; then
    CURRENT_DOCKER_TAG=$NEW_RELEASE_NAME_DOCKER
    CURRENT_GIT_TAG=$NEW_RELEASE_NAME_GIT

    deploy/bin/set_value_in_file.sh $RELEASE_VALUES_FILE "docker_tag" $CURRENT_DOCKER_TAG
    deploy/bin/set_value_in_file.sh $RELEASE_VALUES_FILE "git_tag" $CURRENT_GIT_TAG
    deploy/bin/set_value_in_file.sh $RELEASE_VALUES_FILE "git_hash" $(git rev-parse HEAD)
  fi

}

determine_generate_release_name() {
  if [ $O_DEBUG_MODE = true ]; then
    if [ -n "$CURRENT_HELM_RELEASE" ] && [ -n "$CURRENT_DOCKER_TAG" ] && [ -z "$CURRENT_GIT_TAG" ]; then
      GENERATE_RELEASE_NAME=false
    fi
  else
    if [ $BUILD_DOCKER = false ] && [ $O_GENERATE_NAME = false ]; then
      if [ -n "$CURRENT_HELM_RELEASE" ] && [ -n "$CURRENT_DOCKER_TAG" ] && [ -n "$CURRENT_GIT_TAG" ]; then
        GENERATE_RELEASE_NAME=false
      fi
    fi
  fi
}

confirm_release_name() {
  if [ $O_DEBUG_MODE = false ]; then
    echo "Named release: $NEW_RELEASE_NAME"
    echo "Type 'ok' to continue"

    read input
    if [ -z $input ] || [ ! $input = "ok" ]; then
      echo "Deploy cancelled. Exiting..."
      exit 0
    fi
  fi
}

generate_release_name() {
  print_header "GENERATING RELEASE NAME"
  attempts=0
  while [ true ]; do
    attempts=$((attempts + 1))

    if [ $attempts -ge 1000 ]; then
      echo ""
      echo "ERROR: Failed to find a unique name after 1000 attempts"
      exit 1
    fi

    adj=$(echo $(shuf -n 1 "deploy/words_adjectives.txt"))
    noun=$(echo $(shuf -n 1 "deploy/words_nouns.txt"))

    # CHECK IF UNIQUE
    unique=true
    for tag in $(git ls-remote --tags | sed -E 's/^[[:xdigit:]]+[[:space:]]+refs\/tags\/(.+)/\1/g'); do
      if [ "$adj-$noun" = $tag ]; then
        unique=false
        break
      fi
    done

    if [ $unique = true ]; then
      ADJ=$(echo "$(tr '[:lower:]' '[:upper:]' <<<${adj:0:1})${adj:1}")
      NOUN=$(echo "$(tr '[:lower:]' '[:upper:]' <<<${noun:0:1})${noun:1}")

      NEW_RELEASE_ADJ="$adj"
      NEW_RELEASE_NOUN="$noun"

      NEW_RELEASE_NAME="$ADJ $NOUN"
      NEW_RELEASE_NAME_DOCKER="$adj$NOUN"
      NEW_RELEASE_NAME_GIT="$adj-$noun"
      NEW_RELEASE_NAME_HELM="$adj-$noun"

      break
    fi

    printf "."
  done
}

set_options() {
  print_header "SET OPTIONS"
  while test $# -gt 0; do
    case "$1" in
    -h | --help)
      print_header OPTIONS
      echo "-h, --help                show help"
      echo "-b, --build               force docker build"
      echo "-d, --debug               debug mode"
      echo "-f, --force               force install the current branch"
      echo "-l, --local               install locally on minikube"
      echo "-n, --generate-name       generate new helm name"
      echo "-s, --skip-docker         skip docker build"
      echo "--skip-tls                don't create tls certificates (for initial installs on prod)"
      exit 0
      ;;
    -b | --build)
      echo "force build docker = true"
      O_FORCE_BUILD_DOCKER=true
      shift
      ;;
    -d | --debug)
      echo "debug mode = true"
      O_DEBUG_MODE=true
      shift
      ;;
    -f | --force)
      echo "force branch = true"
      O_FORCE_BRANCH=true
      shift
      ;;
    -l | --local)
      echo "local install = true"
      O_LOCAL_INSTALL=true
      TLS_CERTIFICATES=false
      shift
      ;;
    -n | --generate-name)
      echo "generate name = true"
      O_GENERATE_NAME=true
      shift
      ;;
    -s | --skip-docker)
      echo "skip docker = true"
      O_SKIP_DOCKER_BUILD=true
      shift
      ;;
    --skip-tls)
      TLS_CERTIFICATES=false
      shift
      ;;
    *)
      break
      ;;
    esac
  done
}

detect_changes() {
  while read line; do
    root=$(echo "$line" | cut -d " " -f2- | xargs | cut -d "/" -f1)
    if [[ ! "${EXCLUDED_ROOTS[@]}" =~ "${root}" ]]; then
      CHANGES_DETECTED=true
      break
    fi
  done <<<"$(git status -s)"
}

security_checks() {
  if [ ! $(basename "$PWD") = "$APP_NAME" ]; then
    echo ""
    echo "ERROR: You must be in the $APP_NAME directory to run this script"
    exit 1
  fi

  if [ $O_DEBUG_MODE = false ]; then
    if [ $O_FORCE_BRANCH = false ]; then
      if [ ! $(git rev-parse --abbrev-ref HEAD) = $MAIN_BRANCH ]; then
        echo ""
        echo "ERROR: You must be in branch '$MAIN_BRANCH' to run this script or set --force"
        exit 1
      fi

      if [ $CHANGED_DETECTED = true ]; then
        echo ""
        echo "ERROR: You must commit changes before running this script or set --force"
        exit 1
      fi
    fi
  fi
}

initialize_secrets() {
  DB_USERNAME=$(deploy/bin/get_value_from_file.sh $SECRETS_FILE "db_username")
  DB_PASSWORD=$(deploy/bin/get_value_from_file.sh $SECRETS_FILE "db_password")
  KUBE_CONTEXT=$(deploy/bin/get_value_from_file.sh $SECRETS_FILE "k8s_context")
  ADMIN_EMAIL=$(deploy/bin/get_value_from_file.sh $SECRETS_FILE "admin_email")
  DNS_CLOUD_SECRET_NAME=$(deploy/bin/get_value_from_file.sh $SECRETS_FILE "cloud_secret_name")
  MASTER_KEY=$(cat $MASTER_KEY_FILE)

  print_header SECRETS
  if [ -n "${DB_USERNAME}" ]; then
    echo "found db_username"
  else
    echo ""
    echo "ERROR: db_username not found in $SECRETS_FILE"
    exit 1
  fi

  if [ -n "${DB_PASSWORD}" ]; then
    echo "found db_password"
  else
    echo ""
    echo "ERROR: db_password not found in $SECRETS_FILE"
    exit 1
  fi

  if [ -n "${KUBE_CONTEXT}" ]; then
    echo "found kube_context"
  else
    echo ""
    echo "ERROR: kube_context not found in $SECRETS_FILE"
    exit 1
  fi

  if [ -n "${ADMIN_EMAIL}" ]; then
    echo "found admin_email"
  else
    echo ""
    echo "ERROR: admin_email not found in $SECRETS_FILE"
    exit 1
  fi

  if [ -n "${DNS_CLOUD_SECRET_NAME}" ]; then
    echo "found dns_cloud_secret_name"
  else
    echo ""
    echo "ERROR: dns_cloud_secret_name not found in $SECRETS_FILE"
    exit 1
  fi

  if [ -n "${MASTER_KEY}" ]; then
    echo "found master_key"
  else
    echo ""
    echo "ERROR: master key not found in $MASTER_KEY_FILE"
    exit 1
  fi
}

initialize_values() {
  values_file=$1

  DOCKER_USER=$(deploy/bin/get_value_from_file.sh $values_file "docker_user")
  APP_NAME=$(deploy/bin/get_value_from_file.sh $values_file "app_name")
  MAIN_BRANCH=$(deploy/bin/get_value_from_file.sh $values_file "main_branch")
  MASTER_KEY_FILE=$(deploy/bin/get_value_from_file.sh $values_file "master_key_file")
  SECRETS_FILE=$(deploy/bin/get_value_from_file.sh $values_file "secrets_file")
  RELEASE_VALUES_FILE=$(deploy/bin/get_value_from_file.sh $values_file "release_values_file")
  EXCLUDED_ROOTS=$(deploy/bin/get_value_from_file.sh $values_file "excluded_roots")

  print_header VALUES
  echo "docker username:     $DOCKER_USER"
  echo "app name:            $APP_NAME"
  echo "main branch:         $MAIN_BRANCH"
  echo "master key file:     $MASTER_KEY_FILE"
  echo "release values file: $RELEASE_VALUES_FILE"
  echo "excluded_roots:      $EXCLUDED_ROOTS"
  echo ""

  all_values=($DOCKER_USER $APP_NAME $MAIN_BRANCH $MASTER_KEY_FILE $EXCLUDED_ROOTS $RELEASE_VALUES_FILE)
  for var in "${all_values[@]}"; do
    if [ -z "$var" ]; then
      echo "ERROR: missing value. Exiting..."
      exit 1
    fi
  done
}

print_header() {
  echo ""
  echo "------------ $1 ------------"
}

# VALUES
DOCKER_USER=""
APP_NAME=""
MAIN_BRANCH=""
MASTER_KEY_FILE=""
SECRETS_FILE=""
EXCLUDED_ROOTS=""
RELEASE_VALUES_FILE=""

# SECRETS
DB_USERNAME=""
DB_PASSWORD=""
KUBE_CONTEXT=""
ADMIN_EMAIL=""
MASTER_KEY=""
DNS_CLOUD_SECRET_NAME=""

# OPTIONS
O_FORCE_BUILD_DOCKER=false
O_DEBUG_MODE=false
O_FORCE_BRANCH=false
O_LOCAL_INSTALL=false
O_GENERATE_NAME=false
O_SKIP_DOCKER_BUILD=false

# VARIABLES
CHANGES_DETECTED=false
NEW_RELEASE_ADJ=""
NEW_RELEASE_NOUN=""
NEW_RELEASE_NAME_HELM=""
NEW_RELEASE_NAME_GIT=""
NEW_RELEASE_NAME_DOCKER=""
NEW_RELEASE_NAME=""
BUILD_DOCKER=false
CURRENT_HELM_RELEASE=""
CURRENT_DOCKER_TAG=""
CURRENT_GIT_TAG=""
CURRENT_GIT_HASH=""
USE_KUBE_CONTEXT="minikube"
GENERATE_RELEASE_NAME=true
TLS_CERTIFICATES=true

main "$@"
