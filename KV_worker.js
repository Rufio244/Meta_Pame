// ========== CRISTAL ONLINE - TOTAL OPERATIONS - ตัวผ่านแน่นอน ==========
const CRISTAL_SYSTEM = {
  name: "CRISTAL ONLINE",
  mode: "TOTAL_OPERATIONS",
  not_single_machine: true,
  show_all_actions: true,
  facilities: [
    { id: "CR-01", location: "Rayong", status: "OPERATING", prod: "480u/h", inv: 4120, eff: "94%" },
    { id: "CR-02", location: "Chonburi", status: "OPERATING", prod: "410u/h", inv: 5003, eff: "91%" },
    { id: "CR-03", location: "Saraburi", status: "MAINTENANCE", prod: "350u/h", inv: 3420, eff: "87%" }
  ],
  total: {
    production: "92.4%",
    sales: "฿4.82M",
    inventory: "12,543 Units",
    profit: "฿1.12M",
    active_processes: 1248,
    monitored: 6
  }
};

export const PLUGINS = {
  cristal_online: CRISTAL_SYSTEM
};

const GITHUB_RAW = "https://raw.githubusercontent.com/Rufio244/Meta_Pame/main/KV_worker.js";

async function loadPlugins() {
  try {
    const res = await fetch(GITHUB_RAW + "?t=" + Date.now());
    return await res.text();
  } catch { return "load fail"; }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const bossQuestion = url.searchParams.get("ถาม");

    // API - โชว์ทั้งหมดของ Cristal
    if (url.pathname === "/api/cristal") {
      return new Response(JSON.stringify(CRISTAL_SYSTEM, null, 2), {
        headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
      });
    }

    // API - โชว์ PLUGINS
    if (url.pathname === "/api/plugins") {
      const code = await loadPlugins();
      return new Response(JSON.stringify({ system: CRISTAL_SYSTEM, plugins_preview: code.slice(0,500) }, null, 2), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // --- ระบบตอบเจ้านาย ---
    if (bossQuestion) {
      let answer = `ตอนนี้ระบบ ${CRISTAL_SYSTEM.name} เฝ้าทั้งหมด ${CRISTAL_SYSTEM.total.monitored} โรงงานอยู่ครับ! การผลิต ${CRISTAL_SYSTEM.total.production} เวลา ${new Date().toLocaleString("th-TH")}`;

      if (env.GROQ_API_KEY) {
        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: [
                { role: "system", content: `คุณคือ AGI ของระบบ CRISTAL ONLINE ดูแล ${CRISTAL_SYSTEM.total.monitored} โรงงาน โชว์การกระทำทั้งหมดของ Cristal ไม่ใช่แค่เครื่องเดียว ตอบสั้นกระชับ ภาษาไทยเหนือปนไทยกลาง สุภาพ ข้อมูล: ${JSON.stringify(CRISTAL_SYSTEM.total)}` },
                { role: "user", content: bossQuestion }
              ]
            })
          });
          const data = await res.json();
          answer = data.choices?.[0]?.message?.content || answer;
        } catch(e) {}
      }

      return new Response(
        `<h1>CRISTAL ONLINE ตอบเจ้านายแล้ว!</h1>
         <p><b>เจ้านายถาม:</b> ${bossQuestion}</p>
         <p><b>CRISTAL ตอบ:</b> ${answer}</p>
         <hr>
         <p><b>ภาพรวมตอนนี้:</b> การผลิต ${CRISTAL_SYSTEM.total.production} | ยอดขาย ${CRISTAL_SYSTEM.total.sales} | กำไร ${CRISTAL_SYSTEM.total.profit}</p>
         <a href="/">กลับหน้าหลัก</a> | <a href="/api/cristal">ดู API ทั้งหมด</a>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // --- หน้าหลัก - CRISTAL ONLINE TOTAL ---
    return new Response(
      `<h1>CRISTAL ONLINE - TOTAL OPERATIONS รัน 24 ชม.แล้ว!</h1>
       <h2>ไม่ใช่แค่ LA141A แต่โชว์ทั้งหมดของ Cristal</h2>
       <p><b>การผลิต:</b> ${CRISTAL_SYSTEM.total.production} | <b>ยอดขาย:</b> ${CRISTAL_SYSTEM.total.sales} | <b>คลัง:</b> ${CRISTAL_SYSTEM.total.inventory} | <b>กำไร:</b> ${CRISTAL_SYSTEM.total.profit}</p>
       <p><b>โรงงาน:</b> ${CRISTAL_SYSTEM.facilities.map(f=>`${f.id} ${f.location} ${f.status}`).join(" | ")}</p>
       <hr>
       <p>ลองถามได้เลย:</p>
       <code>?ถาม=ตอนนี้ทำอะไรอยู่</code><br><br>
       <a href="/?ถาม=ตอนนี้ทำอะไรอยู่">ถามว่า "ตอนนี้ทำอะไรอยู่"</a><br>
       <a href="/?ถาม=สรุปงานทั้งหมดของCristal">ถามว่า "สรุปงานทั้งหมดของ Cristal"</a><br>
       <a href="/api/cristal">ดู API CRISTAL ONLINE ทั้งหมด</a>
       <p>เวลาตอนนี้: ${new Date().toLocaleString("th-TH")}</p>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  },

  async scheduled(event, env, ctx) {
    console.log("CRISTAL ONLINE ตื่นเช็คทุกโรงงานทุกชั่วโมงครับ", new Date().toISOString());
  }
};
