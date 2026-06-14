import * as tf from '@tensorflow/tfjs'
import type { RawDetection } from '../hooks/useObjectDetection'
import { YOLO_LABELS } from './yoloLabels'

const NUM_CLASSES = YOLO_LABELS.length

export async function runYoloDetection(
  imageTensor: tf.Tensor3D,
  model: tf.GraphModel,
  modelWidth: number,
  modelHeight: number,
  minScore: number,
  maxBoxes: number
): Promise<RawDetection[]> {
  tf.engine().startScope()

  try {
    const floatImg = imageTensor.toFloat()
    const [height, width] = floatImg.shape
    const maxSize = Math.max(width, height)
    const imgPadded = floatImg.pad([
      [0, maxSize - height],
      [0, maxSize - width],
      [0, 0],
    ])
    const xRatio = maxSize / width
    const yRatio = maxSize / height

    const input = tf.image
      .resizeBilinear(imgPadded as tf.Tensor3D, [modelHeight, modelWidth])
      .div(255.0)
      .expandDims(0)

    floatImg.dispose()
    imgPadded.dispose()

    const res = model.execute(input) as tf.Tensor
    input.dispose()

    const transRes = res.transpose([0, 2, 1])
    res.dispose()

    const boxes = tf.tidy(() => {
      const boxW = transRes.slice([0, 0, 2], [-1, -1, 1])
      const boxH = transRes.slice([0, 0, 3], [-1, -1, 1])
      const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(boxW, 2))
      const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(boxH, 2))
      return tf
        .concat([y1, x1, tf.add(y1, boxH), tf.add(x1, boxW)], 2)
        .squeeze() as tf.Tensor2D
    })

    const [scores, classes] = tf.tidy(() => {
      const rawScores = transRes.slice([0, 0, 4], [-1, -1, NUM_CLASSES]).squeeze()
      return [rawScores.max(1), rawScores.argMax(1)]
    })

    transRes.dispose()

    const nms = await tf.image.nonMaxSuppressionAsync(
      boxes,
      scores,
      maxBoxes,
      minScore,
      0.45
    )

    const boxesFlat = boxes.gather(nms, 0).dataSync()
    const scoresData = scores.gather(nms, 0).dataSync()
    const classesData = classes.gather(nms, 0).dataSync()

    boxes.dispose()
    scores.dispose()
    classes.dispose()
    nms.dispose()

    const detections: RawDetection[] = []
    for (let i = 0; i < scoresData.length; i++) {
      const y1 = boxesFlat[i * 4] / yRatio
      const x1 = boxesFlat[i * 4 + 1] / xRatio
      const y2 = boxesFlat[i * 4 + 2] / yRatio
      const x2 = boxesFlat[i * 4 + 3] / xRatio

      detections.push({
        class: YOLO_LABELS[classesData[i]] ?? 'unknown',
        score: scoresData[i],
        bbox: [x1, y1, x2 - x1, y2 - y1],
      })
    }

    return detections
  } finally {
    tf.engine().endScope()
  }
}
