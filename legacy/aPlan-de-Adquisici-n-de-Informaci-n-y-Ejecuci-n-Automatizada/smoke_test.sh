#!/usr/bin/env bash
set -u
base="${BASE_URL:-http://127.0.0.1:3100}"
for i in $(seq 1 30); do
  if curl -fsS "$base/api/health" >/tmp/health.json 2>/dev/null; then break; fi
  sleep 1
done
status=0
for endpoint in / /api/health /api/stats /api/skills /api/repos /api/phases /api/audit /api/simulate; do
  code=$(curl -sS -o /tmp/response -w '%{http_code}' "$base$endpoint")
  printf '%s %s\n' "$code" "$endpoint"
  if [ "$code" -ge 500 ]; then status=1; fi
done
printf '%s\n' '--- health body ---'
cat /tmp/health.json 2>/dev/null || true
printf '%s\n' '--- lexical validation ---'
code=$(curl -sS -o /tmp/search.json -w '%{http_code}' -X POST "$base/api/repos/search" -H 'content-type: application/json' --data '{"query":"agent","limit":5}')
printf '%s /api/repos/search POST\n' "$code"
cat /tmp/search.json 2>/dev/null || true
exit "$status"
