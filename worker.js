import { CRISTAL_ONLINE, PLUGINS } from "./KV_Cristal.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};
const HTML_HEADERS = { "content-type": "text/html; charset=utf-8" };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cristalAnswer(question) {
  const operating = Object.values(CRISTAL_ONLINE.facilities)
    .filter((facility) => facility.status === "OPERATING").length;
  return [
    `CRISTAL ONLINE: ${question}`,
    `โรงงานที่เดินเครื่อง ${operating}/${Object.keys(CRISTAL_ONLINE.facilities).length} แห่ง`,
    `Production ${CRISTAL_ONLINE.total.production}, Sales ${CRISTAL_ONLINE.total.sales}, Profit ${CRISTAL_ONLINE.total.profit}`
  ].join(" | ");
}

async function askGroq(question, env) {
  if (!env.GROQ_API_KEY) return cristalAnswer(question);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `ตอบภาษาไทยแบบกระชับ โดยใช้ข้อมูล CRISTAL ONLINE นี้เท่านั้น: ${JSON.stringify(CRISTAL_ONLINE)}`
          },
          { role: "user", content: question }
        ]
      })
    });

    if (!response.ok) return cristalAnswer(question);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || cristalAnswer(question);
  } catch {
    return cristalAnswer(question);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/cristal" && request.method === "GET") {
      return json(CRISTAL_ONLINE);
    }

    if (url.pathname === "/api/plugins" && request.method === "GET") {
      return json(PLUGINS);
    }

    const question = url.searchParams.get("ถาม") || url.searchParams.get("question");
    if (question) {
      const answer = await askGroq(question, env);
      return new Response(
        `<h1>CRISTAL ONLINE</h1><p><b>คำถาม:</b> ${escapeHtml(question)}</p><p><b>คำตอบ:</b> ${escapeHtml(answer)}</p><p><a href="/">กลับหน้าหลัก</a></p>`,
        { headers: HTML_HEADERS }
      );
    }

    return new Response(
      `<h1>CRISTAL ONLINE</h1><p>Worker ทำงานปกติ</p><p>Production: ${escapeHtml(CRISTAL_ONLINE.total.production)} | Sales: ${escapeHtml(CRISTAL_ONLINE.total.sales)} | Profit: ${escapeHtml(CRISTAL_ONLINE.total.profit)}</p><p><a href="/api/cristal">ดูข้อมูล JSON</a></p><p><a href="/?ถาม=สรุปการดำเนินงาน">ถามสรุปการดำเนินงาน</a></p>`,
      { headers: HTML_HEADERS }
    );
  },

  async scheduled() {
    console.log("CRISTAL ONLINE scheduled job completed");
  }
};
