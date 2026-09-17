// KV_worker.js - CRISTAL ONLINE
export const PLUGINS = {
  cristal_online: {
    name: "CRISTAL ONLINE",
    total_ops: true,
    profit: "฿1.12M"
  }
};

export default {
  async fetch(request, env, ctx) {
    return new Response(JSON.stringify({
      system: "CRISTAL ONLINE",
      status: "ONLINE",
      show: "ทั้งหมดของ Cristal ไม่ใช่แค่ระบบเดียว",
      profit: "฿1.12M",
      facilities: 6,
      time: new Date().toISOString()
    }, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
