"""YOLOv8 detection service — run alongside the Node server."""
import base64
import io
import os

from fastapi import FastAPI, HTTPException
from PIL import Image
from pydantic import BaseModel
from ultralytics import YOLO
import uvicorn

app = FastAPI()
model = YOLO(os.environ.get("YOLO_MODEL", "yolov8n.pt"))
MIN_CONF = float(os.environ.get("YOLO_MIN_CONF", "0.35"))


class DetectRequest(BaseModel):
    image: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/detect")
def detect(req: DetectRequest):
    try:
        img_bytes = base64.b64decode(req.image)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
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

        return {"width": width, "height": height, "detections": detections}
    except Exception as err:
        raise HTTPException(status_code=400, detail=str(err)) from err


if __name__ == "__main__":
    port = int(os.environ.get("DETECT_PORT", "3002"))
    uvicorn.run(app, host="0.0.0.0", port=port)
