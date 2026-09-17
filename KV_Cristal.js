// CRISTAL ONLINE - ข้อมูลการดำเนินงานและปลั๊กอิน
export const CRISTAL_ONLINE = {
  name: "CRISTAL ONLINE",
  mode: "TOTAL_OPERATIONS",
  show_all: true,
  facilities: {
    "CR-01": { location: "Rayong", status: "OPERATING" },
    "CR-02": { location: "Chonburi", status: "OPERATING" },
    "CR-03": { location: "Saraburi", status: "MAINTENANCE" },
    "CR-04": { location: "Lampang", status: "OPERATING" }
  },
  total: { production: "92.4%", sales: "฿4.82M", profit: "฿1.12M" }
};

export const PLUGINS = {
  cristal_online: CRISTAL_ONLINE
};
