#!/bin/bash

# Dev Port Configurations (CLI will update these)
FE_PORT=4200
BE_PORT=3000

echo "--------------------------------------------------"
echo "⚡ Starting Vibe Monorepo Dev Servers ⚡"
echo "--------------------------------------------------"

# Trap Ctrl+C (SIGINT) and exit signals to kill children
cleanup() {
  echo ""
  echo "Shutting down background processes..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  echo "Development environment stopped."
  exit 0
}
trap cleanup INT TERM EXIT

# Start Backend Express on Bun
echo "[Backend] Starting on http://localhost:$BE_PORT..."
(cd backend && PORT=$BE_PORT bun run src/index.ts) 2>&1 | sed 's/^/[Backend] /' &
BACKEND_PID=$!

# Start Frontend Angular
echo "[Frontend] Starting on http://localhost:$FE_PORT..."
if [ ! -d "frontend/node_modules" ]; then
  echo "[Frontend] Warning: node_modules folder not found in frontend. Running npm install..."
  npm install --prefix frontend
fi
(cd frontend && npx ng serve --port $FE_PORT --open) 2>&1 | sed 's/^/[Frontend] /' &
FRONTEND_PID=$!

echo "Both servers started in background. Press Ctrl+C to terminate."
echo "=================================================="

# Wait for children to finish
wait $BACKEND_PID $FRONTEND_PID
