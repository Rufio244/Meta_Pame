from __future__ import annotations

import os
import time
from typing import Any

import requests


def _worker_url(path: str) -> str:
    base_url = os.getenv("WORKER_URL", "").strip().rstrip("/")
    if not base_url:
        raise RuntimeError("กรุณากำหนด WORKER_URL ก่อนใช้งาน เช่น https://your-worker.workers.dev")
    return f"{base_url}/{path.lstrip('/')}"


def _get(path: str, timeout: float = 10.0) -> Any:
    response = requests.get(_worker_url(path), timeout=timeout)
    response.raise_for_status()
    return response.json()


def worker_health(timeout: float = 10.0) -> dict:
    return _get("health", timeout)


def cristal_status(timeout: float = 10.0) -> dict:
    return _get("api/cristal", timeout)


def plugins(timeout: float = 10.0) -> dict:
    return _get("api/plugins", timeout)


def watch(interval_seconds: int = 300) -> None:
    previous = None
    while True:
        current = cristal_status()
        if current != previous:
            print("CRISTAL updated:")
            print(current)
            previous = current
        time.sleep(interval_seconds)


if __name__ == "__main__":
    print(worker_health())
    print(cristal_status())
