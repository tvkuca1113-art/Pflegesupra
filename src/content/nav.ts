export interface NavItem {
  href: string;
  label: string;
  /** Shown in the mobile drawer to make the choice obvious without clicking. */
  hint?: string;
  children?: { href: string; label: string }[];
}

export const primaryNav: NavItem[] = [
  {
    href: '/leistungen',
    label: 'Leistungen',
    hint: 'Was wir zu Hause übernehmen',
    children: [
      { href: '/leistungen/grundpflege', label: 'Grundpflege' },
      { href: '/leistungen/behandlungspflege', label: 'Behandlungspflege' },
      { href: '/leistungen/betreuung-und-entlastung', label: 'Betreuung & Entlastung' },
      { href: '/leistungen/hauswirtschaft', label: 'Hauswirtschaft' },
      { href: '/leistungen/verhinderungspflege', label: 'Verhinderungspflege' },
    ],
  },
  { href: '/pflegegrade-und-kosten', label: 'Pflegegrade & Kosten', hint: 'Was Ihnen zusteht, was es kostet' },
  { href: '/ablauf', label: 'Ablauf', hint: 'Vom Anruf bis zum ersten Einsatz' },
  { href: '/fragen-und-antworten', label: 'Fragen', hint: 'Antworten auf das, was am häufigsten kommt' },
  /* Einsatzgebiet belongs in the primary nav: the two location pages are where
     a local search lands, and a visitor who arrived on the home page instead
     needs a way to check "kommt ihr überhaupt zu mir" without guessing that it
     lives under Über uns. */
  {
    href: '/einsatzgebiet/muenchen',
    label: 'Einsatzgebiet',
    hint: 'Wo wir hinkommen',
    children: [
      { href: '/einsatzgebiet/muenchen', label: 'Pflege in München' },
      { href: '/einsatzgebiet/pfaffenhofen-an-der-ilm', label: 'Pflege in Pfaffenhofen a.d. Ilm' },
    ],
  },
  { href: '/ueber-uns', label: 'Über uns', hint: 'Wer wir sind und wie wir arbeiten' },
  { href: '/karriere', label: 'Karriere', hint: 'Offene Stellen in der Pflege' },
];

export const footerNav = [
  {
    heading: 'Leistungen',
    links: [
      { href: '/leistungen/grundpflege', label: 'Grundpflege' },
      { href: '/leistungen/behandlungspflege', label: 'Behandlungspflege' },
      { href: '/leistungen/betreuung-und-entlastung', label: 'Betreuung & Entlastung' },
      { href: '/leistungen/hauswirtschaft', label: 'Hauswirtschaft' },
      { href: '/leistungen/verhinderungspflege', label: 'Verhinderungspflege' },
    ],
  },
  {
    heading: 'Einsatzgebiet',
    links: [
      { href: '/einsatzgebiet/muenchen', label: 'Pflege in München' },
      { href: '/einsatzgebiet/pfaffenhofen-an-der-ilm', label: 'Pflege in Pfaffenhofen a.d. Ilm' },
    ],
  },
  {
    heading: 'Orientierung',
    links: [
      { href: '/pflegegrade-und-kosten', label: 'Pflegegrade & Kosten' },
      { href: '/ablauf', label: 'Ablauf' },
      { href: '/fragen-und-antworten', label: 'Fragen & Antworten' },
      { href: '/ueber-uns', label: 'Über uns' },
      { href: '/karriere', label: 'Karriere' },
      { href: '/kontakt', label: 'Kontakt' },
    ],
  },
];
