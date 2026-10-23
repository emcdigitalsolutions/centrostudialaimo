import { abilitanti, regionali, ROUTES, STATS } from './catalog';

export interface NavLink { label: string; href: string; note?: string }
export interface NavCol { title: string; icon: string; links: NavLink[] }
export interface NavMenu { label: string; href: string; intro: { title: string; text: string }; cols: NavCol[] }

export const MENUS: NavMenu[] = [
  {
    label: 'Università',
    href: '/universita/',
    intro: {
      title: 'Università online',
      text: `${STATS.lauree} corsi di laurea triennali e magistrali da seguire online, con tutor personale e riconoscimento dei crediti già acquisiti.`,
    },
    cols: [
      {
        title: 'Corsi di laurea', icon: 'grad',
        links: [
          { label: 'Lauree triennali', href: '/universita/lauree-triennali/', note: `${STATS.triennali} corsi` },
          { label: 'Lauree magistrali', href: '/universita/lauree-magistrali/', note: `${STATS.magistrali} corsi` },
          { label: 'Tutti i corsi di laurea', href: '/universita/corsi-di-laurea/' },
        ],
      },
      {
        title: 'Facoltà', icon: 'layers',
        links: ['Ingegneria', 'Psicologia', 'Economia', 'Giurisprudenza', 'Lettere'].map((f) => ({
          label: f, href: `/universita/corsi-di-laurea/?facolta=${encodeURIComponent(f)}`,
        })),
      },
      {
        title: 'Servizi', icon: 'spark',
        links: [
          { label: 'Valutazione CFU gratuita', href: '/universita/valutazione-cfu/', note: 'Senza impegno' },
          { label: 'Corsi singoli', href: '/universita/corsi-singoli/' },
          { label: 'Orientamento universitario', href: '/contatti/' },
        ],
      },
    ],
  },
  {
    label: 'Offerta formativa',
    href: '/area-scuola/',
    intro: {
      title: 'Offerta formativa',
      text: 'Tutto quello che serve a chi insegna o vuole cominciare: master, perfezionamenti, abilitazioni e alta formazione professionale.',
    },
    cols: [
      {
        title: 'Mondo Scuola', icon: 'school',
        links: [
          { label: 'Master Mondo Scuola', href: '/master/mondo-scuola/' },
          { label: 'Master completamento classe di concorso', href: '/master/completamento-classe-di-concorso/' },
          { label: 'Corsi di perfezionamento 60 CFU', href: '/area-scuola/corsi-di-perfezionamento/?cfu=60' },
          { label: 'Corsi di perfezionamento 120 CFU', href: '/area-scuola/corsi-di-perfezionamento/?cfu=120' },
          { label: 'Aumenta i punti in GPS', href: '/area-scuola/punteggio-gps/' },
        ],
      },
      {
        title: 'Alta formazione', icon: 'award',
        links: [
          { label: 'Master Area Sanitaria', href: '/master/area-sanitaria/' },
          { label: 'Master Pubblica Amministrazione', href: '/master/pubblica-amministrazione/' },
          { label: 'Master Post Laurea', href: '/master/post-laurea/' },
          { label: 'Tutti i master', href: '/master/', note: `${STATS.master}` },
        ],
      },
      {
        title: 'Percorsi abilitanti', icon: 'shield',
        links: [
          ...abilitanti.map((a) => ({ label: a.title, href: ROUTES.abil(a.slug) })),
          { label: 'Tutti i percorsi', href: '/area-scuola/percorsi-abilitanti/' },
        ],
      },
    ],
  },
  {
    label: 'Corsi e certificazioni',
    href: '/certificazioni/',
    intro: {
      title: 'Corsi e certificazioni',
      text: 'Certificazioni informatiche e linguistiche riconosciute, corsi regionali e pacchetti per aumentare il punteggio.',
    },
    cols: [
      {
        title: 'Certificazioni', icon: 'award',
        links: [
          { label: 'Certificazioni informatiche', href: '/certificazioni/#informatiche' },
          { label: 'Certificazioni linguistiche', href: '/certificazioni/#linguistiche' },
          { label: 'Pacchetti punteggio GPS', href: '/area-scuola/punteggio-gps/' },
        ],
      },
      {
        title: 'Corsi regionali', icon: 'users',
        links: [
          ...regionali.map((r) => ({ label: r.title.replace(/^Corso\s+/, ''), href: ROUTES.reg(r.slug) })),
          { label: 'Tutti i corsi regionali', href: '/corsi-regionali/' },
        ],
      },
      {
        title: 'Lezioni private', icon: 'pencil',
        links: [
          { label: 'Ripetizioni scuola media e superiore', href: '/lezioni-private/#scuola' },
          { label: 'Preparazione esami universitari', href: '/lezioni-private/#universita' },
          { label: 'Tesi, concorsi e recupero anni', href: '/lezioni-private/#percorsi' },
        ],
      },
    ],
  },
];

export const SIMPLE_LINKS: NavLink[] = [
  { label: 'Lezioni private', href: '/lezioni-private/' },
  { label: 'Chi siamo', href: '/chi-siamo/' },
  { label: 'Contatti', href: '/contatti/' },
];
