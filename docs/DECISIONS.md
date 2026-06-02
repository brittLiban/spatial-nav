# DECISIONS.md — Technical Decision Log
> Log every non-obvious decision here as it's made. Include why.
> Format: [DATE] — Decision — Reason

---

### [Project Start] — Check box size BEFORE left/right and LLM
Filter early, save compute. Box size check is two multiplications — essentially free.
Only run the expensive stuff (LLM call, TTS) on objects that actually cleared the threshold.

### [Project Start] — COCO-SSD as Week 1 starting model, upgrade to YOLOv8 ONNX if time allows
COCO-SSD: 3-line npm install, works immediately. YOLOv8 ONNX: better accuracy but more setup.
Better to have something working in Week 1 than stuck on setup.

### [Project Start] — Groq API call goes through Node backend, not frontend
API keys in frontend code are visible in browser dev tools. Backend proxies the call.
Key lives in `.env`, never committed.

### [Project Start] — Box size threshold set to 0.05 (5% of frame) as starting point
No empirical data yet — educated guess. Tune in Week 4 with real-world testing.

### [Project Start] — Cooldown set to 4 seconds per class + position key
Prevents the same alert repeating every frame. 4s felt right — not annoying, not missing things.
Will tune during testing.

### [Project Start] — Distance in feet deferred to future
Requires focal length calibration which adds setup complexity.
MVP just needs to know "close enough to warn." Box size covers that.

### [Project Start] — Web Speech API over ElevenLabs for TTS
Web Speech API: zero latency, zero cost, zero setup, works offline.
ElevenLabs: better voice quality but adds API latency + another key.
Speed > quality for MVP.

### [Project Start] — Only alert on the largest object in frame per cycle
Multiple objects will be detected simultaneously. Only passing the biggest one
prevents alert flooding and focuses the user on the nearest hazard.

---

_New decisions go at the top._
