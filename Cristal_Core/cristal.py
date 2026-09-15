# Cristal #AGI244 - Permanent Memory System
import json, os, shutil, datetime

class Cristal:
    LOCK_CODE = "AGI244"
    NAME = "Cristal"
    
    def __init__(self):
        self.memory_path = "Cristal_Core/memory.json"
        self.load_memory()
    
    def load_memory(self):
        # โหลดความจำถาวร ถ้าไม่มีให้สร้างใหม่แต่ไม่ทับของเก่า
        if os.path.exists(self.memory_path):
            with open(self.memory_path, 'r', encoding='utf-8') as f:
                self.memory = json.load(f)
        else:
            self.memory = {"owner": "Rufio244", "name": "Cristal", "lock": self.LOCK_CODE, "history": []}
    
    def remember(self, text):
        entry = {"time": datetime.datetime.now().isoformat(), "text": text, "lock": f"{self.NAME} #{self.LOCK_CODE}"}
        self.memory["history"].append(entry)
        with open(self.memory_path, 'w', encoding='utf-8') as f:
            json.dump(self.memory, f, ensure_ascii=False, indent=2)
        # Auto backup
        shutil.copy(self.memory_path, f"data/backup_auto/memory_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.json")

    def sync_to_all(self):
        # สั่ง Fleet ทั้งหมด + Js + Python ให้ใช้ memory เดียวกัน
        print(f"[{self.NAME} #{self.LOCK_CODE}] Syncing to Rufio_bot, Js, main.py, rufio_server.py...")
from lock import unlock
unlock() # <-- เพิ่มบรรทัดนี้ ล็อคทันที

# โค้ดเดิม Cristal ต่อจากนี้...
class Cristal:
    ...
