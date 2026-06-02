# NOW.md — Week 2
> Current focus. This week only. Nothing else.

**Goal: YOLO output processed. Object filtered by size and position. Alert trigger wired up.**

**PREREQUISITE — Week 1 must be fully done before starting Week 2.**
YOLO must be detecting and logging objects on screen before any of this makes sense.

When this week is done: archive this file → `archive/now/week-2.md`, then copy `weeks/week-3.md` → `NOW.md`

---

## Definition of Done — Week 2

- [ ] Box size check working — detections below threshold are silently dropped
- [ ] Left/right detection working — every passing detection has a `position` field
- [ ] Confidence filter working — anything below 0.75 dropped before size check
- [ ] Cooldown timer working — same class + position won't re-trigger for 4 seconds
- [ ] `POST /alert` backend route built and tested in Postman
- [ ] Groq API call working from backend — sends prompt, receives alert string
- [ ] Fallback working — if Groq fails, return raw `"there is a [object] on the [left/right]"`
- [ ] Frontend calls `/alert` when a detection passes all filters
- [ ] Response logged to console (TTS not required yet — just confirm the string arrives)

---

## This Week's Tasks by Person

**Liban** ← *backend work this week*
- [ ] Build `POST /alert` route in `server/routes/alert.js`
  - Accepts `{ object: string, position: "left" | "right" }`
  - Calls Groq API with prompt
  - Returns `{ alert: string }`
- [ ] Add Groq API integration (use `fetch` or `groq` npm package)
- [ ] Add error handling + fallback string if Groq times out or hits rate limit
- [ ] Test with Postman: send `{ object: "door", position: "left" }`, confirm response
- [ ] Deploy updated backend to Vercel

**Rudolph** ← *blocked until Week 1 YOLO is working*
- [ ] Parse YOLO output into clean detection objects: `{ class, confidence, bbox }`
- [ ] Implement confidence filter: drop anything below `MIN_CONFIDENCE = 0.75`
- [ ] Implement box size check:
  ```js
  const rel = (bbox.w * bbox.h) / (frameW * frameH)
  if (rel < THRESHOLD) return // drop
  ```
- [ ] Implement left/right:
  ```js
  const cx = bbox.x + bbox.w / 2
  const position = cx < frameW / 2 ? "left" : "right"
  ```
- [ ] Implement cooldown map:
  ```js
  const key = `${class}_${position}`
  if (Date.now() - cooldownMap[key] < COOLDOWN_MS) return
  cooldownMap[key] = Date.now()
  ```
- [ ] Export qualifying detections via callback/prop to Abdirashid's component

**Abdirashid** ← *blocked until Rudolph's callback is ready*
- [ ] Build `AlertEngine` — receives detection from Rudolph, calls `/alert`, gets string back
- [ ] Log alert string to console (just confirm it arrives — no TTS yet)
- [ ] Start basic TTS integration with Web Speech API (can run in isolation first)

---

## Blockers / Notes

_Update as the week goes_

---

## Next Week Preview
Week 3: Connect everything end-to-end. TTS speaks for real. One alert at a time. Full pipeline live.
