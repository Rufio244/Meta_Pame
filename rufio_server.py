from __future__ import annotations

import os
from pathlib import Path
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename

app = Flask(__name__)
BRAIN_DIR = Path(os.getenv("BRAIN_DIR", "brains"))
MEMORY_FILE = Path(os.getenv("MEMORY_FILE", "rufio_memory.json"))
BRAIN_DIR.mkdir(parents=True, exist_ok=True)


@app.get("/health")
def health():
    return jsonify(status="ok", service="rufio-server")


@app.post("/brain/update")
def update_brain():
    uploaded = request.files.get("brain_file")
    if uploaded is None or not uploaded.filename:
        return jsonify(status="error", message="ต้องส่งฟิลด์ brain_file"), 400
    filename = secure_filename(uploaded.filename)
    if not filename:
        return jsonify(status="error", message="ชื่อไฟล์ไม่ถูกต้อง"), 400
    uploaded.save(BRAIN_DIR / filename)
    with MEMORY_FILE.open("a", encoding="utf-8") as memory:
        memory.write(f"{filename}\n")
    return jsonify(status="success", message="อัปเดตความสามารถใหม่เรียบร้อย", filename=filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
