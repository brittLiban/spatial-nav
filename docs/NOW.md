# NOW.md — Week 1
> Current focus. This week only. Nothing else.

**Goal: Repo live. Expo app running on a real phone. COCO-SSD detecting objects on screen.**

When this week is done: archive this file → `archive/now/week-1.md`, then copy `weeks/week-2.md` → `NOW.md`

---

## Definition of Done — Week 1

- [ ] GitHub repo created, all three members have access
- [ ] Expo (React Native) + TypeScript app scaffolded and running via Expo Go
- [ ] Node + Express backend running locally on port 3001
- [ ] `.env` file set up, `.env.example` committed to repo
- [ ] expo-camera renders live rear camera feed on the phone
- [ ] @tensorflow/tfjs-react-native + COCO-SSD model loaded and running on camera frames
- [ ] Bounding boxes drawn over detected objects on screen
- [ ] Class label + confidence score visible on each box
- [ ] Console log on every detection: `{ class, confidence, bbox: [x,y,w,h] }`

**That's it. No LLM. No TTS. No alerts. Just COCO-SSD seeing things on a real phone.**

---

## This Week's Tasks by Person

**Liban**
- [ ] Create GitHub repo (`spatial-nav`)
- [ ] Scaffold Expo app with TypeScript: `npx create-expo-app client --template blank-typescript`
- [ ] Scaffold Node + Express backend (`server/`)
- [ ] Push initial structure — invite Rudolph and Abdirashid
- [ ] Add `.env.example` with `GROQ_API_KEY=` placeholder
- [ ] Confirm both team members can pull and run locally via Expo Go

**Rudolph** ← *starts after Liban pushes initial repo*
- [ ] Pull repo
- [ ] Install expo-camera and request camera permissions
- [ ] Render live rear camera feed in `Camera.tsx`
- [ ] Install @tensorflow/tfjs + @tensorflow/tfjs-react-native + @tensorflow-models/coco-ssd
- [ ] Call `tf.ready()` then load COCO-SSD model
- [ ] Capture frames every 300ms (takePictureAsync or frame processor)
- [ ] Run COCO-SSD on each frame
- [ ] Draw bounding boxes over detections
- [ ] Log raw detections to console

> **If TF.js native setup breaks:** log it in OPEN_QUESTIONS.md immediately and ping the team.
> The fallback is server-side detection — don't spend more than 2 days fighting it.

**Abdirashid** ← *starts after Liban pushes initial repo*
- [ ] Pull repo
- [ ] Build Expo app shell — full-screen camera layout, portrait mode
- [ ] Placeholder status bar at bottom (will show alerts later)
- [ ] Help Rudolph with bounding box overlay rendering if needed
- [ ] Sign up for Groq at console.groq.com — get API key ready

---

## Blockers / Notes

_Nothing yet — update as the week goes_

---

## Next Week Preview
Week 2: Box size threshold. Left/right detection. Cooldown timer. Groq backend route. Prompt builder.
All of those are blocked until Week 1 is done.
