# Serveert de site lokaal op http://localhost:8000 (stoppen met Ctrl+C).
# Gebruik: .\serve.ps1  of  .\serve.ps1 -Port 3000
param([int]$Port = 8000)
& "$PSScriptRoot\build-config.ps1"
Write-Host "BijYord draait op http://localhost:$Port"
python -m http.server $Port --bind 127.0.0.1 --directory "$PSScriptRoot\site"
