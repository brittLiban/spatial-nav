# TECH_STACK.md

## Stack

| Layer | Tool | Cost | Notes |
|-------|------|------|-------|
| Frontend | React + Vite + TypeScript | Free | Mobile-friendly, works in any phone browser |
| Camera | getUserMedia API | Free | Browser native, no library needed |
| Object Detection | COCO-SSD (TF.js) | Free | Start here — easier setup than ONNX |
| Object Detection (upgrade) | YOLOv8n ONNX | Free | Better accuracy, harder to set up in browser |
| LLM | Groq API (LLaMA 3 8B) | Free tier | Fast inference, generous free limit |
| TTS | Web Speech API | Free | Browser native, no latency, no key needed |
| Backend | Node.js + Express | Free | Proxies Groq API call, keeps key off client |
| Hosting | Vercel | Free | Deploys both frontend and serverless backend |
| Storage | localStorage | Free | Cooldown map, future room data |

---

## Install

```bash
# Frontend
npm create vite@latest client -- --template react-ts
cd client
npm install @tensorflow/tfjs @tensorflow-models/coco-ssd

# Backend
mkdir server && cd server
npm init -y
npm install express dotenv cors groq
```

---

## Environment Variables

```env
# server/.env  ← never commit this file
GROQ_API_KEY=your_key_here
PORT=3001
```

```env
# server/.env.example  ← commit this
GROQ_API_KEY=
PORT=3001
```

---

## Get Your Groq Key
Free at: https://console.groq.com
All three team members should have one.
