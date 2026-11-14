# Zet waarden uit .env in site/js/config.js, zodat de site ze in de browser kan gebruiken.
# .env en config.js staan in .gitignore; draai dit script ook vóór elke deploy.
# Let op: alles in config.js is publiek zichtbaar (de Web3Forms-key is daarvoor bedoeld).
$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) { throw ".env ontbreekt. Kopieer .env.example naar .env en vul de key in." }

$waarden = @{}
foreach ($regel in Get-Content $envFile) {
  if ($regel -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$') {
    $waarden[$Matches[1]] = $Matches[2].Trim('"', "'")
  }
}

$key = $waarden["WEB3FORMS_ACCESS_KEY"]
if (-not $key) { throw "WEB3FORMS_ACCESS_KEY ontbreekt in .env." }

$js = "// Gegenereerd door build-config.ps1 uit .env. Niet handmatig aanpassen.`nwindow.WEB3FORMS_ACCESS_KEY = $($key | ConvertTo-Json);`n"
Set-Content -Path (Join-Path $PSScriptRoot "site\js\config.js") -Value $js -Encoding utf8 -NoNewline
Write-Host "site/js/config.js bijgewerkt vanuit .env"
