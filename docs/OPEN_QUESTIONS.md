# OPEN_QUESTIONS.md — Unknowns and Blockers
> Log questions as they come up. Check off when answered.
> Format: [ ] Question — who's looking into it — week

---

## Open

- [ ] Does COCO-SSD run fast enough on a mid-range Android? Or do we need YOLOv8? — Rudolph — Week 1
- [ ] Does `facingMode: environment` correctly request rear camera on iOS Safari? — Rudolph — Week 1
- [ ] What is Groq's actual free tier rate limit? Will it hold under simultaneous testing? — Liban — Week 2
- [ ] What is the right `FRAME_INTERVAL_MS`? Needs benchmarking on real phones. — Rudolph — Week 3
- [ ] Browser requires user gesture before Web Speech API plays audio. Best UX solution? "Start" button? — Abdirashid — Week 2
- [ ] Does Web Speech API on Android Chrome sound clear enough, or do we need a fallback? — Abdirashid — Week 3
- [ ] Multiple objects in one frame — do we alert only the biggest? Or closest to center? — All — Week 3

---

## Answered

- [x] Do we need exact distance in feet for MVP?
  → No. Box size as a close/far proxy is enough. Distance is a future feature. (Project start)

- [x] Should we run MiDaS depth model alongside YOLO?
  → No. Too much compute for mobile. Box size threshold handles the filtering. (Project start)

- [x] Whisper for TTS?
  → Whisper is speech-to-text, not text-to-speech. Using Web Speech API instead. (Project start)

- [x] Should we alert on every detection or just new objects?
  → Only new objects. Cooldown timer per class + position key prevents re-alerting. (Project start)

- [x] Should box size check happen before or after left/right?
  → Before. Filter early, save compute. (Project start)
