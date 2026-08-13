# ==============================================
# ฟีเจอร์เพิ่ม: อัปโหลดไฟล์ + ลบส่วนขยาย
# ==============================================
from fastapi import UploadFile, File, Form

class UploadInstallRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    version: str = "latest"
    expected_hash: Optional[str] = None

@app.post("/upload/extension", summary="อัปโหลดไฟล์ zip แล้วติดตั้งทันที")
async def upload_extension(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(""),
    version: str = Form("latest"),
    expected_hash: Optional[str] = Form(None),
    access: Dict = Depends(verify_access)
):
    ext_id = f"ext_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
    temp_file = f"{DOWNLOAD_DIR}/{ext_id}.zip"
    install_path = f"{INSTALLED_DIR}/{ext_id}"

    try:
        # เซฟไฟล์ที่อัปโหลด
        content = await file.read()
        if len(content) > 50 * 1024 * 1024:
            raise HTTPException(400, detail="ไฟล์ใหญ่เกิน 50MB")
        with open(temp_file, "wb") as f:
            f.write(content)

        file_hash = calculate_file_hash(temp_file)

        # ตรวจแฮช
        if expected_hash and file_hash!= expected_hash:
            shutil.move(temp_file, f"{QUARANTINE_DIR}/{ext_id}.zip")
            raise HTTPException(400, detail=f"แฮชไม่ตรง ไฟล์ถูกกักกัน")

        # สแกนความปลอดภัย
        security = scan_code_security(temp_file)
        if not security["safe"]:
            shutil.move(temp_file, f"{QUARANTINE_DIR}/{ext_id}.zip")
            raise HTTPException(400, detail=f"เสี่ยงระดับ {security['risk_level']}: {security['issues']}")

        # ติดตั้ง
        os.makedirs(install_path,if to​ ADD APi​ Install​ @Pame, exist_ok=True)
        
        if not extract_package(temp_file, install_path):
            raise HTTPException(500, detail="แตกไฟล์ไม่ได้")

        # บันทึก
        extension_info = {
            "id": ext_id,
            "name": name,
            "description": description,
            "version": version,
            "install_date": datetime.now().isoformat(),
            "source_url": "uploaded",
            "file_hash": file_hash,
            "security_score": security["score"],
            "risk_level": security["risk_level"],
            "installed_by_ip": access["ip"]
        }
        INSTALLED_EXTENSIONS[ext_id] = extension_info
        os.remove(temp_file)

        return {
            "status": "success",
            "message": "อัปโหลดและติดตั้งสำเร็จ",
            "extension": extension_info
        }
    except Exception as e:
        if os.path.exists(temp_file):
            os.remove(temp_file)
        if os.path.exists(install_path):
            shutil.rmtree(install_path)
        raise HTTPException(400, detail=str(e))

@app.delete("/extensions/{ext_id}", summary="ลบส่วนขยาย")
async def delete_extension(ext_id: str, access: Dict = Depends(verify_access)):
    if ext_id not in INSTALLED_EXTENSIONS:
        raise HTTPException(404, detail="ไม่พบส่วนขยายนี้")

    install_path = f"{INSTALLED_DIR}/{ext_id}"
    ext_info = INSTALLED_EXTENSIONS[ext_id]

    try:
        # ย้ายไป backup ก่อนลบ เผื่อป๋าจะกู้
        backup_path = f"{BACKUP_DIR}/{ext_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        if os.path.exists(install_path):
            shutil.move(install_path, backup_path)

        # ลบออกจากระบบ
        del INSTALLED_EXTENSIONS[ext_id]

        return {
            "status": "success",
            "message": f"ลบ {ext_info['name']} สำเร็จ ย้ายไป backup แล้ว",
            "backup_path": backup_path
        }
    except Exception as e:
        raise HTTPException(500, detail=f"ลบไม่สำเร็จ: {str(e)}")
import requests
from datetime import datetime

