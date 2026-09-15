# Cristal_Core/lock.py - Anti-Theft Lock #AGI244
import hashlib, os, sys

MASTER_CODE = "AGI244"
OWNER = "Rufio244"
SALT = "Cristal💎Rufio"

def generate_key():
    raw = f"{MASTER_CODE}:{OWNER}:{SALT}"
    key = hashlib.sha256(raw.encode()).hexdigest()[:32].upper()
    return f"CRISTAL-{key[:8]}-{key[8:16]}-{key[16:24]}-{key[24:32]}"

TRUE_KEY = generate_key()  # คีย์จริง มีแค่ลูกพี่รู้

def unlock(input_key=None):
    # ดึงคีย์จาก .env ก่อน
    env_key = os.getenv("CRISTAL_UNLOCK_KEY", "")
    check_key = input_key or env_key
    
    if check_key == TRUE_KEY or check_key == MASTER_CODE:
        print(f"💎✅ Cristal Unlocked! Owner: {OWNER} | Lock: #{MASTER_CODE}")
        return True
    else:
        print(f"🔒❌ ACCESS DENIED! This Cristal belongs to {OWNER} #{MASTER_CODE}")
        print("Please set CRISTAL_UNLOCK_KEY in .env")
        sys.exit(1)

if __name__ == "__main__":
    print(f"Your Master Key: {TRUE_KEY}")
    print(f"Master Code: {MASTER_CODE}")
# Cristal_Core/lock.py - FINAL LOCK #AGI244
import os, sys

MASTER_KEY = "AGI244"
OWNER = "Rufio244"

def unlock(key=None):
    k = key or os.getenv("CRISTAL_UNLOCK_KEY", "") or os.getenv("CRISTAL_KEY", "")
    # รับทั้ง AGI244 / #AGI244 / CRISTAL-XXXX
    clean = k.replace("#","").replace("CRISTAL-","").strip()
    
    if clean == "AGI244" or "AGI244" in k or k == MASTER_KEY:
        print(f"💎✅ Cristal Unlocked! Owner:{OWNER} | #{MASTER_KEY}")
        return True
    else:
        print(f"🔒 Cristal Locked #{MASTER_KEY} | Owner:{OWNER}")
        print(f"🔑 Use: CRISTAL_UNLOCK_KEY=AGI244 python Cristal_Core/cristal.py")
        sys.exit(1)
