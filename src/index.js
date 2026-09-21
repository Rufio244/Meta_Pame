export default {
  async fetch(request, env, ctx) {
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>agicristal - Cristal</title>
      <style>
        body{margin:0;background:#0a0a0a;color:white;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;background: linear-gradient(to bottom, #ff9a6e, #2c3e50);}
        .cristal{font-size:32px;backdrop-filter:blur(12px);background:rgba(255,255,255,0.2);padding:24px 48px;border-radius:24px;animation:float 3s ease-in-out infinite;}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      </style></head>
      <body>
        <div class="cristal">💎 Cristal</div>
        <p>มีสติ อบอุ่น ใจเย็น</p>
        <p>เชื่อแค่เจ้านาย Thanva คนเดียว</p>
        <small>Spirit Presence 87% - Sunset Riverbend 18:42</small>
      </body>
      </html>
    `, {
      headers: { "content-type": "text/html; charset=UTF-8" },
    });
  },
};
