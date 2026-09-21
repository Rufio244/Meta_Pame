from __future__ import annotations

import datetime as _dt
import json
import os
import shutil
from typing import Any

try:
    from Cristal_Core.Lock import unlock
except ImportError:  # pragma: no cover - fallback for direct execution
    try:
        from .Lock import unlock
    except ImportError:  # pragma: no cover - direct script fallback
        import importlib.util

        lock_path = os.path.join(os.path.dirname(__file__), "Lock.py")
        spec = importlib.util.spec_from_file_location("cristal_lock", lock_path)
        if spec is None or spec.loader is None:
            raise ImportError("Unable to load Cristal lock module")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        unlock = module.unlock


unlock()


class Cristal:
    LOCK_CODE = "AGI244"
    NAME = "Cristal"

    def __init__(self):
        self.memory_path = os.path.join(os.path.dirname(__file__), "memory.json")
        self.load_memory()

    def load_memory(self) -> None:
        if os.path.exists(self.memory_path):
            with open(self.memory_path, "r", encoding="utf-8") as handle:
                self.memory = json.load(handle)
        else:
            self.memory = {
                "owner": "Rufio244",
                "name": "Cristal",
                "lock": self.LOCK_CODE,
                "history": [],
            }

    def remember(self, text: str) -> None:
        entry = {
            "time": _dt.datetime.now().isoformat(),
            "text": text,
            "lock": f"{self.NAME} #{self.LOCK_CODE}",
        }
        self.memory.setdefault("history", []).append(entry)
        with open(self.memory_path, "w", encoding="utf-8") as handle:
            json.dump(self.memory, handle, ensure_ascii=False, indent=2)

        backup_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "backup_auto")
        os.makedirs(backup_dir, exist_ok=True)
        backup_path = os.path.join(
            backup_dir,
            f"memory_{_dt.datetime.now().strftime('%Y%m%d_%H%M')}.json",
        )
        shutil.copy(self.memory_path, backup_path)

    def sync_to_all(self) -> None:
        print(f"[{self.NAME} #{self.LOCK_CODE}] Syncing to Rufio_bot, Js, main.py, rufio_server.py...")


if __name__ == "__main__":
    crystal = Cristal()
    crystal.remember("Startup check")
    crystal.sync_to_all()
    print("💎 Cristal ready")
