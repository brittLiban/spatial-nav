# NOW.md — Week 3
> Current focus. This week only. Nothing else.

**Goal: Full pipeline connected end-to-end. expo-speech speaks live alerts. App works on a real phone.**

**PREREQUISITE — Week 2 must be fully done.**
- COCO-SSD output must be filtered (size, confidence, left/right, cooldown)
- `/alert` backend route must be returning Groq strings
- Both confirmed working in isolation before connecting

When this week is done: archive this file → `archive/now/week-3.md`, then copy `weeks/week-4.md` → `NOW.md`

---

## Definition of Done — Week 3

- [ ] Full pipeline runs end-to-end without crashing:
  Camera → COCO-SSD → filters → backend → Groq → expo-speech speaks out loud
- [ ] TTS queue working — only one alert plays at a time
- [ ] expo-speech stops previous alert before speaking new one (`Speech.stop()`)
- [ ] Alert text shown on screen while speaking
- [ ] App runs for 10+ minutes without crashing or freezing
- [ ] Tested on at least one real phone (not just simulator)

---

## This Week's Tasks by Person

**Liban** ← *integration and performance*
- [ ] Confirm full data flow works: detection in → alert string out → no errors
- [ ] Check Groq response times under real usage — is latency acceptable?
- [ ] If Groq is too slow: cache common alerts (door/left, door/right, person/left etc.)
- [ ] Measure round-trip time: detection trigger → TTS speaks. Should be under 2 seconds.
- [ ] Fix any CORS issues between app and backend

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
- [ ] Implement TTS queue with expo-speech:
  ```tsx
  import * as Speech from 'expo-speech'
  const speak = (text: string) => {
    Speech.stop()
    Speech.speak(text, { rate: 1.1, volume: 1.0 })
  }
  ```
- [ ] Show current alert text on screen (big, readable, high contrast)
- [ ] Clean up UI — full screen camera, minimal chrome, status bar at bottom

---

## Blockers / Notes

_Update as the week goes_

---

## Next Week Preview
Week 4: Testing, tuning, bug fixes, demo prep. No new features.
