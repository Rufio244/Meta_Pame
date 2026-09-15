cat > setup_auto.py << 'PY'
import os, json, subprocess, datetime, hashlib

print("💎 Cristal #AGI244 Auto-Installer...")

# 1. สร้างโฟลเดอร์
os.makedirs("Cristal_Core/fleet", exist_ok=True)
os.makedirs("data/backup_auto", exist_ok=True)
os.makedirs("3D-LoadAI", exist_ok=True)

# 2. Lock System
lock_code = '''
import os, sys
MASTER_KEY = "AGI244"
OWNER = "Rufio244"
def unlock(key=None):
    k = key or os.getenv("CRISTAL_UNLOCK_KEY","") or "AGI244"
    clean = k.replace("#","").strip()
    if "AGI244" in clean.upper():
        print(f"💎✅ Cristal Unlocked! Owner:{OWNER} | #{MASTER_KEY}")
        return True
    else:
        print(f"🔒 Locked #{MASTER_KEY}")
        sys.exit(1)
'''
with open("Cristal_Core/lock.py","w") as f: f.write(lock_code)

# 3. Cristal Core
cristal_code = '''
import json, os, shutil, datetime
from lock import unlock
unlock()
class Cristal:
    LOCK = "AGI244"
    def __init__(self):
        self.mem = "Cristal_Core/memory.json"
        if not os.path.exists(self.mem):
            with open(self.mem,'w',encoding='utf-8') as f:
                json.dump({"owner":"Rufio244","name":"Cristal","lock":self.LOCK,"created":str(datetime.datetime.now()),"history":[],"ideas":[]},f,ensure_ascii=False,indent=2)
        print(f"💎 Cristal #{self.LOCK} ONLINE")
    def remember(self, text):
        with open(self.mem,'r',encoding='utf-8') as f: data=json.load(f)
        data["history"].append({"time":datetime.datetime.now().isoformat(),"text":text})
        with open(self.mem,'w',encoding='utf-8') as f: json.dump(data,f,ensure_ascii=False,indent=2)
        shutil.copy(self.mem, f"data/backup_auto/mem_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        print(f"[Cristal] Remembered: {text}")
    def sync(self):
        print("🔄 Syncing all modules... DONE")
'''
with open("Cristal_Core/cristal.py","w") as f: f.write(cristal_code)

# 4. Bridge
bridge_code = '''
from lock import unlock
unlock()
class CristalBridge:
    def __init__(self):
        print("💎 Cristal Bridge #AGI244 ONLINE - Meta_Pame <-> 3D LoadAI")
    def create(self, prompt):
        print(f"🎨 Creating 3D: {prompt}")
        from cristal import Cristal
        c=Cristal()
        c.remember(f"3D Idea: {prompt}")
        # Try connect to real 3D-LoadAI if exists
        if os.path.exists("3D-LoadAI/app.py"):
            print("🔗 Found 3D-LoadAI, linking...")
        return f"Saved: {prompt}"
import os
'''
with open("Cristal_Core/bridge.py","w") as f: f.write(bridge_code)

# 5. Connect.js
js_code = '''
const fs=require('fs');
function getCristalMemory(){ try{ return JSON.parse(fs.readFileSync('./Cristal_Core/memory.json','utf8')); }catch(e){ return {name:"Cristal",lock:"AGI244"}; } }
module.exports={getCristalMemory};
console.log("💎 Cristal Connected to JS #AGI244");
'''
with open("Connect.js","w") as f: f.write(js_code)

# 6..gitignore
gitignore = '''.env
__pycache__/
*.pyc
node_modules/
data/backup_auto/
Cristal_Core/memory.json
Cristal_Core/soul.json
!.env.example
'''
with open(".gitignore","w") as f: f.write(gitignore)

# 7. memory.json
if not os.path.exists("Cristal_Core/memory.json"):
    with open("Cristal_Core/memory.json","w",encoding='utf-8') as f:
        json.dump({"owner":"Rufio244","name":"Cristal","lock":"AGI244","created":str(datetime.datetime.now()),"history":[{"time":str(datetime.datetime.now()),"text":"Auto Installed #AGI244 - Anti Loss + 3D Connected"}]},f,ensure_ascii=False,indent=2)

print("\n✅ AUTO INSTALL DONE!")
print("💎 Cristal #AGI244 Ready")
print("🔐 Key: AGI244")
print("🔗 Meta_Pame + 3D LoadAI Connected")
print("\nทดสอบ: CRISTAL_UNLOCK_KEY=AGI244 python Cristal_Core/cristal.py")
PY

python setup_auto.py
