import type { RawDetection } from '../hooks/useObjectDetection'
import {
  LEFT_THRESHOLD,
  MIN_BOX_AREA_RATIO,
  MIN_CONFIDENCE,
  RELEVANT_CLASSES,
  RIGHT_THRESHOLD,
} from '../constants/detectionConfig'

export type FilteredDetection = {
  class: string
  score: number
  direction: 'left' | 'right' | 'ahead'
  bbox: number[]
  areaRatio: number
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

  // Rear camera: image left = user's right, image right = user's left.
  if (centerRatio < LEFT_THRESHOLD) {
    return 'right'
  }
  if (centerRatio > RIGHT_THRESHOLD) {
    return 'left'
  }
  return 'ahead'
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
    .map((prediction) => ({
      class: prediction.class,
      score: prediction.score,
      direction: getDirection(prediction.bbox, frameWidth),
      bbox: prediction.bbox,
      areaRatio: getBoxAreaRatio(prediction.bbox, frameWidth, frameHeight),
    }))
}

export function pickPrimaryDetection(
  filtered: FilteredDetection[]
): FilteredDetection | null {
  if (filtered.length === 0) {
    return null
  }

  return [...filtered].sort((a, b) => b.areaRatio - a.areaRatio)[0]
}
