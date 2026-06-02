# NOW.md — Week 3
> Current focus. This week only. Nothing else.

**Goal: Full pipeline connected end-to-end. TTS speaks live alerts. App works.**

**PREREQUISITE — Week 2 must be fully done.**
- YOLO output must be filtered (size, confidence, left/right, cooldown)
- `/alert` backend route must be returning Groq strings
- Both confirmed working in isolation before connecting

When this week is done: archive this file → `archive/now/week-3.md`, then copy `weeks/week-4.md` → `NOW.md`

---

## Definition of Done — Week 3

- [ ] Full pipeline runs end-to-end without crashing:
  Camera → YOLO → filters → backend → Groq → TTS speaks out loud
- [ ] TTS queue working — only one alert plays at a time
- [ ] TTS doesn't overlap — `speechSynthesis.cancel()` before each new utterance
- [ ] "Start" button required before TTS can play (browser permission workaround)
- [ ] Alert text shown on screen while speaking
- [ ] App runs for 10+ minutes without crashing or freezing
- [ ] Tested on at least one real phone (not just laptop browser)

---

## This Week's Tasks by Person

**Liban** ← *integration and performance*
- [ ] Confirm full data flow works: detection in → alert string out → no errors
- [ ] Check Groq response times under real usage — is latency acceptable?
- [ ] If Groq is too slow: cache common alerts (door/left, door/right, person/left etc.)
- [ ] Measure round-trip time: detection trigger → TTS speaks. Should be under 2 seconds.
- [ ] Fix any CORS issues between frontend and backend

**Rudolph** ← *blocked until Week 2 filters are working*
- [ ] Confirm pipeline handoff to Abdirashid's `AlertEngine` is clean
- [ ] Tune `FRAME_INTERVAL_MS` — benchmark on a real phone
  - Too fast = phone overheats / lags
  - Too slow = misses objects
  - Target: 300–500ms
- [ ] Handle multiple objects in same frame — only pass the biggest/closest one
- [ ] Test in varying lighting conditions — note failure modes

**Abdirashid** ← *blocked until Rudolph's callback is confirmed working*
- [ ] Wire `AlertEngine` fully: receives detection → calls `/alert` → gets string → speaks
- [ ] Implement TTS queue:
  ```js
  const speak = (text) => {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 1.1
    window.speechSynthesis.speak(u)
  }
  ```
- [ ] Add "Start Navigation" button — required for browser audio permission
- [ ] Show current alert text on screen (big, readable, high contrast)
- [ ] Clean up UI — full screen camera, minimal chrome, status bar

---

## Blockers / Notes

_Update as the week goes_

---

## Next Week Preview
Week 4: Testing, tuning, bug fixes, demo prep. No new features.
