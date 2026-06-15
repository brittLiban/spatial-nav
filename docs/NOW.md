# NOW.md — Week 4
> Current focus. This week only. Nothing else.

**Goal: App is solid, tuned, and demo-ready. No new features.**

The full pipeline is working end-to-end: camera → YOLOv8 (laptop) → Node/Groq → expo-speech.
This week is tuning, testing, and demo prep only.

When this week is done: archive this file → `archive/now/week-4.md`, then append final entry to `LOG.md`

---

## Definition of Done — Week 4

- [ ] App runs for 20+ minutes on a real phone without crashing
- [ ] Threshold and cooldown values tuned from real-world testing
- [ ] Demo run-through done at least once by all three team members
- [ ] Demo video recorded (backup in case live demo has issues)
- [ ] README complete — setup instructions work from scratch in under 5 minutes
- [ ] All three members can run the app on their own phone independently

---

## This Week's Tasks by Person

**Liban**
- [ ] README complete: clone → install → `npx expo start` + `node server/index.js` + `python server/python/detect_app.py` works end-to-end in under 10 minutes
- [ ] Make sure `.env.example` is accurate and documented
- [ ] Performance check: any memory leaks after 20 min? (watch Node process memory)
- [ ] Confirm CORS is not a problem under real phone + laptop WiFi conditions
- [ ] Note: backend deploy to Railway/Render is out of scope — YOLOv8 needs the laptop GPU, can't deploy to a cloud server

**Rudolph**
- [ ] Tune `MIN_BOX_AREA_RATIO` with real testing (walk toward door — adjust until alert fires at right moment)
- [ ] Tune `MIN_FRAME_GAP_MS` / `MIN_CAPTURE_GAP_MS` — find slowest values that still feel responsive
- [ ] Tune `MIN_CONFIDENCE` in Python (`YOLO_MIN_CONF`) — too many false positives? Raise it.
- [ ] Test in: bright room, dim room, hallway, doorway, cluttered space
- [ ] Document failure modes in `OPEN_QUESTIONS.md`

**Abdirashid**
- [ ] End-to-end test on iPhone AND Android
- [ ] Check TTS voice quality on both platforms — adjust `rate`/`pitch` if needed
- [ ] Tune alert pacing — does it feel right? Not too chatty, not missing things?
- [ ] UI final pass — readable on phone screen in bright outdoor light
- [ ] Rehearse demo walkthrough

**All Three**
- [ ] Full demo run-through together (simulate real presentation)
- [ ] Record backup demo video
- [ ] Agree on who presents which part

---

## Demo Script (5 minutes)

1. **Intro (30 sec):** What the problem is. Who it's for.
2. **Show the pipeline (1 min):** Three components in one sentence each — phone camera, YOLOv8 on laptop, Groq LLM alert.
3. **Live demo (2 min):** Walk toward a door. Walk toward a person. Show the alert firing and expo-speech speaking.
4. **What's next (30 sec):** Distance in feet. Backend deployment. Room calibration.
5. **Q&A**

---

## Blockers / Notes

- Backend runs locally (laptop + phone must be on same WiFi). This is intentional for demo — YOLOv8 needs local GPU/CPU.
- Model upgraded to `yolov8s.pt` from `yolov8n.pt` — if first run is slow, it's downloading the model weights.
