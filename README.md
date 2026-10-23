# Centro Studi Alaimo — sito web

Sito di **centrostudialaimo.it** (dominio da acquistare): corsi di laurea online, master, corsi di perfezionamento, percorsi abilitanti, certificazioni informatiche e linguistiche, corsi regionali e lezioni private.

## Tecnologia

- **Astro 7** (sito statico): 273 pagine generate dai dati, nessun database, hosting statico (GitHub Pages, Cloudflare Pages, Netlify).
- Font ospitati sul sito (Bricolage Grotesque, Figtree, Instrument Serif): niente Google Fonts e niente cookie, quindi **non serve il banner cookie**.
- Moduli **mailto** (aprono il programma di posta dell'utente): il sito non invia né conserva dati.
- Ricerca istantanea su tutti i corsi (`Ctrl K` o `/`), catalogo con filtri sincronizzati nell'URL, mega-menu, animazioni con `prefers-reduced-motion` rispettato.
- SEO, GEO e AEO (ottimizzazione per i motori di risposta AI): title/description per pagina, canonical, Open Graph, JSON-LD (`EducationalOrganization`, `Course`, `BreadcrumbList`, `FAQPage`, `WebSite`), `sitemap-index.xml`, `robots.txt` con crawler AI ammessi, `llms.txt` generato dal catalogo.

## Comandi (cartella `site/`)

```bash
npm install
npm run dev        # sviluppo su http://localhost:4321
npm run build      # genera dist/
npx astro preview --port 4377
node scripts/brand.mjs                       # rigenera og:image, logo e favicon
MSYS_NO_PATHCONV=1 node scripts/shots.mjs "/,/master/" desk   # screenshot in ../_shots
MSYS_NO_PATHCONV=1 node scripts/overflow.mjs "/,/master/"     # controllo overflow 360-1280 px
```

## Da completare prima della pubblicazione

Tutto in `site/src/site.config.ts`:

- [ ] **Telefono** e **WhatsApp** (campo vuoto: il sito nasconde in automatico i riferimenti)
- [ ] **Indirizzo della sede** (attiva indirizzo nello schema, footer e contatti)
- [ ] **P.IVA / ragione sociale** (footer e privacy)
- [ ] **Social** (Facebook, Instagram, YouTube)
- [ ] **Prezzi**: non pubblicati; quando il Centro conferma i listini si inseriscono nel campo `prezzo` dei JSON e si attiva `showPrices: true`
- [ ] Acquisto dominio + DNS + HTTPS; caselle email info@, amministrazione@, valutazioni@

## Dati del catalogo

`site/src/data/*.json`: lauree (con piano di studi per anno), master, perfezionamento, certificazioni, regionali, abilitanti, pacchetti.
Le descrizioni sono testi originali scritti per il Centro Studi Alaimo e stanno in `tools/testi/*.json`; `python tools/apply_testi.py` li applica ai dati.

Una modifica a un JSON + `npm run build` aggiorna tutte le pagine, i menu, la ricerca, la sitemap e `llms.txt`.

## Anteprima per il cliente

`node scripts/preview.mjs` (cartella `site/`) genera la versione per GitHub Pages su `/centrostudialaimo/`, non indicizzabile; il contenuto di `dist/` va pubblicato sul ramo `gh-pages`.

## Marchio

Cartella `brand/`: logo positivo e negativo (PNG trasparente), versione 300 DPI per la stampa, marchio SVG, icone 16-512 px, og:image JPG.
Marchio: la «A» di Alaimo con il punto d'ambra (il traguardo). Palette: blu notte `#0d1a3a`, oltremare `#2848d8`, ambra `#ffb21e`, menta `#13b897`, corallo `#f2604c`, viola `#7357f0`, avorio `#f7f4ed`.
