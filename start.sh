#!/usr/bin/env bash
# Starts all three services: YOLOv8 (Python), Node server, Expo.
# Ctrl+C shuts everything down cleanly.
# Run from the repo root: bash start.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓ $1${NC}"; }
warn() { echo -e "${YELLOW}! $1${NC}"; }
die()  { echo -e "${RED}✗ $1${NC}"; exit 1; }

ROOT="$(cd "$(dirname "$0")" && pwd)"

# ── Preflight ────────────────────────────────────────────────────────────────
[ -f "$ROOT/server/.env" ]  || die "server/.env not found. Run: bash setup.sh"
[ -f "$ROOT/client/.env" ]  || die "client/.env not found.  Run: bash setup.sh"

if command -v py &>/dev/null && py --version &>/dev/null 2>&1; then
  PYTHON="py"
elif command -v python3 &>/dev/null && python3 --version &>/dev/null 2>&1; then
  PYTHON="python3"
elif command -v python &>/dev/null && python --version &>/dev/null 2>&1; then
  PYTHON="python"
else
  die "Python not found. Install Python 3.9+ from python.org and try again."
fi

echo ""
echo "=== Spatial Nav ==="
echo ""

# ── Cleanup on exit ──────────────────────────────────────────────────────────
PYTHON_PID=""
NODE_PID=""

cleanup() {
  echo ""
  echo "Shutting down..."
  [ -n "$PYTHON_PID" ] && kill "$PYTHON_PID" 2>/dev/null
  [ -n "$NODE_PID" ]   && kill "$NODE_PID"   2>/dev/null
  exit 0
}
trap cleanup INT TERM

# ── 1. Start Python / YOLOv8 ─────────────────────────────────────────────────
VENV="$ROOT/server/python/venv"
VENV_PYTHON="$VENV/Scripts/python"
# Mac/Linux venv uses bin/ not Scripts/
[ -f "$VENV/bin/python" ] && VENV_PYTHON="$VENV/bin/python"
[ -f "$VENV_PYTHON" ] || die "venv not found — run: bash setup.sh"

echo "Starting YOLOv8 service..."
(cd "$ROOT/server/python" && "$VENV_PYTHON" detect_app.py) &
PYTHON_PID=$!

echo -n "  Waiting for model to load"
READY=0
for i in $(seq 1 40); do
  sleep 1
  echo -n "."
  if curl -sf http://127.0.0.1:3002/health > /dev/null 2>&1; then
    READY=1
    break
  fi
  # Check the process didn't crash
  if ! kill -0 "$PYTHON_PID" 2>/dev/null; then
    echo ""
    die "YOLOv8 process crashed. Check output above for errors."
  fi
done
echo ""

if [ $READY -eq 0 ]; then
  warn "YOLOv8 still not responding after 40s — continuing anyway. Watch for errors."
else
  ok "YOLOv8 ready  (http://127.0.0.1:3002)"
fi

# ── 2. Start Node server ──────────────────────────────────────────────────────
echo "Starting Node server..."
(cd "$ROOT/server" && npm run dev 2>&1 | sed 's/^/  [node] /') &
NODE_PID=$!
sleep 2
ok "Node server running  (:3001)"

# ── 3. Start Expo ─────────────────────────────────────────────────────────────
echo ""
API_URL=$(grep EXPO_PUBLIC_API_URL "$ROOT/client/.env" | cut -d= -f2)
echo -e "  Phone will connect to: ${GREEN}$API_URL${NC}"
echo -e "  ${YELLOW}Make sure your phone is on the same WiFi as this laptop.${NC}"
echo ""

(cd "$ROOT/client" && npx expo start --clear)

# Wait for background jobs if Expo exits
wait
