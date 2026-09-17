// KV_worker.js - ตัวช่วยเพิ่มระบบอัตโนมัติ + CRISTAL ONLINE
export const PLUGINS = {
  // อยากเพิ่มอะไร วางตรงนี้ได้เลย
  cristal_online: {
    name: "CRISTAL ONLINE",
    mode: "TOTAL_OPERATIONS",
    show_all: true,
    facilities: ["CR-01 Rayong", "CR-02 Chonburi", "CR-03 Saraburi"],
    production: "92.4%",
    sales: "฿4.82M",
    inventory: "12,543 Units"
  }
};

// ========== สำคัญ! ต้องมีตัวนี้ Worker ถึงจะ Build ผ่าน ==========
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // API โชว์สถานะ CRISTAL ONLINE
    if (url.pathname === "/api/cristal") {
      return new Response(JSON.stringify({
        system: "CRISTAL ONLINE",
        status: "ONLINE",
        total_ops: "1,248 ACTIVE PROCESSES",
        plugins: PLUGINS,
        time: new Date().toISOString()
      }), { headers: { "Content-Type": "application/json" } });
    }

    // หน้าแรก
    return new Response(`
      <h1>CRISTAL ONLINE - TOTAL OPERATIONS</h1>
      <p>System: ONLINE</p>
      <p>Facilities: 6 Monitored</p>
      <p>Production: 92.4% | Sales: ฿4.82M</p>
      <p><a href="/api/cristal">ดู API</a></p>
    `, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
};
