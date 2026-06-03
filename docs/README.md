# Spatial Awareness Navigator

Real-time voice navigation for people with visual impairments.
Points your phone camera at the world — tells you what's ahead before you run into it.

**Team:** Liban Britt · Rudolph · Abdirashid  
**Course:** Applied AI — Final Project  
**Timeline:** 4 weeks

---

## How It Works

```
Camera → COCO-SSD detects objects → size check → left/right → Groq → expo-speech speaks
```

1. Expo app opens rear camera natively on the phone
2. COCO-SSD detects objects in real-time (on-device)
3. App filters: close enough? new object? which side?
4. Groq generates a short natural alert
5. Phone speaks it out loud via expo-speech

---

## Quick Start

```bash
git clone https://github.com/[your-repo]/spatial-nav
cd spatial-nav

# Backend
cd server
cp .env.example .env        # add your GROQ_API_KEY
npm install
node index.js               # runs on port 3001

# Mobile App (new terminal)
cd client
npm install
npx expo start              # scan QR code with Expo Go on your phone
```

Get a free Groq key at: https://console.groq.com  
Install Expo Go on your phone: App Store / Google Play

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
✅ Real-time object detection (COCO-SSD on-device)
✅ Box size threshold filter
✅ Left/right position detection
✅ Cooldown (no repeated alerts)
✅ Groq LLM alert generation
✅ Native TTS voice output (expo-speech)

🔲 Distance in feet (future)
🔲 Room calibration (future)
🔲 Room memory (future)
