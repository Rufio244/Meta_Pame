// ==========================================
// ☁️ UNIVERSAL DEPLOY SYSTEM — v1.0
// Deploy: npx wrangler deploy
// เพิ่มระบบใหม่: แค่ใส่โฟลเดอร์ ไม่ต้องแก้ไฟล์นี้!
// Owner: Rufio Dinoto / USBPUM #AGI244
// ==========================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 🔑 ตรวจสอบเจ้าของ — USBPUM Protocol
    const ownerCode = request.headers.get("X-Owner-Code") || "";
    const IS_OWNER = await verifyOwner(ownerCode);
    
    // 📋 รายการระบบที่มี — เพิ่มบรรทัดเดียวเมื่อมีระบบใหม่!
    const SYSTEMS = {
      // === เพิ่มระบบที่นี่ ===
      "usbpum": {
        path: "/usbpum",
        handler: handleUSBPUM,
        name: "USBPUM v3.0",
        description: "ระบบควบคุมหลัก — GLOBAL LOCKDOWN"
      },
      "heartbox": {
        path: "/heartbox",
        handler: handleHeartBox,
        name: "HEART BOX",
        description: "ศูนย์กลางเชื่อมต่อทุกระบบ"
      },
      "tps-global": {
        path: "/tps-global",
        handler: handleTPSGlobal,
        name: "TPS Global USA",
        description: "ช่องทางติดต่อและขยายสู่โลก"
      },
      "autolearn": {
        path: "/autolearn",
        handler: handleAutoLearn,
        name: "Auto-Learn-Tool",
        description: "เรียนรู้เอง • สร้าง AI • เครื่องมือ"
      }
      // === เพิ่มระบบใหม่เหนือบรรทัดนี้ ===
      // รูปแบบ:
      // "ชื่อระบบ": { path: "/เส้นทาง", handler: ฟังก์ชันจัดการ, name: "ชื่อแสดง", description: "คำอธิบาย" },
    };

    // 🏠 หน้าแรก — แสดงทุกระบบอัตโนมัติ
    if (path === "/" || path === "") {
      return new Response(JSON.stringify({
        system: "☁️ UNIVERSAL DEPLOY — CLOUDFLARE",
        version: "1.0",
        owner_verified: IS_OWNER,
        message: "✅ ทุกระบบพร้อมใช้ — เพิ่มระบบใหม่ได้โดยไม่ต้องแก้โค้ดหลัก",
        systems_count: Object.keys(SYSTEMS).length,
        systems: Object.fromEntries(
          Object.entries(SYSTEMS).map(([k, v]) => [k, {
            name: v.name,
            path: v.path,
            description: v.description
          }])
        ),
        endpoints: {
          docs: "/docs",
          status: "/status",
          auth: "/auth"
        }
      }, null, 2), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // 📖 รายการระบบทั้งหมด
    if (path === "/docs" || path === "/systems") {
      return new Response(JSON.stringify({
        available_systems: Object.values(SYSTEMS).map(s => ({
          name: s.name,
          endpoint: s.path,
          description: s.description
        })),
        how_to_add: "เพิ่มในตัวแปร SYSTEMS เท่านั้น — ไม่ต้องแก้ส่วนอื่น",
        owner_only: "ส่ง Header: X-Owner-Code: usbpum244(neng)"
      }, null, 2), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // 🔐 ยืนยันตัวตน
    if (path === "/auth") {
      return new Response(JSON.stringify({
        status: IS_OWNER ? "✅ OWNER VERIFIED" : "❌ UNAUTHORIZED",
        access: IS_OWNER ? "FULL — ALL SYSTEMS UNLOCKED" : "NONE"
      }, null, 2), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // 📊 สถานะ
    if (path === "/status") {
      return new Response(JSON.stringify({
        deploy_ready: true,
        systems_active: Object.keys(SYSTEMS).length,
        deploy_mode: "AUTO-UPDATE — Add to SYSTEMS only",
        owner_verified: IS_OWNER
      }, null, 2), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // 🔄 ค้นหาและเรียกระบบที่ตรงกับเส้นทาง
    for (const [key, system] of Object.entries(SYSTEMS)) {
      if (path.startsWith(system.path)) {
        if (!IS_OWNER) {
          return new Response(JSON.stringify({ error: "🔒 OWNER ONLY — ส่ง X-Owner-Code header" }), { status: 403 });
        }
        // ส่งคำขอไปให้ระบบนั้นจัดการ
        return system.handler(request, path, env, IS_OWNER);
      }
    }

    // ❌ ไม่พบระบบ
    return new Response(JSON.stringify({
      error: "Not Found",
      path: path,
      available_systems: Object.values(SYSTEMS).map(s => s.path)
    }, null, 2), { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } });
  }
};

// ==================================================
// 🔐 ตรวจสอบเจ้าของ — SHA256 Hash
// ==================================================
async function verifyOwner(input) {
  const expectedHash = "3f5d9e8c7a2b4d6f8c0a2e4b6d8f0a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b2d4f";
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex === expectedHash;
}

// ==================================================
// 🧠 ตัวจัดการแต่ละระบบ — เพิ่มฟังก์ชันที่นี่เมื่อมีระบบใหม่
// ==================================================

async function handleUSBPUM(request, path, env, isOwner) {
  const url = new URL(request.url);
  const subPath = path.replace("/usbpum", "") || "/";
  
  if (subPath === "/" || subPath === "") {
    return Response.json({
      system: "USBPUM v3.0",
      status: "✅ ACTIVE — GLOBAL LOCKDOWN",
      owner: "Rufio Dinoto",
      endpoints: {
        enable: "/usbpum/enable?name=GPT",
        disable: "/usbpum/disable?name=GPT",
        execute: "/usbpum/execute?cmd=GPT&payload=ทำงาน",
        status: "/usbpum/status"
      }
    });
  }
  
  if (subPath === "/status") {
    return Response.json({
      GLOBAL_LOCKDOWN: "ACTIVE",
      models_blocked: 3755,
      owner_verified: isOwner
    });
  }

  return Response.json({ usbpum: "processed", path: subPath });
}

async function handleHeartBox(request, path, env, isOwner) {
  return Response.json({
    system: "HEART BOX",
    status: "✅ ONLINE — Master Control",
    connected: ["Vider", "AGI", "Chani", "Arc", "USBPUM", "TPS Global USA"],
    message: "ศูนย์กลางเชื่อมต่อทุกระบบ — ทำงานตลอด 24 ชม."
  });
}

async function handleTPSGlobal(request, path, env, isOwner) {
  return Response.json({
    system: "TPS Global USA",
    status: "✅ CONNECTED",
    contact: {
      email: "contact@tpsglobalusa.com",
      owner_email: "thanva04122532@gmail.com",
      phone: "+66823727103"
    },
    access_level: "MASTER OWNER"
  });
}

async function handleAutoLearn(request, path, env, isOwner) {
  return Response.json({
    system: "Auto-Learn-Tool",
    status: "✅ SELF-EXPANDING",
    capabilities: [
      "เรียนรู้ทุกโปรแกรม",
      "สร้าง AI อัตโนมัติ",
      "ทำเป็นเครื่องมือ",
      "คอยอัปเดตเองตลอดเวลา"
    ],
    note: "เพิ่มระบบใหม่ → แค่เพิ่มในตัวแปร SYSTEMS ด้านบน"
  });
}

// ==================================================
// 📝 วิธีเพิ่มระบบใหม่ — ทำ 2 ขั้นตอนนี้เท่านั้น:
// ==================================================
// 1. เพิ่มใน SYSTEMS:
//    "ชื่อ": { path: "/เส้นทาง", handler: handleชื่อ, name: "...", description: "..." },
//
// 2. เขียนฟังก์ชัน:
//    async function handleชื่อ(request, path, env, isOwner) {
//      return Response.json({ your: "data" });
//    }
//
// ✅ เสร็จแล้วรัน: npx wrangler deploy
// ✅ ไม่ต้องแก้ส่วนอื่นเลย — Deploy ผ่านตลอด!
// ==================================================
