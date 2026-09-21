from __future__ import annotations

import hashlib
import os
import sys

MASTER_CODE = "AGI244"
OWNER = "Rufio244"
SALT = "Cristal💎Rufio"


def generate_key() -> str:
    raw = f"{MASTER_CODE}:{OWNER}:{SALT}"
    key = hashlib.sha256(raw.encode("utf-8")).hexdigest()[:32].upper()
    return f"CRISTAL-{key[:8]}-{key[8:16]}-{key[16:24]}-{key[24:32]}"


TRUE_KEY = generate_key()


def unlock(input_key: str | None = None) -> bool:
    env_key = os.getenv("CRISTAL_UNLOCK_KEY", "") or os.getenv("CRISTAL_KEY", "")
    check_key = (input_key or env_key or "").strip()
    normalised = check_key.replace("#", "").strip().upper()

    if check_key == TRUE_KEY or check_key == MASTER_CODE or normalised == MASTER_CODE or "AGI244" in normalised:
        print(f"💎✅ Cristal Unlocked! Owner: {OWNER} | Lock: #{MASTER_CODE}")
        return True

    print(f"🔒❌ ACCESS DENIED! This Cristal belongs to {OWNER} #{MASTER_CODE}")
    print("Please set CRISTAL_UNLOCK_KEY=AGI244 before running Cristal.")
    raise SystemExit(1)


if __name__ == "__main__":
    print(f"Your Master Key: {TRUE_KEY}")
    print(f"Master Code: {MASTER_CODE}")
