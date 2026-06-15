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

### The Journey

This project started with a clear idea — phone camera feeds into an AI model, model speaks what it sees — and turned out to be much harder to get right than the architecture diagram suggested.

**Week 1:** Scaffolded everything fast. The first wall hit immediately: TF.js / COCO-SSD on-device was too painful to wire up in React Native / Expo Go. Abandoned it and switched to YOLOv8 running on the laptop, phone sends JPEG frames over WiFi. That decision shaped the whole project.

**Week 2:** Built the full alert pipeline — confidence filter, box area filter, direction logic, Groq LLM alerts, expo-speech TTS. All the pieces existed. Pipeline looked complete on paper.

**Week 3:** Full end-to-end integration. Everything wired together on a real phone. But real testing revealed deep problems: TTS wasn't audible (iOS silent switch + missing `volume: 1.0`), detection quality was poor, and bounding boxes appeared in wrong positions. The demo was not ready.

**Week 4 — what actually happened:**

The model "worked" but reality was brutal. Point it at a chair — nothing. Walk into a wall — no alert. After real testing, four bugs were found and fixed in sequence:

1. **EXIF orientation bug (root cause of poor detection)**
   iOS photos embed a rotation flag in EXIF metadata. PIL's `Image.open()` ignores it by default. This meant YOLOv8 was seeing a sideways image every single frame — the phone was in portrait, but the model received landscape pixels. A chair appears tall and narrow in real life; sideways it becomes a wide short rectangle that YOLO's training data didn't prepare for. One line fixed it: `ImageOps.exif_transpose()`. Detection accuracy jumped immediately.

2. **Image payload size (latency)**
   The phone was sending a full 4032×3024 JPEG (~2 MB) per frame. Round trip: 2–4 seconds. Added client-side resize to 640px wide via `expo-image-manipulator` before transmitting. Payload dropped to ~40 KB, round trip to ~400–700ms.

3. **Coordinate mapping bug (boxes in wrong position)**
   The camera renders in "cover" mode — uniform scale + center crop. The overlay was using separate X/Y scale factors (simple stretch). Boxes appeared 3× too small and in the wrong position. Fixed with: `scale = max(screenW/imgW, screenH/imgH)` with center offsets.

4. **Direction inversion**
   Code had a comment "rear camera: image left = user's right" — wrong. Rear camera is not mirrored. Swapped the return values.

### Big Wins

- **Detection went from near-zero to reliable** — EXIF fix was the single biggest unlock
- **Latency dropped from 2–4s to under 1s** — image resize alone
- **Priority-based alerting** — now ranks detections by danger (person/car > plant/backpack), direction weight (ahead = 1.5×), and proximity, so the most alarming thing always wins
- **Proximity categories** — "right in front of you!" vs "close ahead" vs "ahead of you" from bounding box area ratio
- **Global 2s alert gap** — prevents rapid-fire when 20 objects are in frame
- **setup.sh + start.sh** — one command to install, one command to run

### What We Learned

- Bugs in data preprocessing (EXIF orientation) destroy model accuracy completely — the model was never the problem
- Real-world testing on a moving phone in different lighting is the only way to know if detection works
- For a blind navigation aid, "right in front of you!" is more useful than a confidence percentage
