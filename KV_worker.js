// ========== CRISTAL ONLINE SYSTEM ==========
const CRISTAL_SYSTEM = {
  name: "CRISTAL ONLINE",
  mode: "TOTAL_OPERATIONS",
  not_single_machine: true,
  show_all_actions: true,
  facilities: [
    { id: "CR-01", location: "Rayong", status: "OPERATING" },
    { id: "CR-02", location: "Chonburi", status: "OPERATING" },
    { id: "CR-03", location: "Saraburi", status: "MAINTENANCE" }
  ],
  metrics: {
    production: "92.4%",
    sales: "฿4.82M",
    inventory: "12,543 Units",
    profit: "฿1.12M"
  }
};

export const PLUGINS = {
  cristal_online: CRISTAL_SYSTEM
};

// ตัวนี้สำคัญ Worker ถึงจะ Build ผ่าน
export default {
  async fetch(request) {
    return new Response(JSON.stringify({
      system: CRISTAL_SYSTEM.name,
      mode: CRISTAL_SYSTEM.mode,
      message: "โชว์ทั้งหมดของ Cristal ไม่ใช่แค่ระบบเดียว",
      data: CRISTAL_SYSTEM,
      time: new Date().toISOString()
    }, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
