import type { RawDetection } from '../hooks/useObjectDetection'
import {
  filterDetections,
  getBoxAreaRatio,
  getDirection,
  pickPrimaryDetection,
} from './detectionFilters'

// A 1000×1000 frame makes area ratios easy to reason about:
// (w * h) / 1_000_000 is the ratio directly.
const FRAME = 1000

function det(partial: Partial<RawDetection> & { bbox: number[] }): RawDetection {
  return { class: 'person', score: 0.9, ...partial } as RawDetection
}

describe('getBoxAreaRatio', () => {
  it('computes box area as a fraction of the frame', () => {
    // 400 × 350 = 140_000 / 1_000_000 = 0.14
    expect(getBoxAreaRatio([0, 0, 400, 350], FRAME, FRAME)).toBeCloseTo(0.14)
  })
})

describe('getDirection', () => {
  it('classifies a box centered left of 0.35 as "left"', () => {
    // center x = (0 + 200/2) / 1000 = 0.10
    expect(getDirection([0, 0, 200, 0], FRAME)).toBe('left')
  })

  it('classifies a box centered right of 0.65 as "right"', () => {
    // center x = (800 + 200/2) / 1000 = 0.90
    expect(getDirection([800, 0, 200, 0], FRAME)).toBe('right')
  })

  it('classifies a centered box as "ahead"', () => {
    // center x = (400 + 200/2) / 1000 = 0.50
    expect(getDirection([400, 0, 200, 0], FRAME)).toBe('ahead')
  })

  it('treats the exact 0.35 boundary as "ahead" (strict <)', () => {
    // center x = (250 + 200/2) / 1000 = 0.35
    expect(getDirection([250, 0, 200, 0], FRAME)).toBe('ahead')
  })
})

describe('filterDetections', () => {
  it('returns [] when frame dimensions are missing', () => {
    expect(filterDetections([det({ bbox: [0, 0, 400, 400] })], 0, 0)).toEqual([])
  })

  it('drops detections below the confidence threshold', () => {
    const low = det({ score: 0.1, bbox: [0, 0, 400, 400] })
    expect(filterDetections([low], FRAME, FRAME)).toHaveLength(0)
  })

  it('drops classes that are not on the safety allowlist', () => {
    const kite = det({ class: 'kite', bbox: [0, 0, 400, 400] })
    expect(filterDetections([kite], FRAME, FRAME)).toHaveLength(0)
  })

  it('drops boxes smaller than the minimum area ratio', () => {
    // 50 × 100 = 5_000 / 1_000_000 = 0.005 < MIN_BOX_AREA_RATIO (0.01)
    const tiny = det({ bbox: [0, 0, 50, 100] })
    expect(filterDetections([tiny], FRAME, FRAME)).toHaveLength(0)
  })

  it('keeps a valid detection and annotates direction, proximity and area', () => {
    // person, centered, 400 × 350 → ratio 0.14 → immediate, ahead
    const result = filterDetections([det({ bbox: [300, 300, 400, 350] })], FRAME, FRAME)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      class: 'person',
      direction: 'ahead',
      proximity: 'immediate',
    })
    expect(result[0].areaRatio).toBeCloseTo(0.14)
    expect(result[0].alarmScore).toBeGreaterThan(0)
  })

  it('maps area ratios to the correct proximity buckets', () => {
    const immediate = filterDetections([det({ bbox: [300, 300, 400, 350] })], FRAME, FRAME) // 0.14
    const close = filterDetections([det({ bbox: [400, 300, 200, 300] })], FRAME, FRAME) // 0.06
    const approaching = filterDetections([det({ bbox: [450, 300, 100, 100] })], FRAME, FRAME) // 0.01

    expect(immediate[0].proximity).toBe('immediate')
    expect(close[0].proximity).toBe('close')
    expect(approaching[0].proximity).toBe('approaching')
  })
})

describe('pickPrimaryDetection', () => {
  it('returns null when there is nothing to rank', () => {
    expect(pickPrimaryDetection([])).toBeNull()
  })

  it('ranks a large person ahead over a smaller bicycle to the side', () => {
    const detections = filterDetections(
      [
        det({ class: 'person', bbox: [300, 300, 400, 350] }), // 0.14 · 10 · 1.5 = 2.1
        det({ class: 'bicycle', bbox: [0, 300, 200, 300] }), // 0.06 · 8 · 1.0 = 0.48
      ],
      FRAME,
      FRAME
    )
    const primary = pickPrimaryDetection(detections)
    expect(primary?.class).toBe('person')
  })

  it('prefers an object directly ahead over an equal one to the side', () => {
    // Same class and box size; only the 1.5× ahead weight breaks the tie.
    const detections = filterDetections(
      [
        det({ class: 'person', bbox: [350, 300, 300, 300] }), // center 0.50 → ahead
        det({ class: 'person', bbox: [0, 300, 300, 300] }), // center 0.15 → left
      ],
      FRAME,
      FRAME
    )
    const primary = pickPrimaryDetection(detections)
    expect(primary?.direction).toBe('ahead')
  })
})
