// Build di anteprima per GitHub Pages (https://emcdigitalsolutions.github.io/centrostudialaimo/):
// imposta il percorso base, aggiunge il prefisso ai link assoluti interni e blocca l'indicizzazione.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const BASE = '/centrostudialaimo';
execSync('npx astro build', { stdio: 'inherit', env: { ...process.env, PREVIEW_BASE: `${BASE}/` } });

const dist = path.resolve(import.meta.dirname, '..', 'dist');
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(path.join(d, f)).isDirectory() ? walk(path.join(d, f)) : [path.join(d, f)]));
let n = 0;
for (const f of walk(dist).filter((f) => f.endsWith('.html'))) {
  const src = readFileSync(f, 'utf8');
  const out = src.replace(/(\s(?:href|src|action)=")\/(?!\/|centrostudialaimo\/)/g, (_m, a) => `${a}${BASE}/`);
  if (out !== src) { writeFileSync(f, out); n++; }
}
writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
writeFileSync(path.join(dist, '.nojekyll'), '');
console.log(`anteprima pronta: ${n} pagine riscritte`);
