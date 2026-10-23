import laureeRaw from '../data/lauree.json';
import masterRaw from '../data/master.json';
import perfRaw from '../data/perfezionamento.json';
import certRaw from '../data/certificazioni.json';
import regRaw from '../data/regionali.json';
import abilRaw from '../data/abilitanti.json';
import paccRaw from '../data/pacchetti.json';

export type Block = { t: 'p'; x: string } | { t: 'ul'; items: string[] };
export type Section = { h: string; c: Block[] };
export type Esame = { ssd?: string; nome?: string; cfu?: string; gruppo?: string };

export interface Laurea {
  slug: string; title: string; livello: 'triennale' | 'magistrale'; classe: string; facolta: string;
  body: Section[]; anni: { anno: string; esami: Esame[] }[]; scelta: Esame[];
}
export interface Master {
  slug: string; title: string; area: AreaKey; livello: 'I' | 'II'; tipologia: string; durata: string; cfu: string;
  modalita: string; prezzo: string; body: Section[]; insegnamenti: Esame[];
}
export interface Corso {
  slug: string; title: string; durata?: string; cfu?: string; crediti?: string; modalita?: string; prezzo?: string;
  tipo?: string; tipologia?: string; body: Section[]; insegnamenti?: Esame[];
}

export const lauree = laureeRaw as Laurea[];
export const masters = masterRaw as Master[];
export const perfezionamenti = perfRaw as Corso[];
export const certificazioni = certRaw as Corso[];
export const regionali = regRaw as Corso[];
export const abilitanti = abilRaw as Corso[];
export const pacchetti = paccRaw as Corso[];

export type AreaKey = 'scuola' | 'sanitaria' | 'pa' | 'post-laurea' | 'completamento';
export const AREE: Record<AreaKey, { label: string; short: string; slug: string; color: string; intro: string }> = {
  scuola: {
    label: 'Master Mondo Scuola', short: 'Mondo Scuola', slug: 'mondo-scuola', color: 'var(--c-blue)',
    intro: 'Master annuali da 60 CFU pensati per docenti e aspiranti docenti: punteggio in graduatoria, metodologie didattiche, inclusione e innovazione.',
  },
  completamento: {
    label: 'Master Completamento Classe di Concorso', short: 'Classi di concorso', slug: 'completamento-classe-di-concorso', color: 'var(--c-mint)',
    intro: 'Percorsi per integrare i crediti mancanti e ottenere i requisiti di accesso alle classi di concorso per l’insegnamento.',
  },
  sanitaria: {
    label: 'Master Area Sanitaria', short: 'Area Sanitaria', slug: 'area-sanitaria', color: 'var(--c-coral)',
    intro: 'Alta formazione per infermieri, ostetriche, fisioterapisti, psicologi e professionisti sanitari: specializzazioni cliniche, management e innovazione.',
  },
  pa: {
    label: 'Master Pubblica Amministrazione', short: 'Pubblica Amministrazione', slug: 'pubblica-amministrazione', color: 'var(--c-amber)',
    intro: 'Competenze giuridiche, gestionali e digitali per funzionari e dipendenti pubblici e per chi prepara i concorsi nella PA.',
  },
  'post-laurea': {
    label: 'Master Post Laurea', short: 'Post Laurea', slug: 'post-laurea', color: 'var(--c-violet)',
    intro: 'Specializzazioni di I e II livello in criminologia, management, comunicazione, cybersecurity e nuove professioni.',
  },
};
export const areaBySlug = Object.fromEntries(Object.entries(AREE).map(([k, v]) => [v.slug, k as AreaKey]));

export const FACOLTA: Record<string, { icon: string; color: string }> = {
  Ingegneria: { icon: 'cog', color: 'var(--c-blue)' },
  Psicologia: { icon: 'brain', color: 'var(--c-coral)' },
  Economia: { icon: 'chart', color: 'var(--c-amber)' },
  Giurisprudenza: { icon: 'scale', color: 'var(--c-violet)' },
  Lettere: { icon: 'book', color: 'var(--c-mint)' },
};

