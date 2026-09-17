from __future__ import annotations

import hashlib
import json
import os
import shutil
import tempfile
import uuid
from datetime import datetime, timezone
from pathlib import Path
from zipfile import BadZipFile, ZipFile

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DOWNLOAD_DIR = DATA_DIR / "downloads"
INSTALLED_DIR = DATA_DIR / "installed"
QUARANTINE_DIR = DATA_DIR / "quarantine"
BACKUP_DIR = DATA_DIR / "backup"
REGISTRY_FILE = DATA_DIR / "extensions.json"
for directory in (DOWNLOAD_DIR, INSTALLED_DIR, QUARANTINE_DIR, BACKUP_DIR):
    directory.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Meta_Pame API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_registry() -> dict:
    try:
        return json.loads(REGISTRY_FILE.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_registry(registry: dict) -> None:
    temp = REGISTRY_FILE.with_suffix(".tmp")
    temp.write_text(json.dumps(registry, ensure_ascii=False, indent=2), encoding="utf-8")
    temp.replace(REGISTRY_FILE)


def file_hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def safe_extract(archive: Path, destination: Path) -> None:
    destination = destination.resolve()
    with ZipFile(archive) as zip_file:
        for member in zip_file.infolist():
            target = (destination / member.filename).resolve()
            if target != destination and destination not in target.parents:
                raise ValueError("พบ path อันตรายในไฟล์ ZIP")
        zip_file.extractall(destination)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "Meta_Pame", "time": datetime.now(timezone.utc).isoformat()}


@app.get("/extensions")
def list_extensions() -> dict:
    return {"extensions": list(load_registry().values())}


@app.post("/upload/extension")
async def upload_extension(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(""),
    version: str = Form("latest"),
    expected_hash: str | None = Form(None),
):
    if not file.filename or not file.filename.lower().endswith(".zip"):
        raise HTTPException(400, "รองรับเฉพาะไฟล์ .zip")

    extension_id = f"ext_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
    archive = DOWNLOAD_DIR / f"{extension_id}.zip"
    install_path = INSTALLED_DIR / extension_id
    try:
        content = await file.read()
        if len(content) > 50 * 1024 * 1024:
            raise HTTPException(413, "ไฟล์ใหญ่เกิน 50MB")
        archive.write_bytes(content)
        digest = file_hash(archive)
        if expected_hash and digest.lower() != expected_hash.strip().lower():
            shutil.move(str(archive), QUARANTINE_DIR / archive.name)
            raise HTTPException(400, "SHA-256 ไม่ตรงกัน")
        try:
            with ZipFile(archive) as zip_file:
                if any(member.filename.endswith("/") is False for member in zip_file.infolist()):
                    pass
        except BadZipFile as exc:
            raise HTTPException(400, "ไฟล์ ZIP ไม่ถูกต้อง") from exc
        install_path.mkdir(parents=True)
        safe_extract(archive, install_path)
        info = {
            "id": extension_id,
            "name": name,
            "description": description,
            "version": version,
            "install_date": datetime.now(timezone.utc).isoformat(),
            "file_hash": digest,
        }
        registry = load_registry()
        registry[extension_id] = info
        save_registry(registry)
        return {"status": "success", "extension": info}
    except HTTPException:
        if install_path.exists():
            shutil.rmtree(install_path, ignore_errors=True)
        raise
    except Exception as exc:
        if install_path.exists():
            shutil.rmtree(install_path, ignore_errors=True)
        raise HTTPException(400, f"ติดตั้งไม่สำเร็จ: {exc}") from exc
    finally:
        archive.unlink(missing_ok=True)


@app.delete("/extensions/{extension_id}")
def delete_extension(extension_id: str):
    registry = load_registry()
    info = registry.get(extension_id)
    if not info:
        raise HTTPException(404, "ไม่พบส่วนขยายนี้")
    install_path = INSTALLED_DIR / extension_id
    backup_path = BACKUP_DIR / f"{extension_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    if install_path.exists():
        shutil.move(str(install_path), backup_path)
    del registry[extension_id]
    save_registry(registry)
    return {"status": "success", "backup_path": str(backup_path)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
