# TECH_STACK.md

## Stack

| Layer | Tool | Cost | Notes |
|-------|------|------|-------|
| Mobile App | Expo (React Native) + TypeScript | Free | Real native app — runs on iOS and Android |
| Camera | expo-camera | Free | Native rear camera access, no browser needed |
| Object Detection | COCO-SSD via @tensorflow/tfjs-react-native | Free | Start here — easier than ONNX, runs on-device |
| Object Detection (upgrade) | YOLOv8n ONNX | Free | Better accuracy, significantly harder to set up |
| LLM | Groq API (LLaMA 3 8B) | Free tier | Fast inference, generous free limit |
| TTS | expo-speech | Free | Native TTS — no latency, no key, no browser required |
| Backend | Node.js + Express | Free | Proxies Groq API call, keeps key off the app |
| Hosting (backend) | Railway or Render | Free tier | Persistent server — Vercel cold-starts hurt real-time latency |
| App Distribution (dev) | Expo Go | Free | Scan QR code, instant test on real phone |
| App Distribution (final) | EAS Build | Free tier | Produces real .apk / .ipa for demo |
| Storage | AsyncStorage | Free | Cooldown map, future room data |

---

## Install

```bash
# Mobile App
npx create-expo-app client --template blank-typescript
cd client
npx expo install expo-camera expo-speech expo-gl
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native @tensorflow-models/coco-ssd

# Backend
mkdir server && cd server
npm init -y
npm install express dotenv cors groq
```

> **If TF.js native modules fail in managed Expo:** run `npx expo prebuild` to eject to bare workflow.
> This is the most likely week 1 blocker — see OPEN_QUESTIONS.md.

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

---

## Expo Go (for testing)
Install on your phone: search "Expo Go" in App Store or Google Play.  
Run `npx expo start` in the `client/` folder, scan the QR code — app loads instantly.
