export const MIN_FRAME_GAP_MS = 400
export const MIN_CAPTURE_GAP_MS = 700
export const CAMERA_WARMUP_MS = 600
export const MIN_CONFIDENCE = 0.4
export const MIN_BOX_AREA_RATIO = 0.015
export const LEFT_THRESHOLD = 0.35
export const RIGHT_THRESHOLD = 0.65
export const COOLDOWN_MS = 2500
export const ALERT_CLEAR_MS = 1200
export const PHOTO_QUALITY = 0.25

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
