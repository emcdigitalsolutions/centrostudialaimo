// Genera og:image, logo e icone a partire dal marchio SVG (node scripts/brand.mjs)
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pub = path.join(root, 'public');
const brand = path.resolve(root, '..', 'brand');
mkdirSync(brand, { recursive: true });
const f = (p) => pathToFileURL(path.join(root, 'node_modules', p)).href;

const fonts = `
@font-face{font-family:'Brico';src:url('${f('@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2')}') format('woff2');font-weight:200 800}
@font-face{font-family:'Fig';src:url('${f('@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2')}') format('woff2');font-weight:300 900}
@font-face{font-family:'Serif';font-style:italic;src:url('${f('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')}') format('woff2')}
*{margin:0;box-sizing:border-box}`;

const L_PATH = 'M27.5 16h9l14.5 34h-10l-2.6-6.5h-12.8L23 50H13zm4.5 11-4 10h8z';
const mark = (size, rx = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a5cff"/><stop offset="1" stop-color="#14245a"/></linearGradient></defs><rect width="64" height="64" rx="${rx}" fill="url(#g)"/><path d="${L_PATH}" fill="#fff" fill-rule="evenodd"/><circle cx="46" cy="16" r="5.5" fill="#ffb21e"/></svg>`;
const wordmark = (dark = true, scale = 1) => `
  <div style="display:flex;align-items:center;gap:${22 * scale}px">
    ${mark(96 * scale, 18)}
    <div style="display:grid;line-height:1">
      <span style="font:700 ${17 * scale}px Fig;letter-spacing:.26em;text-transform:uppercase;color:${dark ? '#2848d8' : '#ffb21e'};margin-bottom:${9 * scale}px">Centro Studi</span>
      <span style="font:800 ${70 * scale}px/0.85 Brico;letter-spacing:-.045em;color:${dark ? '#0d1a3a' : '#fff'}">Alaimo</span>
    </div>
  </div>`;

const og = `<html><head><style>${fonts}
body{width:1200px;height:630px;background:#0d1a3a;font-family:Fig;color:#b9c3dd;position:relative;overflow:hidden}
.b{position:absolute;border-radius:50%;filter:blur(80px)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:56px 56px;-webkit-mask-image:radial-gradient(ellipse at 78% 30%,#000 10%,transparent 65%)}
.in{position:absolute;inset:0;padding:64px 70px;display:flex;flex-direction:column}
h1{font:800 70px/0.98 Brico;letter-spacing:-.04em;color:#fff;margin-top:auto;max-width:640px}
h1 em{font-family:Serif;font-weight:400;font-style:italic;color:#ffb21e;font-size:1.08em}
.chips{display:flex;gap:10px;margin-top:28px;flex-wrap:wrap;max-width:640px}
.chips span{font:600 19px Fig;color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);padding:9px 16px;border-radius:99px}
.url{position:absolute;right:70px;bottom:58px;font:700 22px Fig;color:#ffb21e;letter-spacing:.02em}
.st{position:absolute;right:70px;top:150px;width:400px;height:330px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;align-items:end}
.s{border-radius:18px 18px 6px 6px;background:linear-gradient(180deg,rgba(255,255,255,.17),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.18);padding:12px;display:flex;align-items:flex-end;font:700 17px Brico;color:#fff}
.s:last-child{background:linear-gradient(180deg,rgba(255,178,30,.45),rgba(255,178,30,.06));border-color:rgba(255,178,30,.55)}
.orb{position:absolute;right:8px;top:-62px;width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe2a3,#ffb21e 55%,#e48a00);box-shadow:0 0 0 10px rgba(255,178,30,.12),0 0 60px 12px rgba(255,178,30,.45)}
</style></head><body>
<span class="b" style="width:620px;height:620px;background:#2848d8;right:-160px;top:-240px;opacity:.65"></span>
<span class="b" style="width:420px;height:420px;background:#7357f0;left:-180px;bottom:-200px;opacity:.35"></span>
<span class="b" style="width:260px;height:260px;background:#ffb21e;right:200px;bottom:-60px;opacity:.2"></span>
<div class="grid"></div>
<div class="st"><span class="orb"></span>
  <div class="s" style="height:34%">Diploma</div><div class="s" style="height:56%">Laurea</div><div class="s" style="height:78%">Master</div><div class="s" style="height:100%">Abilitazione</div>
</div>
<div class="in">
  ${wordmark(false, 0.78)}
  <h1>Ogni traguardo è fatto di <em>gradini</em>.</h1>
  <div class="chips"><span>Lauree online</span><span>Master</span><span>Certificazioni</span><span>Lezioni private</span></div>
</div>
<div class="url">centrostudialaimo.it</div>
</body></html>`;

const logoPage = (dark) => `<html><head><style>${fonts} body{background:transparent;display:inline-block;padding:24px}</style></head><body><div id="c" style="display:inline-block">${wordmark(dark, 2)}</div></body></html>`;
const iconPage = (size, pad = 0, bg = 'transparent', rx = 18) => `<html><head><style>body{margin:0;background:${bg};width:${size}px;height:${size}px;display:grid;place-items:center}</style></head><body>${mark(size - pad * 2, rx)}</body></html>`;

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage();
const shot = async (html, w, h, out, opts = {}) => {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: opts.dsf ?? 1 });
  const tmp = path.join(brand, '_tmp.html');
  writeFileSync(tmp, html);
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  if (opts.el) {
    const el = await page.$(opts.el);
    await el.screenshot({ path: out, omitBackground: true });
  } else await page.screenshot({ path: out, omitBackground: !!opts.transparent, clip: { x: 0, y: 0, width: w, height: h } });
};

await shot(og, 1200, 630, path.join(pub, 'og-image.png'));
await shot(logoPage(true), 1400, 500, path.join(brand, 'logo-centro-studi-alaimo.png'), { el: '#c', dsf: 2 });
await shot(logoPage(false), 1400, 500, path.join(brand, 'logo-centro-studi-alaimo-negativo.png'), { el: '#c', dsf: 2 });
await shot(logoPage(true), 1400, 500, path.join(pub, 'logo.png'), { el: '#c', dsf: 1 });
for (const s of [16, 32, 48, 180, 192, 512]) await shot(iconPage(s, 0, 'transparent', s <= 48 ? 14 : 18), s, s, path.join(brand, `icon-${s}.png`), { transparent: true });
await shot(iconPage(512, 0, '#14245a', 0), 512, 512, path.join(pub, 'icon-maskable-512.png'));
await browser.close();

// Copie nelle posizioni standard del sito
for (const [s, n] of [[180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']]) {
  writeFileSync(path.join(pub, n), readFileSync(path.join(brand, `icon-${s}.png`)));
}
const ico = await pngToIco([16, 32, 48].map((s) => path.join(brand, `icon-${s}.png`)));
writeFileSync(path.join(pub, 'favicon.ico'), ico);

// Marchio SVG e versione per stampa a 300 DPI (larghezza 10 cm)
writeFileSync(path.join(brand, 'marchio-alaimo.svg'), readFileSync(path.join(pub, 'favicon.svg')));
await sharp(path.join(brand, 'logo-centro-studi-alaimo.png')).resize({ width: 1181 }).withMetadata({ density: 300 }).png().toFile(path.join(brand, 'logo-centro-studi-alaimo-300dpi.png'));
await sharp(path.join(pub, 'og-image.png')).jpeg({ quality: 88 }).toFile(path.join(brand, 'og-image.jpg'));
const m = await sharp(path.join(pub, 'og-image.png')).metadata();
console.log('og', m.width, m.height, 'ok');
