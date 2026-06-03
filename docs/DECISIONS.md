# DECISIONS.md — Technical Decision Log
> Log every non-obvious decision here as it's made. Include why.
> Format: [DATE] — Decision — Reason

---

### [Project Start] — Native mobile app (Expo) over mobile web app (React + Vite)
Team confirmed: this is a real native app, not a browser-based PWA.
Expo (React Native) uses the same React + TypeScript skills but gives native camera access,
native TTS via expo-speech, and runs on the phone like a real installed app.
Tradeoff: slightly more setup complexity; TF.js React Native may require bare Expo workflow.

### [Project Start] — expo-speech over Web Speech API for TTS
Web Speech API is browser-only — not available in React Native.
expo-speech is the native equivalent: zero latency, zero cost, zero key needed.
No browser user-gesture restriction either — audio plays immediately.

### [Project Start] — Railway/Render over Vercel for backend hosting
Vercel uses serverless functions which cold-start after inactivity.
Cold starts add 1-3 seconds of latency — unacceptable for real-time navigation alerts.
Railway and Render run a persistent Node process. No cold starts.

### [Project Start] — Check box size BEFORE left/right and LLM
Filter early, save compute. Box size check is two multiplications — essentially free.
Only run the expensive stuff (LLM call, TTS) on objects that actually cleared the threshold.

### [Project Start] — COCO-SSD as Week 1 starting model, upgrade to YOLOv8 ONNX if time allows
COCO-SSD: npm install + a few lines, works quickly. YOLOv8 ONNX: better accuracy but harder to set up in React Native.
Better to have something working in Week 1 than stuck on setup.

### [Project Start] — Groq API call goes through Node backend, not the app
API keys bundled in a React Native app can be extracted from the APK/IPA.
Backend proxies the call. Key lives in `.env`, never committed.

### [Project Start] — Box size threshold set to 0.05 (5% of frame) as starting point
No empirical data yet — educated guess. Tune in Week 4 with real-world testing.

### [Project Start] — Cooldown set to 4 seconds per class + position key
Prevents the same alert repeating every frame. 4s felt right — not annoying, not missing things.
Will tune during testing.

### [Project Start] — Distance in feet deferred to future
Requires focal length calibration which adds setup complexity.
MVP just needs to know "close enough to warn." Box size covers that.

### [Project Start] — Only alert on the largest object in frame per cycle
Multiple objects will be detected simultaneously. Only passing the biggest one
prevents alert flooding and focuses the user on the nearest hazard.

---

_New decisions go at the top._
