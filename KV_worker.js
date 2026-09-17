// CRISTAL ONLINE - TOTAL OPERATIONS
export default {
  async fetch(request, env, ctx) {
    const data = {
      system: "CRISTAL ONLINE",
      mode: "TOTAL_OPERATIONS",
      message: "โชว์ทั้งหมดของ Cristal ไม่ใช่แค่เครื่องเดียว",
      facilities: ["CR-01 Rayong", "CR-02 Chonburi", "CR-03 Saraburi", "CR-04 Lampang"],
      total: { production: "92.4%", sales: "฿4.82M", inventory: "12,543 Units", profit: "฿1.12M" },
      time: new Date().toISOString()
    };
    return new Response(JSON.stringify(data, null, 2), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  }
}
