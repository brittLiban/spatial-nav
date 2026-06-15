# PROGRESS.md — Session Log

---

## ▶ WHAT'S NEXT RIGHT NOW

App is working end-to-end with real detection, real TTS, and proximity-aware alerts.
Focus is now: demo prep, edge case testing, README polish.

**Remaining for demo:**
- [ ] Test in multiple environments (hallway, cluttered room, outdoors)
- [ ] Demo run-through with all three team members
- [ ] Record backup demo video
- [ ] Confirm README works from scratch on a fresh machine

---

## Current Week: 4 of 4
See `NOW.md` for full task list.

---

## Session Log
> Add new entries at the top. Format: [DATE] [WHO] — what got done / what's next.

### [2026-06-15] — Major debugging + performance pass (Liban)
- **Fixed EXIF orientation bug** — iOS photos have rotation metadata PIL ignores; YOLOv8 was seeing sideways images every frame. Fixed with `ImageOps.exif_transpose()`. This was the root cause of near-zero detection accuracy.
- **Added image resize before sending** — `expo-image-manipulator` resizes to 640px wide before transmitting. Payload ~40 KB instead of ~2 MB. Latency dropped from 2–4s to ~400–700ms.
- **Fixed coordinate mapping bug** — camera cover mode wasn't accounted for in overlay; boxes appeared 3× too small. Fixed with uniform scale + center crop offset.
- **Fixed direction inversion** — "rear camera is mirrored" logic was wrong; rear camera is not mirrored. Swapped left/right.
- **Priority-based alert ranking** — detections ranked by `areaRatio × classDanger × directionWeight`. Person/car (10) beats potted plant (3). Ahead (1.5×) beats side (1×).
- **Global 2s alert gap** — prevents rapid-fire when many objects detected simultaneously.
- **Proximity categories** — `immediate` (box > 12% of frame) → "right in front of you!"; `close` (>4%) → "close ahead"; `approaching` → standard phrase. TTS and Groq both updated.
- **Updated LOG.md** with full project journey and big wins.

### [2026-06-02] — Sprint 1 scaffolding complete (Liban)
- Confirmed project is a native Expo (React Native) app, not a web app
- Updated all docs to reflect Expo stack (expo-camera, expo-speech, Railway backend)
- Scaffolded `client/` — Expo SDK 54 + TypeScript, expo-camera + expo-speech installed
- Built `client/App.tsx`, camera component, AlertBar
- Scaffolded `server/` — Express + Groq integration, `POST /alert` route ready
- Pushed to GitHub: github.com/brittLiban/spatial-nav
- **Next:** Invite team. Wire up YOLOv8 detection pipeline.

### [DATE] — Project kickoff (Liban)
- Defined MVP pipeline end to end
- Chose tech stack
- Created all doc files
