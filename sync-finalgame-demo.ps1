$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceRepo = Join-Path $repoRoot "FinalGame"
$sourceWeb = Join-Path $sourceRepo "web"
$targetWeb = Join-Path $repoRoot "FinalGameDemo"

if (-not (Test-Path $sourceRepo)) {
    throw "FinalGame repo not found at $sourceRepo"
}

Push-Location $sourceRepo
try {
    powershell -ExecutionPolicy Bypass -File ".\\build-web.ps1"
}
finally {
    Pop-Location
}

New-Item -ItemType Directory -Force -Path $targetWeb | Out-Null
Copy-Item (Join-Path $sourceWeb "*") $targetWeb -Recurse -Force
