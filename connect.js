// Connect.js - Cristal Edition
const fs = require('fs');
function getCristalMemory(){
    try{
        const mem = JSON.parse(fs.readFileSync('./Cristal_Core/memory.json','utf8'));
        return mem;
    }catch(e){ return {name:"Cristal", lock:"AGI244"}; }
}
module.exports = { getCristalMemory };
console.log("💎 Cristal Connected to JS");
