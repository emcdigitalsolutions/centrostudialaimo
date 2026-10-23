import { lauree, masters, perfezionamenti, certificazioni, regionali, abilitanti, AREE, ROUTES, STATS, type AreaKey } from '../lib/catalog';
import { SITE } from '../site.config';

const abs = (p: string) => new URL(p, SITE.url).href;

export function GET() {
  const L: string[] = [];
  L.push(`# ${SITE.name}`, '', `> ${SITE.description}`, '');
  L.push('## Chi siamo', '');
  L.push(`${SITE.name} è un centro di formazione che offre orientamento gratuito e accompagna studenti, lavoratori, docenti, aspiranti insegnanti e personale ATA nella scelta e nello svolgimento di percorsi universitari e professionali. Area servita: ${SITE.address.region} e tutta Italia (corsi online).`, '');
  L.push('## Contatti', '');
  L.push(`- Informazioni e orientamento: ${SITE.email.info}`, `- Valutazione CFU: ${SITE.email.valutazioni}`, `- Amministrazione: ${SITE.email.amministrazione}`);
  if (SITE.phone) L.push(`- Telefono: ${SITE.phone}`);
  L.push(`- Pagina contatti: ${abs('/contatti/')}`, '');
  L.push('## Servizi principali', '');
  L.push(
    `- [Corsi di laurea online](${abs('/universita/corsi-di-laurea/')}): ${STATS.triennali} triennali e ${STATS.magistrali} magistrali, nessun test di ammissione, tutor personale, esami in sede.`,
    `- [Valutazione CFU gratuita](${abs('/universita/valutazione-cfu/')}): riconoscimento degli esami già sostenuti con preventivo dei costi.`,
    `- [Corsi singoli](${abs('/universita/corsi-singoli/')}): esami universitari singoli per integrare CFU.`,
    `- [Master](${abs('/master/')}): ${STATS.master} master online di I e II livello da 60 CFU.`,
    `- [Corsi di perfezionamento](${abs('/area-scuola/corsi-di-perfezionamento/')}): ${STATS.perfezionamenti} corsi per docenti da 60 e 120 CFU.`,
    `- [Percorsi abilitanti](${abs('/area-scuola/percorsi-abilitanti/')}): abilitazione 30-36-60 CFU e preparazione TFA sostegno.`,
    `- [Punteggio GPS](${abs('/area-scuola/punteggio-gps/')}): pacchetti di certificazioni e CLIL per le graduatorie.`,
    `- [Certificazioni](${abs('/certificazioni/')}): informatiche (Pekit, DigComp 2.2, DigCompEdu, LIM, Tablet, Coding, Dattilografia) e linguistiche (Inglese B2, C1, C2, CLIL).`,
    `- [Corsi regionali](${abs('/corsi-regionali/')}): ASACOM, OSA, OPI, Segretario coordinatore amministrativo.`,
    `- [Lezioni private](${abs('/lezioni-private/')}): ripetizioni scuola media e superiore, esami universitari, tesi, recupero anni, concorsi; in sede o online.`,
    '',
  );
  L.push('## Corsi di laurea', '');
  for (const l of lauree) L.push(`- [${l.title}](${abs(ROUTES.laurea(l.slug))}): laurea ${l.livello}, classe ${l.classe}, facoltà di ${l.facolta}`);
  L.push('');
  for (const a of Object.keys(AREE) as AreaKey[]) {
    L.push(`## ${AREE[a].label}`, '');
    for (const m of masters.filter((x) => x.area === a)) L.push(`- [${m.title}](${abs(ROUTES.master(m.slug))}): master di ${m.livello} livello, ${m.cfu} CFU`);
    L.push('');
  }
  L.push('## Corsi di perfezionamento', '');
  for (const p of perfezionamenti) L.push(`- [${p.title}](${abs(ROUTES.perf(p.slug))}): ${p.cfu} CFU`);
  L.push('', '## Percorsi abilitanti', '');
  for (const p of abilitanti) L.push(`- [${p.title}](${abs(ROUTES.abil(p.slug))})`);
  L.push('', '## Certificazioni', '');
  for (const c of certificazioni) L.push(`- [${c.title}](${abs(ROUTES.cert(c.slug))}): certificazione ${c.tipo}`);
  L.push('', '## Corsi regionali', '');
  for (const r of regionali) L.push(`- [${r.title}](${abs(ROUTES.reg(r.slug))})`);
  L.push('', '## Domande frequenti', '');
  L.push(
    '- L’orientamento è gratuito? Sì, la consulenza di orientamento e la valutazione CFU sono gratuite e senza impegno.',
    '- Le lauree online hanno valore legale? Sì, i titoli delle università telematiche riconosciute dal MUR hanno lo stesso valore di quelli degli atenei tradizionali.',
    '- C’è un test di ammissione? No, per i corsi di laurea proposti non è previsto e le iscrizioni sono aperte tutto l’anno.',
    '- I titoli valgono per le graduatorie? Master, perfezionamenti e certificazioni sono valutabili secondo le tabelle ministeriali in vigore.',
    '',
  );
  L.push('## Parole chiave', '', 'università online, università telematica, corsi di laurea online, master online, corsi di perfezionamento docenti, percorsi abilitanti 60 CFU, TFA sostegno, punteggio GPS, certificazione inglese B2 C1 C2, CLIL, certificazione Pekit, DigComp, lezioni private, ripetizioni, valutazione CFU, Sicilia', '');
  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
