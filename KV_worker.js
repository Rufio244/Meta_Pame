// KV_worker.js - คลังเก็บระบบทั้งหมดของ Cristal - สั่งเพิ่มผ่านแชทได้
export const CRISTAL_ONLINE = {
  name: "CRISTAL ONLINE",
  version: "1.0",
  mode: "TOTAL_OPERATIONS",
  show_all_actions: true,
  updated: "2026-05-14T22:46:00Z",
  
  projects: {
    LA141A: { status: "ACTIVE", location: "แม่ก๋ง" },
    CR_RAYONG: { status: "OPERATING", production: "480u/h" },
    CR_CHONBURI: { status: "OPERATING", production: "410u/h" }
  },

  total: {
    production: "92.4%",
    sales: "฿4.82M",
    profit: "฿1.12M"
  }
};

export const PLUGINS = {
  cristal_online: CRISTAL_ONLINE,
  // พื้นที่ให้ผมเพิ่มโปรเจคใหม่ผ่านแชทตรงนี้ - จะเพิ่มตรงนี้เรื่อยๆ
  new_project_example: { name: "ตัวอย่าง" }
};
