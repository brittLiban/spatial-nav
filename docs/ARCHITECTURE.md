# ARCHITECTURE.md — System Design

## Pipeline (The Only Thing That Matters)

```
┌──────────────────────────────────────────────┐
│              MOBILE BROWSER                   │
│                                               │
│  Camera Feed (getUserMedia)                   │
│       ↓  frame every 300ms                    │
│  YOLOv8 / COCO-SSD                            │
│       ↓  { class, confidence, bbox }          │
│  Confidence filter  (< 0.75 → drop)           │
│       ↓                                       │
│  Box size check     (< 5% frame → drop)       │
│       ↓                                       │
│  Left/right calc    (box center x vs frame)   │
│       ↓                                       │
│  Cooldown check     (same key < 4s → drop)    │
│       ↓  { object, position }                 │
│  POST /alert ──────────────────────────────┐  │
│                                            │  │
│  ◀── alert string ─────────────────────────┘  │
│       ↓                                       │
│  Web Speech API → speaks out loud             │
└──────────────────────────────────────────────┘
                    │ POST /alert
                    ▼
┌──────────────────────────────────────────────┐
│           NODE / EXPRESS BACKEND              │
│  Groq API call → returns alert string         │
│  Fallback: raw string if Groq fails           │
└──────────────────────────────────────────────┘
```

---

## Component Details

### Camera (Rudolph)
```js
// Camera.tsx
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: { ideal: "environment" } }
})
videoRef.current.srcObject = stream
// Capture frame every FRAME_INTERVAL_MS
setInterval(() => {
  ctx.drawImage(videoRef.current, 0, 0)
  runDetection(canvas)
}, FRAME_INTERVAL_MS)
```

### YOLO / Detection (Rudolph)
```js
// YoloDetector.tsx
const model = await cocoSsd.load()  // or YOLOv8 ONNX
const predictions = await model.detect(canvas)
// predictions: [{ class, score, bbox: [x, y, w, h] }]
```

### Alert Filters (Rudolph)
```js
// AlertEngine logic — runs on every detection
const rel = (bbox[2] * bbox[3]) / (frameW * frameH)
if (prediction.score < MIN_CONFIDENCE) return
if (rel < THRESHOLD) return
const cx = bbox[0] + bbox[2] / 2
const position = cx < frameW / 2 ? "left" : "right"
const key = `${prediction.class}_${position}`
if (Date.now() - cooldownMap[key] < COOLDOWN_MS) return
cooldownMap[key] = Date.now()
onAlert({ object: prediction.class, position })
```

### Backend Route (Liban)
```js
// server/routes/alert.js
app.post('/alert', async (req, res) => {
  const { object, position } = req.body
  const fallback = `there is a ${object} on the ${position}`
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Navigation assistant. Short clear alerts. Max 10 words." },
        { role: "user", content: `there is a ${object} on the ${position}` }
      ]
    })
    res.json({ alert: response.choices[0].message.content })
  } catch {
    res.json({ alert: fallback })
  }
})
```

### TTS (Abdirashid)
```js
// VoiceOutput.tsx
const speak = (text) => {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 1.1
  u.volume = 1
  window.speechSynthesis.speak(u)
}
```

---

## Constants (Tune in Week 4)

| Name | Default | Effect |
|------|---------|--------|
| `THRESHOLD` | `0.05` | Min box size (% of frame) to trigger alert |
| `COOLDOWN_MS` | `4000` | Ms before same object re-alerts |
| `FRAME_INTERVAL_MS` | `300` | How often to sample video frame |
| `MIN_CONFIDENCE` | `0.75` | Min YOLO confidence to accept |

---

## Future (Not MVP)

```js
// Distance in feet — future
// Requires focal length calibration during setup
const distance_ft = (real_height_ft * focal_length_px) / bbox_height_px

// Known object heights
const KNOWN_HEIGHTS = { door: 6.8, person: 5.8, chair: 3.0 }
```
