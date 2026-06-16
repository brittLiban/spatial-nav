# Spatial Awareness Navigator

Real-time voice navigation for people with visual impairments.
Points your phone camera at the world — tells you what's ahead before you run into it.

**Team:** Liban Britt · Rudolph · Abdirashid  
**Course:** Applied AI — Final Project  
**Timeline:** 4 weeks

---

## How It Works

```
Phone camera → POST frame to laptop → YOLOv8 detects objects → filters → Groq → expo-speech speaks
```

1. Expo app opens rear camera on the phone (capture only)
2. Each frame is sent to your laptop over Wi‑Fi
3. **YOLOv8 runs on the laptop** (Python + Ultralytics) — fast, accurate
4. App filters: close enough? new object? which side?
5. Groq generates a short natural alert
6. Phone speaks it out loud via expo-speech

---

## Quick Start

```bash
git clone https://github.com/brittLiban/spatial-nav
cd spatial-nav

# 1. Python YOLO service (terminal 1)
cd server/python
python -m venv venv
# Windows: venv\Scripts\activate   |   Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python detect_app.py              # runs on port 3002, downloads yolov8n.pt on first run

# 2. Node backend (terminal 2)
cd server
cp .env.example .env              # add GROQ_API_KEY
npm install
node index.js                     # runs on port 3001, proxies /detect to Python

# 3. Mobile app (terminal 3)
cd client
cp .env.example .env              # EXPO_PUBLIC_API_URL = your PC LAN IP, e.g. http://10.0.0.47:3001
npm install --legacy-peer-deps
npx expo start -c                 # scan QR with Expo Go (SDK 54)
```

**Requirements:** Phone and laptop on the same Wi‑Fi. Python 3.10+. Expo Go from the App Store (SDK 54).  
Get a free Groq key at: https://console.groq.com

**Verify:** `curl http://localhost:3001/health` should return `"detectService":"ok"`.

### Demo walkthrough

1. Start **Python YOLO** (`python detect_app.py`), then **Node** (`node index.js`), then Expo
2. Grant camera permission — full-screen rear camera opens
3. Point at a **person** or **chair** within ~6 feet
4. Colored bounding boxes appear (blue=left, orange=right, green=ahead)
5. App speaks alerts like *"Person on your left"* via Groq + native TTS
6. Same object+direction won't repeat for 2.5 seconds (cooldown)

**Detectable objects:** person, chair, car, dog, sports ball, and other COCO classes on the safety allowlist. Doors and walls are not supported.

---

## Testing

```bash
# Client: unit tests for the detection/ranking logic (Jest + ts-jest)
cd client && npm test

# Server: unit + integration tests for the routes (Jest + supertest, externals mocked)
cd server && npm test

# Server: end-to-end pipeline (real image, /detect, /alert)
# Start the Python YOLO service + Node server first (needs GROQ_API_KEY), then:
cd server && npm run test:e2e
```

- **Unit:** `client/src/utils/detectionFilters.test.ts` (filter/direction/proximity/ranking), `server/test/unit/` (alert fallback phrasing)
- **Integration:** `server/test/integration/` drives `/health`, `/detect`, `/alert` with the Python service and Groq mocked, so it runs anywhere
- **E2E:** `server/test/e2e/` runs a real image through the live stack and asserts a spoken alert comes out. It **self-skips** if the stack isn't running, so `npm test` is always safe in CI.

---

## Docs

Start here every session:

| File | Purpose |
|------|---------|
| `docs/CLAUDE.md` | Full project context — read every session |
| `docs/NOW.md` | This week's goal and tasks |
| `docs/PROGRESS.md` | What's done and what's next right now |
| `docs/TASKS.md` | All tasks with dependency markers |
| `docs/ARCHITECTURE.md` | System design + code snippets |
| `docs/TECH_STACK.md` | Tools, install, env vars |
| `docs/DECISIONS.md` | Why we made each technical choice |
| `docs/OPEN_QUESTIONS.md` | Unknowns and blockers |
| `docs/LOG.md` | Permanent weekly history |
| `docs/weeks/` | Pre-written NOW.md files for weeks 2, 3, 4 |
| `docs/archive/` | Completed NOW.md files |

---

## MVP Scope

✅ Live rear camera feed (native)
✅ Server-side YOLOv8 detection (laptop)
✅ Box size threshold filter
✅ Left/right position detection
✅ Cooldown (no repeated alerts)
✅ Groq LLM alert generation
✅ Bounding box overlay with class, confidence, direction
✅ Scanning / alert status bar

🔲 Distance in feet (future)
🔲 Room calibration (future)
🔲 Room memory (future)
