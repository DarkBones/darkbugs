#!/bin/bash

#EXCLUDED_ROOTS=("deploy" "helm")
#git status -s | while read -r line ; do
#    root=$(echo "$line" | cut -d " " -f2- | xargs | cut -d "/" -f1)
#    if  [[ ! "${EXCLUDED_ROOTS[@]}" =~ "${root}" ]]; then
#      echo "$root"
#    fi
#done
#
#GIT_HASH_FILE="deploy/git_hash.txt"
#echo $(git rev-parse HEAD) > $GIT_HASH_FILE

BUILD_DOCKER=false
GENERATE_NAME=true
MAIN_BRANCH="F"

if [ -z "$DOCKER_TAG" ]; then
  BUILD_DOCKER=true
fi
