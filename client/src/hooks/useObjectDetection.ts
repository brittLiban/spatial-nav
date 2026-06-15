// ML COMPONENT: Object Detection (server-side YOLO on laptop)
import { useEffect, useRef, useState } from 'react'
import type { CameraView } from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator'
import {
  MIN_CAPTURE_GAP_MS,
  MIN_FRAME_GAP_MS,
  PHOTO_QUALITY,
} from '../constants/detectionConfig'

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'
const CAPTURE_RETRY_DELAY_MS = 800
// Resize to this width before sending — reduces a 4K photo to ~640px, cutting
// payload from ~2 MB to ~40 KB and halving round-trip latency.
const SEND_WIDTH = 640

export type RawDetection = {
  class: string
  score: number
  bbox: [number, number, number, number]
}

export type DetectionFrame = {
  frameId: number
  detections: RawDetection[]
  width: number
  height: number
}

const EMPTY_FRAME: DetectionFrame = {
  frameId: 0,
  detections: [],
  width: 0,
  height: 0,
}

type DetectResponse = {
  width: number
  height: number
  detections: RawDetection[]
  error?: string
}

function isCaptureError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err)
  return message.toLowerCase().includes('could not be captured')
}

async function checkDetectionService(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/health`)
    const data = await res.json()

    if (data.detectService !== 'ok') {
      return 'Detection service offline — on your laptop run: cd server/python && python detect_app.py'
    }

    return null
  } catch {
    return `Cannot reach server at ${API_URL}`
  }
}

async function detectRemote(base64: string): Promise<DetectResponse> {
  const res = await fetch(`${API_URL}/detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error ?? 'Detection request failed')
  }

  return data
}

export function useObjectDetection(
  cameraRef: React.RefObject<CameraView | null>,
  isActive: boolean
) {
  const [frame, setFrame] = useState<DetectionFrame>(EMPTY_FRAME)
  const [detectError, setDetectError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const runningRef = useRef(false)
  const mountedRef = useRef(true)
  const frameIdRef = useRef(0)
  const lastCaptureAtRef = useRef(0)

  useEffect(() => {
    mountedRef.current = true

    checkDetectionService().then((error) => {
      if (!mountedRef.current) return
      setDetectError(error)
      setIsReady(!error)
    })

    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!isActive || !isReady || detectError) {
      runningRef.current = false
      return
    }

    runningRef.current = true
    let cancelled = false

    async function detectionLoop() {
      while (runningRef.current && !cancelled) {
        const loopStart = Date.now()

        if (!cameraRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 200))
          continue
        }

        const sinceLastCapture = Date.now() - lastCaptureAtRef.current
        if (sinceLastCapture < MIN_CAPTURE_GAP_MS) {
          await new Promise((resolve) =>
            setTimeout(resolve, MIN_CAPTURE_GAP_MS - sinceLastCapture)
          )
        }

        try {
          const photo = await cameraRef.current.takePictureAsync({
            base64: false,
            quality: PHOTO_QUALITY,
            shutterSound: false,
          })

          lastCaptureAtRef.current = Date.now()

          if (photo?.uri && mountedRef.current) {
            // Resize to SEND_WIDTH before transmitting — keeps payload small
            const resized = await ImageManipulator.manipulateAsync(
              photo.uri,
              [{ resize: { width: SEND_WIDTH } }],
              { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
            )

            if (!resized.base64 || !mountedRef.current) continue

            const result = await detectRemote(resized.base64)

            const dets = result.detections ?? []
            console.log(
              `[detect] ${result.width}x${result.height}  ${dets.length} raw: ${
                dets.map((d) => `${d.class} ${Math.round(d.score * 100)}%`).join(', ') || 'none'
              }`
            )

            frameIdRef.current += 1
            setFrame({
              frameId: frameIdRef.current,
              detections: dets,
              width: result.width ?? resized.width ?? 0,
              height: result.height ?? resized.height ?? 0,
            })
          }
        } catch (err) {
          if (isCaptureError(err)) {
            console.warn('Capture retry:', err)
            await new Promise((resolve) => setTimeout(resolve, CAPTURE_RETRY_DELAY_MS))
            continue
          }

          console.warn('Detection error:', err)
          if (mountedRef.current) {
            const message =
              err instanceof Error ? err.message : 'Detection request failed'
            setDetectError(message)
            runningRef.current = false
          }
        }

        const elapsed = Date.now() - loopStart
        const waitMs = Math.max(0, MIN_FRAME_GAP_MS - elapsed)
        await new Promise((resolve) => setTimeout(resolve, waitMs))
      }
    }

    detectionLoop()

    return () => {
      cancelled = true
      runningRef.current = false
    }
  }, [isActive, isReady, detectError, cameraRef])

  return { frame, detectError }
}
