#!/bin/bash

if [ -f $1 ]; then
  while read line; do
    id="$( cut -d ':' -f 1 <<< "$line" )"
    string="$( cut -d ':' -f 2- <<< "$line")"

    if [ "$id" = "$2" ] && [ -n "$string" ]; then
      echo $string
    fi
  done < $1
fi
