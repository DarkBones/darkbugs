#!/bin/bash

if [ ! -f $1 ]; then
  touch $1
fi

WHOLE_CONTENT=""
FOUND=false
while read line; do
  id="$(cut -d ':' -f 1 <<<"$line")"
  string="$(cut -d ':' -f 2- <<<"$line")"

  if [ "$id" = "$2" ]; then
    FOUND=true
    new_string=true
    string=" $3"
  fi

  WHOLE_CONTENT="$WHOLE_CONTENT$id:$string\n"
done <$1

if [ $FOUND = false ]; then
  WHOLE_CONTENT="$WHOLE_CONTENT$2: $3\n"
fi

printf "$WHOLE_CONTENT" > "$1"
