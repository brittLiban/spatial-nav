"""YOLOv8 detection service — run alongside the Node server."""
import base64
import io
import os

from fastapi import FastAPI, HTTPException
from PIL import Image, ImageOps
from pydantic import BaseModel
from ultralytics import YOLO
import uvicorn

app = FastAPI()
model = YOLO(os.environ.get("YOLO_MODEL", "yolov8s.pt"))
MIN_CONF = float(os.environ.get("YOLO_MIN_CONF", "0.20"))


class DetectRequest(BaseModel):
    image: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/detect")
def detect(req: DetectRequest):
    try:
        img_bytes = base64.b64decode(req.image)
        # exif_transpose applies the EXIF rotation flag before inference —
        # iOS photos are landscape pixels with a "rotate 90°" EXIF tag, so
        # without this YOLO sees a sideways image every time.
        img = ImageOps.exif_transpose(Image.open(io.BytesIO(img_bytes)).convert("RGB"))
        width, height = img.size

        results = model(img, verbose=False, conf=MIN_CONF)[0]
        detections = []

        for box in results.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            cls_id = int(box.cls[0])
            detections.append(
                {
                    "class": results.names[cls_id],
                    "score": float(box.conf[0]),
                    "bbox": [x1, y1, x2 - x1, y2 - y1],
                }
            )

        print(
            f"[detect] {width}x{height}  {len(detections)} detections"
            + (
                f": {', '.join(f'{d[\"class\"]} {d[\"score\"]:.2f}' for d in detections)}"
                if detections
                else ""
            ),
            flush=True,
        )

        return {"width": width, "height": height, "detections": detections}
    except Exception as err:
        print(f"[detect] ERROR: {err}", flush=True)
        raise HTTPException(status_code=400, detail=str(err)) from err


if __name__ == "__main__":
    port = int(os.environ.get("DETECT_PORT", "3002"))
    uvicorn.run(app, host="0.0.0.0", port=port)
