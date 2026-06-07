# Meta_Pame
# 🔒 VIDER Install API @Pame

ระบบติดตั้งส่วนขยาย FastAPI พร้อมรหัสปลดล็อก + สแกนความปลอดภัยอัตโนมัติ  
เวอร์ชั่น 1.4.0 | โดย Rufio244

## ✨ ฟีเจอร์
- **รหัสปลดล็อก**: บังคับใส่ `ปลดล๊อค` ทุกครั้งที่ติดตั้ง
- **สแกนโค้ดเสี่ยง**: ตรวจ `os.system`, `eval()`, `subprocess` ก่อนแตกไฟล์
- **อัปโหลดตรง**: ไม่ต้องหา URL → อัป `.zip` ผ่านหน้า `/docs` ได้เลย
- **ลบ+Backup**: ลบส่วนขยายแล้วย้ายไปโฟลเดอร์ backup อัตโนมัติ
- **บันทึก Log**: เก็บ IP, ประเทศ, แพลตฟอร์มที่เข้ามาใช้งาน

## 🚀 ติดตั้งและรัน
```bash
git clone https://github.com/Rufio244/Meta_Pame.git
cd Meta_Pame
pip install -r requirements.txt
python main.py
