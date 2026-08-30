import json, os, datetime, time
import google.generativeai as genai
from googleapiclient.discovery import build
import schedule

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")

if not GEMINI_API_KEY or not YOUTUBE_API_KEY:
    print("ERROR: ลืมใส่ Key ใน Secrets")
    exit()

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-flash')
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

memory_file = "rufio_memory.json"
memory_db = []
if os.path.exists(memory_file):
    with open(memory_file, "r", encoding="utf-8") as f: memory_db = json.load(f)

def log(msg): print(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}")

def save_to_memory(video_id, link, summary):
    global memory_db
    if any(m['id'] == video_id for m in memory_db): return
    memory_db.append({"id": video_id, "link": link, "summary": summary, "date": str(datetime.datetime.now())})
    with open(memory_file, "w", encoding="utf-8") as f: json.dump(memory_db, f, ensure_ascii=False, indent=2)
    log(f"💾 บันทึก: {video_id}")

def read_youtube(link):
    try: return gemini_model.generate_content(f"ถอดความและสรุปคลิปนี้เป็นภาษาไทย: {link}").text
    except Exception as e: return ""

def ai_summarize(text):
    if not text: return "สรุปไม่ได้"
    return gemini_model.generate_content(f"สรุป 3 ส่วน: 1.ใจความ 2.ประเด็น 3.เอาไปใช้: {text[:10000]}").text

HUNT_KEYWORDS = ["ผัดไทย", "AI สร้างรายได้", "เทรนด์ TikTok"]

def auto_hunt():
    log("🚀 Rufio เริ่มล่า")
    for kw in HUNT_KEYWORDS:
        req = youtube.search().list(q=kw, part="snippet", type="video", order="viewCount", maxResults=3, publishedAfter=(datetime.datetime.now()-datetime.timedelta(days=7)).isoformat()+"Z").execute()
        for item in req.get('items', []):
            vid = item['id']['videoId']; link = f"https://www.youtube.com/watch?v={vid}"
            if not any(m['id'] == vid for m in memory_db): save_to_memory(vid, link, ai_summarize(read_youtube(link)))

schedule.every(6).hours.do(auto_hunt)
log("🤖 Rufio v11.0 Worker พร้อม 24/7")
auto_hunt()
while True: schedule.run_pending(); time.sleep(60)
