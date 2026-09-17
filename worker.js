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
