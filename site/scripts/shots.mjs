// Screenshot di verifica: node scripts/shots.mjs
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
const out = 'C:/workspace/centrostudialaimo/_shots';
mkdirSync(out, { recursive: true });
const base = 'http://localhost:4377';
const pages = (process.argv[2] || '/').split(',');
const vw = process.argv[3] === 'mobile' ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900, deviceScaleFactor: 1 };
const full = process.argv[4] !== 'top';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.setViewport(vw);
for (const p of pages) {
  await page.goto(base + p, { waitUntil: 'networkidle0' });
  // forza i reveal per lo screenshot completo
  await page.evaluate(async () => {
    document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-in'));
    await document.fonts.ready;
  });
  await new Promise((r) => setTimeout(r, 1800));
  const name = (p.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home') + '-' + (process.argv[3] || 'desk') + '.png';
  await page.screenshot({ path: `${out}/${name}`, fullPage: full });
  console.log('ok', name);
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
