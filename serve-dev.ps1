# Dev Port Configurations (CLI will update these)
$FE_PORT = 4200
$BE_PORT = 3000
$env:NG_DISABLE_VERSION_CHECK = 1

# Write header
Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "⚡ Starting Vibe Monorepo Dev Servers ⚡" -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan

# Start Backend Express on Bun
Write-Host "[Backend] Starting on http://localhost:$BE_PORT..." -ForegroundColor Gray
$backendJob = Start-Job -ScriptBlock {
    param($port)
    $env:PORT = $port
    cd backend
    bun run src/index.ts
} -ArgumentList $BE_PORT

# Start Frontend Angular
Write-Host "[Frontend] Starting on http://localhost:$FE_PORT..." -ForegroundColor Gray
$frontendJob = Start-Job -ScriptBlock {
    param($port)
    # Check if node_modules exists, if not warn
    if (-not (Test-Path "frontend/node_modules")) {
        Write-Error "Angular node_modules not found. Please run 'npm install' inside /frontend first."
    }
    cd frontend
    npx ng serve --port $port --open
} -ArgumentList $FE_PORT

# Monitor output logs
Write-Host "Both servers started in background." -ForegroundColor Green
Write-Host "Streaming logs... Press Ctrl+C to terminate both servers." -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor DarkGray

$running = $true
# Trap Ctrl+C (SIGINT)
[console]::TreatControlCAsInput = $true

while ($running) {
    if ([console]::KeyAvailable) {
        $key = [console]::ReadKey($true)
        if ($key.Modifiers -eq 'Control' -and $key.Key -eq 'C') {
            $running = $false
            break
        }
    }
    
    # Retrieve new outputs from jobs
    $beOutput = Receive-Job -Job $backendJob
    if ($beOutput) {
        $beOutput | ForEach-Object { Write-Host "[Backend] $_" -ForegroundColor Green }
    }
    
    $feOutput = Receive-Job -Job $frontendJob
    if ($feOutput) {
        $feOutput | ForEach-Object { Write-Host "[Frontend] $_" -ForegroundColor Cyan }
    }
    
    # Check if either job has failed or finished
    if ($backendJob.State -eq 'Failed' -or $backendJob.State -eq 'Completed') {
        Write-Host "Backend server stopped." -ForegroundColor Red
        break
    }
    if ($frontendJob.State -eq 'Failed' -or $frontendJob.State -eq 'Completed') {
        Write-Host "Frontend server stopped." -ForegroundColor Red
        break
    }
    
    Start-Sleep -Milliseconds 250
}

# Clean up
Write-Host "==================================================" -ForegroundColor DarkGray
Write-Host "Shutting down background processes..." -ForegroundColor Yellow

Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue

Write-Host "Development environment stopped." -ForegroundColor Green
