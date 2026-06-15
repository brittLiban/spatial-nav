# TASKS.md — Full Task Breakdown with Dependencies

## Dependency Map
> Read this before anything else. Some tasks cannot start until others finish.

```
Liban: repo setup + Expo scaffold
        ↓ unblocks everyone
        ├── Rudolph: YOLOv8 server-side detection
        │       ↓
        │   Rudolph: box size check ──────────────────────────┐
        │   Rudolph: left/right/ahead check ──────────────────┤
        │   Rudolph: cooldown timer ──────────────────────────┤
        │                                                      ↓
        └── Abdirashid: UI shell          Abdirashid: prompt builder
                                                  ↓
                                    Liban: POST /alert route
                                          Liban: Groq integration
                                                  ↓
                                    Abdirashid: AlertEngine wired to backend
                                                  ↓
                                    Abdirashid: expo-speech speaks alert
                                                  ↓
                                    ALL THREE: end-to-end test  ← WE ARE HERE
                                                  ↓
                                    ALL THREE: tune + demo prep
```

---

## LIBAN — Repo, Backend, Data Flow

### Week 1 ✓ DONE
- [x] Create GitHub repo (`spatial-nav`)
- [x] Scaffold `client/` — Expo + TypeScript
- [x] Scaffold `server/` — Node + Express
- [x] Commit initial folder structure, invite Rudolph and Abdirashid
- [x] Add `.env.example` with `GROQ_API_KEY=` placeholder

### Week 2 ✓ DONE
- [x] Build `POST /alert` route in `server/routes/alert.js`
- [x] Integrate Groq API (`groq` npm package, `llama-3.1-8b-instant`)
- [x] Fallback: if Groq fails, return raw label + direction string
- [x] Proxy route `POST /detect` → Python YOLOv8 service

### Week 3 ✓ DONE
- [x] Confirm full data flow: detection in → alert string out → no errors
- [x] Health check endpoint (`GET /health`) pings Python service
- [x] Fix CORS — open for development

### Week 4 — IN PROGRESS
- [ ] README complete: clone → install → run in under 10 minutes
- [ ] Confirm `.env.example` is accurate and documented
- [ ] Performance check: watch for memory leaks after 20 min
- [ ] Note: cloud deploy is out of scope — YOLOv8 needs local hardware

---

## RUDOLPH — Vision Pipeline

### Week 1 ✓ DONE (architecture pivot)
- [x] Abandoned TF.js / COCO-SSD on-device (too painful to set up)
- [x] Built Python FastAPI service (`server/python/detect_app.py`) with YOLOv8
- [x] Node proxy route forwards JPEG frames from phone to Python service

### Week 2 ✓ DONE
- [x] Confidence filter (`MIN_CONFIDENCE = 0.4` client-side, `0.35` Python-side)
- [x] Box area filter (`MIN_BOX_AREA_RATIO = 0.015`)
- [x] Left/right/ahead direction (`LEFT_THRESHOLD = 0.35`, `RIGHT_THRESHOLD = 0.65`)
  - Rear camera flip handled: image-left = user-right
- [x] Cooldown map per class+direction (`COOLDOWN_MS = 2500`)
- [x] `pickPrimaryDetection` — largest box wins when multiple objects pass filters

### Week 3 ✓ DONE
- [x] Frame capture loop (`MIN_FRAME_GAP_MS = 400`, `MIN_CAPTURE_GAP_MS = 700`)
- [x] Detection overlay with bounding boxes (`DetectionOverlay.tsx`)
- [x] Class whitelist: 19 relevant obstacle/hazard classes

### Week 4 — IN PROGRESS
- [ ] Tune `MIN_BOX_AREA_RATIO` from real walking tests
- [ ] Tune `MIN_FRAME_GAP_MS` / `MIN_CAPTURE_GAP_MS` for responsiveness vs. phone heat
- [ ] Tune `YOLO_MIN_CONF` (Python env var) — reduce false positives if needed
- [ ] Test in: bright room, dim lighting, hallway, cluttered space
- [ ] Log failure modes in `OPEN_QUESTIONS.md`

---

## ABDIRASHID — Alert Layer, TTS, UI

### Week 1 ✓ DONE
- [x] Full-screen camera layout, portrait mode
- [x] Permission screen with Grant Access button
- [x] HomeScreen with Start Scanning button

### Week 2 ✓ DONE
- [x] `useAlertEngine` hook: receives detection frame → filters → cooldown → speaks
- [x] expo-speech TTS (`Speech.stop()` before each new alert, rate 1.1)
- [x] `POST /alert` call to Groq — speak immediately with fallback, upgrade when Groq responds
- [x] Alert text shown on screen (`AlertBar.tsx`)

### Week 3 ✓ DONE
- [x] TTS queue: only one alert at a time, previous stopped before new one speaks
- [x] Hazard count badge (top of camera view)
- [x] Model error banner (shown if Python service is offline)
- [x] Alert auto-clears after `ALERT_CLEAR_MS = 1200` of no detections

### Week 4 — IN PROGRESS
- [ ] End-to-end test on iPhone AND Android
- [ ] Check TTS voice on both platforms, adjust rate/pitch if needed
- [ ] UI final pass — readable in bright outdoor light
- [ ] Rehearse demo walkthrough

---

## ALL THREE — Week 4

- [ ] Full demo run-through together
- [ ] Record backup demo video
- [ ] Agree on who presents which part

---

## Key Constants — Current Values

| Constant | Value | File |
|----------|-------|------|
| `MIN_BOX_AREA_RATIO` | `0.015` | `detectionConfig.ts` |
| `COOLDOWN_MS` | `2500` | `detectionConfig.ts` |
| `MIN_FRAME_GAP_MS` | `400` | `detectionConfig.ts` |
| `MIN_CAPTURE_GAP_MS` | `700` | `detectionConfig.ts` |
| `MIN_CONFIDENCE` (client) | `0.4` | `detectionConfig.ts` |
| `YOLO_MIN_CONF` (Python) | `0.35` | env var / `detect_app.py` |
| `PHOTO_QUALITY` | `0.45` | `detectionConfig.ts` |
| `YOLO_MODEL` | `yolov8s.pt` | env var / `detect_app.py` |
