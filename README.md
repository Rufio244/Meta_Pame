# Meta_Pame

## Cloudflare Worker

```bash
npm install -g wrangler
npx wrangler deploy
```

ตรวจสอบ Worker:

- `/health`
- `/api/cristal`
- `/api/plugins`
- `/?ถาม=สรุปการดำเนินงาน`

ตั้งค่า AI เฉพาะใน Cloudflare Secret และห้ามใส่คีย์จริงใน Git:

```bash
npx wrangler secret put GROQ_API_KEY
```

## Python API / Colab

ติดตั้งแพ็กเกจจากไฟล์ requirements ที่ชื่อถูกต้องก่อน:

```bash
python -m pip install -r requirements.txt
python main.py
```

ใน Google Colab ให้กำหนด URL ของ Worker แล้วเรียก bridge:

```python
import os
os.environ["WORKER_URL"] = "https://ชื่อ-workerของคุณ.workers.dev"
from colab_bridge import cristal_status, worker_health
print(worker_health())
print(cristal_status())
```

Colab จะเชื่อมต่อได้เมื่อ Worker ถูก deploy และ URL สามารถเข้าถึงจากอินเทอร์เน็ตได้ ส่วน `main.py` เป็น API แยกที่ต้องเปิดรันเอง ไม่ได้เชื่อมอัตโนมัติกับ Colab หรือ Cloudflare จนกว่าจะกำหนด URL ให้ถูกต้อง
