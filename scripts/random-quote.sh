#!/usr/bin/env bash
# Fetches a truly random Reddington quote from a running local/deployed instance and prints it styled.
# (api/random.json is a fixed snapshot from build time, so we pick randomly from api/quotes.json instead.)
set -euo pipefail

BASE_URL="${1:-http://localhost:5000}"

QUOTES=$(curl -s "$BASE_URL/api/quotes.json")
COUNT=$(echo "$QUOTES" | jq 'length')
INDEX=$(( RANDOM % COUNT ))

echo "$QUOTES" | jq -r --argjson i "$INDEX" \
  '.[$i] | "\"" + .quote + "\" - Raymond Reddington -S" + (if .season < 10 then "0" else "" end) + (.season|tostring) + "E" + (if .episode < 10 then "0" else "" end) + (.episode|tostring)'
