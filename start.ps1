# Detect current LAN/hotspot IP and wire it into client/.env, then start everything.

$ip = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*" } |
    Sort-Object PrefixLength -Descending |
    Select-Object -First 1 -ExpandProperty IPAddress

if (-not $ip) {
    Write-Error "Could not detect a local IP address. Are you connected to Wi-Fi or a hotspot?"
    exit 1
}

$envFile = "$PSScriptRoot\client\.env"
$newLine = "EXPO_PUBLIC_API_URL=http://${ip}:3001"

if (Test-Path $envFile) {
    $content = Get-Content $envFile
    $updated = $content -replace '^EXPO_PUBLIC_API_URL=.*', $newLine
    $updated | Set-Content $envFile -Encoding utf8
} else {
    $newLine | Set-Content $envFile -Encoding utf8
}

Write-Host "IP detected: $ip"
Write-Host "Set EXPO_PUBLIC_API_URL=http://${ip}:3001 in client/.env"
Write-Host ""
Write-Host "Starting server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\server'; npm run dev"

Write-Host "Starting Expo..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\client'; npx expo start --clear"
