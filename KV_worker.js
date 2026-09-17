const CRISTAL_SYSTEM = {
  name: "CRISTAL ONLINE",
  mode: "TOTAL_OPERATIONS",
  show_all: true,
  facilities: [
    { id: "CR-01", location: "Rayong", status: "OPERATING" },
    { id: "CR-02", location: "Chonburi", status: "OPERATING" },
    { id: "CR-03", location: "Saraburi", status: "MAINTENANCE" }
  ],
  total: { production: "92.4%", sales: "฿4.82M", inventory: "12,543 Units", profit: "฿1.12M", active: 1248, monitored: 6 }
};

export const PLUGINS = { cristal_online: CRISTAL_SYSTEM };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/cristal") {
      return new Response(JSON.stringify(CRISTAL_SYSTEM, null, 2), { headers: { "Content-Type": "application/json" } });
    }
    return new Response(`CRISTAL ONLINE - ${CRISTAL_SYSTEM.total.production} | Sales ${CRISTAL_SYSTEM.total.sales} | ${new Date().toLocaleString("th-TH")}`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  },
  async scheduled(e, env, ctx) { console.log("CRISTAL ONLINE check"); }
};
