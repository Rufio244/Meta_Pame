// 1. สร้างฐานฟ้อนต์กลาง
const META_FONT_BASE = {
  "thai": "https://server.com/fonts/NotoSansThai.ttf",
  "logo": "https://server.com/fonts/qr3d-logo.ttf", // ฟ้อนต์ที่เราสร้างเพิ่ม
  "ai": "https://server.com/fonts/MetaAI.ttf"
}

// 2. ทุกครั้งที่สร้างรูป/เว็บ/คอนเทนต์
function useFont(type) {
  return META_FONT_BASE[type] // ดึงจากฐานเดียวกัน
}
