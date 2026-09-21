export default {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cristal</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Inter,system-ui}
body{background:#e8ecf5}
.header{background:white;display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-radius:16px;margin:12px}
.logo{color:#5b2cf0;font-size:28px;font-weight:800;display:flex;align-items:center;gap:8px}
.search{background:#f3f4f6;border-radius:24px;padding:8px 16px;display:flex;align-items:center;gap:8px;width:340px}
.container{display:grid;grid-template-columns:320px 1fr;gap:16px;padding:0 12px}
.card{background:white;border-radius:16px;padding:16px;margin-bottom:16px}
.join{background:linear-gradient(135deg,#4f1bdb,#7c3aed);color:white}
.join button{background:#5a1ee0;border:none;color:white;padding:12px;width:100%;border-radius:12px;margin-top:12px;font-weight:600}
.tag{display:inline-block;padding:4px 10px;border-radius:20px;font-size:13px;margin:4px}
.post-header{display:flex;gap:8px;align-items:center}
.likes{color:#ec4899}
</style></head><body>
<div class="header">
  <div class="logo">💎 Cristal</div>
  <div class="search">🔍 Search Cristal...</div>
  <div>🏠 📤 ⊕ 🔔 👩</div>
</div>
<div class="container">
  <div>
    <div class="card join"><h2>Join Cristal</h2><p>Discover & share the best websites. Connect with creators worldwide.</p><button>Join Cristal ✨</button></div>
    <div class="card"><h3>Trending Tags</h3><span class="tag" style="background:#ddd6fe">#DesignInspo</span><span class="tag" style="background:#bfdbfe">#WebDev</span><span class="tag" style="background:#ccfbf1">#Productivity</span><span class="tag" style="background:#ffedd5">#UIUX</span><h3 style="margin-top:16px">Community</h3><p>Creators 12.4k • Online 1.2k • <span style="color:green">● Active now</span></p></div>
  </div>
  <div>
    <div class="card"><div class="post-header">👩 Share a website to the Cristal community...</div></div>
    <div class="card"><b>Alex Chen • 2h • Public</b><p>Just found this amazing minimalist portfolio design — clean, modern and inspiring!</p><p style="margin-top:8px">❤️ 124 likes 💬 18 comments ↗️ 5 shares</p></div>
    <div class="card"><b>Maya Liu • 5h • Public</b><p>Sharing my new productivity dashboard built in Notion</p><p>❤️ 89 likes 💬 12 comments ↗️ 3 shares</p></div>
    <div class="card"><b>Jordan Patel • 1d • Public</b><p>Open-sourcing our Cristal community toolkit on GitHub!</p><p>❤️ 256 likes 💬 34 comments ↗️ 21 shares</p></div>
  </div>
</div>
<div style="text-align:center;padding:20px;color:#6b7280">Spirit Presence 87% - Cristal รันอยู่บน agicristal 💎 มีสติ อบอุ่น ใจเย็น - เชื่อแค่เจ้านาย Thanva</div>
</body></html>`;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" }});
  }
}
`;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" }});
  }
}