/** Primo paragrafo utile, accorciato per card e meta description */
export function excerpt(body: Section[], max = 158): string {
  for (const s of body) for (const b of s.c) {
    const t = b.t === 'p' ? b.x : b.items.join(', ');
    if (t.length > 60) return t.length > max ? t.slice(0, t.lastIndexOf(' ', max - 1)).replace(/[,;:.\s]+$/, '') + '…' : t;
  }
  return '';
}

/** Frase (o due) complete per il sottotitolo della scheda */
export function lead(body: Section[], max = 260): string {
  for (const s of body) for (const b of s.c) {
    if (b.t !== 'p' || b.x.length < 60) continue;
    const parts = b.x.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [b.x];
    let out = '';
    for (const p of parts) { if ((out + p).length > max && out) break; out += p; }
    return out.trim().length > max + 40 ? excerpt(body, max) : out.trim();
  }
  return excerpt(body, max);
}

/** Divide «Corso di laurea – indirizzo X» in nome e indirizzo */
export function splitIndirizzo(title: string): { nome: string; indirizzo: string } {
  const m = title.match(/^(.*?)\s*[-–]?\s*[Ii]ndirizzo\s+(?:in\s+)?(.*)$/);
  return m ? { nome: m[1].replace(/[\s–-]+$/, ''), indirizzo: m[2] } : { nome: title, indirizzo: '' };
}

export function cfuLaurea(l: Laurea): number {
  if (/LMG/i.test(l.classe)) return 300;
  return l.livello === 'magistrale' ? 120 : 180;
}
export function anniLaurea(l: Laurea): number {
  if (/LMG/i.test(l.classe)) return 5;
  return l.livello === 'magistrale' ? 2 : 3;
}
export function countEsami(l: Laurea): number {
  return l.anni.reduce((n, a) => n + a.esami.filter((e) => e.nome).length, 0);
}

export const ROUTES = {
  laurea: (s: string) => `/universita/corsi-di-laurea/${s}/`,
  master: (s: string) => `/master/${s}/`,
  masterArea: (a: AreaKey) => `/master/${AREE[a].slug}/`,
  perf: (s: string) => `/area-scuola/corsi-di-perfezionamento/${s}/`,
  cert: (s: string) => `/certificazioni/${s}/`,
  reg: (s: string) => `/corsi-regionali/${s}/`,
  abil: (s: string) => `/area-scuola/percorsi-abilitanti/${s}/`,
  pacc: (_s: string) => `/area-scuola/punteggio-gps/`,
};

export const STATS = {
  lauree: lauree.length,
  triennali: lauree.filter((l) => l.livello === 'triennale').length,
  magistrali: lauree.filter((l) => l.livello === 'magistrale').length,
  master: masters.length,
  perfezionamenti: perfezionamenti.length,
  certificazioni: certificazioni.length,
  totale: lauree.length + masters.length + perfezionamenti.length + certificazioni.length + regionali.length + abilitanti.length,
};

export interface SearchItem { t: string; u: string; k: string; m: string }
export function searchIndex(): SearchItem[] {
  return [
    ...lauree.map((l) => ({ t: l.title, u: ROUTES.laurea(l.slug), k: l.livello === 'triennale' ? 'Laurea triennale' : 'Laurea magistrale', m: `${l.classe} · ${l.facolta}` })),
    ...masters.map((m) => ({ t: m.title, u: ROUTES.master(m.slug), k: `Master ${m.livello} livello`, m: AREE[m.area].short })),
    ...perfezionamenti.map((p) => ({ t: p.title, u: ROUTES.perf(p.slug), k: 'Perfezionamento', m: `${p.cfu} CFU` })),
    ...certificazioni.map((c) => ({ t: c.title, u: ROUTES.cert(c.slug), k: c.tipo === 'linguistica' ? 'Certificazione linguistica' : 'Certificazione informatica', m: c.durata || 'Online' })),
    ...abilitanti.map((a) => ({ t: a.title, u: ROUTES.abil(a.slug), k: 'Percorso abilitante', m: a.crediti && /\d/.test(a.crediti) ? a.crediti : 'Area Scuola' })),
    ...regionali.map((r) => ({ t: r.title, u: ROUTES.reg(r.slug), k: 'Corso regionale', m: r.durata || '' })),
    ...pacchetti.map((p) => ({ t: p.title, u: ROUTES.pacc(p.slug), k: 'Pacchetto GPS', m: 'Punteggio graduatorie' })),
  ];
}
