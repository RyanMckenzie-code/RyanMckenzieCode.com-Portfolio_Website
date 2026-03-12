$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceRepo = Join-Path $repoRoot "programProject2"
$sourceWeb = Join-Path $sourceRepo "web"
$targetWeb = Join-Path $repoRoot "programProject2Demo"

if (-not (Test-Path $sourceRepo)) {
    throw "programProject2 repo not found at $sourceRepo"
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
