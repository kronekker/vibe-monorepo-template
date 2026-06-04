#!/bin/bash

export NG_DISABLE_VERSION_CHECK=1

echo "--------------------------------------------------"
echo "⚡ Building & Serving Production Bundle ⚡"
echo "--------------------------------------------------"

# 1. Build Frontend
echo "Building Angular client production bundle..."
if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies first..."
  npm install --prefix frontend
fi
npm run build --prefix frontend

if [ $? -ne 0 ]; then
  echo "Angular production build failed."
  exit 1
fi
echo "Angular build complete."

# 2. Run Backend
echo "Starting Bun backend server..."
if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies first..."
  bun install --cwd backend
fi

# Run Bun Express Server (which will serve the Angular static dist automatically)
cd backend && bun run src/index.ts
