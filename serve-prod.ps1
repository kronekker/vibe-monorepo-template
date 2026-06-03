# Write header
Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "⚡ Building & Serving Production Bundle ⚡" -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan

# 1. Build Frontend
Write-Host "Building Angular client production bundle..." -ForegroundColor Gray
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Installing frontend dependencies first..." -ForegroundColor Yellow
    npm install --prefix frontend
}
cmd.exe /c "npm run build --prefix frontend"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Angular production build failed."
    exit 1
}
Write-Host "Angular build complete." -ForegroundColor Green

# 2. Run Backend
Write-Host "Starting Bun backend server..." -ForegroundColor Gray
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Installing backend dependencies first..." -ForegroundColor Yellow
    bun install --cwd backend
}

# Run Bun Express Server (which will serve the Angular static dist automatically)
cd backend
bun run src/index.ts
