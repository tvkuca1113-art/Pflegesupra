import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = process.argv[2] || 'http://127.0.0.1:3111';
const OUT = process.argv[3] || 'shots';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox','--disable-gpu','--hide-scrollbars']});
const pages = [['home','/'],['kosten','/pflegegrade-und-kosten'],['leistung','/leistungen/grundpflege'],['kontakt','/kontakt'],['muenchen','/einsatzgebiet/muenchen'],['karriere','/karriere']];
for (const [name, route] of pages) {
  for (const [dev, vp, full] of [['desktop',{width:1440,height:900},true],['mobile',{width:390,height:844},true]]) {
    const c = await b.newContext({viewport:vp, isMobile:dev==='mobile', hasTouch:dev==='mobile', locale:'de-DE', deviceScaleFactor:1});
    const p = await c.newPage();
    await p.goto(BASE+route, {waitUntil:'load'});
    await p.waitForTimeout(400);
    await p.screenshot({path:`${OUT}/new-${name}-${dev}.png`, fullPage: full});
    await c.close();
  }
}
await b.close();
console.log('screenshots written to', OUT);
