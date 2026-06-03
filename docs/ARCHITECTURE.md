# ARCHITECTURE.md — System Design

## Pipeline (The Only Thing That Matters)

```
┌──────────────────────────────────────────────┐
│           EXPO APP (React Native)             │
│                                               │
│  expo-camera (rear camera, live frames)       │
│       ↓  frame every 300ms                    │
│  COCO-SSD (@tensorflow/tfjs-react-native)     │
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
│  expo-speech → speaks out loud                │
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
```tsx
// Camera.tsx — expo-camera
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useRef } from 'react'

const [permission, requestPermission] = useCameraPermissions()
const cameraRef = useRef(null)

// Capture frame every FRAME_INTERVAL_MS
setInterval(async () => {
  if (!cameraRef.current) return
  const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.3 })
  runDetection(photo.base64)
}, FRAME_INTERVAL_MS)
```

### YOLO / Detection (Rudolph)
```tsx
// YoloDetector.tsx
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-react-native'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { decodeJpeg } from '@tensorflow/tfjs-react-native'

await tf.ready()
const model = await cocoSsd.load()

const detect = async (base64: string) => {
  const rawData = Buffer.from(base64, 'base64')
  const imageTensor = decodeJpeg(rawData)
  const predictions = await model.detect(imageTensor)
  imageTensor.dispose()
  return predictions
  // predictions: [{ class, score, bbox: [x, y, w, h] }]
}
```

### Alert Filters (Rudolph)
```tsx
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
```tsx
// VoiceOutput.tsx — expo-speech (no browser restriction, no user gesture needed)
import * as Speech from 'expo-speech'

const speak = (text: string) => {
  Speech.stop()
  Speech.speak(text, { rate: 1.1, volume: 1.0 })
}
```

---

## Constants (Tune in Week 4)

| Name | Default | Effect |
|------|---------|--------|
| `THRESHOLD` | `0.05` | Min box size (% of frame) to trigger alert |
| `COOLDOWN_MS` | `4000` | Ms before same object re-alerts |
| `FRAME_INTERVAL_MS` | `300` | How often to capture a camera frame |
| `MIN_CONFIDENCE` | `0.75` | Min COCO-SSD confidence to accept |

---

## Future (Not MVP)

```js
// Distance in feet — future
// Requires focal length calibration during setup
const distance_ft = (real_height_ft * focal_length_px) / bbox_height_px

// Known object heights
const KNOWN_HEIGHTS = { door: 6.8, person: 5.8, chair: 3.0 }
```
