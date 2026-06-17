# Spatial Awareness Navigator

A real-time voice navigation app for people with visual impairments. Point your phone camera at the world — the app detects nearby objects, figures out which side they're on, and speaks short natural-language alerts out loud.

**Pipeline:** rear camera → YOLOv8 object detection → proximity + position filtering → Groq LLM → text-to-speech.

---

## Requirements

| Requirement | Version |
|------------|---------|
| Node.js | 18+ |
| Python | 3.9+ (from [python.org](https://www.python.org/downloads/), **not** the Microsoft Store) |
| Expo Go | Latest (install on your phone from the App Store or Google Play) |
| Groq API key | Free at [console.groq.com](https://console.groq.com) |

Your phone and laptop must be on the **same WiFi network**.

---

## Setup

Run this once from the repo root. It installs all dependencies, creates your `.env` files, and auto-detects your local IP.

```bash
bash setup.sh
```

You'll be prompted for your Groq API key. Everything else is automatic.

---

## Running the app

```bash
bash start.sh
```

This starts three services in one terminal:

1. **YOLOv8** — Python FastAPI service on `localhost:3002` (object detection)
2. **Node server** — Express API on `localhost:3001` (Groq LLM integration)
3. **Expo** — React Native app served via QR code

Scan the QR code in Expo Go on your phone. Hold the phone up and the app will start speaking alerts.

`Ctrl+C` shuts everything down cleanly.

---

## How it works

Each camera frame goes through a filter chain before anything is spoken:

1. **Confidence** — detections below 75% are dropped
2. **Box size** — objects covering less than 5% of the frame are dropped (too far away)
3. **Position** — bounding box center determines left vs. right
4. **Cooldown** — same object + side won't re-alert for 4 seconds
5. **LLM** — Groq (LLaMA 3 8B) turns `{ object, position }` into a short natural phrase
6. **TTS** — `expo-speech` speaks the alert; overlapping audio is suppressed

---

## Environment variables

The setup script creates these for you. If you need to edit them manually:

**`server/.env`**
```
GROQ_API_KEY=your_key_here
PORT=3001
PYTHON_DETECT_URL=http://127.0.0.1:3002
```

**`client/.env`**
```
EXPO_PUBLIC_API_URL=http://<your-laptop-ip>:3001
```

If your laptop's IP changes (different network), update `EXPO_PUBLIC_API_URL` in `client/.env` and restart.

---

## Project structure

```
spatial-nav/
├── client/          # Expo / React Native app
├── server/
│   ├── python/      # YOLOv8 FastAPI service (detect_app.py)
│   └── ...          # Node/Express server
├── setup.sh         # One-time install + env setup
├── start.sh         # Starts all three services
└── docs/            # Architecture, tech stack, decisions
```
