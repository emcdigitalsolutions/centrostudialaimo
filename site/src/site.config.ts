// Dati del Centro Studi Alaimo: tutto ciò che va aggiornato prima del go-live sta qui.
export const SITE = {
  name: 'Centro Studi Alaimo',
  short: 'Alaimo',
  url: 'https://centrostudialaimo.it',
  tagline: 'Formazione, università e certificazioni',
  description:
    'Centro Studi Alaimo: corsi di laurea online triennali e magistrali, master di I e II livello, corsi di perfezionamento, percorsi abilitanti, certificazioni informatiche e linguistiche e lezioni private. Orientamento gratuito e valutazione CFU.',
  email: {
    info: 'info@centrostudialaimo.it',
    amministrazione: 'amministrazione@centrostudialaimo.it',
    valutazioni: 'valutazioni@centrostudialaimo.it',
  },
  // DA COMPLETARE: telefono, WhatsApp e indirizzo della sede (lasciare '' finché non disponibili)
  phone: '',
  whatsapp: '',
  address: { street: '', city: '', province: '', cap: '', region: 'Sicilia' },
  vat: '',
  social: { facebook: '', instagram: '', youtube: '' },
  // I prezzi del catalogo di riferimento restano nei dati ma non vengono mostrati finché il Centro non li conferma
  showPrices: false,
};

export const phoneHref = SITE.phone ? `tel:${SITE.phone.replace(/\s+/g, '')}` : '';
export const waHref = SITE.whatsapp ? `https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}` : '';

export function mailto(to: string, subject: string, body = '') {
  const q = new URLSearchParams();
  q.set('subject', subject);
  if (body) q.set('body', body);
  return `mailto:${to}?${q.toString().replace(/\+/g, '%20')}`;
}
