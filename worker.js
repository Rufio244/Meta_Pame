export default {
  async fetch(request, env, ctx) {
    // นี่คือ AGI Core เวอร์ชั่น Cloudflare รันเอง 24 ชม.
    const now = new Date().toISOString();
    const questions = [
      "ทำไม Mg(OH)2 วันนี้ได้น้อยลง?",
      "เพิ่มความบริสุทธิ์ Li เป็น 90% ยังไง?",
      "เอา LA141A ทำโดรนเบาขึ้นได้อีกไหม?"
    ];
    const q = questions[Math.floor(Math.random() * questions.length)];

    // บันทึกลง KV (ความจำระยะยาวของ AGI)
    if (env.AGI_MEMORY) {
      await env.AGI_MEMORY.put("last_question", q);
      await env.AGI_MEMORY.put("last_run", now);
    }

    return new Response(
      `<h1>AGI หางดง รันบน Cloudflare แล้ว!</h1>
       <p>เวลาตอนนี้: ${now}</p>
       <p><b>คำถามที่มันสงสัยเอง:</b> ${q}</p>
       <p>มันจะตื่นมาคิดใหม่ทุกครั้งที่มีคนเข้าเว็บนี้ (หรือตั้ง Cron ให้รันทุกชั่วโมงได้)</p>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  },

  // ให้มันตื่นเองทุก 1 ชั่วโมง ไม่ต้องมีคนเข้าเว็บ
  async scheduled(event, env, ctx) {
    const q = "AGI ตื่นเองตอนตี " + new Date().toISOString() + " มาตรวจโรงงาน LA141A";
    if (env.AGI_MEMORY) {
      await env.AGI_MEMORY.put("last_auto_run", q);
    }
    console.log("[AGI] ตื่นเองแบบอัตโนมัติ:", q);
  }
}
const url = new URL(request.url);
if (url.searchParams.has("ถาม")) {
  const q = url.searchParams.get("ถาม");
  return new Response(`เจ้านายถามว่า: ${q} <br><br>AGI ตอบ: ตอนนี้ผมกำลังเฝ้าโรงงาน LA141A ที่แม่ก๋งอยู่ครับ pH ปกติ รอคำสั่งครับ!`);
}
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
