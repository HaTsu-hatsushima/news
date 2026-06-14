$ErrorActionPreference = "Stop"

$projectPath = "C:\Users\sweet\projects\news-pwa"
$port = 8000

Write-Host "News PWA local preview starting on port $port ..."

if (Get-Command py -ErrorAction SilentlyContinue) {
  Set-Location $projectPath
  py -m http.server $port
  exit $LASTEXITCODE
}

if (Get-Command python -ErrorAction SilentlyContinue) {
  Set-Location $projectPath
  python -m http.server $port
  exit $LASTEXITCODE
}

Write-Error "Python not found. Install Python or run another local server."
