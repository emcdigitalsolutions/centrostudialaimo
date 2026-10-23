// Controlla che nessun elemento esca dal viewport (mobile 390px e tablet 768px)
import puppeteer from 'puppeteer-core';
const pages = process.argv[2].split(',');
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const page = await browser.newPage();
for (const w of [360, 390, 768, 1024, 1280]) {
  await page.setViewport({ width: w, height: 800 });
  for (const p of pages) {
    await page.goto('http://localhost:4377' + p, { waitUntil: 'networkidle0' });
    const bad = await page.evaluate(() => {
      const W = document.documentElement.clientWidth, out = [];
      document.querySelectorAll('main *, header *, footer *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || r.right <= W + 1) return;
        let a = el.parentElement, skip = false;
        while (a) { const s = getComputedStyle(a); if (/(auto|scroll|hidden)/.test(s.overflowX) && a.tagName !== 'MAIN' && a.tagName !== 'BODY' && a.tagName !== 'HTML') { skip = true; break; } if (s.visibility === 'hidden' || s.display === 'none') { skip = true; break; } a = a.parentElement; }
        if (getComputedStyle(el).visibility === 'hidden') skip = true;
        if (!skip) out.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} r=${Math.round(r.right)}`);
      });
      return { sw: document.documentElement.scrollWidth, W, out: out.slice(0, 5) };
    });
    if (bad.out.length || bad.sw > bad.W) console.log(w, p, bad.sw, bad.W, bad.out);
  }
}
console.log('fine');
await browser.close();
