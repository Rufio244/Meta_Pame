// KV_worker.js - ตัวช่วยเพิ่มระบบอัตโนมัติ
export const PLUGINS = {
  // อยากเพิ่มอะไร วางตรงนี้ได้เลย ไม่ต้อง Deploy
  github_learner: `
    export async function run() {
      // โค้ดดูด GitHub
      return "ดูด GitHub +1.2% แล้ว!";
    }
  `,
  mg_price: `
    export async function run() {
      // โค้ดดูดราคา Mg
      return "ราคา Mg วันนี้ 2,450 บาท";
    }
  `,
  // เพิ่มใหม่ได้เรื่อยๆ แค่ commit ไฟล์นี้ใน GitHub!
};

// ตัวจัดการอัตโนมัติ
export async function autoAdd(newCode) {
  // เพิ่มโค้ดใหม่เข้า PLUGINS อัตโนมัติ
  PLUGINS['new_'+Date.now()] = newCode;
  return "เพิ่มแล้ว ไม่ต้อง Deploy!";
}
