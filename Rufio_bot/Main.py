import json, os, datetime, time
import google.generativeai as genai
from googleapiclient.discovery import build
import schedule

# อ่าน Key จาก Environment Variable บน Render
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-flash')
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

memory_file = "rufio_memory.json"
memory_db = json.load(open(memory_file, "r", encoding="utf-8")) if os.path.exists(memory_file) else []

def log(msg): 
    print(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}")

def save_to_memory(video_id, link, summary):
    global memory_db
    if any(m['id'] == video_id for m in memory_db): return
    memory_db.append({"id": video_id, "link": link, "summary": summary, "date": str(datetime.datetime.now())})
    with open(memory_file, "w", encoding="utf-8") as f: json.dump(memory_db, f, ensure_ascii=False, indent=2)
    log(f"💾 บันทึกแล้ว: {video_id}")

def read_youtube(link):
    try:
        prompt = f"ถอดความและสรุปเนื้อหาทั้งหมดของคลิป YouTube นี้เป็นภาษาไทย: {link}"
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e: return ""

def ai_summarize(text):
    if not text: return "สรุปไม่ได้"
    prompt = f"คุณคือ Rufio สรุปเป็นภาษาไทย 3 ส่วน:\n1. ใจความ:\n2. 3 ประเด็น:\n3. เอาไปใช้:\nเนื้อหา: {text[:10000]}"
    response = gemini_model.generate_content(prompt)
    return response.text

HUNT_KEYWORDS = ["ผัดไทย", "AI สร้างรายได้", "เทรนด์ TikTok", "Facebook Reels"]

def auto_hunt():
    log("🚀 เริ่มล่า")
    for kw in HUNT_KEYWORDS:
        try:
            request = youtube.search().list(q=kw, part="snippet", type="video", order="viewCount", maxResults=3, publishedAfter=(datetime.datetime.now()-datetime.timedelta(days=7)).isoformat()+"Z")
            response = request.execute()
            for item in response['items']:
                video_id = item['id']['videoId']
                link = f"https://www.youtube.com/watch?v={video_id}"
                if not any(m['id'] == video_id for m in memory_db):
                    log(f"เจอใหม่: {item['snippet']['title']}")
                    text = read_youtube(link)
                    summary = ai_summarize(text)
                    save_to_memory(video_id, link, summary)
        except Exception as e: log(f"Error: {e}")

def job():
    auto_hunt()
    log("😴 หลับ 6 ชม")

schedule.every(6).hours.do(job)
log("🤖 Rufio v11.0 GitHub Worker พร้อม")
job() # รันรอบแรก
while True:
    schedule.run_pending()
    time.sleep(60)
