from __future__ import annotations

import os
import requests


def _url(path: str) -> str:
    return f"{os.environ['WORKER_URL'].rstrip('/')}/{path.lstrip('/')}"


def cristal_status(timeout: float = 10.0) -> dict:
    response = requests.get(_url("api/cristal"), timeout=timeout)
    response.raise_for_status()
    return response.json()


def worker_health(timeout: float = 10.0) -> dict:
    response = requests.get(_url("health"), timeout=timeout)
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    print(cristal_status())
