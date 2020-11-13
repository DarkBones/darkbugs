#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /darkbugs/tmp/pids/server.pid

# Update crontab
bundle exec whenever --update-crontab

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
