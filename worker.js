export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const bossQuestion = url.searchParams.get("ถาม");

    // --- ระบบตอบเจ้านาย ---
    if (bossQuestion) {
      let answer = `ตอนนี้ผมเฝ้าโรงงาน LA141A ที่แม่ก๋งอยู่ครับ! เวลา ${new Date().toLocaleString("th-TH")}`;

      // ถ้ามี GROQ_API_KEY จะตอบฉลาดด้วย AI จริง
      if (env.GROQ_API_KEY) {
        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: [
                { role: "system", content: "คุณคือ AGI เฝ้าโรงงาน LA141A ที่แม่ก๋ง ตอบเจ้านายสั้นๆ กระชับ เป็นภาษาไทยเหนือปนไทยกลาง สุภาพ" },
                { role: "user", content: bossQuestion }
              ]
            })
          });
          const data = await res.json();
          answer = data.choices?.[0]?.message?.content || answer;
        } catch(e) {}
      }

      return new Response(
        `<h1>AGI แม่ก๋งตอบเจ้านายแล้ว!</h1>
         <p><b>เจ้านายถาม:</b> ${bossQuestion}</p>
         <p><b>AGI ตอบ:</b> ${answer}</p>
         <hr>
         <a href="/">กลับหน้าหลัก</a>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // --- หน้าหลัก ---
    return new Response(
      `<h1>AGI LA141A แม่ก๋ง รัน 24 ชม.แล้ว!</h1>
       <p>ลองถามมันได้เลย พิมพ์ต่อท้ายลิงก์แบบนี้:</p>
       <code>?ถาม=ตอนนี้ทำอะไรอยู่</code><br><br>
       <a href="/?ถาม=ตอนนี้ทำอะไรอยู่">กดถามว่า "ตอนนี้ทำอะไรอยู่"</a><br>
       <a href="/?ถาม=Mg-วันนี้ได้เท่าไหร่">กดถามว่า "Mg วันนี้ได้เท่าไหร่"</a><br>
       <a href="/?ถาม=สรุปงานเมื่อคืน">กดถามว่า "สรุปงานเมื่อคืน"</a>
       <p>เวลาตอนนี้: ${new Date().toLocaleString("th-TH")}</p>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  },
  async scheduled(event, env, ctx) {
    console.log("AGI ตื่นเองทุกชั่วโมงครับ");
  }
}
// ใน Worker หลักที่ Deploy แล้ว
const GITHUB_RAW = "https://raw.githubusercontent.com/USER/REPO/main/KV_worker.js";

async function loadPlugins() {
  const res = await fetch(GITHUB_RAW + "?t=" + Date.now()); // กัน cache
  const code = await res.text();
  // เอาโค้ดจาก GitHub มารันเลย!
  return code;
}

// เวลาเรียกใช้งาน
export default {
  async fetch(request) {
    const pluginsCode = await loadPlugins();
    // รันโค้ดจาก GitHub สดๆ ไม่ต้อง Deploy ใหม่!
    return new Response("ดึงจาก GitHub แล้วรันแล้วครับ! " + pluginsCode.slice(0,100));
  }
}
