#!/bin/sh
set -e

cd /app/backend
npm start &
backend_pid=$!

cd /app/frontend
npm start &
frontend_pid=$!

cleanup() {
  kill -TERM "$backend_pid" "$frontend_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

while true; do
  if ! kill -0 "$backend_pid" 2>/dev/null; then
    echo "backend exited"
    break
  fi
  if ! kill -0 "$frontend_pid" 2>/dev/null; then
    echo "frontend exited"
    break
  fi
  sleep 1
done

cleanup
wait "$backend_pid" "$frontend_pid"
exit 1
