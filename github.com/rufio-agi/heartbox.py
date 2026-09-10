import os, json, time, schedule, base64, io
from datetime import datetime
from dotenv import load_dotenv
from github import Github
import pytesseract
from PIL import Image
import pyautogui
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

load_dotenv()

# --- CONFIG ---
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_NAME = os.getenv("GITHUB_REPO")
DRIVE_FOLDER_ID = os.getenv("DRIVE_FOLDER_ID")
SERVICE_JSON = json.loads(os.getenv("GOOGLE_SERVICE_JSON"))

g = Github(GITHUB_TOKEN)
repo = g.get_repo(REPO_NAME)

def report(status, detail):
    msg = f"[{datetime.now()}] #sum STATUS: {status} | {detail}"
    print(msg)
    # เก็บ log ขึ้น github
    try:
        log_path = "data/log.txt"
        content = repo.get_contents(log_path).decoded_content.decode()
        repo.update_file(log_path, "update log", content + "\n" + msg, repo.get_contents(log_path).sha)
    except:
        repo.create_file(log_path, "create log", msg)

def upload_to_drive(file_bytes, filename):
    creds = Credentials.from_service_account_info(SERVICE_JSON, scopes=['https://www.googleapis.com/auth/drive.file'])
    service = build('drive', 'v3', credentials=creds)
    file_metadata = {'name': filename, 'parents': [DRIVE_FOLDER_ID]}
    media = MediaIoBaseUpload(io.BytesIO(file_bytes), mimetype='image/png')
    file = service.files().create(body=file_metadata, media_body=media, fields='id,webViewLink').execute()
    return file['webViewLink']

def process_file(file_content, filename):
    report("กำลังทำงาน", f"เริ่มประมวลผล {filename}")

    # 1. OCR
    image = Image.open(io.BytesIO(file_content))
    text = pytesseract.image_to_string(image, lang='tha+eng')

    # 2. Auto Click AI
    steps = []
    if "upload" in text.lower() or "อัปโหลด" in text: steps.append((500,300))
    if "submit" in text.lower() or "ส่ง" in text: steps.append((700,500))
    for i, (x,y) in enumerate(steps):
        time.sleep(2)
        pyautogui.click(x=x, y=y)

    # 3. บันทึกผลลง data/ocr_jobs.json
    job = {"file": filename, "result": text, "status": "done", "time": str(datetime.now())}
    try:
        data_file = repo.get_contents("data/ocr_jobs.json")
        data = json.loads(data_file.decoded_content)
        data.append(job)
        repo.update_file("data/ocr_jobs.json", "update job", json.dumps(data, ensure_ascii=False, indent=2), data_file.sha)
    except:
        repo.create_file("data/ocr_jobs.json", "create job", json.dumps([job], ensure_ascii=False, indent=2))

    # 4. อัปโหลดเข้า Google Drive
    link = upload_to_drive(file_content, filename)

    # 5. ย้ายไฟล์ไป /done/
    repo.create_file(f"done/{filename}", "done", file_content)
    repo.delete_file(f"input/{filename}", "processed", repo.get_contents(f"input/{filename}").sha)

    report("เสร็จสิ้น", f"{filename} → Drive: {link}")

def run_auto():
    try:
        files = repo.get_contents("input")
        for f in files:
            content = f.decoded_content
            process_file(content, f.name)
    except Exception as e:
        report("ล้มเหลว", str(e))

# ตั้งเวลาเช็คทุก 1 นาที
schedule.every(1).minutes.do(run_auto)
report("ระบบเริ่ม", "Heart Box กำลังทำงานบน Colab 24 ชม.")

while True:
    schedule.run_pending()
    time.sleep(5)
