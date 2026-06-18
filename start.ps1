# Detect current LAN/hotspot IP, update client/.env, ensure server/.env exists, then start everything.

$ip = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*" } |
    Sort-Object PrefixLength -Descending |
    Select-Object -First 1 -ExpandProperty IPAddress

if (-not $ip) {
    Write-Error "Could not detect a local IP address. Are you connected to Wi-Fi or a hotspot?"
    exit 1
}

Write-Host "Detected IP: $ip"

# --- client/.env ---
$clientEnv = "$PSScriptRoot\client\.env"
$apiUrlLine = "EXPO_PUBLIC_API_URL=http://${ip}:3001"

if (Test-Path $clientEnv) {
    $content = Get-Content $clientEnv -Raw
    if ($content -match 'EXPO_PUBLIC_API_URL=') {
        $content = $content -replace 'EXPO_PUBLIC_API_URL=[^\r\n]*', $apiUrlLine
    } else {
        $content = $content.TrimEnd() + "`r`n" + $apiUrlLine + "`r`n"
    }
    $content | Set-Content $clientEnv -Encoding utf8 -NoNewline
} else {
    $apiUrlLine | Set-Content $clientEnv -Encoding utf8
}
Write-Host "client/.env -> $apiUrlLine"

# --- server/.env ---
$serverEnv = "$PSScriptRoot\server\.env"

if (-not (Test-Path $serverEnv)) {
    @"
GROQ_API_KEY=
PORT=3001
PYTHON_DETECT_URL=http://127.0.0.1:3002
"@ | Set-Content $serverEnv -Encoding utf8
    Write-Host "server/.env created (add your GROQ_API_KEY to enable AI alerts)"
} else {
    Write-Host "server/.env already exists"
}

Write-Host ""
Write-Host "Starting server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\server'; npm run dev"

Write-Host "Starting Expo..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\client'; npx expo start --clear"
