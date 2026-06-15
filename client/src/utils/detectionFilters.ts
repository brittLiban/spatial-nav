import type { RawDetection } from '../hooks/useObjectDetection'
import {
  CLASS_PRIORITY,
  DEFAULT_CLASS_PRIORITY,
  LEFT_THRESHOLD,
  MIN_BOX_AREA_RATIO,
  MIN_CONFIDENCE,
  PROXIMITY_THRESHOLDS,
  RELEVANT_CLASSES,
  RIGHT_THRESHOLD,
} from '../constants/detectionConfig'

export type Proximity = 'immediate' | 'close' | 'approaching'

export type FilteredDetection = {
  class: string
  score: number
  direction: 'left' | 'right' | 'ahead'
  proximity: Proximity
  bbox: number[]
  areaRatio: number
  alarmScore: number
}

// Things directly ahead are 1.5× more urgent than things to the side.
const DIRECTION_WEIGHT: Record<FilteredDetection['direction'], number> = {
  ahead: 1.5,
  left: 1.0,
  right: 1.0,
}

export function getBoxAreaRatio(bbox: number[], frameWidth: number, frameHeight: number) {
  const [, , w, h] = bbox
  return (w * h) / (frameWidth * frameHeight)
}

export function getDirection(
  bbox: number[],
  frameWidth: number
): FilteredDetection['direction'] {
  const [x, , w] = bbox
  const centerRatio = (x + w / 2) / frameWidth

  if (centerRatio < LEFT_THRESHOLD) {
    return 'left'
  }
  if (centerRatio > RIGHT_THRESHOLD) {
    return 'right'
  }
  return 'ahead'
}

function getProximity(areaRatio: number): Proximity {
  if (areaRatio >= PROXIMITY_THRESHOLDS.immediate) return 'immediate'
  if (areaRatio >= PROXIMITY_THRESHOLDS.close) return 'close'
  return 'approaching'
}

function computeAlarmScore(
  detection: Omit<FilteredDetection, 'alarmScore'>
): number {
  const priority = CLASS_PRIORITY[detection.class] ?? DEFAULT_CLASS_PRIORITY
  return detection.areaRatio * priority * DIRECTION_WEIGHT[detection.direction]
}

export function filterDetections(
  predictions: RawDetection[],
  frameWidth: number,
  frameHeight: number
): FilteredDetection[] {
  if (!frameWidth || !frameHeight) {
    return []
  }

  return predictions
    .filter((prediction) => {
      if (prediction.score < MIN_CONFIDENCE) {
        return false
      }

      if (!RELEVANT_CLASSES.includes(prediction.class as (typeof RELEVANT_CLASSES)[number])) {
        return false
      }

      return getBoxAreaRatio(prediction.bbox, frameWidth, frameHeight) >= MIN_BOX_AREA_RATIO
    })
    .map((prediction) => {
      const direction = getDirection(prediction.bbox, frameWidth)
      const areaRatio = getBoxAreaRatio(prediction.bbox, frameWidth, frameHeight)
      const proximity = getProximity(areaRatio)
      const base = {
        class: prediction.class,
        score: prediction.score,
        direction,
        proximity,
        bbox: prediction.bbox,
        areaRatio,
      }
      return { ...base, alarmScore: computeAlarmScore(base) }
    })
}

export function pickPrimaryDetection(
  filtered: FilteredDetection[]
): FilteredDetection | null {
  if (filtered.length === 0) {
    return null
  }

  // Highest alarm score wins: class danger × proximity (area) × direction weight
  return [...filtered].sort((a, b) => b.alarmScore - a.alarmScore)[0]
}
