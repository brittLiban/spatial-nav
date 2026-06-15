export const MIN_FRAME_GAP_MS = 400
export const MIN_CAPTURE_GAP_MS = 700
export const CAMERA_WARMUP_MS = 600
export const MIN_CONFIDENCE = 0.25
export const MIN_BOX_AREA_RATIO = 0.01
export const LEFT_THRESHOLD = 0.35
export const RIGHT_THRESHOLD = 0.65
export const COOLDOWN_MS = 3000
export const ALERT_CLEAR_MS = 1200
export const PHOTO_QUALITY = 0.45
// Minimum gap between ANY two spoken alerts — prevents rapid-fire when many
// objects are detected simultaneously.
export const GLOBAL_ALERT_GAP_MS = 2000

export const RELEVANT_CLASSES = [
  'person',
  'bicycle',
  'car',
  'motorcycle',
  'bus',
  'truck',
  'chair',
  'couch',
  'dining table',
  'dog',
  'cat',
  'stop sign',
  'bench',
  'potted plant',
  'tv',
  'backpack',
  'handbag',
  'suitcase',
  'sports ball',
] as const

// Higher = more alarming. Used to rank competing detections.
export const CLASS_PRIORITY: Record<string, number> = {
  // Moving / collision hazards
  person: 10,
  car: 10,
  truck: 10,
  bus: 10,
  motorcycle: 9,
  bicycle: 8,
  dog: 7,
  // Large stationary obstacles
  'dining table': 6,
  'stop sign': 6,
  couch: 5,
  bed: 5,
  bench: 4,
  chair: 4,
  cat: 4,
  // Minor
  'potted plant': 3,
  suitcase: 3,
  tv: 2,
  backpack: 2,
  handbag: 2,
  'sports ball': 2,
}
export const DEFAULT_CLASS_PRIORITY = 3

// Proximity is estimated from bounding box area ratio — bigger box = closer.
// Not a precise meter reading, but reliable enough for "stop now" vs "heads up".
export const PROXIMITY_THRESHOLDS = {
  immediate: 0.12, // box > 12% of frame  → ~arm's reach, stop immediately
  close: 0.04,     // box > 4% of frame   → a few steps away, slow down
} as const