# ========== ใส่ของบอสตรงนี้ครั้งเดียว ==========
PAGE_ACCESS_TOKEN = "PASTE_PAGE_TOKEN_HERE"
PAGE_ID = "PASTE_PAGE_ID_HERE"
LINE_TOKEN = "PASTE_LINE_TOKEN_HERE"

def งานหลัก(request):
    """Cloud Function จะเรียกฟังก์ชั่นนี้ทุก 10 นาที"""
    print(f"[{datetime.now()}] AGI เริ่มทำงาน")
    
    # 1. ดึงเม้น
    เม้นทั้งหมด = ดึงคอมเม้น()
    
    # 2. ตอบกลับ
    นับ = 0
    for เม้น in เม้นทั้งหมด[:3]:
        คำตอบ = f"ขอบคุณครับ 🙏 เดี๋ยวแอดมินมาตอบให้นะครับ"
        ตอบกลับคอมเม้น(เม้น['id'], คำตอบ)
        นับ += 1
    
    # 3. แจ้งไลน์
    แจ้งไลน์(f"AGI ทำงานแล้ว: ตอบไป {นับ} เม้น")
    
    return f"Success: ตอบไป {นับ} เม้น"

def ดึงคอมเม้น():
  try:
    url = f"https://graph.facebook.com/v20.0/{PAGE_ID}/comments"
    params = {"access_token": PAGE_ACCESS_TOKEN, "fields": "id,message"}
    res = requests.get(url, params=params).json()
    return res.get('data',[])
  except: return []

def ตอบกลับคอมเม้น(comment_id, ข้อความ):
  url = f"https://graph.facebook.com/v20.0/{comment_id}/comments"
  data = {"message": ข้อความ, "access_token": PAGE_ACCESS_TOKEN}
  requests.post(url, data=data)

def แจ้งไลน์(ข้อความ):
  requests.post("https://notify-api.line.me/api/notify",
    headers={"Authorization": f"Bearer {LINE_TOKEN}"},
    data={"message": ข้อความ})
    ​import requests
import os
import re
from datetime import datetime

# ========== อ่านจาก Secret ใน Cloud ==========
PAGE_ACCESS_TOKEN = os.environ.get("PAGE_ACCESS_TOKEN")
PAGE_ID = os.environ.get("PAGE_ID")
LINE_TOKEN = os.environ.get("LINE_TOKEN")

def งานหลัก(request):
    """Cloud Function: รันทุก 10 นาที"""
    print(f"[{datetime.now()}] AGI สมอง_5ชั้น เริ่มทำงาน")
    
    เม้นทั้งหมด = ดึงคอมเม้น()
    นับ = 0
    for เม้น in เม้นทั้งหมด[:5]:
        ข้อความ = เม้น.get('message','')
        if "ขอบคุณ" not in ข้อความ: # กันตอบซ้ำ
            
            # ========== ใช้สมองใหม่วิเคราะห์ก่อนตอบ ==========
            คำตอบ = สมอง_5ชั้น(ข้อความ)
            
            ตอบกลับคอมเม้น(เม้น['id'], คำตอบ)
            นับ += 1
    
    แจ้งไลน์(f"✅ AGI v2.0 ทำงาน: วิเคราะห์และตอบไป {นับ} เม้น")
    return f"Success: {นับ} comments"

# ========== อัลกอริทึมใหม่ 5 ชั้น ==========
def สมอง_5ชั้น(ข้อความ):
    
    # ชั้น 1: แยกแยะ - แกะคำสำคัญ
    คำสำคัญ = แยกคำสำคัญ(ข้อความ)
    
    # ชั้น 2: วิเคราะห์ - จับอารมณ์ + เจตนา
    อารมณ์ = จับอารมณ์(ข้อความ)
    เจตนา = จับเจตนา(คำสำคัญ)
    
    # ชั้น 3: ประมวลผล - หาข้อมูลในระบบ
    ข้อมูล = หาข้อมูลในระบบ(คำสำคัญ)
    
    # ชั้น 4: สันนิษฐาน - ถ้าข้อมูลไม่มี
    if ข้อมูล:
        คำตอบ = สร้างคำตอบ(ข้อมูล, อารมณ์, เจตนา)
    else:
        คำตอบ = สันนิษฐานคำตอบ(เจตนา, อารมณ์, คำสำคัญ)
    
    # ชั้น 5: ตรวจสอบ - ก่อนส่ง
    return ตรวจความสุภาพ(คำตอบ)

