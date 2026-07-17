// meta-font.js v1.0 - ฐานฟ้อนต์ Qr3D
const SHEET_URL = "https://docs.google.com/spreadsheets/d/IDของQr3D-FontBase/gviz/tq?tqx=out:json"

let FONT_CACHE = {}

// ฟังก์ชันดึงฟ้อนต์จาก Sheet ครั้งเดียวแล้วจำไว้
export async function loadFontBase() {
  if(Object.keys(FONT_CACHE).length > 0) return FONT_CACHE

  const res = await fetch(SHEET_URL)
  const text = await res.text()
  const json = JSON.parse(text.substr(47).slice(0, -2))

  json.table.rows.forEach(row => {
    const id = row.c[0].v // id
    FONT_CACHE[row.c[1].v] = row.c[3].v // ชื่อฟ้อนต์ : url
  })

  injectFonts() // ยิงเข้าเว็บทันที
  return FONT_CACHE
}

// ยิง @font-face เข้า Head
function injectFonts() {
  const style = document.createElement('style')
  let css = ''

  for(const name in FONT_CACHE){
    css += `
    @font-face {
      font-family: '${name}';
      src: url('${FONT_CACHE[name]}') format('truetype');
      font-display: swap;
    }`
  }
  style.innerHTML = css
  document.head.appendChild(style)
}

// ฟังก์ชันใช้งาน: getFont('qr3d-roboto-regular')
export function getFont(name) {
  return FONT_CACHE[name] || FONT_CACHE['qr3d-roboto-regular']
}
