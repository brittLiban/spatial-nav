// End-to-end pipeline test: real image -> /detect (real YOLOv8) -> /alert (real Groq).
//
// This exercises the actual running stack, so it is OPT-IN:
//   npm run test:e2e
//
// It self-skips (passes without asserting) when the stack is not reachable or
// when no fixture image is available, so it never breaks a CI run that lacks a
// live server / GROQ_API_KEY.
const fs = require('fs')
const path = require('path')

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3001'
const FIXTURE = path.join(__dirname, '..', 'fixtures', 'sample.jpg')
const SAMPLE_URL = 'https://ultralytics.com/images/bus.jpg' // contains people + a bus

// Thresholds mirrored from client/src/constants/detectionConfig.ts so the e2e
// derives direction/proximity the same way the app does.
const LEFT_THRESHOLD = 0.35
const RIGHT_THRESHOLD = 0.65
const IMMEDIATE = 0.12
const CLOSE = 0.04

function directionOf(bbox, frameWidth) {
  const [x, , w] = bbox
  const center = (x + w / 2) / frameWidth
  if (center < LEFT_THRESHOLD) return 'left'
  if (center > RIGHT_THRESHOLD) return 'right'
  return 'ahead'
}

function proximityOf(bbox, frameWidth, frameHeight) {
  const [, , w, h] = bbox
  const ratio = (w * h) / (frameWidth * frameHeight)
  if (ratio >= IMMEDIATE) return 'immediate'
  if (ratio >= CLOSE) return 'close'
  return 'approaching'
}

async function stackIsLive() {
  try {
    const res = await fetch(`${BASE_URL}/health`)
    if (!res.ok) return false
    const body = await res.json()
    return body.detectService === 'ok'
  } catch {
    return false
  }
}

async function ensureFixture() {
  if (fs.existsSync(FIXTURE)) return true
  try {
    const res = await fetch(SAMPLE_URL)
    if (!res.ok) return false
    const buf = Buffer.from(await res.arrayBuffer())
    fs.mkdirSync(path.dirname(FIXTURE), { recursive: true })
    fs.writeFileSync(FIXTURE, buf)
    return true
  } catch {
    return false
  }
}

describe('e2e: image -> /detect -> /alert', () => {
  let live = false
  let haveImage = false

  beforeAll(async () => {
    live = await stackIsLive()
    if (live) haveImage = await ensureFixture()
  })

  it('turns a real image into a spoken safety alert', async () => {
    if (!live) {
      console.warn(
        `[e2e] SKIPPED: stack not reachable at ${BASE_URL}. ` +
          `Start it first: run the Python YOLO service + 'node index.js' with a GROQ_API_KEY.`
      )
      return
    }
    if (!haveImage) {
      console.warn('[e2e] SKIPPED: no fixture image and the sample could not be downloaded.')
      return
    }

    const image = fs.readFileSync(FIXTURE).toString('base64')

    // 1. Detect
    const detectRes = await fetch(`${BASE_URL}/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    })
    expect(detectRes.ok).toBe(true)
    const { width, height, detections } = await detectRes.json()
    expect(Array.isArray(detections)).toBe(true)
    expect(detections.length).toBeGreaterThan(0)

    // 2. Pick the highest-confidence detection and derive its spatial context
    const top = [...detections].sort((a, b) => b.score - a.score)[0]

    // 3. Alert
    const alertRes = await fetch(`${BASE_URL}/alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        class: top.class,
        direction: directionOf(top.bbox, width),
        proximity: proximityOf(top.bbox, width, height),
        confidence: Math.round(top.score * 100),
      }),
    })
    expect(alertRes.ok).toBe(true)
    const { alertText } = await alertRes.json()

    expect(typeof alertText).toBe('string')
    expect(alertText.trim().length).toBeGreaterThan(0)
    // The alert is meant to be short and spoken.
    expect(alertText.trim().split(/\s+/).length).toBeLessThanOrEqual(12)

    console.log(`[e2e] detected "${top.class}" -> alert: "${alertText}"`)
  })
})
