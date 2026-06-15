# LOG.md — Permanent History
> One entry per week. Never deleted. Append at the bottom.
> Written at the end of each week when you "close out this week."

---

## Week 1

- What got built: GitHub repo created, Expo + TypeScript client scaffolded, Node/Express server scaffolded, basic camera feed rendering on phone, initial TTS and detection wired up
- What got stuck: TF.js / COCO-SSD on-device setup was too painful — abandoned in favour of server-side YOLOv8
- Key decision made: Switched from COCO-SSD on-device to YOLOv8 running on laptop, phone sends JPEG frames over WiFi
- Going into Week 2: Detection proxy ready, needed filters + alert pipeline built out

---

## Week 2

- What got built: Full detection pipeline wired — confidence filter, box area filter, left/right/ahead direction, cooldown logic, Groq `/alert` route, expo-speech TTS
- What got stuck: N/A
- Key decision made: Speak immediately with local fallback text, then upgrade to Groq response when it arrives (keeps latency low)
- Going into Week 3: All components existed, needed full end-to-end integration and testing

---

## Week 3

- What got built: Full end-to-end pipeline live on real phone — camera → YOLOv8 (laptop) → Node/Groq → expo-speech speaks alert. Detection overlay with bounding boxes. Alert bar on screen. Hazard count badge.
- What got stuck: N/A
- Key decision made: Architecture confirmed as phone + laptop pair on same WiFi — no backend deploy to cloud (YOLOv8 needs local hardware)
- Going into Week 4: Tuning, testing on multiple devices, demo prep

---

## Week 4
_Fill in when Week 4 closes out._
