// Cloudflare Worker entrypoint for Meta_Pame.
import { CRISTAL_ONLINE, PLUGINS } from "./KV_Cristal.js";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const HTML_HEADERS = { "content-type": "text/html; charset=utf-8" };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
const cors = (headers) => ({ ...headers, "access-control-allow-origin": "*" });

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function localAnswer(question) {
  const facilities = Object.values(CRISTAL_ONLINE.facilities);
  const operating = facilities.filter((facility) => facility.status === "OPERATING").length;
  return `CRISTAL ONLINE: ${question} | เดินเครื่อง ${operating}/${facilities.length} แห่ง | Production ${CRISTAL_ONLINE.total.production} | Sales ${CRISTAL_ONLINE.total.sales} | Profit ${CRISTAL_ONLINE.total.profit}`;
}

async function askGroq(question, env) {
  if (!env.GROQ_API_KEY) return localAnswer(question);
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "system", content: `ตอบภาษาไทยจากข้อมูลนี้เท่านั้น: ${JSON.stringify(CRISTAL_ONLINE)}` }, { role: "user", content: question }] })
    });
    if (!response.ok) return localAnswer(question);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || localAnswer(question);
  } catch {
    return localAnswer(question);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: cors({ "access-control-allow-methods": "GET, OPTIONS", "access-control-allow-headers": "Content-Type" }) });
    if (url.pathname === "/health") return json({ status: "ok", service: "Meta_Pame Worker" });
    if (url.pathname === "/api/cristal") return new Response(JSON.stringify(CRISTAL_ONLINE), { headers: cors(JSON_HEADERS) });
    if (url.pathname === "/api/plugins") return new Response(JSON.stringify(PLUGINS), { headers: cors(JSON_HEADERS) });
    const question = url.searchParams.get("ถาม") || url.searchParams.get("question");
    if (question) {
      const answer = await askGroq(question, env);
      return new Response(`<h1>CRISTAL ONLINE</h1><p><b>คำถาม:</b> ${escapeHtml(question)}</p><p><b>คำตอบ:</b> ${escapeHtml(answer)}</p>`, { headers: HTML_HEADERS });
    }
    return new Response(`<h1>CRISTAL ONLINE</h1><p>Worker ทำงานปกติ</p><p><a href="/health">health</a> | <a href="/api/cristal">cristal JSON</a></p>`, { headers: HTML_HEADERS });
  },
  async scheduled() { console.log("CRISTAL ONLINE scheduled job completed"); }
};
