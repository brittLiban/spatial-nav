# Spatial Awareness Navigator

Real-time voice navigation for people with visual impairments.
Points your phone camera at the world — tells you what's ahead before you run into it.

**Team:** Liban Britt · Rudolph · Abdirashid  
**Course:** Applied AI — Final Project  
**Timeline:** 4 weeks

---

## How It Works

```
Camera → YOLO detects objects → size check → left/right → Groq → TTS speaks
```

1. Phone camera streams live
2. YOLOv8 detects objects in real-time
3. App filters: close enough? new object? which side?
4. Groq generates a short natural alert
5. Phone speaks it out loud

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

# Frontend (new terminal)
cd client
npm install
npm run dev                 # open localhost:5173
```

Get a free Groq key at: https://console.groq.com

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

✅ Live camera feed  
✅ Real-time object detection (YOLO)  
✅ Box size threshold filter  
✅ Left/right position detection  
✅ Cooldown (no repeated alerts)  
✅ Groq LLM alert generation  
✅ TTS voice output  

🔲 Distance in feet (future)  
🔲 Room calibration (future)  
🔲 Room memory (future)  