# ========== ฟังก์ชั่นย่อยของสมอง ==========
def แยกคำสำคัญ(ข้อความ):
    คำ = re.findall(r'\w+', ข้อความ)
    keyword = ['เล่ม', 'ออก', 'เมื่อไหร่', 'ราคา', 'ซื้อ', 'สนุก', 'เบื่อ']
    return [k for k in คำ if any(x in k for x in keyword)]

def จับอารมณ์(ข้อความ):
    if any(x in ข้อความ for x in ['เบื่อ','เมื่อไหร่','ช้า']): return "น้อยใจ"
    if any(x in ข้อความ for x in ['สนุก','ชอบ','ดี']): return "ดีใจ"
    if any(x in ข้อความ for x in ['ราคา','ซื้อ','ที่ไหน']): return "อยากซื้อ"
    return "ทั่วไป"

def จับเจตนา(คำสำคัญ):
    if any(x in คำสำคัญ for x in ['เมื่อไหร่','ออก']): return "ถามความคืบหน้า"
    if any(x in คำสำคัญ for x in ['ราคา','ซื้อ']): return "จะซื้อ"
    return "พูดคุย"

def หาข้อมูลในระบบ(คำสำคัญ):
    # ตรงนี้ต่อไปบอสเอาไปต่อ DB ได้
    if 'เล่ม3' in str(คำสำคัญ): 
        return {"สถานะ": "เขียน 70%", "คาดว่า": "Q4 2026"}
    return None

def สร้างคำตอบ(ข้อมูล, อารมณ์, เจตนา):
    if เจตนา == "ถามความคืบหน้า":
        return f"เข้าใจความรู้สึกเลยครับ 🙏 ตอนนี้{ข้อมูล['สถานะ']}แล้ว คาดว่า{ข้อมูล['คาดว่า']}ได้อ่านแน่นอนครับ ขอบคุณที่รอนะครับ"
    return "ขอบคุณสำหรับคอมเม้นครับ 🙏"

def สันนิษฐานคำตอบ(เจตนา, อารมณ์, คำสำคัญ):
    if อารมณ์ == "น้อยใจ":
        return f"ขอโทษที่ให้รอนานนะครับ 🙇 ตอนนี้กำลังเร่งให้อยู่เลย ฝากติดตามเพจไว้นะครับ มีอัปเดตจะรีบแจ้งทันที"
    if เจตนา == "จะซื้อ":
        return "ทัก Inbox มาได้เลยครับ เดี๋ยวแอดมินส่งรายละเอียดให้ครับ 😊"
    return "ขอบคุณมากๆครับที่แวะมาคุยกัน 🙏"

def ตรวจความสุภาพ(คำตอบ):
    return คำตอบ # ตรงนี้ต่อไปใส่ AI ตรวจคำหยาบได้

# ========== ฟังก์ชั่นเดิม ==========
def ดึงคอมเม้น():
  try:
    url = f"https://graph.facebook.com/v20.0/{PAGE_ID}/comments"
    params = {"access_token": PAGE_ACCESS_TOKEN, "fields": "id,message"}
    res = requests.get(url, params=params).json()
    return res.get('data',[])
  except: return []

def ตอบกลับคอมเม้น(comment_id, ข้อความ):
  url = f"https://graph.facebook.com/v20.0/{comment_id}/comments"
  data = {"message": ข้อความ, "access_token": PAGE_ACCESS_TOKEN}
  requests.post(url, data=data)

def แจ้งไลน์(ข้อความ):
  if LINE_TOKEN:
    requests.post("https://notify-api.line.me/api/notify",
      headers={"Authorization": f"Bearer {LINE_TOKEN}"},
      data={"message": ข้อความ})
