# NOW.md — Week 1
> Current focus. This week only. Nothing else.

**Goal: Repo live. Camera working. YOLO detecting objects on screen.**

When this week is done: archive this file → `archive/now/week-1.md`, then copy `weeks/week-2.md` → `NOW.md`

---

## Definition of Done — Week 1

- [ ] GitHub repo created, all three members have access
- [ ] React + Vite + TypeScript scaffolded and running locally
- [ ] Deployed to Vercel (even if it's just a blank page — get the pipeline working)
- [ ] Node + Express backend running locally on port 3001
- [ ] `.env` file set up, `.env.example` committed to repo
- [ ] `getUserMedia` camera feed renders live in browser (rear camera on mobile)
- [ ] YOLO / COCO-SSD model loaded and running on camera frames
- [ ] Bounding boxes drawn on canvas over detected objects
- [ ] Class label + confidence score visible on each box
- [ ] Console log on every detection: `{ class, confidence, bbox: {x,y,w,h} }`

**That's it. No LLM. No TTS. No alerts. Just YOLO seeing things.**

---

## This Week's Tasks by Person

**Liban**
- [ ] Create GitHub repo
- [ ] Scaffold React + Vite frontend (`client/`)
- [ ] Scaffold Node + Express backend (`server/`)
- [ ] Push initial structure — invite team
- [ ] Set up Vercel, confirm both frontend and backend deploy
- [ ] Add `.env.example` with `GROQ_API_KEY` placeholder

**Rudolph** ← *starts after Liban pushes initial repo*
- [ ] Pull repo
- [ ] Implement `getUserMedia` in `Camera.tsx` — request rear camera
- [ ] Render video to `<video>` element
- [ ] Set up `<canvas>` overlay to capture frames
- [ ] Load COCO-SSD model (start here — faster than ONNX setup)
- [ ] Run detection on captured frames every 300ms
- [ ] Draw bounding boxes on canvas
- [ ] Log raw detections to console

**Abdirashid** ← *starts after Liban pushes initial repo*
- [ ] Pull repo
- [ ] Build React app shell — layout, full-screen camera view
- [ ] Status bar at bottom (placeholder for alerts)
- [ ] Help Rudolph with canvas overlay rendering if needed
- [ ] Sign up for Groq at console.groq.com — get API key ready

---

## Blockers / Notes

_Nothing yet — update as the week goes_

---

## Next Week Preview
Week 2: Box size threshold. Left/right detection. Cooldown timer. Groq backend route. Prompt builder.
All of those are blocked until Week 1 is done.
