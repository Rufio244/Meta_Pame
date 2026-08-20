from flask import Flask, request
import os
app = Flask(__name__)

MEMORY_FILE = "rufio_memory.json" # หน่วยความจำถาวร ไม่มีวันลืม

@app.route("/brain/update", methods=["POST"])
def update_brain():
    brain_file = request.files['brain_file']
    brain_file.save(f"brains/{brain_file.filename}")
    
    # บันทึกลง Memory ถาวร
    with open(MEMORY_FILE, "a") as f:
        f.write(f"{brain_file.filename}\n")
    
    print("อัปเดตความสามารถใหม่เรียบร้อย")
    return {"status": "success", "message": "Rufio เก่งขึ้นแล้ว"}

app.run(host="0.0.0.0", port=8000)
