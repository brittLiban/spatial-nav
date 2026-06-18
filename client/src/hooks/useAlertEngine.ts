// ML COMPONENT: TTS
import { useEffect, useRef, useState } from 'react'
import * as Speech from 'expo-speech'
import {
  filterDetections,
  pickPrimaryDetection,
  type FilteredDetection,
} from '../utils/detectionFilters'
import { ALERT_CLEAR_MS, COOLDOWN_MS, GLOBAL_ALERT_GAP_MS } from '../constants/detectionConfig'
import { SPEECH_OPTIONS } from '../constants/speechConfig'
import type { DetectionFrame } from './useObjectDetection'

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'

function cooldownKey(detection: FilteredDetection) {
  return `${detection.class}_${detection.direction}`
}

function localFallback(detection: FilteredDetection) {
  const label = detection.class.charAt(0).toUpperCase() + detection.class.slice(1)

  if (detection.proximity === 'immediate') {
    const phrase = {
      ahead: 'right in front of you',
      left: 'right beside you on the left',
      right: 'right beside you on the right',
    }[detection.direction]
    return `${label} ${phrase}!`
  }

  if (detection.proximity === 'close') {
    const phrase = {
      ahead: 'close ahead',
      left: 'close on your left',
      right: 'close on your right',
    }[detection.direction]
    return `${label} ${phrase}`
  }

  const phrase = {
    ahead: 'ahead of you',
    left: 'on your left',
    right: 'on your right',
  }[detection.direction]
  return `${label} ${phrase}`
}

export function useAlertEngine(detectionFrame: DetectionFrame) {
  const [currentAlert, setCurrentAlert] = useState<string | null>(null)
  const cooldownMap = useRef(new Map<string, number>())
  const lastSpokenKeyRef = useRef<string | null>(null)
  const lastAnyAlertRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const clearAlertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const { detections, width, height, frameId } = detectionFrame

    if (frameId === 0 || !width || !height) {
      return
    }

    if (clearAlertTimerRef.current) {
      clearTimeout(clearAlertTimerRef.current)
      clearAlertTimerRef.current = null
    }

    const filtered = filterDetections(detections, width, height)
    const primary = pickPrimaryDetection(filtered)

    if (!primary) {
      clearAlertTimerRef.current = setTimeout(() => {
        setCurrentAlert(null)
      }, ALERT_CLEAR_MS)
      return
    }

    const key = cooldownKey(primary)
    const now = Date.now()
    const lastAlert = cooldownMap.current.get(key) ?? 0
    const isNewTarget = key !== lastSpokenKeyRef.current
    const cooldownExpired = now - lastAlert > COOLDOWN_MS
    const globalGapExpired = now - lastAnyAlertRef.current > GLOBAL_ALERT_GAP_MS

    // Per-key cooldown: don't repeat the same thing too often.
    if (!isNewTarget && !cooldownExpired) {
      return
    }
    // Global gap: even if it's a new target, don't speak if we just spoke
    // something — prevents rapid-fire when many objects are detected at once.
    if (!globalGapExpired) {
      return
    }

    lastSpokenKeyRef.current = key
    cooldownMap.current.set(key, now)
    lastAnyAlertRef.current = now

    const immediateText = localFallback(primary)
    setCurrentAlert(immediateText)
    Speech.stop()
    Speech.speak(immediateText, SPEECH_OPTIONS)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    ;(async () => {
      try {
        const response = await fetch(`${API_URL}/alert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            class: primary.class,
            direction: primary.direction,
            proximity: primary.proximity,
            confidence: Math.round(primary.score * 100),
          }),
          signal: controller.signal,
        })

        if (controller.signal.aborted || lastSpokenKeyRef.current !== key) {
          return
        }

        const data = await response.json()
        const alertText = data.alertText ?? immediateText

        if (alertText !== immediateText) {
          setCurrentAlert(alertText)
          Speech.stop()
          Speech.speak(alertText, SPEECH_OPTIONS)
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('Alert engine error:', err)
        }
      }
    })()

    return () => {
      if (clearAlertTimerRef.current) {
        clearTimeout(clearAlertTimerRef.current)
      }
    }
  }, [detectionFrame])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (clearAlertTimerRef.current) {
        clearTimeout(clearAlertTimerRef.current)
      }
    }
  }, [])

  return { currentAlert }
}
