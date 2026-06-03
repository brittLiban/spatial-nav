# NOW.md — Week 4
> Current focus. This week only. Nothing else.

**Goal: App is solid, tuned, and demo-ready. No new features.**

**PREREQUISITE — Week 3 must be fully done.**
Full pipeline must be running end-to-end before tuning anything.
Do not add features this week. Ship what works.

---

## Definition of Done — Week 4

- [ ] App runs for 20+ minutes on a real phone without crashing
- [ ] Threshold and cooldown values tuned from real-world testing
- [ ] Demo run-through done at least once by all three team members
- [ ] Demo video recorded (backup in case live demo has issues)
- [ ] README complete — setup instructions work from scratch (Expo Go in under 5 minutes)
- [ ] All three members can run the app on their own phone independently

---

## This Week's Tasks by Person

**Liban**
- [ ] Final backend deploy — confirm production URL works from phone on LTE (not just WiFi)
- [ ] README complete: clone → install → `npx expo start` works in under 5 minutes
- [ ] Make sure `.env.example` is accurate and documented
- [ ] Performance audit: any memory leaks after 20 min? Use Expo DevTools / Flipper
- [ ] Write up what "distance in feet" would look like (future feature doc)

**Rudolph**
- [ ] Tune `THRESHOLD` with real testing:
  - Walk toward a door, note at what box size the alert fires
  - Adjust until it feels like the right moment (not too early, not too late)
- [ ] Tune `FRAME_INTERVAL_MS` — find the slowest value that still feels responsive
- [ ] Tune `MIN_CONFIDENCE` — are there too many false positives? Raise it.
- [ ] Test in: bright room, dim room, hallway, doorway, cluttered space
- [ ] Document failure modes in `OPEN_QUESTIONS.md`

**Abdirashid**
- [ ] End-to-end test on iPhone AND Android
- [ ] Check TTS voice quality on both platforms — adjust rate/pitch if needed
- [ ] Tune alert rate — does it feel right? Not too often, not missing things?
- [ ] UI final pass — readable on phone screen in bright outdoor light
- [ ] Rehearse demo walkthrough

**All Three**
- [ ] Full demo run-through together (simulate real presentation)
- [ ] Record backup demo video
- [ ] Agree on who presents which part

---

## Demo Script (5 minutes)

1. **Intro (30 sec):** What the problem is. Who it's for.
2. **Show the pipeline (1 min):** Pull up ARCHITECTURE.md or a simple diagram. Explain the 3 components in one sentence each.
3. **Live demo (2 min):** Walk toward a door. Walk toward a person. Show the alert firing and expo-speech speaking.
4. **What's next (30 sec):** Distance in feet. Room calibration. Height measurement.
5. **Q&A**

---

## Blockers / Notes

_Update as the week goes_
