#!/usr/bin/env bash
# One-time setup: installs deps and creates .env files.
# Run from the repo root: bash setup.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓ $1${NC}"; }
warn() { echo -e "${YELLOW}! $1${NC}"; }
die()  { echo -e "${RED}✗ $1${NC}"; exit 1; }

echo ""
echo "=== Spatial Nav Setup ==="
echo ""

# Resolve repo root regardless of where the script is called from
ROOT="$(cd "$(dirname "$0")" && pwd)"

# ── Python ──────────────────────────────────────────────────────────────────
# On Windows, `python` may be a Store alias that does nothing useful.
# Try py (Windows Launcher) first, then python3, then verify python actually works.
if command -v py &>/dev/null && py --version &>/dev/null 2>&1; then
  PYTHON="py"
elif command -v python3 &>/dev/null && python3 --version &>/dev/null 2>&1; then
  PYTHON="python3"
elif command -v python &>/dev/null && python --version &>/dev/null 2>&1; then
  PYTHON="python"
else
  die "Python not found. Install Python 3.9+ from python.org (not the Microsoft Store) and try again."
fi

echo "Installing Python dependencies..."
VENV="$ROOT/server/python/venv"
if [ ! -d "$VENV" ]; then
  "$PYTHON" -m venv "$VENV"
fi
# Activate and install
"$VENV/Scripts/python" -m pip install -q --upgrade pip
"$VENV/Scripts/python" -m pip install -q -r "$ROOT/server/python/requirements.txt"
ok "Python deps installed (venv at server/python/venv)"

# ── Node (server) ───────────────────────────────────────────────────────────
echo "Installing Node dependencies (server)..."
(cd "$ROOT/server" && npm install --silent)
ok "Server deps installed"

# ── Node (client) ───────────────────────────────────────────────────────────
echo "Installing Node dependencies (client)..."
(cd "$ROOT/client" && npm install --silent)
ok "Client deps installed"

# ── Detect local WiFi IP ─────────────────────────────────────────────────────
echo ""
echo "Detecting local IP address..."

IP=""

# Linux / Mac
if [ -z "$IP" ] && command -v hostname &>/dev/null; then
  IP=$(hostname -I 2>/dev/null | awk '{print $1}')
fi

# Mac (ifconfig fallback)
if [ -z "$IP" ] && command -v ifconfig &>/dev/null; then
  IP=$(ifconfig 2>/dev/null | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}' | head -1)
fi

# Windows / Git Bash
if [ -z "$IP" ] && command -v ipconfig &>/dev/null; then
  IP=$(ipconfig 2>/dev/null | grep -i "IPv4" | grep -v "169\.254" | awk '{print $NF}' | head -1 | tr -d '\r')
fi

if [ -z "$IP" ]; then
  warn "Could not auto-detect WiFi IP."
  read -rp "Enter your laptop's local IP (e.g. 192.168.1.42): " IP
fi

echo -e "  Using IP: ${GREEN}$IP${NC}"
echo "  (Phone must be on the same WiFi as this laptop)"

# ── server/.env ──────────────────────────────────────────────────────────────
if [ ! -f "$ROOT/server/.env" ]; then
  echo ""
  read -rp "Paste your GROQ_API_KEY (from console.groq.com): " GROQ_KEY
  {
    echo "GROQ_API_KEY=$GROQ_KEY"
    echo "PORT=3001"
    echo "PYTHON_DETECT_URL=http://127.0.0.1:3002"
  } > "$ROOT/server/.env"
  ok "server/.env created"
else
  warn "server/.env already exists — skipping (delete it to re-run)"
fi

# ── client/.env ──────────────────────────────────────────────────────────────
if [ ! -f "$ROOT/client/.env" ]; then
  echo "EXPO_PUBLIC_API_URL=http://$IP:3001" > "$ROOT/client/.env"
  ok "client/.env created  (EXPO_PUBLIC_API_URL=http://$IP:3001)"
else
  warn "client/.env already exists — skipping"
  warn "If your IP changed, update EXPO_PUBLIC_API_URL in client/.env manually"
fi

echo ""
echo -e "${GREEN}Setup complete.${NC} Run:  bash start.sh"
echo ""
