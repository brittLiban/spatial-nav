# TASKS.md — Full Task Breakdown with Dependencies

## Dependency Map
> Read this before anything else. Some tasks cannot start until others finish.

```
Liban: repo setup + deploy
        ↓ unblocks everyone
        ├── Rudolph: camera feed
        │       ↓
        │   Rudolph: YOLO running
        │       ↓
        │   Rudolph: box size check ──────────────────────────┐
        │   Rudolph: left/right check ────────────────────────┤
        │   Rudolph: cooldown timer ──────────────────────────┤
        │                                                      ↓
        └── Abdirashid: UI shell          Abdirashid: prompt builder
                                                  ↓
                                    Liban: POST /alert route
                                          Liban: Groq integration
                                                  ↓
                                    Abdirashid: AlertEngine wired to backend
                                                  ↓
                                    Abdirashid: TTS speaks alert
                                                  ↓
                                    ALL THREE: end-to-end test
                                                  ↓
                                    ALL THREE: tune + demo prep
```

---

## LIBAN — Repo, Backend, Data Flow

### Week 1
- [ ] Create GitHub repo (`spatial-nav`)
- [ ] Scaffold `client/` — React + Vite + TypeScript
- [ ] Scaffold `server/` — Node + Express
- [ ] Commit initial folder structure, invite Rudolph and Abdirashid
- [ ] Set up Vercel — deploy both frontend and backend
- [ ] Add `.env.example` with `GROQ_API_KEY=` placeholder
- [ ] Confirm both team members can pull and run locally

### Week 2 — [BLOCKED: Week 1 must be done]
- [ ] Build `POST /alert` route in `server/routes/alert.js`
  - Accepts: `{ object: string, position: "left" | "right" }`
  - Returns: `{ alert: string }`
- [ ] Integrate Groq API — call LLM with prompt, return response
- [ ] Prompt format:
  ```
  System: You are a navigation assistant for a visually impaired person.
  Give a short, clear, natural safety alert. Max 10 words. No punctuation.

  User: there is a door on the left
  ```
- [ ] Handle failures — if Groq times out or rate-limits, return raw input string
- [ ] Test with Postman before telling Abdirashid it's ready
- [ ] Deploy updated backend to Vercel

### Week 3 — [BLOCKED: Week 2 backend route must be live and tested]
- [ ] Monitor round-trip time: detection → TTS speaking. Target: under 2 seconds
- [ ] If latency is too high: cache common alerts (door/left, door/right, person/left, etc.)
- [ ] Fix any CORS issues between frontend and backend
- [ ] Confirm no memory leaks after 10 min of continuous use

### Week 4 — [BLOCKED: Full pipeline must be working end-to-end]
- [ ] Final Vercel production deploy
- [ ] README complete — clone to running in under 5 minutes
- [ ] Performance audit: browser memory tab after 20 min
- [ ] Document future feature: distance in feet (focal length formula)

---

## RUDOLPH — Vision Pipeline

### Week 1 — [BLOCKED: Wait for Liban to push initial repo]
- [ ] Pull repo
- [ ] Implement `getUserMedia` in `Camera.tsx`:
  ```js
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: "environment" } }
  })
  ```
- [ ] Render stream to `<video>` element
- [ ] Set up `<canvas>` overlay to capture frames at interval
- [ ] Load COCO-SSD model:
  ```js
  import * as cocoSsd from '@tensorflow-models/coco-ssd'
  const model = await cocoSsd.load()
  ```
- [ ] Run model on canvas frame every 300ms
- [ ] Draw bounding boxes on canvas overlay
- [ ] Console log every detection: `{ class, confidence, bbox }`

### Week 2 — [BLOCKED: Week 1 YOLO detections must be logging correctly]
- [ ] Parse detections into clean objects: `{ class, confidence, bbox: {x,y,w,h} }`
- [ ] Confidence filter — drop anything below `MIN_CONFIDENCE = 0.75`
- [ ] Box size check:
  ```js
  const rel = (bbox.w * bbox.h) / (frameW * frameH)
  if (rel < 0.05) return
  ```
- [ ] Left/right detection:
  ```js
  const cx = bbox.x + bbox.w / 2
  const position = cx < frameW / 2 ? "left" : "right"
  ```
- [ ] Cooldown timer:
  ```js
  const key = `${cls}_${position}`
  if (Date.now() - cooldownMap[key] < 4000) return
  cooldownMap[key] = Date.now()
  ```
- [ ] Export qualifying detections via callback to `AlertEngine`

### Week 3 — [BLOCKED: Week 2 filters must all be working]
- [ ] Handle multiple objects in same frame — only pass the one with the biggest box
- [ ] Tune `FRAME_INTERVAL_MS` on a real phone (not just laptop)
- [ ] Test in: bright room, dim lighting, hallway, cluttered background
- [ ] Log failure cases to `OPEN_QUESTIONS.md`

### Week 4 — [BLOCKED: End-to-end pipeline must be working]
- [ ] Tune `THRESHOLD` — walk toward door, adjust until alert fires at right moment
- [ ] Tune `MIN_CONFIDENCE` — too many false positives? Raise it.
- [ ] Final performance check — frame rate on mid-range Android phone

---

## ABDIRASHID — Alert Layer, TTS, UI

### Week 1 — [BLOCKED: Wait for Liban to push initial repo]
- [ ] Pull repo
- [ ] Build React app shell — full-screen camera layout
- [ ] Placeholder status bar at bottom (will show alerts later)
- [ ] Help Rudolph with canvas overlay if needed
- [ ] Sign up for Groq at `console.groq.com` — get free API key

### Week 2 — [BLOCKED: Rudolph's detection callback must be ready AND Liban's backend route must be live]
- [ ] Build `AlertEngine` component:
  - Receives `{ object, position }` from Rudolph
  - POSTs to `/alert`
  - Receives alert string back
  - Logs to console (TTS not required yet — just confirm string arrives)
- [ ] Start TTS in isolation (test it separately from the pipeline):
  ```js
  const speak = (text) => {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 1.1
    window.speechSynthesis.speak(u)
  }
  ```

### Week 3 — [BLOCKED: AlertEngine must be receiving Groq strings correctly]
- [ ] Wire TTS into AlertEngine — Groq string → spoken alert
- [ ] TTS queue — `cancel()` before each new utterance so they never overlap
- [ ] Add "Start Navigation" button — browser requires user gesture before audio plays
- [ ] Show current alert text on screen while speaking (large, high contrast)
- [ ] UI cleanup — works on phone screen, looks clean

### Week 4 — [BLOCKED: Full pipeline must be working end-to-end]
- [ ] End-to-end test on iPhone AND Android
- [ ] Test TTS voice quality across browsers — pick best voice if browser allows
- [ ] UI final pass — readable in bright outdoor light
- [ ] Record demo video (backup)
- [ ] Rehearse demo script

---

## Key Constants — Tune in Week 4

| Constant | Default | File |
|----------|---------|------|
| `THRESHOLD` | `0.05` | `AlertEngine.tsx` |
| `COOLDOWN_MS` | `4000` | `AlertEngine.tsx` |
| `FRAME_INTERVAL_MS` | `300` | `Camera.tsx` |
| `MIN_CONFIDENCE` | `0.75` | `YoloDetector.tsx` |
