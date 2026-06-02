# CLAUDE.md — Spatial Awareness Navigator
> Read this first. Every session. Every team member. Every AI instance.
> Then read PROGRESS.md to know exactly where things stand right now.

---

## What This Project Is

A mobile web app that gives real-time voice navigation to people with visual impairments.
The phone camera feeds into YOLOv8, which detects objects. A simple algorithm checks if the
object is close enough and which side it's on. Groq LLM turns that into a natural alert.
TTS speaks it out loud. That is the whole thing.

---

## The MVP Pipeline (Do Not Deviate Without Logging in DECISIONS.md)

```
Live camera feed (phone browser)
        ↓
YOLOv8 — bounding box (x, y, w, h) + class label + confidence
        ↓
Box size check — (box_w × box_h) / (frame_w × frame_h) > THRESHOLD?
        → NO:  drop it. next frame.
        → YES: continue
        ↓
Left/right — box center x < frame center x? → "left". else → "right"
        ↓
Cooldown check — same class + position alerted in last 4 seconds?
        → YES: drop it.
        → NO:  continue
        ↓
POST /alert → { object, position } → Node backend
        ↓
Groq LLM → natural alert string
        ↓
Web Speech API → speaks alert out loud
```

**Three alert rules — never skip these:**
1. Only if object is big enough (box size threshold)
2. Only if it's a new object (cooldown timer per class + position)
3. One alert at a time (no overlapping audio)

---

## Out of Scope for MVP

- Distance in feet (future — needs focal length calibration)
- Room calibration / 360 scan (future)
- Height measurement (future)
- Room memory / hazard map (future)
- MiDaS depth model (future)

---

## Team

| Person | Owns |
|--------|------|
| Liban | Repo, backend (Node/Express), Groq API integration, data flow |
| Rudolph | Vision pipeline — YOLO, camera feed, bounding box logic, size + left/right |
| Abdirashid | Alert layer — prompt builder, Groq call trigger, TTS, React UI, testing |

---

## Current Sprint
→ `NOW.md`

## Current State + What's Next
→ `PROGRESS.md`

## Full Task Breakdown (with dependencies)
→ `TASKS.md`

## Architecture + Code Details
→ `ARCHITECTURE.md`

## Tech Stack
→ `TECH_STACK.md`

## Decision Log
→ `DECISIONS.md`

## Open Questions
→ `OPEN_QUESTIONS.md`

## Permanent History
→ `LOG.md`

---

## Weekly Rhythm

**During a session:**
- Made a real decision? → log it in `DECISIONS.md` immediately
- Hit an unknown? → log it in `OPEN_QUESTIONS.md`
- Answered one? → check it off

**End of every session:**
Update `PROGRESS.md`. What got done. What's next. 60 seconds.

**End of every week:**
1. Copy `NOW.md` → `archive/now/week-[N].md`
2. Copy `weeks/week-[N+1].md` → `NOW.md`
3. Append one entry to `LOG.md`
4. Update `PROGRESS.md` for new week

**Three phrases:**
- `"log that decision"` → AI appends to DECISIONS.md
- `"update progress, we're done"` → AI updates PROGRESS.md
- `"close out this week"` → AI runs the full weekly ritual above
