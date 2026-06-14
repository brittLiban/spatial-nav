import { StyleSheet, Text, View } from 'react-native'
import { filterDetections, type FilteredDetection } from '../src/utils/detectionFilters'
import { colors, radii } from '../src/theme'
import type { DetectionFrame } from '../src/hooks/useObjectDetection'

interface Props {
  detectionFrame: DetectionFrame
  screenSize: { width: number; height: number }
}

function scaleBox(
  bbox: number[],
  imageSize: { width: number; height: number },
  screenSize: { width: number; height: number }
) {
  const scaleX = screenSize.width / imageSize.width
  const scaleY = screenSize.height / imageSize.height
  const [x, y, w, h] = bbox

  return {
    left: x * scaleX,
    top: y * scaleY,
    width: w * scaleX,
    height: h * scaleY,
  }
}

function directionColor(direction: FilteredDetection['direction']) {
  if (direction === 'left') return colors.left
  if (direction === 'right') return colors.right
  return colors.ahead
}

export default function DetectionOverlay({ detectionFrame, screenSize }: Props) {
  const { detections, width, height } = detectionFrame

  if (!width || !height || !screenSize.width || !screenSize.height) {
    return null
  }

  const filtered = filterDetections(detections, width, height)

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {filtered.map((detection, index) => {
        const box = scaleBox(detection.bbox, { width, height }, screenSize)
        const color = directionColor(detection.direction)

        return (
          <View
            key={`${detection.class}-${index}`}
            style={[
              styles.box,
              {
                left: box.left,
                top: box.top,
                width: box.width,
                height: box.height,
                borderColor: color,
              },
            ]}
          >
            <View style={[styles.label, { backgroundColor: color }]}>
              <Text style={styles.labelText}>
                {detection.class} {Math.round(detection.score * 100)}% · {detection.direction}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: radii.sm,
  },
  label: {
    position: 'absolute',
    top: -24,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  labelText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
})
