// KV_worker.js - CRISTAL ONLINE - TOTAL OPERATIONS
export const PLUGINS = {
  cristal_online: {
    name: "CRISTAL ONLINE",
    version: "2.0",
    description: "โชว์การกระทำทั้งหมดของ Cristal ไม่ใช่แค่ระบบใดระบบหนึ่ง",
    facilities: {
      "CR-01": { location: "Rayong", status: "OPERATING", prod: "480u/h" },
      "CR-02": { location: "Chonburi", status: "OPERATING", prod: "410u/h" },
      "CR-03": { location: "Saraburi", status: "MAINTENANCE", prod: "350u/h" }
    },
    total: {
      production: "92.4%",
      sales: "฿4.82M",
      inventory: "12,543 Units",
      profit: "฿1.12M"
    }
  }
};

// ตัวนี้สำคัญที่สุด ต้องมี Worker ถึงจะ Build ผ่าน
export default {
  async fetch(request, env, ctx) {
    const data = {
      system: "CRISTAL ONLINE",
      status: "ONLINE",
      message: "Total Operations Overview - Not single system",
      plugins: PLUGINS,
      timestamp: new Date().toISOString()
    };
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
